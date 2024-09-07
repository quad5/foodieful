'use client'

import { useSession } from 'next-auth/react';
import {
    Fragment,
    useEffect,
    useRef,
    useState
} from "react";
import Image from 'next/image'
import {
    Backdrop,
    CircularProgress,
    ImageListItem,
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
            <div>
                <Backdrop
                    open={isFetching}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress ref={inProgressRef} />
                </Backdrop>
            </div>

            {!isFetching && <Typography
                align='center'
                sx={{
                    color: 'white',
                    marginBottom: 4,
                }}
                variant='h3'>
                {MY_PROFILE_CC}
            </Typography>}

            {!isFetching && <Stack
                direction={'column'}
                padding={2}
                spacing={2}
                sx={{
                    backgroundColor: 'white',
                    display: 'flex',
                    mx: 'auto',
                    width: { xs: '100%', sm: '60%', md: '40%' }
                }}>

                <ImageListItem sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Image
                        alt="user-image"
                        height={200}
                        loading="lazy"
                        src={session?.user.image}
                        width={200} />
                </ImageListItem>

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
                    variant='filled' />
            </Stack>}
        </Fragment>
    )
}

