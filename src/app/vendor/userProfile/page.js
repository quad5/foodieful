'use client'

import { useSession } from 'next-auth/react';
import {
    Fragment,
    useEffect,
    useRef,
    useState
} from "react";
import {
    Backdrop,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import {
    EMAIL_CC,
    MY_PROFILE_CC,
    NAME_CC,
} from "@/app/lib/constants";


export default function UserProfile() {
    const inProgressRef = useRef(null)
    const { data: session, status } = useSession();
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        session ? setIsFetching(false) : setIsFetching(true)
    }, [session])

    useEffect(() => {
        if (isFetching && inProgressRef.current) {
            inProgressRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isFetching])

    return (
        <Fragment>
            <Backdrop
                open={isFetching}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress ref={inProgressRef} />
            </Backdrop>

            <Typography
                align='center'
                sx={{
                    color: 'common.white',
                    marginY: '5%'
                }}
                variant='h3'>
                {MY_PROFILE_CC}
            </Typography>

            <Container
                maxWidth='sm'
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: { xs: '20%' }
                }}>

                <Card sx={{ padding: 2 }}>
                    <Stack
                        alignItems="center"
                        direction={'row'}>
                        <CardMedia
                            component="img"
                            height='100'
                            image={session?.user.image}
                            width='100'
                        />

                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Stack
                                direction={'column'}
                                spacing={2}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    label={NAME_CC}
                                    size='small'
                                    value={session?.user.name}
                                    variant='filled' />

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    label={EMAIL_CC}
                                    size='small'
                                    value={session?.user.email}
                                    variant='filled'
                                />
                            </Stack>
                        </CardContent>
                    </Stack>
                </Card>
            </Container>
        </Fragment>
    )
}

