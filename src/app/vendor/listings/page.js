"use client"

import {
    Fragment,
    useEffect,
    useRef,
    useState
} from 'react';
import { useForm } from 'react-hook-form';
import {
    useRouter,
    useSearchParams
} from 'next/navigation'
import { useSession } from 'next-auth/react';
import {
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Typography
} from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import GenericErrorAlert from '@/components/GenericErrorAlert'
import GenericSuccessAlert from '@/components/GenericSuccessAlert';
import { generateRandomUUID } from '@/app/lib/utils';

import {
    ACTIVE_LISTING,
    ACTIVE_LISTING_CC,
    ADD,
    ADDRESS_LINE_1,
    ADD_LISTING_CC,
    CITY_CC,
    EDIT,
    EDIT_LISTING_CC,
    ID,
    MODE,
    OPERATING_HOURS_CC,
    PIT_STOP_ADDRESS,
    PIT_STOP_ADDRESS_CC,
    SAVE_CC,
    SCHEDULES,
    STATE_CC,
    SUCCESSFULLY_CREATED_LISTING_CC,
    SUCCESSFULLY_UPDATED_LISTING_CC,
    TECHNICAL_DIFFICULTIES,
    ZIP_CODE_CC,
} from "@/app/lib/constants";

import { isEmpty } from '@/app/lib/utils';

import {
    DB_ACTIVE,
    DB_ADDRESS_LINE_1,
    DB_CITY,
    DB_STATE,
    DB_ZIP_CODE
} from '@/app/lib/dbFieldConstants';

import { listingSchema } from '@/app/lib/validation-schema'
import {
    createListing,
    getListingByAddressId,
    getZipCodeDetails,
    updateListingByAddressId
} from '@/app/lib/apiHelpers';

import { convertToFullCalendarEvent } from '@/app/lib/fullCalendar/event-utils';



