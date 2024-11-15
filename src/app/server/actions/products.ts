"use server"

import { APIResponse } from "@/app/types/api_response"
import { prisma } from "../database"
import { Product, ProductImage } from "@prisma/client"

export async function findAllProductsByUser(user_id: number): APIResponse<Product & { images: ProductImage[], stock: number }> {
    try {
        const res = await prisma.product.findMany({
            where: {
                userId: user_id
            },
            include: {
                images: true
            }
        })

        if (res == null) return { success: false, message: "Not found" }

        return { success: true, response: res.map(product => ({ ...product, stock: product.quantity })) }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function createOneProduct(formData: FormData): APIResponse<Product> {
    const data = Object.fromEntries(formData) as any

    data.price = parseFloat(data.price)
    data.categoryId = parseInt(data.categoryId)
    data.userId = parseInt(data.userId)
    data.quantity = parseInt(data.quantity)

    try {
        const res = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                userId: data.userId,
                quantity: data.quantity,
                images: {
                    create: {
                        imageUrl: data.productImg
                    }
                }
            } as any
        })

        return { success: true, response: [res] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function addProductImage(productId: number, imageUrl: string): APIResponse<ProductImage> {
    try {
        const res = await prisma.productImage.create({
            data: {
                productId,
                imageUrl
            }
        })

        return { success: true, response: [res] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function deleteProduct(productId: number): APIResponse<null> {
    try {
        await prisma.productImage.deleteMany({
            where: { productId }
        })
        await prisma.product.delete({
            where: { id: productId }
        })
        return { success: true, response: [null] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function deleteProductImage(imageId: number): APIResponse<null> {
    try {
        await prisma.productImage.delete({
            where: { id: imageId }
        })
        return { success: true, response: [null] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function updateProduct(productId: number, formData: FormData): APIResponse<Product> {
    const data = Object.fromEntries(formData) as any

    data.price = parseFloat(data.price)
    data.categoryId = parseInt(data.categoryId)
    data.quantity = parseInt(data.quantity)

    try {
        const res = await prisma.product.update({
            where: { id: productId },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                quantity: data.quantity
            } as any
        })

        return { success: true, response: [res] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function updateProductImage(imageId: number, imageUrl: string): APIResponse<ProductImage> {
    try {
        const res = await prisma.productImage.update({
            where: { id: imageId },
            data: { imageUrl }
        })

        return { success: true, response: [res] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function findAllProducts(): APIResponse<Product & { images: ProductImage[], stock: number, user: { username: string } }> {
    try {
        const res = await prisma.product.findMany({
            include: {
                images: true,
                user: true
            }
        })

        if (res == null) return { success: false, message: "Not found" }

        return {
            success: true,
            response: res.map(product => ({ ...product, stock: product.quantity, user: product.user }))
        }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}
