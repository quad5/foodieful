"use server"

import { AUTH0 } from "@/app/lib/constants"
import { signIn, signOut } from "@/auth"


export async function signInHelperFn() {
    await signIn(AUTH0, {
        redirectTo: '/vendor'
    })
}

export async function signOutHelperFn() {
    await signOut()
}
