"use client"

import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid'
import { createEventId } from '@/app/lib/fullCalendar/event-utils'
import { yupResolver } from '@hookform/resolvers/yup';
import {
    ADD,
    ADDRESS_LINE_1,
    CANCEL_CC,
    CITY_CC,
    EDIT,
    ID,
    TECHNICAL_DIFFICULTIES,
    LABEL,
    MODE,
    PIT_STOP_ADDRESS,
    SAVE_CC,
    SCHEDULES,
    STATE_CC,
    ZIP_CODE,
} from "@/app/lib/constants";

import {
    DB_ADDRESS_LINE_1,
    DB_CITY,
    DB_STATE,
    DB_ZIP_CODE
} from '@/app/lib/dbFieldConstants';

import {
    CALENDAR,
    ERROR_MSG_MEDIUM,
    ERROR_MSG_SMALL,
    FORM_CONTAINER,
    LINEFORM,
    TEXTFIELD
} from '@/app/lib/globalClassNames';

import styles from "./listing.module.css"
import { listingSchema } from '@/app/lib/validation-schema'
import {
    createListing,
    getListingByAddressId,
    getZipCodeDetails,
    updateListingByAddressId
} from '@/app/lib/apiHelpers';

import { convertToFullCalendarEvent } from '@/app/lib/fullCalendar/event-utils';



