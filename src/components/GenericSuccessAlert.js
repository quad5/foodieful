import { forwardRef } from 'react';
import { Alert } from '@mui/material'

function GenericSuccessAlert(props, ref) {
    return (
        <Alert
            className='success-alert'
            onClose={props.closeFn}
            ref={ref}
            severity="success"
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

export default forwardRef(GenericSuccessAlert);