import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageProvider';

const TermsAndConditionsPage = () => {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('tncTitle')}</h1>
                
                <div className="space-y-6 text-gray-700">
                    <p>{t('tncIntro')}</p>

                    <h2 className="text-2xl font-semibold text-gray-800 pt-4 border-t mt-6">{t('tncGoverningLawTitle')}</h2>
                    <p>{t('tncGoverningLawText1', { country: t('countryName') })}</p>
                    <p>{t('tncGoverningLawText2', { country: t('countryName') })}</p>

                    <h2 className="text-2xl font-semibold text-gray-800 pt-4 border-t mt-6">{t('tncUserAgeTitle')}</h2>
                    <p>{t('tncUserAgeText')}</p>

                    <h2 className="text-2xl font-semibold text-gray-800 pt-4 border-t mt-6">{t('tncPaymentTitle')}</h2>
                    <p>{t('tncPaymentText', { currencies: 'SAR' })}</p>
                    <p>{t('tncCardholderResponsibility')}</p>
                    <p>{t('tncAccountConfidentiality')}</p>

                    <h2 className="text-2xl font-semibold text-gray-800 pt-4 border-t mt-6">{t('tncPolicyUpdatesTitle')}</h2>
                    <p>{t('tncPolicyUpdatesText')}</p>

                    <h2 className="text-2xl font-semibold text-gray-800 pt-4 border-t mt-6">{t('tncOfacTitle')}</h2>
                    <p>{t('tncOfacText', { websiteUrl: 'www.saytech.com', country: t('countryName') })}</p>
                    <p>{t('tncMultipleTransactions')}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default TermsAndConditionsPage;
