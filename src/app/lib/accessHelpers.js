"use server"

import { signIn, signOut } from "@/auth"
import { AUTH0 } from "@/app/lib/constants"

export async function signInHelperFn() {
    await signIn(AUTH0, {
        redirectTo: '/vendor'
    })
}


export const signOutHelperFn = async () => {
    await signOut()
}
