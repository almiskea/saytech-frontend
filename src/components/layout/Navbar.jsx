import { useLanguage } from '../../App';
import { cn } from '../../utils/helpers';
import { Button } from '../common/ui-utils';
import { Store, Globe } from 'lucide-react';

// --- Navbar Component ---
const Navbar = ({ navigateTo, adminToken, onLogout }) => {
    const { t, language, toggleLanguage } = useLanguage();
    return (
    <nav className="bg-gray-900 text-white flex flex-wrap justify-between items-center shadow-lg sticky top-0 z-40 px-4 sm:px-6 lg:px-8">
        <div className="text-2xl font-bold cursor-pointer flex items-center py-3" onClick={() => navigateTo('welcome')}>
            <Store className={cn("w-7 h-7 text-blue-400", language === 'ar' ? 'ml-2' : 'mr-2')} />
            <span className="text-blue-400">{t('welcomeTitle').split(' ')[0]}</span>
            <span className="text-white">{t('welcomeTitle').split(' ')[1]}</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-sm sm:text-base py-3">
            <button onClick={() => navigateTo('welcome')} className="hover:text-blue-300 transition-colors px-1.5 py-1 sm:px-2">{t('navHome')}</button>
            <button onClick={() => navigateTo('request')} className="hover:text-blue-300 transition-colors px-1.5 py-1 sm:px-2">{t('navNewRequest')}</button>
            <button onClick={() => navigateTo('status')} className="hover:text-blue-300 transition-colors px-1.5 py-1 sm:px-2">{t('navCheckStatus')}</button>
            {adminToken ? (
                <>
                    <button onClick={() => navigateTo('adminDashboard')} className="hover:text-blue-300 transition-colors px-1.5 py-1 sm:px-2">{t('navAdminDashboard')}</button>
                    <Button 
                        onClick={onLogout} 
                        className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-md text-xs sm:text-sm transition-colors"
                    >
                        {t('navLogout')}
                    </Button>
                </>
            ) : (
                <Button 
                    onClick={() => navigateTo('adminLogin')} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1 rounded-md text-xs sm:text-sm transition-colors"
                >
                    {t('navAdminLogin')}
                </Button>
            )}
            <Button 
                onClick={toggleLanguage} 
                className="text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white px-2.5 py-1 rounded-md text-xs sm:text-sm transition-colors flex items-center"
            >
                 <Globe className={cn("h-4 w-4", language === 'ar' ? 'ml-1.5' : 'mr-1.5')} /> {t('languageSwitch')}
            </Button>
        </div>
    </nav>
    );
};

export default Navbar;