import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageProvider';
import { cn } from '../../utils/helpers';

const Message = ({ type, title, message, children }) => {
    const { language } = useLanguage();
    return (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={cn(
            'p-4 rounded-md my-4 border',
            type === 'success' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
        )}
    >
        <div className="flex">
            <div className="flex-shrink-0">
                {type === 'success' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
            </div>
            <div className={language === 'ar' ? "mr-3" : "ml-3"}>
                {title && <h3 className="text-sm font-medium">{title}</h3>}
                <div className={cn("text-sm", title && "mt-2")}>
                    {message}
                    {children}
                </div>
            </div>
        </div>
    </motion.div>
    );
};

export default Message;