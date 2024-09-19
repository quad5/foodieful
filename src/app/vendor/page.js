'use client'


import { useSession } from 'next-auth/react';
import {
    Fragment,
    useEffect,
    useRef,
    useState
} from "react";
import {
    redirect,
    useRouter,
} from 'next/navigation'
import {
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Collapse,
    Divider,
    FormControlLabel,
    List,
    ListItemButton,
    ListItemText,
    Stack,
    Switch,
    TextField,
    Typography
} from '@mui/material';

import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import GenericSuccessAlert from '@/components/GenericSuccessAlert';
import GenericErrorAlert from '@/components/GenericErrorAlert';
import {
    ACTIVE_LISTINGS_CC,
    CREATE,
    ADDRESS_LINE_1,
    CITY_CC,
    CREATE_NEW_LISTING,
    DELETE_LISTING_CC,
    EDIT,
    EDIT_LISTING_CC,
    EXPAND_ALL_CC,
    ID,
    INACTIVE_LISTINGS_CC,
    MANAGE_MY_LISTINGS_CC,
    MODE,
    NO_LISTING_CREATED_CC,
    OPERATING_HOURS_CC,
    PIT_STOP_ADDRESS_CC,
    STATE_CC,
    SUCCESSFULLY_DELETED_LISTING_CC,
    TECHNICAL_DIFFICULTIES,
    ZIP_CODE_CC
} from "@/app/lib/constants"
import {
    DB_ADDRESS_LINE_1,
    DB_CITY,
    DB_ID,
    DB_STATE,
    DB_ZIP_CODE
} from "@/app/lib/dbFieldConstants"
import {
    deleteListingByAddressId,
    getListingsByActive,
} from "../lib/apiHelpers";
import { convertToFullCalendarEvent } from '../lib/fullCalendar/event-utils';


