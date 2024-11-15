"use client"

import { createContext, useContext, useState, useRef, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { completePurchase } from "@/app/server/actions/orders"
import { ProductWithImages } from "@/app/types/shared"

interface CartContextType {
    cart: { product: ProductWithImages, quantity: number }[]
    addToCart: (product: ProductWithImages) => void
    removeFromCart: (productId: number) => void
    completePurchase: (address: { street: string, city: string, state: string, zip: string }, shippingCost: number) => void
    isCartOpen: boolean
    setIsCartOpen: (isOpen: boolean) => void
    address: { street: string, city: string, state: string, zip: string }
    setAddress: (address: { street: string, city: string, state: string, zip: string }) => void
    shippingCost: number
    calculateShipping: (address: { street: string, city: string, state: string, zip: string }) => void
    setCart: (cart: { product: ProductWithImages, quantity: number }[]) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children, user_id }: { children: React.ReactNode, user_id: number }) => {
    const queryClient = useQueryClient()
    const [cart, setCart] = useState<{ product: ProductWithImages, quantity: number }[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "" })
    const [shippingCost, setShippingCost] = useState(0)
    const cartRef = useRef<HTMLDivElement>(null)

    const addToCart = (product: ProductWithImages) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.product.id === product.id)
            if (existingProduct) {
                return prevCart.map(item =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                return [...prevCart, { product, quantity: 1 }]
            }
        })
    }

    const removeFromCart = (productId: number) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.product.id === productId)
            if (existingProduct && existingProduct.quantity > 1) {
                return prevCart.map(item =>
                    item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
            } else {
                return prevCart.filter(item => item.product.id !== productId)
            }
        })
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
            setIsCartOpen(false)
        }
    }

    const handleCompletePurchase = async () => {
        const res = await completePurchase(user_id, cart.map(item => item.product), shippingCost, address)
        if (res.success) {
            setCart([])
            setIsCartOpen(false)
            alert("Compra concluída com sucesso!")
        } else {
            alert("Erro ao concluir a compra: " + res.message)
        }
        queryClient.invalidateQueries({
            queryKey: ["orders", user_id]
        })
    }

    const calculateShipping = async (address: { street: string, city: string, state: string, zip: string }) => {
        // Simulate a shipping cost calculation based on the address
        const cost = address.zip.length * 0.5 // Example calculation
        setShippingCost(cost)
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, completePurchase: handleCompletePurchase, isCartOpen, setIsCartOpen, address, setAddress, shippingCost, calculateShipping, setCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}