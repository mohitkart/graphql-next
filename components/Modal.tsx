import { createPortal } from "react-dom";

/* eslint-disable @typescript-eslint/no-explicit-any */
function Modal({
    onResult = (e: any) => { },
    body='',
    title='Modal Title'
}:{
    onResult: (e: any) => void;
    body?: any;
    title?: string;
}) {
    return <>
    {createPortal(<>
    <div className="fixed inset-0 bg-gray-600 opacity-50"></div>
     <div className="inset-0 fixed flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button id="closeModal" className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={()=>onResult({ action: 'close' })}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {body}
            </div>
        </div>
    </>, document.body)}
    </>;
}
export default Modal;