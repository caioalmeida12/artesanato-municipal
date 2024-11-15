"use client"

import ProductCard from "@/app/components/ProductCard"
import { findAllOrdersByUser } from "@/app/server/actions/orders"
import { findAllProducts } from "@/app/server/actions/products"
import { OrderWithItems, ProductWithImages } from "@/app/types/shared"
import { useQuery } from "@tanstack/react-query"
import { useCookies } from 'next-client-cookies'
import { useState } from "react"
import { useCart } from "./CartContext"

type ProductWithImagesExtended = ProductWithImages & { quantity: number, user: { username: string } }

export default function Page() {
    const user_id = Number(useCookies().get("id"))
    const [activeTab, setActiveTab] = useState("products")
    const [searchTerm, setSearchTerm] = useState("");

    const { data: produtos } = useQuery({
        queryKey: ["produtos"],
        queryFn: async (): Promise<ProductWithImagesExtended[]> => {
            const res = await findAllProducts()
            return res.success ? res.response.map(product => ({ ...product, user: product.user })) : []
        }
    })

    const filteredProducts = produtos?.filter(prod => prod.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const { data: orders } = useQuery({
        queryKey: ["orders", user_id],
        queryFn: async (): Promise<OrderWithItems[]> => {
            const res = await findAllOrdersByUser(user_id)
            return res.success ? res.response : []
        }
    })

    const { addToCart } = useCart()
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

    const handleQuantityChange = (productId: number, quantity: number) => {
        setQuantities(prev => ({ ...prev, [productId]: quantity }))
    }

    const handleAddToCart = (product: ProductWithImages) => {
        const quantity = quantities[product.id] || 1
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="search-bar mb-4">
                <input
                    type="text"
                    placeholder="Procurar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            <div className="tabs flex gap-4 mb-4">
                <button onClick={() => setActiveTab("products")} className={`px-4 py-2 ${activeTab === "products" ? "bg-gray-700 text-white" : "bg-gray-300"}`}>Produtos</button>
                <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 ${activeTab === "orders" ? "bg-gray-700 text-white" : "bg-gray-300"}`}>Pedidos</button>
            </div>

            {activeTab === "products" && (
                <>
                    <h2 className="text-xl font-semibold mb-4">Produtos Disponíveis</h2>
                    <div className="flex flex-wrap gap-4">
                        {filteredProducts?.length ? filteredProducts.map(prod => (
                            <div key={prod.id} className="max-w-sm w-full">
                                <ProductCard product={prod} />
                            </div>
                        )) : <p>Nenhum produto disponível</p>}
                    </div>
                </>
            )}

            {activeTab === "orders" && (
                <>
                    <h2 className="text-xl font-semibold mb-4">Meus Pedidos</h2>
                    <div className="orders-section">
                        {orders?.length ? orders.map(order => (
                            <div key={order.id} className="order-card border p-4 mb-4">
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Total:</strong> R${order.total.toFixed(2)}</p>
                                <p><strong>Custo de Frete:</strong> R${order.shippingCost.toFixed(2)}</p>
                                <p><strong>Endereço de Entrega:</strong> {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}</p>
                                <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                <div className="order-items mt-2">
                                    <h3 className="font-semibold">Itens:</h3>
                                    {order.items.map(item => (
                                        <div key={item.id} className="order-item flex justify-between">
                                            <span>{item.product.name} (x{item.quantity})</span>
                                            <span>R${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) : <p>Nenhum pedido encontrado</p>}
                    </div>
                </>
            )}
        </div>
    )
}