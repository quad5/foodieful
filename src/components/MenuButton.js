import { Button } from '@mui/material';
import { hyphenateText } from '@/app/lib/utils';

export default function MenuButton(props) {
    return (
        <Button
            className={`menu-${hyphenateText(props.title).toLowerCase()}`}
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