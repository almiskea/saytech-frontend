import { SelectContext } from '../../../App';
import { useContext } from 'react';
import { cn } from '../../../utils/helpers';
import { Check } from 'lucide-react';

const SelectItem = ({ children, value, className }) => {
    const { handleSelect, selectedValue, language } = useContext(SelectContext);
    const isSelected = selectedValue === value;
    return (
        <div
            onClick={() => handleSelect(value, children)} 
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100",
                language === 'ar' ? "pr-8 pl-2 text-right" : "pl-8 pr-2 text-left",
                isSelected && "font-semibold bg-gray-100",
                className
            )}
        >
            {children}
            {isSelected && <Check className={cn("absolute h-4 w-4", language === 'ar' ? "right-2" : "left-2")} />}
        </div>
    );
};

export default SelectItem;