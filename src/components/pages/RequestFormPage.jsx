import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageProvider';
import api from '../../services/api';
import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, Alert, AlertTitle, AlertDescription } from '../common/ui-utils';
import { Select } from '../common/Select/Select';
import { SelectContent } from '../common/Select/SelectContent';
import { SelectItem } from '../common/Select/SelectItem';
import { SelectTrigger } from '../common/Select/SelectTrigger';
import { SelectValue } from '../common/Select/SelectValue';
import Message from '../common/Message';
import AgreementModal from '../common/AgreementModel';
import { cn, isMobileDevice } from '../../utils/helpers';

const MOCK_SERVICE_FEE = 2000;

const RequestFormPage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [submissionStatus, setSubmissionStatus] = useState('idle'); // idle, paying, success, error
    const [finalSubmissionInfo, setFinalSubmissionInfo] = useState(null);
    const [formMessage, setFormMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentSessionId] = useState(() => Date.now().toString()); // Unique session ID for this payment attempt
    const [paymentWindowRef, setPaymentWindowRef] = useState(null);
    const [paymentCheckInterval, setPaymentCheckInterval] = useState(null);
    const [paymentTimeoutId, setPaymentTimeoutId] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '', countryCode: '+966', localPhoneNumber: '', email: '', city: '',
        region: '', phoneModel: '', previouslyRepaired: '', deviceCondition: '',
        issueDescription: '', deviceImage: null,
    });
    const [isAgreementChecked, setIsAgreementChecked] = useState(false);
    const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
    // const [fileName, setFileName] = useState('');
    
    // Close payment window if component unmounts
    useEffect(() => {
        return () => {
            if (paymentWindowRef && !paymentWindowRef.closed) {
                console.log('Closing payment window on component unmount');
                paymentWindowRef.close();
            }
            if (paymentCheckInterval) {
                clearInterval(paymentCheckInterval);
            }
            if (paymentTimeoutId) {
                clearTimeout(paymentTimeoutId);
            }
        };
    }, [paymentWindowRef, paymentCheckInterval, paymentTimeoutId]);
    
    // Clear any stale payment data on component mount
    useEffect(() => {
        // Clean up any old pending request data when component mounts
        const savedDataString = localStorage.getItem('pendingRequestData');
        if (savedDataString) {
            try {
                const savedData = JSON.parse(savedDataString);
                // If there's old data from a different session, clear it
                if (savedData.sessionId && savedData.sessionId !== paymentSessionId) {
                    localStorage.removeItem('pendingRequestData');
                    console.log('Cleared stale payment data from previous session');
                }
            } catch (e) {
                // Invalid data, clear it
                localStorage.removeItem('pendingRequestData');
            }
        }
        
        // Cleanup function to remove pending data when component unmounts
        return () => {
            if (submissionStatus === 'paying') {
                // User navigated away while payment was in progress
                console.log('Component unmounting with payment in progress, cleaning up');
                localStorage.removeItem('pendingRequestData');
            }
        };
    }, [paymentSessionId, submissionStatus]); // Include dependencies
    
    // This effect handles the response from the payment popup
    useEffect(() => {
        const handlePaymentMessage = async (event) => {
            // Validate that this is actually a payment message
            if (!event.data || typeof event.data !== 'object') {
                // Not an object message, ignore silently
                return;
            }
            
            // Check if this is our payment callback message
            if (!event.data.isPaymentCallback) {
                // This is not from our payment callback, ignore it
                // Common messages from extensions or other scripts
                if (event.data.type || event.data.action || event.data.message) {
                    console.debug('Ignoring non-payment message:', event.data.type || event.data.action || 'unknown');
                }
                return;
            }
            
            // Check if the message has the expected payment fields
            if (!('status' in event.data || 'response_message' in event.data || 
                  'transaction_id' in event.data || 'fort_id' in event.data)) {
                // This is not a valid payment message, ignore it
                return;
            }
            
            // Verify session ID matches if available
            if (event.data.sessionId && event.data.sessionId !== paymentSessionId) {
                console.log('Ignoring payment message from different session:', event.data.sessionId, 'current:', paymentSessionId);
                return;
            }
            
            // Optional: Check event.origin for security
            // if (event.origin !== "http://your-backend-domain.com") return;
            
            const { status, response_message, transaction_id, fort_id } = event.data;
            console.log("Payment response received:", event.data);
            if (status === "14" || (response_message && response_message.toLowerCase().includes('success'))) {
                const savedDataString = localStorage.getItem('pendingRequestData');
                if (savedDataString) {
                    try {
                        const savedData = JSON.parse(savedDataString);
                        const fullPhoneNumber = savedData.countryCode + savedData.localPhoneNumber;
                        
                        const serviceRequestData = {
                            ...savedData,
                            fullPhoneNumber,
                            transactionId: transaction_id,
                            fortId: fort_id,
                            deviceImageName: savedData.deviceImage ? savedData.deviceImage.name : null,
                        };
                        
                        // Remove temporary fields
                        delete serviceRequestData.countryCode;
                        delete serviceRequestData.localPhoneNumber;
                        delete serviceRequestData.deviceImage;
                        delete serviceRequestData.sessionId;

                        const requestResponse = await api.submitRequest(serviceRequestData);
                        setFinalSubmissionInfo({ ...requestResponse.request, phoneNumber: fullPhoneNumber });
                        setSubmissionStatus('success');
                        
                        // Close the payment window if it's still open
                        if (paymentWindowRef && !paymentWindowRef.closed) {
                            paymentWindowRef.close();
                            setPaymentWindowRef(null);
                        }
                        // Clear the check interval
                        if (paymentCheckInterval) {
                            clearInterval(paymentCheckInterval);
                            setPaymentCheckInterval(null);
                        }
                        // Clear the timeout
                        if (paymentTimeoutId) {
                            clearTimeout(paymentTimeoutId);
                            setPaymentTimeoutId(null);
                        }
                    } catch (err) {
                        setFormMessage({ type: 'error', title: t('submissionFailedTitle'), text: err.message });
                        setSubmissionStatus('error');
                    } finally {
                        localStorage.removeItem('pendingRequestData');
                    }
                } else {
                    setFormMessage({ type: 'error', title: t('submissionFailedTitle'), text: "Missing request data." });
                    setSubmissionStatus('error');
                }
            } else {
                // Only process as payment failure if we have payment-related fields
                const failureReason = response_message || 'Unknown reason';
                console.error('Payment failed with reason:', failureReason);
                const errorMessage = response_message ? 
                    `${t('paymentFailedText')} (${failureReason})` : 
                    t('paymentFailedText');
                setFormMessage({ type: 'error', title: t('paymentFailedTitle'), text: errorMessage });
                setSubmissionStatus('error');
                localStorage.removeItem('pendingRequestData');
                
                // Close the payment window if it's still open
                if (paymentWindowRef && !paymentWindowRef.closed) {
                    paymentWindowRef.close();
                    setPaymentWindowRef(null);
                }
                // Clear the check interval
                if (paymentCheckInterval) {
                    clearInterval(paymentCheckInterval);
                    setPaymentCheckInterval(null);
                }
                // Clear the timeout
                if (paymentTimeoutId) {
                    clearTimeout(paymentTimeoutId);
                    setPaymentTimeoutId(null);
                }
            }
        };

        window.addEventListener('message', handlePaymentMessage);
        return () => window.removeEventListener('message', handlePaymentMessage);
    }, [t, paymentSessionId, paymentWindowRef, paymentCheckInterval, paymentTimeoutId]);

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        
        // Prevent multiple clicks
        if (loading || submissionStatus === 'paying') {
            console.log('Payment already in progress');
            return;
        }
        
        setLoading(true);
        setFormMessage(null);
        setSubmissionStatus('paying');
        
        if (!isAgreementChecked) {
            setFormMessage({ type: 'error', title: t('errorAgreementRequiredTitle'), text: t('errorAgreementRequiredText') });
            setLoading(false);
            setSubmissionStatus('idle');
            return;
        }

        const requiredFields = ['fullName', 'countryCode', 'localPhoneNumber', 'email', 'city', 'region', 'phoneModel', 'previouslyRepaired', 'deviceCondition', 'issueDescription'];
        if (requiredFields.some(field => !formData[field])) {
            setFormMessage({ type: 'error', title: t('errorMissingInfoTitle'), text: t('errorMissingInfoText') });
            setLoading(false);
            setSubmissionStatus('idle');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setFormMessage({ type: 'error', title: t('errorInvalidEmailTitle'), text: t('errorInvalidEmailText') });
            setLoading(false);
            setSubmissionStatus('idle');
            return;
        }

        try {
            const paymentData = {
                ...formData,
                sessionId: paymentSessionId
            };
            localStorage.setItem('pendingRequestData', JSON.stringify(paymentData));
            const paymentHtml = await api.initiatePayFortPayment({
                email: formData.email,
                amount: MOCK_SERVICE_FEE,
            });
            
            // Mobile vs Desktop Payment Handling:
            // - Mobile: Opens payment in the same tab (_self) for better compatibility
            //   as mobile browsers often block popups or handle them poorly
            // - Desktop: Opens payment in a popup window for better UX
            const isMobile = isMobileDevice();
            
            let paymentWindow;
            
            if (isMobile) {
                // On mobile, open in the same tab/window for better compatibility
                paymentWindow = window.open('', '_self');
            } else {
                // On desktop, use popup with responsive dimensions
                const width = Math.min(800, window.innerWidth - 100);
                const height = Math.min(600, window.innerHeight - 100);
                const left = (window.innerWidth - width) / 2;
                const top = (window.innerHeight - height) / 2;
                
                paymentWindow = window.open('', '_blank', 
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
            }
            
            if (paymentWindow) {
                setPaymentWindowRef(paymentWindow);
                paymentWindow.document.write(paymentHtml);
                paymentWindow.document.close();
                
                // Different handling for mobile vs desktop
                if (!isMobile) {
                    // Desktop: Check periodically if the popup was closed by the user
                    const checkInterval = setInterval(() => {
                        try {
                            if (paymentWindow.closed) {
                                console.log('Payment window was closed by user');
                                clearInterval(checkInterval);
                                setPaymentCheckInterval(null);
                                setPaymentWindowRef(null);
                                
                                // Only show error if we're still in paying status
                                // We need to check localStorage to see if payment was processed
                                const pendingData = localStorage.getItem('pendingRequestData');
                                if (pendingData) {
                                    // Payment data still pending, means payment wasn't completed
                                    setFormMessage({ 
                                        type: 'error', 
                                        title: t('paymentCancelledTitle') || 'Payment Cancelled', 
                                        text: t('paymentCancelledText') || 'Payment was cancelled. Please try again.' 
                                    });
                                    setSubmissionStatus('idle');
                                    localStorage.removeItem('pendingRequestData');
                                }
                            }
                        } catch (e) {
                            // Can't access the window, might be cross-origin
                            clearInterval(checkInterval);
                            setPaymentCheckInterval(null);
                        }
                    }, 1000);
                    
                    setPaymentCheckInterval(checkInterval);
                    setPaymentCheckInterval(checkInterval);
                    
                    // Clear the interval after 10 minutes (maximum payment time)
                    const timeoutId = setTimeout(() => {
                        clearInterval(checkInterval);
                        setPaymentCheckInterval(null);
                        setPaymentTimeoutId(null);
                        
                        // Check if payment is still pending
                        const pendingData = localStorage.getItem('pendingRequestData');
                        if (pendingData) {
                            console.log('Payment timeout reached');
                            setFormMessage({ 
                                type: 'error', 
                                title: t('paymentTimeoutTitle') || 'Payment Timeout', 
                                text: t('paymentTimeoutText') || 'Payment process took too long. Please try again.' 
                            });
                            setSubmissionStatus('idle');
                            localStorage.removeItem('pendingRequestData');
                            
                            // Close the payment window if still open
                            if (paymentWindow && !paymentWindow.closed) {
                                paymentWindow.close();
                            }
                        }
                    }, 600000); // 10 minutes
                    
                    setPaymentTimeoutId(timeoutId);
                } else {
                    // Mobile: Since we're redirecting in the same window, 
                    // the form component will be unmounted, so no need to check for closure
                    console.log('Mobile payment redirect initiated');
                    
                    // Set a shorter timeout for mobile since we can't track window closure
                    const timeoutId = setTimeout(() => {
                        setPaymentTimeoutId(null);
                        
                        // Check if payment is still pending
                        const pendingData = localStorage.getItem('pendingRequestData');
                        if (pendingData) {
                            console.log('Mobile payment timeout reached');
                            setFormMessage({ 
                                type: 'error', 
                                title: t('paymentTimeoutTitle') || 'Payment Timeout', 
                                text: t('paymentTimeoutText') || 'Payment process took too long. Please try again.' 
                            });
                            setSubmissionStatus('idle');
                            localStorage.removeItem('pendingRequestData');
                        }
                    }, 600000); // 10 minutes
                    
                    setPaymentTimeoutId(timeoutId);
                }
            } else {
                setFormMessage({ type: 'error', title: t('popupBlockedTitle'), text: t('popupBlockedText') });
                setSubmissionStatus('idle');
                localStorage.removeItem('pendingRequestData');
            }
        } catch(error) {
             setFormMessage({ type: 'error', title: t('submissionFailedTitle'), text: error.message || t('submissionFailedText') });
             localStorage.removeItem('pendingRequestData');
             setSubmissionStatus('idle');
             // Clear any refs
             setPaymentWindowRef(null);
             if (paymentCheckInterval) {
                clearInterval(paymentCheckInterval);
                setPaymentCheckInterval(null);
             }
             if (paymentTimeoutId) {
                clearTimeout(paymentTimeoutId);
                setPaymentTimeoutId(null);
             }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "deviceImage") {
            setFormData(prev => ({ ...prev, [name]: files ? files[0] : null }));
            // setFileName(files && files[0] ? files[0].name : "");
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const requiredStar = <span className="text-red-500">{t('requiredFieldIndicator')}</span>;

    // Final success/error view
    if (submissionStatus === 'success' && finalSubmissionInfo) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center">
                 <Message type="success" title={t('requestSubmittedTitle')} message={t('requestSubmittedText')} />
                 <Alert variant="success" className="mt-6 text-left">
                    <CheckCircle className="h-5 w-5" />
                    <AlertTitle>{t('importantSaveInfoTitle')}</AlertTitle>
                    <AlertDescription>
                        <p className="mb-2">{t('importantSaveInfoText')}</p>
                        <ul className={cn("list-inside space-y-1 bg-green-100 p-3 rounded-md", language === 'ar' ? 'list-disc text-right' : 'list-disc text-left')}>
                            <li><strong>{t('requestIdLabel')}</strong> <span className="font-mono text-green-700">{finalSubmissionInfo.fortId}</span></li>
                            <li><strong>{t('transactionIdLabel')}</strong> <span className="font-mono text-green-700">{finalSubmissionInfo.transactionId}</span></li>
                        </ul>
                        <p className="mt-3">{t('contactWhatsAppText', {phoneNumber: finalSubmissionInfo.phoneNumber})}</p>
                         <Button variant="outline" size="sm" className="mt-4" onClick={() => navigateTo('status')}>{t('checkStatusNowButton')}</Button>
                    </AlertDescription>
                </Alert>
            </motion.div>
        );
    }
    
    if (submissionStatus === 'error') {
         return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center">
                <Message type="error" title={formMessage.title} message={formMessage.text} />
                <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                    setSubmissionStatus('idle');
                    setFormMessage(null);
                    // Clear any stale data
                    localStorage.removeItem('pendingRequestData');
                    // Close payment window if still open
                    if (paymentWindowRef && !paymentWindowRef.closed) {
                        paymentWindowRef.close();
                        setPaymentWindowRef(null);
                    }
                    // Clear intervals and timeouts
                    if (paymentCheckInterval) {
                        clearInterval(paymentCheckInterval);
                        setPaymentCheckInterval(null);
                    }
                    if (paymentTimeoutId) {
                        clearTimeout(paymentTimeoutId);
                        setPaymentTimeoutId(null);
                    }
                }}>
                    {t('tryAgainButton') || 'Try Again'}
                </Button>
            </motion.div>
        );
    }
    
    const countryCodes = [
        { value: '+966', label: '🇸🇦 +966 (KSA)' }, { value: '+971', label: '🇦🇪 +971 (UAE)' }, { value: '+974', label: '🇶🇦 +974 (Qatar)' },
        { value: '+973', label: '🇧🇭 +973 (Bahrain)' }, { value: '+968', label: '🇴🇲 +968 (Oman)' }, { value: '+965', label: '🇰🇼 +965 (Kuwait)' },
    ];
    const phoneModels = [
        { value: 'iPhone X', label: 'iPhone X / XR / XS' }, { value: 'iPhone 11', label: 'iPhone 11 / Pro / Max' },
        { value: 'iPhone 12', label: 'iPhone 12 / Mini / Pro / Max' }, { value: 'iPhone 13', label: 'iPhone 13 / Mini / Pro / Max' },
        { value: 'iPhone 14', label: 'iPhone 14 / Plus / Pro / Max' }, { value: 'iPhone 15', label: 'iPhone 15 / Plus / Pro / Max' },
        { value: 'iPhone SE (2nd Gen)', label: 'iPhone SE (2nd Gen)' }, { value: 'iPhone SE (3rd Gen)', label: 'iPhone SE (3rd Gen)' }, { value: 'Other', label: 'Other iPhone Model' },
    ];
    const deviceConditions = [
        { value: 'fell_in_water', labelKey: 'conditionFellInWater' }, { value: 'physical_damage', labelKey: 'conditionPhysicalDamage' },
        { value: 'no_power', labelKey: 'conditionNoPower' }, { value: 'screen_issue', labelKey: 'conditionScreenIssue' },
        { value: 'battery_issue', labelKey: 'conditionBatteryIssue' }, { value: 'software_issue', labelKey: 'conditionSoftwareIssue' }, { value: 'other', labelKey: 'conditionOther' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 max-w-2xl mx-auto"
        >
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">{t('requestServiceTitle')}</h2>
                <p className="text-gray-600 mt-2">{t('requestServiceSubtitle')}</p>
            </div>

            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle>{t('yourInformationTitle')}</CardTitle>
                    <CardDescription>{t('yourInformationDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProceedToPayment} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><Label htmlFor="fullName">{t('fullNameLabel')} {requiredStar}</Label><Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('fullNamePlaceholder')} required className="mt-1" /></div>
                            <div><Label htmlFor="email">{t('emailLabel')} {requiredStar}</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t('emailPlaceholder')} required className="mt-1" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-1"><Label htmlFor="countryCode">{t('countryCodeLabel')} {requiredStar}</Label><Select onValueChange={(v) => handleSelectChange('countryCode', v)} value={formData.countryCode}><SelectTrigger className="mt-1 w-full"><SelectValue placeholder={t('countryCodePlaceholder')} /></SelectTrigger><SelectContent>{countryCodes.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
                            <div className="md:col-span-2"><Label htmlFor="localPhoneNumber">{t('localPhoneNumberLabel')} {requiredStar}</Label><Input id="localPhoneNumber" name="localPhoneNumber" value={formData.localPhoneNumber} onChange={handleChange} placeholder={t('localPhoneNumberPlaceholder')} required className="mt-1" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div><Label htmlFor="city">{t('cityLabel')} {requiredStar}</Label><Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder={t('cityPlaceholder')} required className="mt-1" /></div>
                             <div><Label htmlFor="region">{t('regionLabel')} {requiredStar}</Label><Input id="region" name="region" value={formData.region} onChange={handleChange} placeholder={t('regionPlaceholder')} required className="mt-1" /></div>
                        </div>
                        <div className="pt-4 border-t mt-6 space-y-6">
                            <div><Label htmlFor="phoneModel">{t('phoneModelLabel')} {requiredStar}</Label><Select onValueChange={(v) => handleSelectChange('phoneModel', v)} value={formData.phoneModel}><SelectTrigger className="mt-1 w-full"><SelectValue placeholder={t('phoneModelSelectPlaceholder')} /></SelectTrigger><SelectContent>{phoneModels.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent></Select></div>
                            <div><Label htmlFor="previouslyRepaired">{t('previouslyRepairedLabel')} {requiredStar}</Label><Select onValueChange={(v) => handleSelectChange('previouslyRepaired', v)} value={formData.previouslyRepaired}><SelectTrigger className="mt-1 w-full"><SelectValue placeholder={t('previouslyRepairedPlaceholder')} /></SelectTrigger><SelectContent><SelectItem value="no">{t('noOption')}</SelectItem><SelectItem value="yes">{t('yesOption')}</SelectItem></SelectContent></Select></div>
                            <div><Label htmlFor="deviceCondition">{t('deviceConditionLabel')} {requiredStar}</Label><Select onValueChange={(v) => handleSelectChange('deviceCondition', v)} value={formData.deviceCondition}><SelectTrigger className="mt-1 w-full"><SelectValue placeholder={t('deviceConditionPlaceholder')} /></SelectTrigger><SelectContent>{deviceConditions.map(c => <SelectItem key={c.value} value={c.value}>{t(c.labelKey)}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div><Label htmlFor="issueDescription">{t('issueDescriptionLabel')} {requiredStar}</Label><Textarea id="issueDescription" name="issueDescription" value={formData.issueDescription} onChange={handleChange} placeholder={t('issueDescriptionPlaceholder')} required className="mt-1" rows={4} /></div>
                        {/* <div><Label htmlFor="deviceImage" className="flex items-center gap-2"><UploadCloud className="w-5 h-5 text-gray-500" />{t('deviceImageLabel')} {requiredStar}</Label><Input id="deviceImage" name="deviceImage" type="file" accept="image/*" onChange={handleChange} required className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>{fileName && <p className="text-xs text-gray-500 mt-1">{t('fileNameLabel')} {fileName}</p>}</div> */}
                        {/* <div className="pt-4 border-t mt-6">
                            <p className="text-sm text-gray-600">{t('paymentCreditCard')}</p>
                        </div> */}
                        <div className={cn("flex items-start mt-6 pt-6 border-t", language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                            <input type="checkbox" id="agreement" checked={isAgreementChecked} onChange={(e) => setIsAgreementChecked(e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0" />
                            <Label htmlFor="agreement" className="text-sm text-gray-700">{t('agreementCheckboxLabel')}{' '}<button type="button" onClick={() => setIsAgreementModalOpen(true)} className="text-blue-600 hover:underline font-medium">{t('viewAgreementLink')}</button></Label>
                        </div>
                        <AnimatePresence>{formMessage && <Message type={formMessage.type} title={formMessage.title} message={formMessage.text} />}</AnimatePresence>
                        {submissionStatus === 'paying' && !formMessage && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-blue-50 border border-blue-200 rounded-md p-4"
                            >
                                <div className="flex items-center">
                                    <Loader2 className={cn("h-5 w-5 animate-spin text-blue-600", language === 'ar' ? 'ml-3' : 'mr-3')} />
                                    <span className="text-blue-700">
                                        {(() => {
                                            const isMobile = isMobileDevice();
                                            return isMobile 
                                                ? (t('paymentInProgressMobileMessage') || 'Redirecting to payment gateway...')
                                                : (t('paymentInProgressMessage') || 'Payment in progress. Please complete the payment in the popup window...');
                                        })()}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                        <Button type="submit" className="w-full text-lg py-3" disabled={loading || !isAgreementChecked || submissionStatus === 'paying'} size="lg">
                            {loading ? (<><Loader2 className={cn("h-5 w-5 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('submittingButton')}</>) : (<><CreditCard className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('proceedToPaymentButton')}</>)}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <AnimatePresence>{isAgreementModalOpen && <AgreementModal isOpen={isAgreementModalOpen} onClose={() => setIsAgreementModalOpen(false)} />}</AnimatePresence>
        </motion.div>
    );
};

export default RequestFormPage;