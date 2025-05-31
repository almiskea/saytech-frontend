import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Phone, Mail, MessageCircle
} from 'lucide-react'; 

import WelcomePage from './components/pages/WelecomePage';
import RequestFormPage from './components/pages/RequestFormPage';
import StatusCheckPage from './components/pages/StatusCheckPage';
import AdminLoginPage from './components/pages/AdminLoginPage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import Navbar from './components/layout/Navbar';
import translations from './utils/translations';
import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Alert, AlertDescription, AlertTitle } from './components/common/ui-utils';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const t = (key, params = {}) => {
        let translation = translations[language][key] || translations['en'][key] || key;
        Object.keys(params).forEach(paramKey => {
            translation = translation.replace(`{${paramKey}}`, params[paramKey]);
        });
        return translation;
    };
    
    const toggleLanguage = () => {
        setLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);






Button.displayName = "Button";

Input.displayName = "Input";

Textarea.displayName = "Textarea";

Label.displayName = "Label";

Card.displayName = "Card";

CardHeader.displayName = "CardHeader";

CardTitle.displayName = "CardTitle";

CardDescription.displayName = "CardDescription";

CardContent.displayName = "CardContent";

CardFooter.displayName = "CardFooter";

export const SelectContext = createContext();

Alert.displayName = "Alert";

AlertTitle.displayName = "AlertTitle";

AlertDescription.displayName = "AlertDescription";

