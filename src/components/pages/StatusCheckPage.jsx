import { useLanguage } from '../../App';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common/ui-utils';
import { Input } from '../common/ui-utils';
import { Label } from '../common/ui-utils';
import { Button } from '../common/ui-utils';
import { Loader2 } from 'lucide-react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';
import api from '../../services/api';
import Message from '../common/Message';
import { AnimatePresence } from 'framer-motion';
import { KeyRound, Phone } from 'lucide-react';
import React from 'react';

const StatusCheckPage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [searchType, setSearchType] = useState('requestId');
    const [requestId, setRequestId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCodeInput, setVerificationCodeInput] = useState('');
    
    const [statusData, setStatusData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [message, setMessage] = useState(null);

    const resetForm = () => {
        setRequestId(''); setPhoneNumber(''); setVerificationCodeInput('');
        setStatusData(null); setError(null); setMessage(null);
        setIsVerificationSent(false); setIsCheckingStatus(false);
    };
    
    const handleSearchTypeChange = (type) => { setSearchType(type); resetForm(); };

    const handleSendVerification = async () => {
        setLoading(true); setError(null); setStatusData(null); setIsVerificationSent(false); setMessage(null);
        try {
            if (searchType === 'requestId') {
                if (!requestId.trim()) {
                    setError({ title: t('errorInputRequiredTitle'), text: t('errorEnterRequestId') }); setLoading(false); return;
                }
                await api.sendRequestIdVerificationCode(requestId.trim().toUpperCase());
                setMessage({ type: 'success', title: t('verificationCodeSentTitle'), text: t('verificationCodeSentTextRequestId', {requestId: requestId.trim().toUpperCase()}) });
            } else { 
                if (!phoneNumber.trim() || !/^\+\d{10,}$/.test(phoneNumber.trim())) {
                    setError({ title: t('errorInputRequiredTitle'), text: t('errorEnterPhoneNumber') }); setLoading(false); return;
                }
                await api.sendVerificationCode(phoneNumber.trim());
                setMessage({ type: 'success', title: t('verificationCodeSentTitle'), text: t('verificationCodeSentTextPhone', {phoneNumber: phoneNumber.trim()}) });
            }
            setIsVerificationSent(true);
        } catch (err) {
            setError({ title: t('errorFailedToSendCodeTitle'), text: err.message || t('errorFailedToSendCodeText') });
        } finally { setLoading(false); }
    };
    
    const handleCheckStatus = async (e) => {
        e.preventDefault();
        setLoading(true); setIsCheckingStatus(true); setError(null); setStatusData(null); setMessage(null);

        if (!verificationCodeInput.trim()) {
            setError({ title: t('errorInputRequiredTitle'), text: t('errorEnterVerificationCode') }); setLoading(false); return;
        }

        try {
            let rawData;
            if (searchType === 'requestId') {
                rawData = await api.checkStatus(requestId.trim().toUpperCase(), verificationCodeInput.trim());
            } else { 
                rawData = await api.checkStatusByPhone(phoneNumber.trim(), verificationCodeInput.trim());
            }

            if (rawData) {
                if (typeof rawData === 'object' && !Array.isArray(rawData) && rawData.status === 'error') {
                     setError({ title: t('statusCheckFailedTitle'), text: rawData.message || t('statusCheckFailedTextDefault') });
                     setStatusData(null);
                } else {
                    setStatusData(rawData); 
                    setError(null);
                }
            } else { 
                setError({ title: t('errorNotFoundTitle'), text: searchType === 'requestId' ? t('errorRequestIdNotFound') : t('errorPhoneNumberNotFound') });
                setStatusData(null);
            }
        } catch (err) {
            setError({ title: t('errorGenericTitle'), text: err.message || t('statusCheckFailedTextDefault') });
            setStatusData(null);
        } finally { setLoading(false); setIsCheckingStatus(false); }
    };

    const getStatusDisplay = (statusKey) => {
        const statusMap = {
            'paid': { text: t('statusPaid'), color: 'text-blue-600', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
            'shipped': { text: t('statusShipped'), color: 'text-blue-600', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
            'delivered': { text: t('statusDelivered'), color: 'text-purple-600', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
            'evaluating_device': { text: t('statusEvaluatingDevice'), color: 'text-yellow-500', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
            'data_recovered': { text: t('statusDataRecovered'), color: 'text-green-600', icon: <CheckCircle className="h-5 w-5" /> },
            'data_cant_recover': { text: t('statusDataCantRecover'), color: 'text-red-600', icon: <X className="h-5 w-5" /> },
            'pending': { text: t('statusPending'), color: 'text-yellow-600', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
        };
        const display = statusMap[statusKey] || { text: t('statusUnknown'), color: 'text-gray-500', icon: <AlertCircle className="h-5 w-5" /> };
        display.icon = React.cloneElement(display.icon, { className: cn(display.icon.props.className, language === 'ar' ? 'ml-2' : 'mr-2') });
        return display;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 max-w-lg mx-auto"
        >
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">{t('checkRequestStatusTitle')}</h2>
                <p className="text-gray-600 mt-2">{t('checkRequestStatusSubtitle')}</p>
            </div>

            <Card className="shadow-xl">
                <CardHeader>
                    <div className="flex space-x-2 mb-4 border-b pb-4">
                        <Button variant={searchType === 'requestId' ? 'default' : 'outline'} onClick={() => handleSearchTypeChange('requestId')} className="flex-1">
                            <KeyRound className={cn("w-4 h-4", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('useRequestIdButton')}
                        </Button>
                        <Button variant={searchType === 'phoneNumber' ? 'default' : 'outline'} onClick={() => handleSearchTypeChange('phoneNumber')} className="flex-1">
                            <Phone className={cn("w-4 h-4", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('usePhoneNumberButton')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCheckStatus} className="space-y-6">
                        {!isVerificationSent ? (
                            <>
                                {searchType === 'requestId' ? (
                                    <div>
                                        <Label htmlFor="requestId">{t('requestIdInputLabel')}</Label>
                                        <Input id="requestId" value={requestId} onChange={(e) => setRequestId(e.target.value.toUpperCase())} placeholder={t('requestIdInputPlaceholder')} className="mt-1" />
                                    </div>
                                ) : (
                                    <div>
                                        <Label htmlFor="phoneNumber">{t('phoneNumberInputLabel')}</Label>
                                        <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={t('phoneNumberInputPlaceholder')} className="mt-1" />
                                    </div>
                                )}
                                <Button onClick={handleSendVerification} className="w-full" disabled={loading} type="button">
                                    {loading ? <><Loader2 className={cn("h-4 w-4 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('sendingCodeButton')}</> : t('sendVerificationCodeButton')}
                                </Button>
                            </>
                        ) : (
                             <>
                                {searchType === 'requestId' && <p className="text-sm text-gray-600">{t('requestIdInputLabel')}: <span className="font-medium">{requestId}</span></p>}
                                {searchType === 'phoneNumber' && <p className="text-sm text-gray-600">{t('phoneNumberInputLabel')}: <span className="font-medium">{phoneNumber}</span></p>}
                                <div>
                                    <Label htmlFor="verificationCodeInput">{t('verificationCodeInputLabel')}</Label>
                                    <Input id="verificationCodeInput" value={verificationCodeInput} onChange={(e) => setVerificationCodeInput(e.target.value)} placeholder={t('verificationCodeInputPlaceholder')} className="mt-1" />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading || isCheckingStatus}>
                                    {(loading || isCheckingStatus) ? <><Loader2 className={cn("h-4 w-4 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('checkingStatusButton')}</> : t('checkStatusButton')}
                                </Button>
                                <Button variant="link" size="sm" onClick={() => { setIsVerificationSent(false); setMessage(null); setError(null); }} className="w-full text-sm">
                                    {searchType === 'requestId' ? t('changeRequestIdLink') : t('changePhoneNumberLink')} {t('orResendCodeLink')}
                                </Button>
                            </>
                        )}
                    </form>
                </CardContent>
            </Card>
            
            <AnimatePresence>
                {message && <Message type={message.type} title={message.title} message={message.text} />}
                {error && <Message type="error" title={error.title} message={error.text} />}
            </AnimatePresence>

            {statusData && !error && (
                <Card className="shadow-lg mt-6">
                    <CardHeader>
                        <CardTitle>
                            {(Array.isArray(statusData) && statusData.length > 0) ? t('multipleRequestsStatusTitle') :
                             (statusData && !Array.isArray(statusData) && statusData.requestId) ? t('statusForRequestId', {requestId: statusData.requestId}) :
                             t('requestStatusTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {Array.isArray(statusData) ? (
                            statusData.length > 0 ? (
                                statusData.map((item, index) => (
                                    <div key={item.requestId || index} className={cn("py-3", index > 0 ? "mt-3 border-t border-gray-200" : "")}>
                                        <h3 className="text-md font-semibold mb-2 text-blue-700">{item.requestId ? t('statusForRequestId', {requestId: item.requestId}) : t('requestStatusTitle')}</h3>
                                        <div className={`flex items-center text-lg font-semibold p-3 rounded-md ${getStatusDisplay(item.status).color} bg-opacity-10 bg-${getStatusDisplay(item.status).color.split('-')[1]}-100`}>
                                            {getStatusDisplay(item.status).icon}
                                            {getStatusDisplay(item.status).text}
                                        </div>
                                        {item.message && <p className="text-sm text-gray-600 mt-2">{item.message}</p>}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">{t('noRequestsFound')}</p>
                            )
                        ) : ( 
                            statusData.status && statusData.status !== 'error' ? (
                                <>
                                    <div className={`flex items-center text-lg font-semibold p-4 rounded-md ${getStatusDisplay(statusData.status).color} bg-opacity-10 bg-${getStatusDisplay(statusData.status).color.split('-')[1]}-100`}>
                                        {getStatusDisplay(statusData.status).icon}
                                        {getStatusDisplay(statusData.status).text}
                                    </div>
                                    {statusData.message && <p className="text-sm text-gray-600 mt-3">{statusData.message}</p>}
                                </>
                            ) : null 
                        )}
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
};

export default StatusCheckPage;