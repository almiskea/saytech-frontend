import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageProvider';
import LoadingIndicator from '../common/LoadingIndicator';

const PaymentCallbackPage = () => {
    const { t } = useLanguage();
    useEffect(() => {
        // This page runs inside the popup.
        // It reads the URL parameters from PayFort's redirect.
        const params = new URLSearchParams(window.location.search);
        const paymentResult = {
            status: params.get('status'),
            response_message: params.get('response_message'),
            transaction_id: params.get('transaction_id'), // Example param, might differ
            fort_id: params.get('fort_id'), // Example param, might differ
        };
        
        // It sends the result to the main window that opened it.
        if (window.opener) {
            // The second argument is the target origin. For security, this should be specific.
            // Using '*' is okay for local dev, but for production, use your actual domain.
            window.opener.postMessage(paymentResult, '*');
        }
        
        // It then closes itself.
        window.close();
    }, []);

    // Display a simple message while the script runs.
    return (
        <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '50px' }}>
            <LoadingIndicator message={t('processingPayment')} />
        </div>
    );
};

export default PaymentCallbackPage;