function AppInternal() {
    const { t, language } = useLanguage();
    const [currentPage, setCurrentPage] = useState('welcome');
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

    const navigateTo = useCallback((page) => {
        const validPage = (typeof page === 'string' && page.trim() !== '') ? page.trim() : 'welcome';
        setCurrentPage(validPage);
        const newUrl = `/${validPage}`;
        try {
            if (window.location.protocol !== 'blob:' && (window.location.pathname !== newUrl || (window.history.state?.page !== validPage))) {
                 window.history.pushState({ page: validPage }, '', newUrl);
            }
        } catch (e) {
            console.error("Error executing pushState in navigateTo: ", e);
        }
        window.scrollTo(0, 0);
    }, []); 

    useEffect(() => {
        const handlePopState = (event) => {
            const pageFromState = event.state?.page;
            let resolvedPage = 'welcome';

            if (pageFromState && ['welcome', 'request', 'status', 'adminLogin', 'adminDashboard'].includes(pageFromState)) {
                resolvedPage = pageFromState;
            } else {
                const pathName = window.location.pathname.substring(1);
                if (['welcome', 'request', 'status', 'adminLogin', 'adminDashboard'].includes(pathName)) {
                    resolvedPage = pathName;
                }
            }
            setCurrentPage(resolvedPage);
        };

        window.addEventListener('popstate', handlePopState);

        const pathName = window.location.pathname.substring(1);
        const initialPage = ['welcome', 'request', 'status', 'adminLogin', 'adminDashboard'].includes(pathName) 
                            ? pathName 
                            : 'welcome';
        setCurrentPage(initialPage);
        
        try {
            if (window.location.protocol !== 'blob:') { 
                 if (window.location.pathname !== `/${initialPage}` || !window.history.state || window.history.state.page !== initialPage) {
                    window.history.replaceState({ page: initialPage }, '', `/${initialPage}`);
                }
            }
        } catch (e) {
            console.error("Error on initial replaceState: ", e);
        }

        return () => window.removeEventListener('popstate', handlePopState);
    }, []); 

    const handleAdminLogin = (token) => {
        setAdminToken(token);
        localStorage.setItem('adminToken', token);
    };

    const handleAdminLogout = () => {
        setAdminToken(null);
        localStorage.removeItem('adminToken');
        navigateTo('welcome');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'request': return <RequestFormPage navigateTo={navigateTo} />;
            case 'status': return <StatusCheckPage navigateTo={navigateTo} />;
            case 'adminLogin': return <AdminLoginPage onLoginSuccess={handleAdminLogin} navigateTo={navigateTo} />;
            case 'adminDashboard': return adminToken ? <AdminDashboardPage adminToken={adminToken} navigateTo={navigateTo} /> : <AdminLoginPage onLoginSuccess={handleAdminLogin} navigateTo={navigateTo} />;
            case 'welcome': default: return <WelcomePage navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <Navbar navigateTo={navigateTo} adminToken={adminToken} onLogout={handleAdminLogout} />
            <main className="container mx-auto p-4 sm:p-6 md:p-8 mt-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage + language} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderPage()}
                    </motion.div>
                </AnimatePresence>
            </main>
            <footer className="text-center py-8 mt-12 border-t border-gray-300 bg-gray-50">
                <div className="container mx-auto px-6 text-gray-600">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('footerContactUs')}</h3>
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div className="flex flex-col items-center">
                            <Mail className="w-8 h-8 text-blue-600 mb-2"/>
                            <p className="font-semibold">{t('footerEmail')}</p>
                            <a href="mailto:info@saytech.sa" className="text-blue-500 hover:text-blue-700">info@saytech.sa</a>
                        </div>
                        <div className="flex flex-col items-center">
                            <Phone className="w-8 h-8 text-blue-600 mb-2"/>
                            <p className="font-semibold">{t('footerPhone')}</p>
                            <a href="tel:+966501234567" className="text-blue-500 hover:text-blue-700" dir="ltr">+966 50 123 4567</a>
                        </div>
                        <div className="flex flex-col items-center">
                           <MessageCircle className="w-8 h-8 text-green-500 mb-2"/> {/* WhatsApp Icon */}
                            <p className="font-semibold">WhatsApp</p>
                            <a href="https://wa.me/966501234567" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700"  dir="ltr">+966 50 123 4567</a>
                        </div>
                    </div>
                     <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{t('footerFollowUs')}</h4>
                        <div className="flex justify-center space-x-4">
                            {/* Snapchat Icon */}
                            <a href="https://www.snapchat.com/add/saytech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.99 0 1.95-.14 2.85-.41-.09-.26-.15-.54-.15-.84V12h-2.5v-2H14.7v-1.61c0-1.3.62-2.61 1.77-3.19.58-.29 1.28-.4 2.03-.4.88 0 1.7.13 2.4.39v1.98h-1.15c-.61 0-1.05.26-1.05.82V10h2.4l-.39 2H17.7v8.75c2.56-.95 4.3-3.53 4.3-6.75 0-5.52-4.48-10-10-10zm7.5 4.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22-.5-.5-.22-.5-.5-.5z"/>
                                </svg>
                                <span className="sr-only">Snapchat</span>
                            </a>
                            {/* YouTube Icon */}
                            <a href="https://www.youtube.com/@saytech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M21.582 7.416A2.486 2.486 0 0019.515 5.5H4.485A2.486 2.486 0 002.418 7.416 25.018 25.018 0 002 12a25.018 25.018 0 00.418 4.584A2.486 2.486 0 004.485 18.5h15.03a2.486 2.486 0 002.067-1.916A25.018 25.018 0 0022 12a25.018 25.018 0 00-.418-4.584zM9.75 15.5V8.5l6 3.5-6 3.5z"/>
                                </svg>
                                <span className="sr-only">YouTube</span>
                            </a>
                            {/* Instagram Icon (already present) */}
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.023.047 1.351.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882-.344-1.857.047-1.023.058-1.351-.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                                <span className="sr-only">Instagram</span>
                            </a>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-8">© {new Date().getFullYear()} {t('footerRightsReserved', { year: ''})}</p> 
                    <p className="text-sm text-gray-500">{t('footerServiceLocation')}</p>
                </div>
            </footer>
        </div>
    );
}

function App() {
    return (
        <LanguageProvider>
            <AppInternal />
        </LanguageProvider>
    );
}

export default App;
