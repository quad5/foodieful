
import MenuButton from "./MenuButton"

/* 
TODO -  https://github.com/nextauthjs/next-auth/issues/8976

Existing issue on next-auth where it doesn't clear session so user can login again after logout. 

*/
export default function SignOut(props) {
  return (
    <form action={props.fn}>
      <MenuButton title={props.title} />
    </form>
  )
} 