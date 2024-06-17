
import { signIn } from "@/auth"
import { AUTH0, VENDOR_SIGN_IN } from "@/app/lib/constants"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
          const response = await signIn(AUTH0, {
            redirectTo: '/vendor'
          })
      }}
    >
      <button type="submit">{VENDOR_SIGN_IN}</button>
    </form>
  )
} 