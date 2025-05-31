import { SelectContext } from '../../../App';
import { useContext } from 'react';
import { cn } from '../../../utils/helpers';
import { motion } from 'framer-motion';

const SelectContent = ({ children, className }) => {
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

export default SelectContent;