import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2, CheckCircle, X, AlertCircle, FileText
} from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageProvider';
import { cn } from '../../utils/helpers';

// UI Component Imports from common
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent } from '../common/ui-utils';
import Message from '../common/Message';

const StatusCheckPage = ({ navigateTo }) => {
    const { t, language } = useLanguage();
    const [orderId, setOrderId] = useState('');
    const [statusData, setStatusData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    const handleCheckStatus = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setStatusData(null);
        
        if (!orderId.trim()) { 
            setError({ title: t('errorMissingInfoTitle'), text: t('errorOrderIdRequired') }); 
            setLoading(false); 
            return; 
        }
        
        try {
            const result = await api.checkStatus(orderId.trim());
            if (result) { 
                setStatusData(result); 
                setError(null); 
            } else { 
                setError({ title: t('errorNotFoundTitle'), text: t('errorRequestNotFound') }); 
                setStatusData(null); 
            }
        } catch (err) {
            setError({ title: t('statusCheckFailedTitle'), text: err.message || t('statusCheckFailedTextDefault') });
            setStatusData(null);
        } finally { 
            setLoading(false); 
        }
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
        <motion.div initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-lg mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">{t('checkRequestStatusTitle')}</h2>
                <p className="text-gray-600 mt-2">{t('checkRequestStatusSubtitle')}</p>
            </div>
            <Card className="shadow-xl">
                <CardContent className="p-6">
                    <form onSubmit={handleCheckStatus} className="space-y-6">
                        <div>
                            <Label htmlFor="orderId">{t('orderIdLabel')}</Label>
                            <div className="relative mt-1">
                                <FileText className={cn("absolute h-5 w-5 text-gray-400 top-1/2 -translate-y-1/2", language === 'ar' ? "right-3" : "left-3")} />
                                <Input 
                                    id="orderId" 
                                    value={orderId} 
                                    onChange={(e) => setOrderId(e.target.value)} 
                                    placeholder={t('orderIdPlaceholder')} 
                                    className={cn(language === 'ar' ? "pr-10" : "pl-10")} 
                                    required 
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className={cn("h-4 w-4 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> 
                                    {t('checkingStatusButton')}
                                </>
                            ) : (
                                t('checkStatusButton')
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <AnimatePresence>
                {error && <Message type="error" title={error.title} message={error.text} />}
            </AnimatePresence>
            {statusData && !error && (
                <Card className="shadow-lg mt-6">
                    <CardHeader>
                        <CardTitle>{t('requestStatusTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="py-3">
                            <h3 className="text-md font-semibold mb-2 text-blue-700">
                                {t('statusForRequestId', {requestId: statusData.requestId})}
                            </h3>
                            <div className={`flex items-center text-lg font-semibold p-3 rounded-md ${getStatusDisplay(statusData.status).color} bg-opacity-10 bg-${getStatusDisplay(statusData.status).color.split('-')[1]}-100`}>
                                {getStatusDisplay(statusData.status).icon}
                                {getStatusDisplay(statusData.status).text}
                            </div>
                            {statusData.message && (
                                <p className="text-sm text-gray-600 mt-2">{statusData.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
};

export default StatusCheckPage;