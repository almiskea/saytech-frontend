import { useLanguage } from '../../App';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

// --- Helper Components ---
const LoadingIndicator = ({ message }) => {
    const { t, language } = useLanguage();
    return (
    <div className="flex items-center justify-center p-4 my-4">
        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
        <span className={cn("text-gray-600 text-lg", language === 'ar' ? 'mr-3' : 'ms-3')}>{message || t('loadingMessage')}</span>
    </div>
    );
};

export default LoadingIndicator;