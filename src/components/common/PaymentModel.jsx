import { useLanguage } from '../../App';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui-utils';
import { ShieldCheck, X, Loader2, CreditCard } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Button, Label, Input } from './ui-utils';
import Message from './Message';
// --- Payment Modal Component ---
const PaymentModal = ({ isOpen, onClose, amount, onSubmitPayment, paymentMethodType }) => {
    const { t, language } = useLanguage();
    const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "cardNumber") {
            const cleanedValue = value.replace(/\s/g, '');
            if (/^\d{0,16}$/.test(cleanedValue)) {
                const formatted = cleanedValue.replace(/(.{4})/g, '$1 ').trim();
                setCardDetails(prev => ({ ...prev, [name]: formatted }));
            }
        } else if (name === "expiryDate") {
             const cleanedValue = value.replace(/\D/g, '');
            if (cleanedValue.length <= 4) {
                let formattedValue = cleanedValue;
                if (cleanedValue.length >= 2) {
                    formattedValue = cleanedValue.slice(0,2) + '/' + cleanedValue.slice(2);
                }
                setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
            }
        } else if (name === "cvv") {
            if (/^\d{0,3}$/.test(value)) {
                 setCardDetails(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setCardDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentLoading(true);
        setPaymentMessage(null);

        if (paymentMethodType === 'creditCard') {
            if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16 || 
                !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate) || 
                cardDetails.cvv.length !== 3) {
                setPaymentMessage({ type: 'error', textKey: 'paymentFailedText' });
                setPaymentLoading(false);
                return;
            }
        }
        
        const result = await onSubmitPayment(cardDetails); 
        setPaymentLoading(false);
        if (result.success) {
            setPaymentMessage({ type: 'success', textKey: result.messageKey || 'paymentSuccessfulText' });
        } else {
            setPaymentMessage({ type: 'error', textKey: result.messageKey || 'paymentFailedText' });
        }
    };
    
    if (!isOpen) return null;

    const isCardPayment = paymentMethodType === 'creditCard';
    const moyasarMethods = ['mada', 'stcpay', 'applePay', 'bankTransfer']; 
    const isMoyasarRedirectFlow = moyasarMethods.includes(paymentMethodType);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <Card className="w-full max-w-md bg-white shadow-xl rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                <CardHeader className="bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center">
                            <ShieldCheck className={cn("h-6 w-6 text-green-600", language === 'ar' ? 'ml-2' : 'mr-2')} />
                            {t('paymentModalTitle')}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5"/></Button>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="p-6 space-y-4">
                        <div className="text-center mb-4">
                            <p className="text-lg text-gray-600">{t('paymentAmountLabel')}</p>
                            <p className="text-3xl font-bold text-blue-600">{amount} <span className="text-xl">{t('SAR')}</span></p>
                        </div>

                        {isCardPayment && (
                            <>
                                <div>
                                    <Label htmlFor="cardNumber">{t('cardNumberLabel')}</Label>
                                    <Input 
                                        id="cardNumber" 
                                        name="cardNumber" 
                                        value={cardDetails.cardNumber} 
                                        onChange={handleInputChange} 
                                        placeholder={t('cardNumberPlaceholder')} 
                                        required 
                                        className="mt-1" 
                                        maxLength="19"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="expiryDate">{t('expiryDateLabel')}</Label>
                                        <Input 
                                            id="expiryDate" 
                                            name="expiryDate" 
                                            value={cardDetails.expiryDate} 
                                            onChange={handleInputChange} 
                                            placeholder={t('expiryDatePlaceholder')} 
                                            required 
                                            className="mt-1"
                                            maxLength="5"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv">{t('cvvLabel')}</Label>
                                        <Input 
                                            id="cvv" 
                                            name="cvv" 
                                            type="password"
                                            value={cardDetails.cvv} 
                                            onChange={handleInputChange} 
                                            placeholder={t('cvvPlaceholder')} 
                                            required 
                                            className="mt-1" 
                                            maxLength="3"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                         {isMoyasarRedirectFlow && (
                            <Message type="success" 
                                title={t(
                                    paymentMethodType === 'mada' ? 'paymentMada' :
                                    paymentMethodType === 'stcpay' ? 'paymentSTCPay' :
                                    paymentMethodType === 'applePay' ? 'paymentApplePay' :
                                    'paymentBankTransfer' 
                                )} 
                                message={t('moyasarRedirectMessage', {paymentMethod: t(
                                    paymentMethodType === 'mada' ? 'paymentMada' :
                                    paymentMethodType === 'stcpay' ? 'paymentSTCPay' :
                                    paymentMethodType === 'applePay' ? 'paymentApplePay' :
                                    'paymentBankTransfer'
                                ).split('(')[0].trim()})} 
                            />
                        )}

                        {paymentMessage && <Message type={paymentMessage.type} message={t(paymentMessage.textKey)} />}
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t">
                        <Button type="submit" className="w-full" disabled={paymentLoading || (paymentMessage?.type === 'success')}>
                            {paymentLoading ? (
                                <><Loader2 className={cn("h-5 w-5 animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> {t('processingPaymentButton')}</>
                            ) : (
                                <><CreditCard className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} /> 
                                {isMoyasarRedirectFlow ? t('proceedToSecurePaymentButton') : t('payNowButton')}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    );
};

export default PaymentModal;