import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck2, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageProvider';
import { Button } from './ui-utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui-utils';
import { cn } from '../../utils/helpers';

// --- Agreement Modal Component ---
const AgreementModal = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]" // Higher z-index
            onClick={onClose}
        >
            <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                <CardHeader className="bg-gray-100 border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center text-xl md:text-2xl">
                            <FileCheck2 className={cn("h-6 w-6 text-blue-600", language === 'ar' ? 'ml-2' : 'mr-2')} />
                            {t('agreementModalTitle')}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5"/></Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 max-h-[70vh] overflow-y-auto prose prose-sm max-w-none">
                    <p className="text-base">{t('agreementTextLine1')}</p>
                    <p>{t('agreementTextLine2')}</p>
                    
                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementServiceTitle')}</h3>
                    <p>{t('agreementServiceText1')}</p>
                    <p>{t('agreementServiceText2')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementPaymentTitle')}</h3>
                    <p>{t('agreementPaymentText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementUserResponsibilityTitle')}</h3>
                    <p>{t('agreementUserResponsibilityText1')}</p>
                    <p>{t('agreementUserResponsibilityText2')}</p>
                    
                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementLimitationTitle')}</h3>
                    <p>{t('agreementLimitationText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementConfidentialityTitle')}</h3>
                    <p>{t('agreementConfidentialityText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementShippingTitle')}</h3>
                    <p>{t('agreementShippingText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementChangesTitle')}</h3>
                    <p>{t('agreementChangesText1')}</p>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{t('agreementContactTitle')}</h3>
                    <p>{t('agreementContactText1')}</p>
                </CardContent>
                <CardFooter className="bg-gray-100 border-t">
                    <Button onClick={onClose} className="w-full" size="lg">
                        <CheckCircle className={cn("h-5 w-5", language === 'ar' ? 'ml-2' : 'mr-2')} />
                        {t('iAgreeButton')}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default AgreementModal;