import { forwardRef } from 'react';
import Alert from '@mui/material/Alert'

function GenericErrorAlert(props, ref) {
    return (
        <Alert
            onClose={props.closeFn}
            ref={ref}
            severity="error"
            sx={{
                mx: 'auto',
                my: 4,
                width: '25%'
            }}
            variant="filled">
            {props.message}
        </Alert>
    )
}

export default forwardRef(GenericErrorAlert);