export default function Vendor() {
    const router = useRouter()
    const { data: session, status } = useSession();

    if (status !== 'loading' && !session) {
        redirect("/")
        // router.replace("/")
    }

    const alertRef = useRef(null);
    const inProgressRef = useRef(null);
    const [activeListings, setActiveListings] = useState([])
    const [activePreviouslyClosed, setActivePreviouslyClosed] = useState([])
    const [email, setEmail] = useState('')
    const [inActiveListings, setInActiveListings] = useState([])
    const [inActivePreviouslyClosed, setInActivePreviouslyClosed] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [openActive, setOpenActive] = useState(false)
    const [openInActive, setOpenInActive] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false)
    const [selectedActiveIndex, setSelectedActiveIndex] = useState(-1)
    const [selectedInActiveIndex, setSelectedInActiveIndex] = useState(-1)
    const [updateListing, setUpdateListing] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            setEmail(session.user.email)
            if (email) {
                // TODO - implement Redux to execute this once after login, and clear it once logout. 
                // if (!name) {
                //     const userResponse = await updateVendorUser({ email: email, name: session.user.name })
                //     if (userResponse.success) {
                //         setName(session?.user.name)
                //     }
                // }

                const activeListingsResp = await getListingsByActive(email, true)
                if (activeListingsResp.success) {
                    setActiveListings(activeListingsResp.message)
                }

                const inActiveListingsResp = await getListingsByActive(email, false)
                if (inActiveListingsResp.success) {
                    setInActiveListings(inActiveListingsResp.message)
                }
                if (!activeListingsResp.success || !inActiveListingsResp.success) {
                    setOpenErrorAlert(true)
                }
                setUpdateListing(false)
                setIsFetching(false)
                router.refresh()
            }
        }

        if (session) {
            fetchData()
        } else {
            setIsFetching(true)
        }
    }, [email, router, session, updateListing])

    useEffect(() => {
        if (isFetching && inProgressRef.current) {
            inProgressRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if ((openErrorAlert && alertRef.current) || (openSuccessAlert && alertRef.current)) {
            alertRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isFetching, openErrorAlert, openSuccessAlert])

    const handleAlertClose = () => {
        setOpenErrorAlert(false)
        setOpenSuccessAlert(false)
    }

    const handleDelete = async (addressId) => {
        handleAlertClose()
        const ask = confirm("Are you sure you want to delete?")

        if (ask) {
            const result = await deleteListingByAddressId(email, addressId)

            if (result.success) {
                setOpenSuccessAlert(true)
                setUpdateListing(true)
                setIsFetching(true)
            } else {
                setOpenErrorAlert(true)
            }
        }
    }

    const handleExpandAllClick = () => {
        setOpenActive(!openActive)
        setOpenInActive(!openInActive)
        setSelectedActiveIndex(-1)
        setSelectedInActiveIndex(-2)
        if (openActive) {
            setActivePreviouslyClosed([])
        }
        if (openInActive) {
            setInActivePreviouslyClosed([])
        }
    }

    const handleItemExpansionClick = (id, isActive) => {
        if (isActive) {
            if (openActive) {
                if (activePreviouslyClosed.includes(id)) {
                    setActivePreviouslyClosed(
                        activePreviouslyClosed.filter(i =>
                            i !== id
                        )
                    )
                } else {
                    setActivePreviouslyClosed([
                        ...activePreviouslyClosed,
                        id
                    ])
                }
            } else {
                if (selectedActiveIndex === id) {
                    setSelectedActiveIndex(-1)
                } else {
                    setSelectedActiveIndex(id)
                }
            }
        } else {
            if (openInActive) {
                if (inActivePreviouslyClosed.includes(id)) {
                    setInActivePreviouslyClosed(
                        inActivePreviouslyClosed.filter(i =>
                            i !== id
                        )
                    )
                } else {
                    setInActivePreviouslyClosed([
                        ...inActivePreviouslyClosed,
                        id
                    ])
                }
            } else {
                if (selectedInActiveIndex === id) {
                    setSelectedInActiveIndex(-1)
                } else {
                    setSelectedInActiveIndex(id)
                }
            }
        }
    }

    function UI({ item, isActive }) {
        return (
            <Stack
                direction={'column'}
                justifyContent='center'>
                <ListItemButton
                    onClick={() => handleItemExpansionClick(item[DB_ID], isActive)}
                    sx={{
                        bgcolor: 'secondary.secondary',
                        fontSize: 30,
                        my: 2,
                        textAlign: 'center',
                        ":hover": {
                            backgroundColor: "secondary.main"
                        }
                    }}>
                    <ListItemText disableTypography >
                        {`${item[DB_ADDRESS_LINE_1]} ${item[DB_CITY]}, ${item[DB_STATE]}, ${item[DB_ZIP_CODE]}`}
                    </ListItemText>
                </ListItemButton>

                <Collapse in={isActive ? (openActive && !activePreviouslyClosed.includes(item[DB_ID]) || item[DB_ID] == selectedActiveIndex) :
                    (openInActive && !inActivePreviouslyClosed.includes(item[DB_ID]) || item[DB_ID] == selectedInActiveIndex)}
                    timeout="auto" unmountOnExit>

                    <Card sx={{ mb: 4 }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'column', md: 'row' }}
                            display='flex'>
                            <CardContent
                                sx={{ width: { xs: '100%', sm: '100%', md: '65%' } }} >
                                <Divider>{OPERATING_HOURS_CC}</Divider>
                                <FullCalendar
                                    allDaySlot={false}
                                    dayHeaderFormat={{ weekday: 'short' }}
                                    droppable={false}
                                    editable={false}
                                    headerToolbar={{
                                        left: '',
                                        center: '',
                                        right: ''
                                    }}
                                    initialView='timeGridWeek'
                                    initialEvents={convertToFullCalendarEvent(item.schedule)}
                                    plugins={[dayGridPlugin, timeGridPlugin]}
                                    selectable={false}
                                    weekends={true}
                                />
                            </CardContent>

                            <CardContent sx={{ width: { xs: '100%', sm: '100%', md: '35%' } }} >
                                <Stack direction={'column'} spacing={2}>
                                    <Divider>{PIT_STOP_ADDRESS_CC}</Divider>
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        label={ADDRESS_LINE_1}
                                        size='small'
                                        value={item[DB_ADDRESS_LINE_1]}
                                        variant='filled' />

                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        label={CITY_CC}
                                        size='small'
                                        value={item[DB_CITY]}
                                        variant='filled' />

                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        label={STATE_CC}
                                        size='small'
                                        value={item[DB_STATE]}
                                        variant='filled' />

                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        label={ZIP_CODE_CC}
                                        size='small'
                                        value={item[DB_ZIP_CODE]}
                                        variant='filled' />

                                    <Stack direction='row' spacing={2} justifyContent={'center'} display={'flex'} sx={{ textAlign: 'center' }}>
                                        <Button
                                            href={`/vendor/manage?${MODE}=${EDIT}&${ID}=${item[DB_ID]}`}
                                            size='small'
                                            variant='contained'>
                                            {EDIT_LISTING_CC}
                                        </Button>

                                        <Button
                                            onClick={() => handleDelete(item.id)}
                                            size='small'
                                            variant='contained'>
                                            {DELETE_LISTING_CC}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Stack>
                    </Card>
                </Collapse>
            </Stack>
        )
    }

    return (
        <Fragment >
            {openErrorAlert && <GenericErrorAlert
                closeFn={handleAlertClose}
                message={TECHNICAL_DIFFICULTIES}
                ref={alertRef} />}

            {openSuccessAlert && <GenericSuccessAlert
                closeFn={handleAlertClose}
                message={SUCCESSFULLY_DELETED_LISTING_CC}
                ref={alertRef} />}

            <div>
                <Backdrop
                    open={isFetching}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress ref={inProgressRef} />
                </Backdrop>
            </div>

            {!isFetching && <Box
                maxWidth='md'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mx: 'auto',
                    paddingX: { xs: 2, md: 0 }
                }}>
                <Typography
                    align='center'
                    sx={{
                        color: 'white',
                        marginBottom: 4
                    }}
                    variant='h3'>
                    {MANAGE_MY_LISTINGS_CC}
                </Typography>

                <List sx={{ mx: 'auto', width: '100%' }}>
                    <Stack
                        direction={'row'}
                        justifyContent={{ sm: 'flex-end', xs: 'center' }}
                        spacing={2}
                        sx={{ mb: 2 }}>
                        <Button
                            disabled={isFetching}
                            variant='contained'
                            href={`/vendor/manage?${MODE}=${CREATE}`}
                            sx={{ width: 'fit-content' }}>
                            {CREATE_NEW_LISTING}
                        </Button>
                        <Button
                            disabled={isFetching}
                            size='small'
                            sx={{ width: 'fit-content' }}
                            variant='contained'>
                            <FormControlLabel
                                control={<Switch
                                    color='white'
                                    onChange={handleExpandAllClick} />}
                                disableTypography
                                label={EXPAND_ALL_CC} />
                        </Button >
                    </Stack>

                    {!isFetching && activeListings.length == 0 && inActiveListings.length == 0 && <Typography
                        align='center'
                        sx={{
                            color: 'white',
                            marginTop: '5%'
                        }}
                        variant='h5'>
                        {NO_LISTING_CREATED_CC}
                    </Typography>}
                    {activeListings.length > 0 && <Typography
                        align='center'
                        sx={{ color: 'white', marginTop: '5%' }}
                        variant='h5'>
                        {ACTIVE_LISTINGS_CC}
                    </Typography>}

                    {!isFetching && activeListings.map((item) => (
                        <UI item={item} isActive={true} key={item[DB_ID]} />
                    ))}

                    {inActiveListings.length > 0 && <Typography
                        align='center'
                        sx={{ color: 'white', marginTop: '5%' }}
                        variant='h5'>
                        {INACTIVE_LISTINGS_CC}
                    </Typography>}

                    {!isFetching && inActiveListings.map((item) => (
                        <UI item={item} isActive={false} key={item[DB_ID]} />
                    ))}
                </List>
            </Box>}
        </Fragment>
    )
}