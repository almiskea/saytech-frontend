import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageProvider';
import LoadingIndicator from '../common/LoadingIndicator';

const PaymentCallbackPage = () => {
    const { t } = useLanguage();
    
    useEffect(() => {
        console.log('PaymentCallbackPage mounted, processing callback...');
        
        // This page runs when payment gateway redirects back
        // It reads the URL parameters from PayFort's redirect
        const params = new URLSearchParams(window.location.search);
        
        console.log('Payment callback URL params:', Object.fromEntries(params.entries()));
        
        // Try to get the session ID from localStorage
        let sessionId = null;
        try {
            const savedDataString = localStorage.getItem('pendingRequestData');
            if (savedDataString) {
                const savedData = JSON.parse(savedDataString);
                sessionId = savedData.sessionId;
                console.log('Found session ID:', sessionId);
            } else {
                console.log('No pending request data found');
            }
        } catch (e) {
            console.error('Error reading session ID:', e);
        }
        
        const paymentResult = {
            isPaymentCallback: true, // Add a flag to identify this as a payment message
            sessionId: sessionId, // Include session ID to match with the original request
            status: params.get('status'),
            response_message: params.get('response_message'),
            transaction_id: params.get('transaction_id'),
            fort_id: params.get('fort_id'),
        };
        
        console.log('Payment result:', paymentResult);
        console.log('Status value:', paymentResult.status, 'Type:', typeof paymentResult.status);
        console.log('Is successful?', paymentResult.status === "14" || paymentResult.status === 14);
        
        // Check if this is a popup or same-window redirect
        if (window.opener) {
            console.log('Running in popup, sending message to opener');
            // This is a popup - send message to parent window
            window.opener.postMessage(paymentResult, '*');
            // Close the popup
            window.close();
        } else {
            console.log('Running in same window, processing directly');
            // This is a same-window redirect (mobile) - process the payment directly
            
            // First try to send a message to any listening components
            window.postMessage(paymentResult, '*');
            
            // Also dispatch a custom event that components can listen to
            const paymentEvent = new CustomEvent('paymentCallback', { 
                detail: paymentResult 
            });
            window.dispatchEvent(paymentEvent);
            
            // Set a flag in sessionStorage to indicate payment completion
            sessionStorage.setItem('paymentCallback', JSON.stringify(paymentResult));
            
            // Check if we have a stored origin to return to
            const paymentOrigin = sessionStorage.getItem('paymentOrigin');
            let redirectUrl = '/request'; // Default to request page instead of welcome
            
            if (paymentOrigin) {
                console.log('Found payment origin:', paymentOrigin);
                // If we have an origin, go back there but add the payment parameters
                const paymentParams = new URLSearchParams({
                    status: paymentResult.status || '',
                    transaction_id: paymentResult.transaction_id || '',
                    fort_id: paymentResult.fort_id || '',
                    response_message: paymentResult.response_message || ''
                });
                
                // Construct the URL with payment parameters
                redirectUrl = paymentOrigin + (paymentOrigin.includes('?') ? '&' : '?') + paymentParams.toString();
            } else {
                // Fallback: redirect to request page with payment parameters
                console.log('No payment origin found, redirecting to request page with parameters');
                const paymentParams = new URLSearchParams({
                    status: paymentResult.status || '',
                    transaction_id: paymentResult.transaction_id || '',
                    fort_id: paymentResult.fort_id || '',
                    response_message: paymentResult.response_message || ''
                });
                redirectUrl = '/request?' + paymentParams.toString();
            }
            
            // Redirect back to the appropriate page after a short delay
            setTimeout(() => {
                console.log('Redirecting to:', redirectUrl);
                window.location.href = redirectUrl;
            }, 1000);
        }
    }, []);

    // Display a simple message while the script runs
    return (
        <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '50px' }}>
            <LoadingIndicator message={t('processingPayment') || 'Processing payment...'} />
            <p style={{ marginTop: '20px', color: '#666' }}>
                {window.opener ? 
                    (t('closingPaymentWindow') || 'Closing payment window...') :
                    (t('redirectingAfterPayment') || 'Redirecting back to the main page...')
                }
            </p>
        </div>
    );
};

export default PaymentCallbackPage;