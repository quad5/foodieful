'use client'

import {
    Fragment,
    useEffect,
    useRef,
    useState
} from 'react';
import { useSession } from 'next-auth/react';
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
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    STATE_CC,
    TECHNICAL_DIFFICULTIES,
    VENDOR_BUSINESS_NAME_CC,
    VENDOR_PROFILE_CC,
    ZIP_CODE_CC,
} from "@/app/lib/constants";

import {
    getVendorProfileById,
    getVendorUserByEmail
} from "@/app/lib/apiHelpers";
import GenericErrorAlert from '@/components/GenericErrorAlert'


export default function VendorProfile() {
    const alertRef = useRef(null);
    const inProgressRef = useRef(null);
    const { data: session, status } = useSession();
    const [isFetching, setIsFetching] = useState(true)
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [vendorProfile, setVendorProfile] = useState();
    const [vendorUser, setVendorUser] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const user = await getVendorUserByEmail(session?.user.email)

            if (user.success) {
                setVendorUser(user.message)
                const vendorId = user.message.vendorProfileId
                const profile = await getVendorProfileById(vendorId)

                if (profile.success) {
                    setVendorProfile(profile.message)
                    setIsFetching(false)
                } else {
                    setOpenErrorAlert(true)
                }
            } else {
                setOpenErrorAlert(true)
            }
        }

        if (session) {
            fetchData().catch(() => {
                setIsFetching(false)
            })
        } else {
            setIsFetching(true)
        }
    }, [session])



    useEffect(() => {
        if (isFetching && inProgressRef.current) {
            inProgressRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if (openErrorAlert && alertRef.current) {
            alertRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isFetching, openErrorAlert])

    return (
        <Fragment>
            {openErrorAlert && <GenericErrorAlert
                closeFn={() => { }}
                message={TECHNICAL_DIFFICULTIES}
                ref={alertRef} />}

            <div>
                <Backdrop
                    open={isFetching}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress ref={inProgressRef} />
                </Backdrop>
            </div>

            <Typography
                align='center'
                sx={{ color: 'common.white', marginY: '5%' }}
                variant='h3'>
                {VENDOR_PROFILE_CC}
            </Typography>

            {/* <Container */}
            {/* // maxWidth='sm'
                // sx={{
                //     display: 'flex',
                //     justifyContent: 'center',
                //     marginBottom: { xs: '20%' }
                // }} */}

            {/* // > */}
            <Card>
                <Stack
                    alignItems="center"
                    direction={'row'}>
                    <CardMedia
                        component="img"
                        height='100'
                        image="/orange-4547207_1920.png"    // temporary image
                        width='100' />

                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Stack
                            direction={'column'}
                            spacing={2}>

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                label={VENDOR_BUSINESS_NAME_CC}
                                size='small'
                                value={vendorProfile?.name || ""}
                                variant='filled' />

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                label={ADDRESS_LINE_1}
                                size='small'
                                value={vendorProfile?.addressLine1 || ""}
                                variant='filled' />

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                label={ADDRESS_LINE_2}
                                size='small'
                                value={vendorProfile?.addressLine2 || ""}
                                variant='filled' />

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                label={CITY_CC}
                                size='small'
                                value={vendorProfile?.city || ""}
                                variant='filled' />

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                label={STATE_CC}
                                size='small'
                                value={vendorProfile?.state || ""}
                                variant='filled' />

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                label={ZIP_CODE_CC}
                                size='small'
                                value={vendorProfile?.zipCode || ""}
                                variant='filled' />
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>
            {/* </Container> */}
        </Fragment>
    )
}