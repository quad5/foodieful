import { VENDOR_SIGN_UP_CC } from "@/app/lib/constants"
import { Button } from "@mui/material"

export default function SignUp() {
    return (
        <form action="/create-vendor">
            <Button
                type="submit"
                variant="text">
                {VENDOR_SIGN_UP_CC}</Button>
        </form>
    )
}