/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import axios from "axios"
const api = axios.create({
    //   baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const errHandle = (err: any) => {
    return {
        success: false,
        message: err.message,
        status: err.status
    }
}

export const allApi = async ({ url = '', method = 'get', payload, params, controllerRef }: { url: string, method: 'get' | 'put' | 'post' | 'delete', params?: any, payload?: any, controllerRef?: any }) => {
    const controller = new AbortController();
    const token:any=''
    if(controllerRef) controllerRef.current = controller;
    let headers={}
    if(token) headers={Authorization:`Bearer ${token}`}
    try {
        let res: any = null;
        if (method == 'get' || method == 'delete') res = await (api as any)[method]?.(url, { params: params, signal: controller.signal,headers:headers })
        else res = await (api as any)[method]?.(url, payload, { params: params, signal: controller.signal,headers:headers })
        return res.data
    } catch (err) {
        return errHandle(err)
    }
}

export const getApi = async ({ url, params, controllerRef }: { url: string, params?: any, controllerRef?: any }) => {
    return allApi({ url, params, controllerRef, method: 'get' })
}

export const postApi = async ({ url, payload, params, controllerRef }: { url: string, payload: any, params?: any, controllerRef?: any }) => {
    return allApi({ url, params, payload, controllerRef, method: 'post' })
}

export const putApi = async ({ url, payload, params, controllerRef }: { url: string, payload: any, params?: any, controllerRef?: any }) => {
    return allApi({ url, params, payload, controllerRef, method: 'put' })
}

export const deleteApi = async ({ url, params, controllerRef }: { url: string, params?: any, controllerRef?: any }) => {
    return allApi({ url, params, controllerRef, method: 'delete' })
}

