import { forwardRef } from 'react';
import { Alert } from '@mui/material'

function GenericErrorAlert(props, ref) {
    return (
        <Alert
            onClose={props.closeFn}
            ref={ref}
            severity="error"
            sx={{
                mx: 'auto',
                my: 4,
                width: { xs: '100%', sm: '60%', md: '40%' }
            }}
            variant="filled">
            {props.message}
        </Alert>
    )
}

export default forwardRef(GenericErrorAlert);