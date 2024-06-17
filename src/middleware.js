// It seems like this file is needed to execute callbacks


import { auth } from "@/auth"
 
export default auth((req) => {
  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, "/")
    return Response.redirect(url)
  }
})
 

export const config = {
    matcher: '/vendor/:path*'
}
