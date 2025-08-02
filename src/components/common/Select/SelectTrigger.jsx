import React, { useContext } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/helpers';
import { SelectContext } from './Select';

export const SelectTrigger = ({ children, className }) => { 
    const { setIsOpen, isOpen, language } = useContext(SelectContext); 
    return (
        <button 
            type="button" 
            onClick={() => setIsOpen(!isOpen)} 
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", 
                className
            )}
        >
            {language === 'ar' && (isOpen ? <ChevronUp className="h-4 w-4 opacity-50 me-auto" /> : <ChevronDown className="h-4 w-4 opacity-50 me-auto" />)}
            {children}
            {language === 'en' && (isOpen ? <ChevronUp className="h-4 w-4 opacity-50 ms-auto" /> : <ChevronDown className="h-4 w-4 opacity-50 ms-auto" />)}
        </button>
    ); 
};