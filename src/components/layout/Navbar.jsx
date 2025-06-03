import { useLanguage } from '../../App';
import { cn } from '../../utils/helpers';
import { Button } from '../common/ui-utils';
import { Store, Globe } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

// --- Navbar Component ---
const Navbar = ({ navigateTo, adminToken, onLogout }) => {
    const { t, language, toggleLanguage } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const handleNavigate = (page) => {
        navigateTo(page);
        setIsMobileMenuOpen(false);
    };
    
    return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="text-xl sm:text-2xl font-bold cursor-pointer flex items-center" onClick={() => handleNavigate('welcome')}>
                    <Store className={cn("w-6 h-6 sm:w-7 sm:h-7 text-blue-400", language === 'ar' ? 'ml-2' : 'mr-2')} />
                    <span className="text-blue-400">{t('welcomeTitle').split(' ')[0]}</span>
                    <span className="text-white">{t('welcomeTitle').split(' ')[1]}</span>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                    <button onClick={() => navigateTo('welcome')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navHome')}</button>
                    <button onClick={() => navigateTo('request')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navNewRequest')}</button>
                    <button onClick={() => navigateTo('status')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navCheckStatus')}</button>
                    {adminToken ? (
                        <>
                            <button onClick={() => navigateTo('adminDashboard')} className="hover:text-blue-300 transition-colors px-2 py-1">{t('navAdminDashboard')}</button>
                            <Button 
                                onClick={onLogout} 
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                            >
                                {t('navLogout')}
                            </Button>
                        </>
                    ) : (
                        <Button 
                            onClick={() => navigateTo('adminLogin')} 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                        >
                            {t('navAdminLogin')}
                        </Button>
                    )}
                    <Button 
                        onClick={toggleLanguage} 
                        className="text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white px-3 py-1.5 rounded-md text-sm transition-colors flex items-center"
                    >
                         <Globe className={cn("h-4 w-4", language === 'ar' ? 'ml-1.5' : 'mr-1.5')} /> {t('languageSwitch')}
                    </Button>
                </div>
                
                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <Button 
                        onClick={toggleLanguage} 
                        className="text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white px-2 py-1 rounded-md text-xs transition-colors flex items-center mr-2"
                    >
                         <Globe className="h-4 w-4" />
                    </Button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMobileMenuOpen ? (
                            <X className="block h-6 w-6" />
                        ) : (
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden overflow-hidden"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
                        <button 
                            onClick={() => handleNavigate('welcome')} 
                            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                        >
                            {t('navHome')}
                        </button>
                        <button 
                            onClick={() => handleNavigate('request')} 
                            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                        >
                            {t('navNewRequest')}
                        </button>
                        <button 
                            onClick={() => handleNavigate('status')} 
                            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                        >
                            {t('navCheckStatus')}
                        </button>
                        {adminToken ? (
                            <>
                                <button 
                                    onClick={() => handleNavigate('adminDashboard')} 
                                    className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                >
                                    {t('navAdminDashboard')}
                                </button>
                                <button 
                                    onClick={() => {
                                        onLogout();
                                        setIsMobileMenuOpen(false);
                                    }} 
                                    className="text-red-400 hover:text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                >
                                    {t('navLogout')}
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => handleNavigate('adminLogin')} 
                                className="text-blue-400 hover:text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                            >
                                {t('navAdminLogin')}
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </nav>
    );
};

export default Navbar;