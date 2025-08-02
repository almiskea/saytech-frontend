import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/helpers';
import { SelectContext } from './Select';

export const SelectContent = ({ children, className }) => { 
    const { isOpen } = useContext(SelectContext); 
    if (!isOpen) return null; 
    return (
        <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -5 }} 
            className={cn("absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md mt-1", className)}
        >
            {children}
        </motion.div>
    ); 
};