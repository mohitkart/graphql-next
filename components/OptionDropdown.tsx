/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/preserve-manual-memoization */
import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

const OptionDropdown = ({ options = [],isSearch=false, placeholder = 'Select', value = '', displayValue = 'name', valueType = 'string', onChange = (_) => { } }: { isSearch?:boolean,options: any[], placeholder: string, value?: any, displayValue?: string, valueType?: 'string' | 'object', onChange: (e: any) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<any>(null);
    const dropdownRef = useRef(null);

    // This state stores the position of the button to place dropdown accordingly
    const [dropdownStyle, setDropdownStyle] = useState({});
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: "absolute",
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                minWidth: `${rect.width}px`,
                zIndex: 9999,
                background: "white",
            });
        }
    }, [isOpen]);

    const handleChange = (e: any) => {
        let v = e;
        if (valueType == "object") {
            v = options.find((itm) => itm.id == e);
        }
        setIsOpen(false);
        onChange(v)
    };

    const selected = useMemo(() => {
        let v = {
            color: '',
            className: '',
            id: '',
            [displayValue]: placeholder || 'Select'
        }
        const ext = options.find(itm => itm.id == value)
        if (ext) v = {
            color: '',
            className: '',
            ...ext
        }
        return v
    }, [placeholder, options, displayValue])

    const list: any[] = useMemo(() => {
        let arr = [...options]
        arr = arr.filter((itm: any) => itm[displayValue]?.toLowerCase()?.includes(search?.toLowerCase().trim()))
        return arr
    }, [options, search])

    return (
        <>

            <button
                ref={buttonRef}
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex gap-2 items-center"
            >
                <div className={`${selected.color ? `text-[${selected.color}]` : ''} ${selected.className || ''}`}>
                    {selected[displayValue]}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen &&
                createPortal(
                    <div ref={dropdownRef} >
                        <div className="fixed w-full h-full z-[9999] top-0 left-0" onClick={() => setIsOpen(false)}></div>
                        <div style={dropdownStyle} className="rounded-[5px] border shadow">

                            {isSearch?<div className="p-[4px] relative">
                                <input type="text" className="w-full border px-[10px] py-[4px] rounded" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
                                {search ? <span className="material-symbols-outlined cursor-pointer absolute top-[12px] text-[14px] right-[7px]"
                                    onClick={() => setSearch('')}
                                >close</span> : <></>}
                            </div>:<></>}
                            
                            <div className="overflow-auto max-h-[180px] text-[14px]">
                                {list.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => handleChange(option.id)}
                                        className={`px-[12px] py-[8px] border-b cursor-pointer ${value == option.id ? 'font-bold' : ''} ${option.color ? `text-[${option.color}]` : ''} ${option.className || ''}`}
                                    >
                                        {option[displayValue]}
                                    </div>
                                ))}
                                {!list.length ? <>
                                    <div className="px-[12px] py-[8px] text-center text-gray-600">No Options</div>
                                </> : <></>}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default OptionDropdown;