export default function Page() { 
    

    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession();
    
    const methods = useForm({
        resolver: yupResolver(listingSchema),
        });
    
    const [errorContent, setErrorContent] = useState('')
    const [addressLine1, setAddressLine1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [existingSchedules, setExistingSchedules] = useState([])
    const [currentEvents, setCurrentEvents] = useState([])

    
    const itemId = (!searchParams.get(ID)) ? 0 : parseInt(searchParams.get(ID), 10)
    const mode = searchParams.get(MODE)

    useEffect(() => {
        
        const fetchData = async () => {
            const result = await getListingByAddressId(session?.user?.email, itemId)

            if (result.success) {
                setAddressLine1(result.message[DB_ADDRESS_LINE_1])
                setCity(result.message[DB_CITY])
                setState(result.message[DB_STATE])
                setZipCode(result.message[DB_ZIP_CODE])
                setExistingSchedules(result.message.schedule)
            }
        }

        if (itemId > 0) {
            fetchData().catch((error) => {

            })
        }

    }, [])

    // NOTE - Need to place after all hooks initialization
    if (!session) {
        return
    }
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods

    const handleCancel = () => {
        router.push("/vendor")
    }

    const handleZipCode = async (e) => {
        setZipCode(e.target.value)

        if (e.target.value.length === 5) {
            const result = await getZipCodeDetails(e.target.value)

            if (result.success) {
                setCity(result.message.city)
                setState(result.message.state)
                setErrorContent('')
            } else {
                setErrorContent('Invalid Zip Code. ')
            }
        } else {
            setCity('')
            setState('')
        }
    }

    async function onSubmit(data) {
        data[CITY_CC] = city
        data[STATE_CC] = state

        
        setErrorContent('');

        if (!errorContent) {
            let response = {}

            // create address object
            const address = {
                [DB_ADDRESS_LINE_1]: data[ADDRESS_LINE_1],
                [DB_CITY]: city,
                [DB_STATE]: state,
                [DB_ZIP_CODE]: data[ZIP_CODE]
            }

            if (mode === ADD) {
                response = await createListing({
                    [PIT_STOP_ADDRESS]: address,
                    [SCHEDULES]: currentEvents
                }, session.user.email)

            } else {    // edit
                response = await updateListingByAddressId({
                    [PIT_STOP_ADDRESS]: address,
                    [SCHEDULES]: currentEvents
                }, itemId)
            } 
            if(response.success) {
                alert("Successfully created/updated listing")
            } else {
                alert(TECHNICAL_DIFFICULTIES)
            }
            router.push("/vendor")
        }
    }
    
    function handleDateSelect(selectInfo) {
        const eventId = createEventId()
        let calendarApi = selectInfo.view.calendar
    
        calendarApi.unselect() // clear date selection
        
        calendarApi.addEvent({
            id: eventId,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
        })
      }

    function handleEventClick(clickInfo) {
        if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
          clickInfo.event.remove()
        }
    }

    function handleEvents(events) {
        setCurrentEvents(events)
    }

    function addMode() {
        return (
            <div className={styles.listingContainer}>
                <div className={CALENDAR}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        headerToolbar={{
                            left: '',
                            center: '',
                            right: ''
                        }}
                        initialView='timeGridWeek'
                        initialEvents={[]}
                        dayHeaderFormat={{weekday: 'short'}}
                        allDaySlot={false}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        droppable={false}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                    />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={FORM_CONTAINER}>
                    {errorContent && <div className={ERROR_MSG_MEDIUM}>{`Error - ${errorContent}`}</div>}

                    <h3>Pit stop address</h3>

                    <div className={LINEFORM}>
                        <label className={LABEL}>{ADDRESS_LINE_1}</label>
                        <input className={TEXTFIELD} {...register(ADDRESS_LINE_1)} type="text" 
                        placeholder="Enter pit stop address"/>
                    </div>
                    {errors[ADDRESS_LINE_1] && <span className={ERROR_MSG_SMALL}>{errors[ADDRESS_LINE_1].message}</span>}

                    <div className={LINEFORM}>
                        <label className={LABEL}>{CITY_CC}</label>
                        <input className={TEXTFIELD}  readOnly value={city}/>
                    </div>
                    <div className={LINEFORM}>
                        <label className={LABEL}>{STATE_CC}</label>
                        <input className={TEXTFIELD} readOnly value={state}/>
                    </div>
                    <div className={LINEFORM}>
                        <label className={LABEL}>{ZIP_CODE}</label>
                        <input className={TEXTFIELD} {...register(ZIP_CODE)} onChange={handleZipCode} type="text" 
                        placeholder='Enter a valid zip code' />
                    </div>
                    {errors[ZIP_CODE] && <span className={ERROR_MSG_SMALL}>{errors[ZIP_CODE].message}</span>}

                    <div className={styles.buttons}>
                        <button className={styles.submitButton} type="submit">{SAVE_CC}</button>
                        <button className={styles.submitButton} type="button" onClick={handleCancel}>{CANCEL_CC}</button>
                    </div> 
                </form>
            </div>
        )
    }

    function editMode() {
        return (
            <div>
                <div className={styles.listingContainer}>
                    <div className={CALENDAR}>
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                            headerToolbar={{
                                left: '',
                                center: '',
                                right: ''
                            }}
                            initialView='timeGridWeek'
                            initialEvents={convertToFullCalendarEvent(existingSchedules)}
                            dayHeaderFormat={{weekday: 'short'}}
                            allDaySlot={false}
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={true}
                            droppable={false}
                            select={handleDateSelect}
                            eventClick={handleEventClick}
                            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                        />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className={FORM_CONTAINER}>
                        {errorContent && <div className={ERROR_MSG_MEDIUM}>{`Error - ${errorContent}`}</div>}

                        <h3>Pit stop address</h3>

                        <div className={LINEFORM}>
                            <label className={LABEL}>{ADDRESS_LINE_1}</label>
                            <input className={TEXTFIELD} {...register(ADDRESS_LINE_1)} defaultValue={addressLine1} type="text" 
                            placeholder="Enter pit stop address"/>
                        </div>
                        {errors[ADDRESS_LINE_1] && <span className={ERROR_MSG_SMALL}>{errors[ADDRESS_LINE_1].message}</span>}

                        <div className={LINEFORM}>
                            <label className={LABEL}>{CITY_CC}</label>
                            <input className={TEXTFIELD}  readOnly value={city}/>
                        </div>
                        <div className={LINEFORM}>
                            <label className={LABEL}>{STATE_CC}</label>
                            <input className={TEXTFIELD} readOnly value={state}/>
                        </div>
                        <div className={LINEFORM}>
                            <label className={LABEL}>{ZIP_CODE}</label>
                            <input className={TEXTFIELD} {...register(ZIP_CODE)} onChange={handleZipCode} defaultValue={zipCode} type="text" 
                            placeholder='Enter a valid zip code' />
                        </div>
                        {errors[ZIP_CODE] && <span className={ERROR_MSG_SMALL}>{errors[ZIP_CODE].message}</span>}

                        <div className={styles.buttons}>
                            <button className={styles.submitButton} type="submit">{SAVE_CC}</button>
                            <button className={styles.submitButton} type="submit" onClick={handleCancel}>{CANCEL_CC}</button>
                        </div> 
                    </form>

                    
                </div>
            </div>
        )
    }

    return (
        <Fragment>
            {mode === ADD && addMode()}
            {mode === EDIT && editMode()}
        </Fragment>   
    ); 
} 