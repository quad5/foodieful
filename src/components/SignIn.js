
import MenuButton from "./MenuButton"


export default function SignIn(props) {

  return (
    <form action={props.fn}>
      <MenuButton title={props.title} />
    </form>
  )
} 