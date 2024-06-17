import { VENDOR_SIGN_UP } from "@/app/lib/constants"


export default function SignUp() {
    return (
        <form action="/create-vendor">
            <button type="submit">{VENDOR_SIGN_UP}</button> 
        </form>
    )
}