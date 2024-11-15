"use server"

import { APIResponse } from "@/app/types/api_response";
import { User, Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "../database";

export async function authenticate({ email, password }: { email: string, password: string }): APIResponse<User> {
    const user = await prisma.user.findFirst({
        where: {
            email,
        }
    });

    if (!user) return { success: false, message: "User not found" };

    const passwordIsCorrect = password == user.password;

    if (!passwordIsCorrect) {
        return { success: false, message: "Passwords don't match" };
    }

    const next_cookies = await cookies();

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    next_cookies.set("authentication", token);
    next_cookies.set("role", user.role);
    next_cookies.set("id", user.id.toString());

    return {
        success: true,
        response: [user]
    };
}

export async function register(userData: Prisma.UserCreateInput): APIResponse<User> {
    const newUser = await prisma.user.create({
        data: userData
    });

    const next_cookies = await cookies();

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5ldyBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    next_cookies.set("authentication", token);
    next_cookies.set("role", newUser.role);

    return {
        success: true,
        response: [newUser]
    };
}