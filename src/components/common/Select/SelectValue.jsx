import { useContext } from 'react';
import { SelectContext } from '../../../App';
import { cn } from '../../../utils/helpers';

const SelectValue = ({ placeholder }) => {
    const { displayValue, selectedValue } = useContext(SelectContext);
    return <span className={cn(!selectedValue && placeholder ? "text-gray-500" : "", "truncate")}>{displayValue || placeholder}</span>;
};

export default SelectValue;