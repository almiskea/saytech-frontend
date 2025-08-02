import React, { useContext } from 'react';
import { cn } from '../../../utils/helpers';
import { SelectContext } from './Select';

export const SelectValue = ({ placeholder }) => { 
    const { displayValue, selectedValue } = useContext(SelectContext); 
    return (
        <span className={cn(!selectedValue && placeholder ? "text-gray-500" : "", "truncate")}>
            {displayValue || placeholder}
        </span>
    ); 
};