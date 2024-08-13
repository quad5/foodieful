import { forwardRef } from 'react';
import Alert from '@mui/material/Alert'

function GenericSuccessAlert(props, ref) {
    return (
        <Alert
            onClose={props.closeFn}
            ref={ref}
            severity="success"
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

export default forwardRef(GenericSuccessAlert);