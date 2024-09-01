import { Button } from '@mui/material';

export default function MenuButton(props) {
    return (

        <Button
            size='large'
            sx={{
                backgroundColor: 'common.black', color: 'white',
                ":hover": {
                    backgroundColor: "white",
                    color: 'black'
                },
                width: 120
            }}
            type="submit"
            variant='contained'>
            {props.title}
        </Button>
    )
}