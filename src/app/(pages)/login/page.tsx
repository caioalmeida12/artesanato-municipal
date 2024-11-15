"use client"

import useFeedback from "@/app/lib/use_feedback";
import { authenticate } from "@/app/server/actions/auth";
import { useMutation } from "@tanstack/react-query"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
    const { feedbackMessageRef, updateMessage } = useFeedback()
    const router = useRouter()

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData: FormData) => {
            const user = Object.fromEntries(formData)
            const response = await authenticate(user as any)
            updateMessage(response)
            if (response.success) {
                router.push("/")
            }
            return response
        }
    })

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-slate-800 p-4 text-white">
                <div className="container mx-auto flex justify-between">
                    <h1 className="text-xl">Artesanato Municipal</h1>
                    <div className="flex gap-4">
                        <Link href="/login" className="hover:underline">Login</Link>
                        <Link href="/register" className="hover:underline">Registrar</Link>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto p-4 flex-grow flex items-center justify-center">
                <div className="form-section border p-4 mb-4 max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Login</h2>
                    <form action={mutate} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="font-bold">Email:</label>
                            <input name="email" type="email" required className="border p-1 w-full" />
                        </div>
                        <div>
                            <label htmlFor="password" className="font-bold">Senha:</label>
                            <input name="password" type="password" required className="border p-1 w-full" />
                        </div>
                        <button type="submit" disabled={isPending} className="bg-blue-500 text-white px-4 py-2 mt-2 whitespace-nowrap">Enviar</button>
                    </form>
                    <div ref={feedbackMessageRef} className="mt-4 text-center text-red-500"></div>
                </div>
            </div>
            <footer className="bg-slate-800 p-4 text-white mt-4">
                <div className="container mx-auto text-center">
                    <p>&copy; 2023 Artesanato Municipal. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    )
}