export default function Listings() {
    const alertRef = useRef(null);
    const inProgressRef = useRef(null);
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession();
    const [activeListing, setActiveListing] = useState(true);
    const [addressLine1, setAddressLine1] = useState('')
    const [city, setCity] = useState('')
    const [currentEvents, setCurrentEvents] = useState([])
    const [disableElement, setDisableElement] = useState(false)
    const [existingSchedules, setExistingSchedules] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false)
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [zipCodeError, setZipCodeError] = useState('')

    const itemId = (!searchParams.get(ID)) ? 0 : parseInt(searchParams.get(ID), 10)
    const mode = searchParams.get(MODE)

    useEffect(() => {

        const fetchData = async () => {
            const result = await getListingByAddressId(itemId)

            if (result.success) {
                setExistingSchedules(result.message.schedule)
                setActiveListing(result.message[DB_ACTIVE])
                setAddressLine1(result.message[DB_ADDRESS_LINE_1])
                setCity(result.message[DB_CITY])
                setState(result.message[DB_STATE])
                setZipCode(result.message[DB_ZIP_CODE])
            } else {
                setOpenErrorAlert(true)
            }
            setIsFetching(false)
        }

        if (mode === EDIT) {
            fetchData()
        } else {
            setIsFetching(false)
        }

    }, [itemId, mode])

    useEffect(() => {
        if (isFetching && inProgressRef.current) {
            inProgressRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if ((openErrorAlert && alertRef.current) || (openSuccessAlert && alertRef.current)) {
            alertRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isFetching, openErrorAlert, openSuccessAlert])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(listingSchema),
        mode: 'onChange'
    });


    // NOTE - Need to place after all hooks initialization
    if (!session) {
        return
    }
    const handleActive = () => {
        setActiveListing(!activeListing)
    }

    const handleAlertClose = () => {
        router.push("/vendor")
        setDisableElement(true)
    }

    const handleZipCode = async (e) => {
        setZipCode(e.target.value)

        if (e.target.value.length === 5) {
            const result = await getZipCodeDetails(e.target.value)

            if (result.success) {
                setCity(result.message.city)
                setState(result.message.state)
                setZipCodeError('')
            } else {
                setZipCodeError('Invalid Zip Code. ')
            }
        } else {
            setCity('')
            setState('')
            setZipCodeError('')
        }
    }

    async function onSubmit(data) {
        setZipCodeError('');
        data[CITY_CC] = city
        data[STATE_CC] = state

        if (!zipCodeError) {
            let response = {}

            // create address object
            const address = {
                [DB_ADDRESS_LINE_1]: data[ADDRESS_LINE_1],
                [DB_CITY]: city,
                [DB_STATE]: state,
                [DB_ZIP_CODE]: data[ZIP_CODE_CC]
            }

            if (mode === ADD) {
                response = await createListing({
                    [PIT_STOP_ADDRESS]: address,
                    [SCHEDULES]: currentEvents,
                    [ACTIVE_LISTING]: activeListing,
                }, session.user.email)

            } else {    // edit
                response = await updateListingByAddressId({
                    [PIT_STOP_ADDRESS]: address,
                    [SCHEDULES]: currentEvents,
                    [ACTIVE_LISTING]: activeListing,
                }, itemId)
            }

            if (response.success) {
                setOpenSuccessAlert(true)
                setDisableElement(true)
            } else {
                setOpenErrorAlert(true)
            }
        }
    }

    function handleDateSelect(selectInfo) {
        const eventId = generateRandomUUID()
        let calendarApi = selectInfo.view.calendar

        calendarApi.unselect() // clear date selection

        calendarApi.addEvent({
            id: eventId,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
        })
    }

    function handleEventClick(clickInfo) {
        if (!disableElement && confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            clickInfo.event.remove()
        }
    }

    function handleEvents(events) {
        setCurrentEvents(events)
    }

    function addMode() {
        return (
            <Fragment>
                <Typography
                    align='center'
                    sx={{ color: 'common.white', marginY: '5%' }}
                    variant='h3'>
                    {ADD_LISTING_CC}
                </Typography>

                <Container
                    maxWidth='md'
                    sx={{ display: 'flex', justifyContent: 'center', maxHeight: 'xs' }}>
                    <Box
                        display='flex'
                        flexDirection='column'
                        width='100%' >
                        <Button
                            size='small'
                            sx={{
                                display: 'flex',
                                ml: 'auto',
                                width: 'fit-content',
                            }}
                            variant='contained'>
                            <FormControlLabel
                                checked={activeListing}
                                control={<Switch onChange={handleActive} color='common.white' />}
                                disabled={disableElement}
                                disableTypography
                                label={ACTIVE_LISTING_CC} />
                        </Button>

                        <Card
                            sx={{
                                mx: 'auto',
                                width: '100%'
                            }}>
                            <Stack
                                display='flex'
                                direction={{ xs: 'column', md: 'row' }} >
                                <CardContent sx={{ width: { xs: '100%', md: '65%' } }}>

                                    <Divider>{OPERATING_HOURS_CC}</Divider>
                                    <FullCalendar
                                        allDaySlot={false}
                                        dayHeaderFormat={{ weekday: 'short' }}
                                        droppable={false}
                                        editable={!disableElement}
                                        eventClick={handleEventClick}
                                        eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                                        headerToolbar={{
                                            left: '',
                                            center: '',
                                            right: ''
                                        }}
                                        initialView='timeGridWeek'
                                        initialEvents={[]}
                                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                                        select={handleDateSelect}
                                        selectable={!disableElement}
                                        weekends={true} />
                                </CardContent>

                                <CardContent sx={{ width: { xs: '100%', md: '35%' } }}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Stack
                                            direction={'column'}
                                            spacing={2}
                                            mx='auto'>

                                            <Divider>{PIT_STOP_ADDRESS_CC}</Divider>

                                            <TextField
                                                disabled={disableElement}
                                                error={!!errors[ADDRESS_LINE_1]}
                                                helperText={errors[ADDRESS_LINE_1]?.message}
                                                InputLabelProps={{ shrink: true }}
                                                label={ADDRESS_LINE_1}
                                                required={true}
                                                size='small'
                                                variant='outlined'
                                                {...register(ADDRESS_LINE_1)} />

                                            <TextField
                                                disabled={disableElement}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                label={CITY_CC}
                                                size='small'
                                                value={city}
                                                variant='filled' />

                                            <TextField
                                                disabled={disableElement}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                label={STATE_CC}
                                                size='small'
                                                value={state}
                                                variant='filled' />

                                            <TextField
                                                disabled={disableElement}
                                                error={!!errors[ZIP_CODE_CC] || zipCodeError}
                                                helperText={errors[ZIP_CODE_CC]?.message || zipCodeError}
                                                InputLabelProps={{ shrink: true }}
                                                label={ZIP_CODE_CC}
                                                onKeyUp={handleZipCode}
                                                size='small'
                                                variant='outlined'
                                                {...register(ZIP_CODE_CC)} />

                                            <Button
                                                disabled={!isEmpty(errors) || zipCodeError || disableElement}
                                                mx='auto'
                                                size='small'
                                                type='submit'
                                                variant='contained'>
                                                {SAVE_CC}
                                            </Button>
                                        </Stack>
                                    </form>
                                </CardContent>
                            </Stack>
                        </Card>
                    </Box>
                </Container>

            </Fragment>
        )
    }

    function editMode() {
        return (
            <Fragment>
                <Typography
                    align='center'
                    sx={{
                        color: 'common.white',
                        marginY: '5%'
                    }}
                    variant='h3'>
                    {EDIT_LISTING_CC}
                </Typography>

                <Container
                    maxWidth='md'
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        maxHeight: 'xs'
                    }}>
                    <Box
                        display='flex'
                        flexDirection='column'
                        width='100%'>

                        <Button
                            size='small'
                            sx={{
                                display: 'flex',
                                ml: 'auto',
                                width: 'fit-content',
                            }}
                            variant='contained'>
                            <FormControlLabel
                                checked={activeListing}
                                control={<Switch onChange={handleActive} color='common.white' />}
                                disabled={disableElement}
                                disableTypography
                                label={ACTIVE_LISTING_CC} />
                        </Button >

                        <Card
                            sx={{
                                mx: 'auto',
                                width: '100%'
                            }}>

                            <Stack
                                display='flex'
                                direction={{ xs: 'column', md: 'row' }} >

                                <CardContent sx={{ width: { xs: '100%', md: '65%' } }}>
                                    <Divider>{OPERATING_HOURS_CC}</Divider>
                                    <FullCalendar
                                        allDaySlot={false}
                                        dayHeaderFormat={{ weekday: 'short' }}
                                        droppable={false}
                                        editable={!disableElement}
                                        eventClick={handleEventClick}
                                        eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                                        headerToolbar={{
                                            left: '',
                                            center: '',
                                            right: ''
                                        }}
                                        initialView='timeGridWeek'
                                        initialEvents={convertToFullCalendarEvent(existingSchedules)}
                                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                                        select={handleDateSelect}
                                        selectable={!disableElement}
                                        weekends={true} />
                                </CardContent>

                                <CardContent sx={{ width: { xs: '100%', md: '35%' } }} >
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Stack
                                            direction={'column'}
                                            mx='auto'
                                            spacing={2}>
                                            <Divider>{PIT_STOP_ADDRESS_CC}</Divider>

                                            <TextField
                                                defaultValue={addressLine1}
                                                disabled={disableElement}
                                                error={!!errors[ADDRESS_LINE_1]}
                                                helperText={errors[ADDRESS_LINE_1]?.message}
                                                InputLabelProps={{ shrink: true }}
                                                label={ADDRESS_LINE_1}
                                                size='small'
                                                variant='outlined'
                                                {...register(ADDRESS_LINE_1)}
                                            />

                                            <TextField
                                                disabled={disableElement}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                label={CITY_CC}
                                                size='small'
                                                value={city}
                                                variant='filled' />

                                            <TextField
                                                disabled={disableElement}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                label={STATE_CC}
                                                size='small'
                                                value={state}
                                                variant='filled' />

                                            <TextField
                                                defaultValue={zipCode}
                                                disabled={disableElement}
                                                error={!!errors[ZIP_CODE_CC] || zipCodeError}
                                                helperText={errors[ZIP_CODE_CC]?.message || zipCodeError}
                                                InputLabelProps={{ shrink: true }}
                                                label={ZIP_CODE_CC}
                                                onKeyUp={handleZipCode}
                                                size='small'
                                                variant='outlined'
                                                {...register(ZIP_CODE_CC)}
                                            />

                                            <Button
                                                disabled={!isEmpty(errors) || zipCodeError || disableElement}
                                                mx='auto'
                                                size='small'
                                                type='submit'
                                                variant='contained'>
                                                {SAVE_CC}
                                            </Button>
                                        </Stack>
                                    </form>
                                </CardContent>
                            </Stack>
                        </Card>
                    </Box>
                </Container>
            </Fragment>
        )
    }

    return (

        <Fragment>
            {openSuccessAlert &&
                <GenericSuccessAlert
                    closeFn={handleAlertClose}
                    message={mode === ADD ? SUCCESSFULLY_CREATED_LISTING_CC : SUCCESSFULLY_UPDATED_LISTING_CC}
                    ref={alertRef} />}

            {openErrorAlert &&
                <GenericErrorAlert
                    closeFn={handleAlertClose}
                    message={TECHNICAL_DIFFICULTIES}
                    ref={alertRef} />}

            <div>
                <Backdrop
                    open={isFetching}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress ref={inProgressRef} />
                </Backdrop>
            </div>

            {mode === ADD && addMode()}
            {!isFetching && mode === EDIT && editMode()}

        </Fragment >


    );
} 