"use server"

import { APIResponse } from "@/app/types/api_response"
import { prisma } from "../database"
import { User } from "@prisma/client"

export async function findOneUserById(user_id: number): APIResponse<User> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: user_id,
            }
        });

        if (!user) return { success: false, message: "User not found" };

        return { success: true, response: [user] }
    } catch (error) {
        return { success: false, message: "Not found" }
    }
}