import { Fragment } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import {
    CANCEL_CC,
    OKAY_CC,
} from '@/app/lib/constants';
import theme from '@/theme';

export default function Prompt(props) {
    return (
        <Fragment>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.primary.main,
                    }
                }}>
                <DialogTitle
                    className='prompt-title'>
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        className='prompt-content'
                        sx={{ color: 'black' }}>
                        {props.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        className='prompt-okay'
                        onClick={props.handleOK}
                        sx={{ backgroundColor: 'black', color: 'white' }}>
                        {OKAY_CC}
                    </Button>
                    <Button
                        className='prompt-cancel'
                        onClick={props.handleClose}
                        sx={{ backgroundColor: 'black', color: 'white' }}>
                        {CANCEL_CC}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}