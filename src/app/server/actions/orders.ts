"use server"

import { APIResponse } from "@/app/types/api_response"
import { prisma } from "../database"
import { Order, OrderItem, User, Product, Address } from "@prisma/client"
import { ProductWithImages, OrderWithItems } from "@/app/types/shared"

export async function findAllOrdersByUser(user_id: number): APIResponse<OrderWithItems> {
    try {
        const res = await prisma.order.findMany({
            where: {
                userId: user_id
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: true,
                address: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (res == null) return { success: false, message: "Not found" }

        return { success: true, response: res }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function completePurchase(userId: number, cart: ProductWithImages[], shippingCost: number, address: { street: string, city: string, state: string, zip: string }): APIResponse<null> {
    try {
        const addressRes = await prisma.address.create({
            data: {
                street: address.street,
                city: address.city,
                state: address.state,
                zip: address.zip,
                userId
            }
        })

        const order = await prisma.order.create({
            data: {
                userId,
                addressId: addressRes.id,
                total: cart.reduce((sum, product) => sum + product.price, 0) + shippingCost,
                shippingCost,
                status: "PENDING",
                items: {
                    create: cart.map(product => ({
                        productId: product.id,
                        quantity: 1,
                        price: product.price
                    }))
                }
            }
        })

        return { success: true, response: [null] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function updateOrderStatus(orderId: number, status: string): APIResponse<null> {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })
        return { success: true, response: [null] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}