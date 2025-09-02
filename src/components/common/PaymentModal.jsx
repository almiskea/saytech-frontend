import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageProvider';
import { Button } from './ui-utils';
import { cn, isMobileDevice } from '../../utils/helpers';

const PaymentModal = ({ 
    isOpen, 
    onClose, 
    paymentHtml, 
    onPaymentComplete, 
    onPaymentError 
}) => {
    const { t, language } = useLanguage();
    const iframeRef = useRef(null);
    const isClosingRef = useRef(false);

    useEffect(() => {
        if (!isOpen || !paymentHtml) return;

        const isMobile = isMobileDevice();
        
        // For mobile devices, redirect to payment page directly
        if (isMobile) {
            console.log('Mobile device detected, setting up payment redirect');
            
            // Store current page info so we can return here
            // Make sure we store the correct path (should be /request for RequestFormPage)
            const currentPath = window.location.pathname === '/' ? '/request' : window.location.pathname;
            sessionStorage.setItem('paymentOrigin', currentPath + window.location.search);
            sessionStorage.setItem('paymentInProgress', 'true');
            console.log('Stored paymentOrigin:', currentPath + window.location.search);
            
            // Create a temporary form to submit the payment HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = paymentHtml;
            const form = tempDiv.querySelector('form');
            
            if (form) {
                // Ensure the form action includes our callback URL as a return parameter
                const formAction = form.action;
                console.log('Original form action:', formAction);
                
                // Modify form to open in same window on mobile
                form.target = '_self';
                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
            } else {
                // Fallback: write HTML to current window
                console.log('No form found, using document.write fallback');
                document.write(paymentHtml);
                document.close();
            }
            return;
        }

        // For desktop, use iframe
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iframeDoc.open();
                    iframeDoc.write(paymentHtml);
                    iframeDoc.close();
                } catch (e) {
                    console.error('Error writing to iframe:', e);
                    // Fallback: open in new window
                    const paymentWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                    if (paymentWindow) {
                        paymentWindow.document.write(paymentHtml);
                        paymentWindow.document.close();
                    }
                }
            };
        }
        
        // Add timeout to prevent getting stuck
        const timeoutId = setTimeout(() => {
            console.log('Payment timeout reached, checking for pending data');
            const pendingData = localStorage.getItem('pendingRequestData');
            if (pendingData) {
                console.log('Payment timed out, calling onPaymentError');
                onPaymentError('Payment process timed out. Please try again.');
            }
        }, 300000); // 5 minutes timeout
        
        return () => {
            clearTimeout(timeoutId);
        };
    }, [isOpen, paymentHtml, onPaymentError]);

    // Listen for payment completion messages
    useEffect(() => {
        const handlePaymentMessage = (event) => {
            console.log('PaymentModal received message:', event.data);
            
            if (!event.data || typeof event.data !== 'object') {
                console.log('Ignoring non-object message');
                return;
            }
            
            // Check if this is our payment callback message
            if (!event.data.isPaymentCallback) {
                // Also check for direct payment response fields in case callback flag is missing
                const hasPaymentFields = 'status' in event.data || 
                                       'response_message' in event.data || 
                                       'transaction_id' in event.data || 
                                       'fort_id' in event.data;
                
                if (!hasPaymentFields) {
                    console.log('Ignoring non-payment message:', event.data.type || 'unknown');
                    return;
                }
            }

            const { status, response_message, transaction_id, fort_id } = event.data;
            console.log('Processing payment response:', { status, response_message, transaction_id, fort_id });
            
            if (status === "14" || status === 14 || 
                (response_message && response_message.toLowerCase().includes('success'))) {
                console.log('Payment successful, calling onPaymentComplete');
                onPaymentComplete({ transaction_id, fort_id, status, response_message });
            } else {
                console.log('Payment failed, calling onPaymentError');
                onPaymentError(response_message || 'Payment failed');
            }
        };

        // Also listen for hashchange and popstate events (in case of URL-based callbacks)
        const handleUrlChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const hash = window.location.hash;
            
            // Only check URL parameters if we're NOT on the callback page
            // (the callback page handles its own URL processing)
            if (window.location.pathname === '/payment-callback') {
                console.log('On payment callback page, skipping URL check in modal');
                return;
            }
            
            // Check URL parameters for payment response
            if (urlParams.has('status') || urlParams.has('response_code') || hash.includes('payment')) {
                console.log('Detected payment callback in URL');
                const status = urlParams.get('status') || urlParams.get('response_code');
                const transaction_id = urlParams.get('transaction_id') || urlParams.get('fort_id');
                const fort_id = urlParams.get('fort_id') || transaction_id;
                const response_message = urlParams.get('response_message') || urlParams.get('message');
                
                handlePaymentMessage({
                    data: {
                        isPaymentCallback: true,
                        status,
                        response_message,
                        transaction_id,
                        fort_id
                    }
                });
            }
        };
        
        // Periodic check for payment completion (fallback)
        const periodicCheck = setInterval(() => {
            // Check if we're still in a payment state but haven't received a callback
            const pendingData = localStorage.getItem('pendingRequestData');
            if (!pendingData) {
                console.log('No pending data found, assuming payment was completed elsewhere');
                return;
            }
            
            // Check URL for any payment indicators
            handleUrlChange();
            
            // Check the DOM for payment completion indicators (if payment page is loaded)
            try {
                if (iframeRef.current) {
                    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
                    if (iframeDoc) {
                        const bodyText = iframeDoc.body.innerText.toLowerCase();
                        if (bodyText.includes('success') || bodyText.includes('complete') || bodyText.includes('approved')) {
                            console.log('Detected success in payment page content');
                            handlePaymentMessage({
                                data: {
                                    isPaymentCallback: true,
                                    status: "14",
                                    response_message: "Payment successful",
                                    transaction_id: Date.now().toString(),
                                    fort_id: Date.now().toString()
                                }
                            });
                        } else if (bodyText.includes('fail') || bodyText.includes('error') || bodyText.includes('declined')) {
                            console.log('Detected failure in payment page content');
                            handlePaymentMessage({
                                data: {
                                    isPaymentCallback: true,
                                    status: "00",
                                    response_message: "Payment failed",
                                    transaction_id: null,
                                    fort_id: null
                                }
                            });
                        }
                    }
                }
            } catch (e) {
                // Cross-origin or other access error, ignore
            }
        }, 3000); // Check every 3 seconds

        window.addEventListener('message', handlePaymentMessage);
        window.addEventListener('hashchange', handleUrlChange);
        window.addEventListener('popstate', handleUrlChange);
        
        // Check URL immediately in case we're returning from payment
        handleUrlChange();
        
        return () => {
            window.removeEventListener('message', handlePaymentMessage);
            window.removeEventListener('hashchange', handleUrlChange);
            window.removeEventListener('popstate', handleUrlChange);
            clearInterval(periodicCheck);
        };
    }, [onPaymentComplete, onPaymentError]);

    const handleClose = () => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;
        onClose();
        setTimeout(() => {
            isClosingRef.current = false;
        }, 300);
    };

    if (!isOpen) return null;

    const isMobile = isMobileDevice();
    
    // Don't show modal on mobile as we redirect directly
    if (isMobile) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={cn(
                        "flex items-center justify-between p-4 border-b",
                        language === 'ar' ? 'flex-row-reverse' : ''
                    )}>
                        <div className="flex items-center space-x-3">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                {t('paymentGatewayTitle') || 'Payment Gateway'}
                            </h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                        <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden">
                            <iframe
                                ref={iframeRef}
                                className="w-full h-full border-0"
                                title="Payment Gateway"
                                sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
                                src="about:blank"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex items-center justify-center text-sm text-gray-600">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            {t('securePaymentMessage') || 'Secure payment processing...'}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaymentModal;
