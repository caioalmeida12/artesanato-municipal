"use client"

import { findOneUserById } from "@/app/server/actions/user"
import { useQuery } from "@tanstack/react-query"
import { useCookies } from "next-client-cookies"
import Link from "next/link"
import { useRef } from "react"
import { CartProvider, useCart } from "./CartContext"

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

    const cartRef = useRef<HTMLDivElement>(null)

    return (
        <CartProvider user_id={user_id}>
            <div className="fixed top-0 inset-x-0 bg-slate-800 px-4 py-2 text-white flex justify-between items-center">
                <h3>Artesanato Municipal</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span>{usuario?.username}</span>
                        <div className="absolute min-w-max right-0 mt-2 w-48 bg-white text-black p-2 rounded-lg shadow-lg hidden group-hover:block">
                            <p><strong>Nome de usuário:</strong> {usuario?.username}</p>
                            <p><strong>Email:</strong> {usuario?.email}</p>
                            <p><strong>Função:</strong> {usuario?.role}</p>
                        </div>
                    </div>
                    <Cart />
                    <Link href="/login">
                        <button onClick={handleLogout} className="text-red-500 whitespace-nowrap">Sair</button>
                    </Link>
                </div>
            </div>
            <div className="pt-16">
                {children}
            </div>
        </CartProvider>
    )
}

function Cart() {
    const cartRef = useRef<HTMLDivElement>(null)
    const { cart, removeFromCart, completePurchase, isCartOpen, setIsCartOpen, address, setAddress, shippingCost, calculateShipping } = useCart()

    return (
        <div className="relative" ref={cartRef}>
            <span onClick={() => setIsCartOpen(!isCartOpen)} className="cursor-pointer">
                Carrinho ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </span>
            {isCartOpen && (
                <div className="absolute min-w-max right-0 mt-2 w-64 max-w-lg bg-white text-black p-2 rounded-lg shadow-lg border border-gray-300">
                    <h3 className="font-bold mb-2">Itens do Carrinho</h3>
                    {cart.length ? (
                        <>
                            {cart.map(({ product, quantity }) => (
                                <div key={product.id} className="cart-item border p-2 mb-2 flex flex-col items-center rounded-lg">
                                    <div>
                                        <h3 className="font-bold">{product.name}</h3>
                                        <p>Preço: R${product.price.toFixed(2)}</p>
                                        <p>Quantidade: {quantity}</p>
                                    </div>
                                    <button className="bg-red-500 text-white px-4 py-2 mt-2 rounded-lg" onClick={() => removeFromCart(product.id)}>Remover</button>
                                </div>
                            ))}
                            <div className="shipping-section mb-4 max-w-lg">
                                <label htmlFor="street" className="font-bold">Rua:</label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={address.street}
                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                    className="border p-1 w-full mb-2 rounded-lg"
                                />
                                <label htmlFor="city" className="font-bold">Cidade:</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    className="border p-1 w-full mb-2 rounded-lg"
                                />
                                <label htmlFor="state" className="font-bold">Estado:</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={address.state}
                                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                    className="border p-1 w-full mb-2 rounded-lg"
                                />
                                <label htmlFor="zip" className="font-bold">CEP:</label>
                                <input
                                    type="text"
                                    id="zip"
                                    name="zip"
                                    value={address.zip}
                                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                                    onBlur={() => calculateShipping(address)}
                                    className="border p-1 w-full mb-2 rounded-lg"
                                />
                                <p>Custo de Frete: R${shippingCost.toFixed(2)}</p>
                            </div>
                            <button className="bg-green-500 text-white px-4 py-2 mt-2 rounded-lg" onClick={() => completePurchase(address, shippingCost)}>Concluir Compra</button>
                        </>
                    ) : <p>O carrinho está vazio</p>}
                </div>
            )}
        </div>
    )
}