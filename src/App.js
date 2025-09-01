import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Globe, Loader2, X,
   Lock, CheckCircle, 
   AlertCircle, User, Instagram,
} from 'lucide-react';
import api from './services/api';
import { Auth0Provider, useAuth0 } from './context/Auth0Provider';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import { LanguageProvider, useLanguage } from './context/LanguageProvider';
import RequestFormPage from './components/pages/RequestFormPage';
import StatusCheckPage from './components/pages/StatusCheckPage';
import WelcomePage from './components/pages/WelcomePage';
import PaymentCallbackPage from './components/pages/PaymentCallbackPage';
import ContactUsPage from './components/pages/ContactUsPage';
import AboutUsPage from './components/pages/AboutUsPage';
import TermsAndConditionsPage from './components/pages/TermsAndConditionsPage';
import { Button } from './components/common/ui-utils';


// --- Utility Functions ---
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

// --- Navbar Component ---
const Navbar = ({ navigateTo }) => {
    const { t, language, toggleLanguage } = useLanguage();
    const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const handleNavigate = (page) => {
        navigateTo(page);
        setIsMobileMenuOpen(false);
    };
    
    const handleAdminAction = () => {
        console.log('Admin action clicked, Auth0 state:', { isAuthenticated, isLoading });
        if (isAuthenticated) {
            // If authenticated with Auth0, go to admin dashboard
            console.log('User authenticated, navigating to adminDashboard');
            navigateTo('adminDashboard');
        } else {
            // If not authenticated, trigger Auth0 login
            console.log('User not authenticated, triggering Auth0 login');
            loginWithRedirect();
        }
    };
    
    const handleLogout = () => {
        // Logout from Auth0
        logout();
    };
    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="text-xl sm:text-2xl font-bold cursor-pointer flex items-center" onClick={() => handleNavigate('welcome')}>
                        <Store className={cn("w-6 h-6 sm:w-7 sm:h-7 text-blue-400", language === 'ar' ? 'ml-2' : 'mr-2')} />
                        <span className="text-blue-400">{t('welcomeTitle').split(' ')[0]}</span>
                        <span className="text-white">{t('welcomeTitle').split(' ')[1]}</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                        <button onClick={() => navigateTo('welcome')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navHome')}</button>
                        <button onClick={() => navigateTo('about')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navAboutUs')}</button>
                        <button onClick={() => navigateTo('request')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navNewRequest')}</button>
                        <button onClick={() => navigateTo('status')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navCheckStatus')}</button>
                        <button onClick={() => navigateTo('contact')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navContactUs')}</button>
                        
                        {/* Admin Section with Auth0 Integration */}
                        {!isLoading && (
                            isAuthenticated ? (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-300">
                                        <User className="h-4 w-4 inline mr-1" />
                                        {user?.name || user?.email}
                                    </span>
                                    <Button onClick={handleAdminAction} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
                                        {t('navAdminDashboard')}
                                    </Button>
                                    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm">
                                        {t('navLogout')}
                                    </Button>
                                </div>
                            ) : (
                                <Button onClick={handleAdminAction} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
                                    <Lock className="h-4 w-4 mr-1" />
                                    {t('navAdminLogin')}
                                </Button>
                            )
                        )}
                        
                        <Button onClick={toggleLanguage} className="text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white px-3 py-1.5 rounded-md text-sm flex items-center">
                            <Globe className={cn("h-4 w-4", language === 'ar' ? 'ml-1.5' : 'mr-1.5')} /> {t('languageSwitch')}
                        </Button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <Button onClick={toggleLanguage} className="text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white px-2 py-1 rounded-md text-xs mr-2"><Globe className="h-4 w-4" /></Button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800">
                            {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
                            <button onClick={() => handleNavigate('welcome')} className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{t('navHome')}</button>
                            <button onClick={() => handleNavigate('about')} className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{t('navAboutUs')}</button>
                            <button onClick={() => handleNavigate('request')} className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{t('navNewRequest')}</button>
                            <button onClick={() => handleNavigate('status')} className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{t('navCheckStatus')}</button>
                            <button onClick={() => handleNavigate('contact')} className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">{t('navContactUs')}</button>
                            
                            {/* Admin Section with Auth0 Integration */}
                            {!isLoading && (
                                isAuthenticated ? (
                                    <>
                                        <div className="text-gray-300 px-3 py-2 text-sm">
                                            <User className="h-4 w-4 inline mr-1" />
                                            {user?.name || user?.email}
                                        </div>
                                        <button onClick={() => { handleAdminAction(); setIsMobileMenuOpen(false); }} className="text-blue-400 hover:text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                            {t('navAdminDashboard')}
                                        </button>
                                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-red-400 hover:text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                            {t('navLogout')}
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => { handleAdminAction(); setIsMobileMenuOpen(false); }} className="text-blue-400 hover:text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                        <Lock className="h-4 w-4 inline mr-1" />
                                        {t('navAdminLogin')}
                                    </button>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

// --- Main App Component ---
function AppInternal() {
    const { t, language } = useLanguage(); // FIXED: Added 't' here
    const { getAccessToken, isAuthenticated, isLoading } = useAuth0(); // Add Auth0 hook with loading state
    const [currentPage, setCurrentPage] = useState('welcome');

    // Set up Auth0 token getter for API service
    useEffect(() => {
        api.getAuth0Token = getAccessToken;
    }, [getAccessToken]);

    const navigateTo = useCallback((page) => {
        const validPage = (page || 'welcome').trim();
        console.log('navigateTo called with:', page, 'resolved to:', validPage, 'current page:', currentPage);
        setCurrentPage(validPage);
        // Update URL without reloading page for better UX
        window.history.pushState({}, '', `/${validPage}`);
        window.scrollTo(0, 0);
    }, [currentPage]);

    // Handle Auth0 authentication flow
    useEffect(() => {
        console.log('Auth0 state changed:', { isAuthenticated, currentPage, isLoading });
        
        // If user is authenticated and on welcome page, but they were trying to access admin
        // (this can happen after Auth0 redirect), navigate to admin dashboard
        if (isAuthenticated && currentPage === 'welcome' && !isLoading) {
            // Check if we came from Auth0 redirect by looking for previous admin intent
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('code') && urlParams.has('state')) {
                // User just authenticated via Auth0, redirect to admin dashboard
                console.log('Redirecting to admin dashboard after Auth0 callback');
                navigateTo('adminDashboard');
                return;
            }
        }
        
        // If user is authenticated and trying to access admin dashboard, ensure they stay there
        if (isAuthenticated && currentPage === 'adminDashboard') {
            // User is properly authenticated, no need to redirect
            console.log('User authenticated and on admin dashboard - staying here');
            return;
        }
        
        // If user is not authenticated and trying to access admin dashboard, 
        // they should see the authentication error message (handled in renderPage)
    }, [isAuthenticated, currentPage, isLoading, navigateTo]); 

    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname.substring(1) || 'welcome';
            console.log('handlePopState triggered, path:', path);
            setCurrentPage(path);
        };
        window.addEventListener('popstate', handlePopState);
        
        // Set initial page based on URL only on mount
        console.log('Setting initial page based on URL');
        const initialPath = window.location.pathname.substring(1) || 'welcome';
        console.log('Initial path from URL:', initialPath);
        setCurrentPage(initialPath);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []); // Remove currentPage dependency to avoid infinite loops

    const renderPage = () => {
        console.log('renderPage called with currentPage:', currentPage, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
        switch (currentPage) {
            case 'request': return <RequestFormPage navigateTo={navigateTo} />;
            case 'status': return <StatusCheckPage navigateTo={navigateTo} />;
            case 'contact': return <ContactUsPage />;
            case 'about': return <AboutUsPage />;
            case 'terms': return <TermsAndConditionsPage />;
            case 'adminLogin': 
                // Redirect to welcome since we now use Auth0 for authentication
                return <WelcomePage navigateTo={navigateTo} />;
            case 'adminDashboard': 
                // Handle Auth0 loading state and authentication for admin dashboard
                if (isLoading) {
                    return <LoadingIndicator message={t('loadingAuth')} />;
                }
                
                return isAuthenticated ? 
                    <AdminDashboardPage navigateTo={navigateTo} /> : 
                    <div className="text-center">
                        <Message type="error" title={t('authenticationRequired')} message={t('pleaseLoginToAccessAdmin')} />
                        <Button onClick={() => navigateTo('welcome')} className="mt-4">
                            {t('goToHomePage')}
                        </Button>
                    </div>;
            case 'payment-callback': return <PaymentCallbackPage />;
            case 'welcome': default: return <WelcomePage navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
            <Navbar navigateTo={navigateTo} />
            <main className="container mx-auto p-4 sm:p-6 md:p-8 mt-8 flex-grow">
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
                    {/* Payment logos */}
                    <div className="flex justify-center items-center space-x-4 mb-6">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                            alt="Visa"
                            className="h-6 sm:h-8 object-contain"
                            loading="lazy"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                            alt="Mastercard"
                            className="h-6 sm:h-8 object-contain"
                            loading="lazy"
                        />
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{t('footerFollowUs')}</h4>
                        <div className="flex justify-center items-center space-x-4">
                            <a href="https://www.instagram.com/apple.ipro1?igsh=MXJtMXhib3N2ajFubw==" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600"><Instagram className="h-6 w-6" /></a>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-8 text-sm">© {new Date().getFullYear()} {t('footerRightsReserved', { year: ''})}</p> 
                    <p className="text-sm text-gray-500">{t('footerServiceLocation')}</p>
                    <div className="mt-4">
                        <button onClick={() => navigateTo('terms')} className="text-sm text-gray-500 hover:text-blue-500 underline">
                            {t('tncTitle')}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <Auth0Provider>
            <LanguageProvider>
                <AppInternal />
            </LanguageProvider>
        </Auth0Provider>
    );
}

const LoadingIndicator = ({ message }) => { const { t, language } = useLanguage(); return <div className="flex items-center justify-center p-4 my-4"><Loader2 className="animate-spin h-6 w-6 text-blue-600" /><span className={cn("text-gray-600 text-lg", language === 'ar' ? 'mr-3' : 'ms-3')}>{message || t('loadingMessage')}</span></div>; };
const Message = ({ type, title, message, children }) => { const { language } = useLanguage(); return <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={cn('p-4 rounded-md my-4 border', type === 'success' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800')}><div className="flex"><div className="flex-shrink-0">{type === 'success' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}</div><div className={language === 'ar' ? "mr-3" : "ml-3"}>{title && <h3 className="text-sm font-medium">{title}</h3>}<div className={cn("text-sm", title && "mt-2")}>{message}{children}</div></div></div></motion.div>; };
