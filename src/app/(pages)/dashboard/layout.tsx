"use client"

import { findOneUserById } from "@/app/server/actions/user"
import { useQuery } from "@tanstack/react-query"
import { useCookies } from "next-client-cookies"
import Link from "next/link"

export default function Layout({ children }: { children: React.ReactNode }) {
    const cookies = useCookies()
    const user_id = Number(cookies.get("id"))

    const { data: usuario } = useQuery({
        queryKey: ["usuario"],
        queryFn: async () => {
            const res = await findOneUserById(user_id)

            return res.success ? res.response[0] : undefined
        }
    })

    const handleLogout = () => {
        cookies.remove("id")
    }

    return (
        <>
            <div className="fixed top-0 inset-x-0 bg-slate-800 px-4 py-2 text-white flex justify-between items-center">
                <h3>Artesanato Municipal</h3>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <span>{usuario?.username}</span>
                        <div className="absolute min-w-max right-0 mt-2 w-48 bg-white text-black p-2 rounded shadow-lg hidden group-hover:block">
                            <p><strong>Nome de usuário:</strong> {usuario?.username}</p>
                            <p><strong>Email:</strong> {usuario?.email}</p>
                            <p><strong>Função:</strong> {usuario?.role}</p>
                        </div>
                    </div>
                    <Link href="/login">
                        <button onClick={handleLogout} className="text-red-500 whitespace-nowrap">Sair</button>
                    </Link>
                </div>
            </div>
            <div className="pt-16">
                {children}
            </div>
        </>
    )
}