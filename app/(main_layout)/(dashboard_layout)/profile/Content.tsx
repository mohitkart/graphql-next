/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { postApi } from "@/lib/apiClient"
import { useEffect, useState } from "react"

export default function Content() {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>()

    useEffect(() => {
        postApi({ url: '/api/profile' ,payload:{}}).then(res => {
            setLoading(false)
            if (res.success) {
                setProfile(res.data)
            }
        })
    }, [])


    return <div className="p-4">
    {loading?<>
    <div className="max-w-4xl mx-auto">
    <div className="h-[192px] mb-2 rounded-xl bg-gray-200 animate-pulse"></div>
    <div className="h-[192px] rounded-xl bg-gray-200 animate-pulse"></div>
    </div>

    </>: <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden mx-auto">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 relative">

                <div className="absolute -bottom-12 left-6">
                    <img src="https://via.placeholder.com/120" alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
                </div>
            </div>

            <div className="pt-14 px-6 pb-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{profile?.name}</h1>
                        <p className="text-gray-500 flex items-center gap-1">
                            <i className="fas fa-map-marker-alt text-sm"></i> {profile?.email}
                        </p>
                    </div>

                    <div className="flex gap-6 mt-4 sm:mt-0">
                        <div className="text-center">
                            <span className="block font-bold text-gray-800">245</span>
                            <span className="text-gray-500 text-sm">Posts</span>
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-gray-800">12.4k</span>
                            <span className="text-gray-500 text-sm">Followers</span>
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-gray-800">980</span>
                            <span className="text-gray-500 text-sm">Following</span>
                        </div>
                    </div>
                </div>

                <p className="text-gray-700 mt-4">
                    ✨ Product designer & UI enthusiast. Sharing design tips and daily inspiration.
                    Love coffee, travel, and open source.
                </p>

            </div>
        </div>}
       
    </div>
}