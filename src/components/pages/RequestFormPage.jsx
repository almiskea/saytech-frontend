import React, { useState, useEffect, useCallback } from 'react';
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
import PaymentModal from '../common/PaymentModal';
import { cn } from '../../utils/helpers';

const MOCK_SERVICE_FEE = 2000;

const RequestFormPage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [submissionStatus, setSubmissionStatus] = useState('idle'); // idle, paying, success, error
    const [finalSubmissionInfo, setFinalSubmissionInfo] = useState(null);
    const [formMessage, setFormMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentSessionId] = useState(() => Date.now().toString()); // Unique session ID for this payment attempt

    // Debug: Log current state on every render
    console.log('[RequestFormPage Render] submissionStatus:', submissionStatus, 'finalSubmissionInfo:', finalSubmissionInfo);

    const [formData, setFormData] = useState({
        fullName: '', countryCode: '+966', localPhoneNumber: '', email: '', city: '',
        region: '', phoneModel: '', previouslyRepaired: '', deviceCondition: '',
        issueDescription: '', deviceImage: null,
    });
    const [isAgreementChecked, setIsAgreementChecked] = useState(false);
    const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentHtml, setPaymentHtml] = useState('');
    // const [fileName, setFileName] = useState('');
    
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
    
    // Payment handlers with useCallback to prevent re-renders
    const handlePaymentComplete = useCallback((paymentResult) => {
        console.log('[Payment Complete] Starting with paymentResult:', paymentResult);
        console.log('[Payment Complete] Current formData:', formData);
        console.log('[Payment Complete] Current finalSubmissionInfo before:', finalSubmissionInfo);
        
        // Set submission status to success
        setSubmissionStatus('success');
        console.log('[Payment Complete] Set submissionStatus to success');
        
        // Create the final submission info with payment details
        const finalInfo = {
            transactionId: paymentResult.transactionId || paymentResult.transaction_id,
            fortId: paymentResult.fortId || paymentResult.fort_id,
            phoneNumber: formData?.phoneNumber || '',
            status: paymentResult.status,
            responseMessage: paymentResult.responseMessage || paymentResult.response_message
        };
        
        console.log('[Payment Complete] Setting finalSubmissionInfo to:', finalInfo);
        setFinalSubmissionInfo(finalInfo);
        
        // Clean up payment modal
        setIsPaymentModalOpen(false);
        setLoading(false);
        
        // Clear any stored payment data
        try {
            localStorage.removeItem('paymentData');
            sessionStorage.removeItem('paymentCallback');
            sessionStorage.removeItem('pendingPayment');
            console.log('[Payment Complete] Cleared storage data');
        } catch (error) {
            console.error('[Payment Complete] Error clearing storage:', error);
        }
        
        console.log('[Payment Complete] Final state - submissionStatus: success, finalSubmissionInfo:', finalInfo);
    }, [formData, finalSubmissionInfo]);
    
    const handlePaymentError = useCallback((errorMessage) => {
        console.log('handlePaymentError called with:', errorMessage);
        setFormMessage({ 
            type: 'error', 
            title: t('paymentFailedTitle'), 
            text: errorMessage || t('paymentFailedText')
        });
        setSubmissionStatus('error');
        setIsPaymentModalOpen(false);
        localStorage.removeItem('pendingRequestData');
    }, [t, setFormMessage, setSubmissionStatus, setIsPaymentModalOpen]);
    
    const handlePaymentModalClose = useCallback(() => {
        setIsPaymentModalOpen(false);
        setSubmissionStatus('idle');
        localStorage.removeItem('pendingRequestData');
    }, [setIsPaymentModalOpen, setSubmissionStatus]);
    
    // Check for payment return on component mount
    useEffect(() => {
        const checkPaymentReturn = () => {
            console.log('checkPaymentReturn called');
            
            // First check sessionStorage for payment callback (mobile flow)
            const sessionCallback = sessionStorage.getItem('paymentCallback');
            console.log('Session callback data:', sessionCallback);
            
            if (sessionCallback) {
                console.log('Found payment callback in sessionStorage');
                try {
                    const paymentResult = JSON.parse(sessionCallback);
                    console.log('Parsed payment result:', paymentResult);
                    sessionStorage.removeItem('paymentCallback'); // Clean up
                    
                    // Process the payment result
                    console.log('Processing payment from sessionStorage:', paymentResult);
                    setSubmissionStatus('paying');
                    
                    const isSuccess = paymentResult.status === "14" || paymentResult.status === 14 || 
                        (paymentResult.response_message && paymentResult.response_message.toLowerCase().includes('success'));
                    
                    console.log('Is payment successful?', isSuccess, 'Status:', paymentResult.status);
                    
                    if (isSuccess) {
                        console.log('Payment successful from sessionStorage');
                        handlePaymentComplete({ 
                            transaction_id: paymentResult.transaction_id, 
                            fort_id: paymentResult.fort_id, 
                            status: paymentResult.status,
                            response_message: paymentResult.response_message 
                        });
                    } else {
                        console.log('Payment failed from sessionStorage:', paymentResult.response_message);
                        handlePaymentError(paymentResult.response_message || 'Payment failed');
                    }
                    return; // Exit early since we found a callback
                } catch (e) {
                    console.error('Error parsing payment callback from sessionStorage:', e);
                    sessionStorage.removeItem('paymentCallback'); // Clean up invalid data
                }
            }
            
            // Then check URL parameters (fallback)
            const urlParams = new URLSearchParams(window.location.search);
            const hash = window.location.hash;
            
            // Check if we're returning from a payment
            if (urlParams.has('status') || urlParams.has('response_code') || hash.includes('payment')) {
                console.log('Detected payment return in URL, processing...');
                
                const status = urlParams.get('status') || urlParams.get('response_code');
                const transaction_id = urlParams.get('transaction_id') || urlParams.get('fort_id');
                const fort_id = urlParams.get('fort_id') || transaction_id;
                const response_message = urlParams.get('response_message') || urlParams.get('message');
                
                // Set paying status to show loading
                setSubmissionStatus('paying');
                
                // Handle the payment response
                if (status === "14" || status === 14 || 
                    (response_message && response_message.toLowerCase().includes('success'))) {
                    console.log('Payment successful from URL, processing completion');
                    handlePaymentComplete({ transaction_id, fort_id, status, response_message });
                } else {
                    console.log('Payment failed from URL:', response_message);
                    handlePaymentError(response_message || 'Payment failed');
                }
                
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        };
        
        // Check immediately on mount
        checkPaymentReturn();
        
        // Listen for custom payment callback events
        const handlePaymentEvent = (event) => {
            console.log('Received payment callback event:', event.detail);
            setSubmissionStatus('paying');
            
            const paymentResult = event.detail;
            const isSuccess = paymentResult.status === "14" || paymentResult.status === 14 || 
                (paymentResult.response_message && paymentResult.response_message.toLowerCase().includes('success'));
            
            console.log('Payment event success check:', isSuccess, 'Status:', paymentResult.status);
            
            if (isSuccess) {
                console.log('Payment successful from event');
                handlePaymentComplete({ 
                    transaction_id: paymentResult.transaction_id, 
                    fort_id: paymentResult.fort_id, 
                    status: paymentResult.status,
                    response_message: paymentResult.response_message 
                });
            } else {
                console.log('Payment failed from event:', paymentResult.response_message);
                handlePaymentError(paymentResult.response_message || 'Payment failed');
            }
        };
        
        // Also listen for hash changes and the custom payment event
        window.addEventListener('hashchange', checkPaymentReturn);
        window.addEventListener('paymentCallback', handlePaymentEvent);
        
        return () => {
            window.removeEventListener('hashchange', checkPaymentReturn);
            window.removeEventListener('paymentCallback', handlePaymentEvent);
        };
    }, [handlePaymentComplete, handlePaymentError]); // Include handler dependencies

    // Check for mobile payment return on component mount
    useEffect(() => {
        // Check if we're returning from a mobile payment
        const paymentInProgress = sessionStorage.getItem('paymentInProgress');
        
        if (paymentInProgress === 'true') {
            console.log('Detected return from mobile payment, checking for callback parameters');
            
            // Check URL parameters for payment callback
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('status') || urlParams.get('response_code');
            const transaction_id = urlParams.get('transaction_id');
            const fort_id = urlParams.get('fort_id');
            const response_message = urlParams.get('response_message');
            
            if (status || transaction_id || fort_id) {
                console.log('Found payment callback parameters:', { status, transaction_id, fort_id, response_message });
                
                // Clear the payment progress flag
                sessionStorage.removeItem('paymentInProgress');
                sessionStorage.removeItem('paymentOrigin');
                
                // Process the payment result
                const paymentResult = { status, transaction_id, fort_id, response_message };
                
                if (status === "14" || status === 14 || 
                    (response_message && response_message.toLowerCase().includes('success'))) {
                    console.log('Mobile payment successful');
                    handlePaymentComplete(paymentResult);
                } else {
                    console.log('Mobile payment failed');
                    handlePaymentError(response_message || 'Payment failed');
                }
                
                // Clean up URL parameters
                const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            } else {
                console.log('No payment parameters found, clearing payment progress flag');
                sessionStorage.removeItem('paymentInProgress');
                sessionStorage.removeItem('paymentOrigin');
            }
        }
    }, [handlePaymentComplete, handlePaymentError]); // Run once after handlers are available

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
            const paymentHtmlResponse = await api.initiatePayFortPayment({
                email: formData.email,
                amount: MOCK_SERVICE_FEE,
            });
            
            // Store payment HTML and open modal
            setPaymentHtml(paymentHtmlResponse);
            setIsPaymentModalOpen(true);
        } catch(error) {
             setFormMessage({ type: 'error', title: t('submissionFailedTitle'), text: error.message || t('submissionFailedText') });
             localStorage.removeItem('pendingRequestData');
             setSubmissionStatus('idle');
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
    if (submissionStatus === 'success') {
        console.log('Rendering success view, finalSubmissionInfo:', finalSubmissionInfo);
        
        if (finalSubmissionInfo) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center">
                     <Message type="success" title={t('requestSubmittedTitle')} message={t('requestSubmittedText')} />
                     <Alert variant="success" className="mt-6 text-left">
                        <CheckCircle className="h-5 w-5" />
                        <AlertTitle>{t('importantSaveInfoTitle')}</AlertTitle>
                        <AlertDescription>
                            <p className="mb-2">{t('importantSaveInfoText')}</p>
                            <ul className={cn("list-inside space-y-1 bg-green-100 p-3 rounded-md", language === 'ar' ? 'list-disc text-right' : 'list-disc text-left')}>
                                <li><strong>{t('requestIdLabel')}</strong> <span className="font-mono text-green-700">{finalSubmissionInfo.fortId || 'N/A'}</span></li>
                                <li><strong>{t('transactionIdLabel')}</strong> <span className="font-mono text-green-700">{finalSubmissionInfo.transactionId || 'N/A'}</span></li>
                            </ul>
                            <p className="mt-3">{t('contactWhatsAppText', {phoneNumber: finalSubmissionInfo.phoneNumber || 'N/A'})}</p>
                             <Button variant="outline" size="sm" className="mt-4" onClick={() => navigateTo('status')}>{t('checkStatusNowButton')}</Button>
                        </AlertDescription>
                    </Alert>
                </motion.div>
            );
        } else {
            // Fallback success view when finalSubmissionInfo is not available
            console.log('Showing fallback success view - no finalSubmissionInfo');
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center">
                     <Message type="success" title={t('requestSubmittedTitle') || 'Payment Successful'} message={t('requestSubmittedText') || 'Your payment has been processed successfully.'} />
                     <Alert variant="success" className="mt-6 text-left">
                        <CheckCircle className="h-5 w-5" />
                        <AlertTitle>{t('importantSaveInfoTitle') || 'Important Information'}</AlertTitle>
                        <AlertDescription>
                            <p className="mb-2">{t('paymentSuccessMessage') || 'Your payment has been processed successfully. You will receive a confirmation shortly.'}</p>
                             <Button variant="outline" size="sm" className="mt-4" onClick={() => navigateTo('status')}>{t('checkStatusNowButton') || 'Check Status'}</Button>
                        </AlertDescription>
                    </Alert>
                </motion.div>
            );
        }
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
                    // Close payment modal if still open
                    setIsPaymentModalOpen(false);
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
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Loader2 className={cn("h-5 w-5 animate-spin text-blue-600", language === 'ar' ? 'ml-3' : 'mr-3')} />
                                        <span className="text-blue-700">
                                            {t('paymentInProgressMessage') || 'Opening payment gateway...'}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            console.log('Manual payment check triggered');
                                            const pendingData = localStorage.getItem('pendingRequestData');
                                            console.log('Pending data:', pendingData);
                                            if (pendingData) {
                                                handlePaymentModalClose();
                                            }
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Cancel
                                    </button>
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
            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={handlePaymentModalClose}
                paymentHtml={paymentHtml}
                onPaymentComplete={handlePaymentComplete}
                onPaymentError={handlePaymentError}
            />
        </motion.div>
    );
};

export default RequestFormPage;