import React, { useState, useEffect, useRef, createContext } from 'react';
import { useLanguage } from '../../../context/LanguageProvider';
import { SelectContent } from './SelectContent';
import { SelectItem } from './SelectItem';
import { SelectTrigger } from './SelectTrigger';
import { SelectValue } from './SelectValue';

export const SelectContext = createContext();

export const Select = ({ children, onValueChange, value: controlledValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(controlledValue || '');
    const [displayValue, setDisplayValue] = useState('');
    const selectRef = useRef(null);
    const { language } = useLanguage();

    useEffect(() => {
        if (controlledValue !== undefined) {
            setSelectedValue(controlledValue);
        }
    }, [controlledValue]);
    
    useEffect(() => {
        let foundDisplay = '';
        React.Children.forEach(children, child => {
            if (child.type === SelectContent) {
                React.Children.forEach(child.props.children, item => {
                    if (item.type === SelectItem && item.props.value === selectedValue) {
                        foundDisplay = item.props.children; 
                    }
                });
            }
        });
        if (foundDisplay) {
            setDisplayValue(foundDisplay);
        } else { 
             React.Children.forEach(children, child => {
                if (child.type === SelectTrigger) {
                     React.Children.forEach(child.props.children, triggerChild => {
                        if (triggerChild.type === SelectValue) {
                            setDisplayValue(triggerChild.props.placeholder);
                        }
                    });
                }
            });
        }
    }, [selectedValue, children, language]);

    const handleSelect = (val, display) => {
        setSelectedValue(val);
        if (onValueChange) {
            onValueChange(val);
        }
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, handleSelect, displayValue, language }}>
            <div className="relative" ref={selectRef}>{children}</div>
        </SelectContext.Provider>
    );
};