import { Button } from '@mui/material';

export default function MenuButton(props) {
    return (

        <Button
            sx={{
                backgroundColor: 'common.black', color: 'white',
                ":hover": {
                    backgroundColor: "white",
                    color: 'black'
                }
            }}
            type="submit"
            variant='contained'>
            {props.title}
        </Button>
    )
}