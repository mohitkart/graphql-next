import { useDebounce } from "@/hooks/debounce";
import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function DebounceInput({ type = 'text', value = '', id, className, placeholder,onChange}: { type?: string, placeholder?: string, value: any, id?: string, className?: string, onChange: (e: any) => void }) {
  const [v, setV] = useState<any>(value)

  const debouncedText = useDebounce(v.trim(), 500);

  useEffect(() => {
    if(debouncedText!=value){
      onChange(debouncedText)
    }
  }, [debouncedText]);

  return <input
    type={type}
    value={v}
    onChange={e => setV(e.target.value)}
    id={id}
    className={className}
    placeholder={placeholder}
  />;
}