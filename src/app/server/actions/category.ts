"use server"

import { APIResponse } from "@/app/types/api_response"
import { prisma } from "../database"
import { Category } from "@prisma/client"


export async function findAllCategories(): APIResponse<Category> {
    try {
        const res = await prisma.category.findMany()

        return { success: true, response: res }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function createOneCategory(formData: FormData): APIResponse<Category> {
    const data = Object.fromEntries(formData) as any

    try {
        const res = await prisma.category.create({
            data
        })

        return { success: true, response: [res] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function deleteCategory(categoryId: number): APIResponse<null> {
    try {
        await prisma.category.delete({
            where: { id: categoryId }
        })
        return { success: true, response: [null] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function updateCategory(categoryId: number, formData: FormData): APIResponse<Category> {
    const data = Object.fromEntries(formData) as any

    try {
        const res = await prisma.category.update({
            where: { id: categoryId },
            data: { name: data.name }
        })

        return { success: true, response: [res] }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}