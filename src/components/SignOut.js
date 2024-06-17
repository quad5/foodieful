
import { signOut } from "@/auth"
import { AUTH0, SIGN_OUT } from "@/app/lib/constants"
import { router } from "next/navigation"

/* 
TODO -  https://github.com/nextauthjs/next-auth/issues/8976

Existing issue on next-auth where it doesn't clear session so user can login again after logout. 

*/
export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
        router.refresh;
      }}
    >
      <button type="submit">{SIGN_OUT}</button>
    </form>
  )
} 