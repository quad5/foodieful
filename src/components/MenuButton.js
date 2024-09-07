import { Button } from '@mui/material';

export default function MenuButton(props) {
    return (
        <Button
            size='large'
            sx={{
                backgroundColor: 'black', color: 'white',
                ":hover": {
                    backgroundColor: "white",
                    color: 'black'
                },
            }}
            type="submit"
            variant='contained'>
            {props.title}
        </Button>
    )
}