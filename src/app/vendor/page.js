'use client'


import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { useRouter, redirect } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import {
    ADD,
    ADDRESS_LINE_1,
    CITY_CC,
    EDIT,
    ID,
    LABEL,
    MODE,
    STATE_CC,
    ZIP_CODE
} from "@/app/lib/constants"

import {
    DB_ADDRESS_LINE_1,
    DB_CITY,
    DB_ID,
    DB_STATE,
    DB_ZIP_CODE
} from "@/app/lib/dbFieldConstants"

import {
    CALENDAR,
    FORM_CONTAINER,
    LINEFORM,
    TEXTFIELD,
} from '../lib/globalClassNames';
import styles from "./vendor.module.css";
import {
    deleteListingByAddressId,
    getListings,
    updateVendorUser
} from "../lib/apiHelpers";
import Link from "next/link";


import { convertToFullCalendarEvent } from '../lib/fullCalendar/event-utils';

export default function Page() {
    const { data: session, status } = useSession();
    const router = useRouter()

    if (!session) {
        redirect("/")
    }
    
    const [listings, setListings] = useState([])
    const [name, setName] = useState('')
    const email = session.user.email;
    

    useEffect(() => {
        const fetchData = async () => {
            const userResponse = await updateVendorUser({email: email, name: session.user.name})
            if (userResponse.success) {
                setName(session.user.name)
            }

            const listings = await getListings(email)
            if (listings.success) {
                setListings(listings.message)
            }
        }

        fetchData().catch((e) => {
            console.error('An error occurred while fetching the data: ', e)
        })
    }, [])

    const handleDelete = async(addressId) => {
        // TODO - for some reason it clears session after deletion and goes to home page (because of above redirect?)
        const ask = confirm("Are you sure you want to delete?")
        console.log("__ask response", ask)
        if(ask) {
            const result = await deleteListingByAddressId(email, addressId)

            if (result.success) {
                prompt("Successfully deleted listing")
            }
        }
    }


    return (
        <>
            
            <header className={styles.vendorHeader}>
                <h1>Welcome back, {name}</h1>
            </header>
            <button className={styles.createButton}>{<Link href={`/vendor/listing?${MODE}=${ADD}`}>Create New Listing</Link>}</button>

            {listings.map((item, index) => (
                <ul key={index} >
                    <div className={styles.listingContainer}>
                        <div className={CALENDAR}>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                headerToolbar={{
                                    left: '',
                                    center: '',
                                    right: ''
                                }}
                                initialView='timeGridWeek'
                                initialEvents={convertToFullCalendarEvent(item.schedule)}
                                dayHeaderFormat={{weekday: 'short'}}
                                allDaySlot={false}
                                editable={false}
                                selectable={false}
                                selectMirror={true}
                                dayMaxEvents={true}
                                weekends={true}
                                droppable={false}
                            />
                        </div>

                        <form className={FORM_CONTAINER}>

                            <div className={LINEFORM}>
                                <label className={LABEL}>{ADDRESS_LINE_1}</label>
                                <input className={TEXTFIELD} readOnly value={item[DB_ADDRESS_LINE_1]}/>
                            </div>

                            <div className={LINEFORM}>
                                <label className={LABEL}>{CITY_CC}</label>
                                <input className={TEXTFIELD}  readOnly value={item[DB_CITY]}/>
                            </div>
                            <div className={LINEFORM}>
                                <label className={LABEL}>{STATE_CC}</label>
                                <input className={TEXTFIELD} readOnly value={item[DB_STATE]}/>
                            </div>
                            <div className={LINEFORM}>
                                <label className={LABEL}>{ZIP_CODE}</label>
                                <input className={TEXTFIELD} readOnly value={item[DB_ZIP_CODE]} />
                            </div>

                            <div className={styles.buttons}>
                                <button>{<Link href={`/vendor/listing?${MODE}=${EDIT}&${ID}=${item[DB_ID]}`}>Edit Listing</Link>}</button>
                                <button onClick={() => handleDelete(item.id)}>Delete Listing</button>
                            </div>
                        </form>

                        

                        
                    </div>

                </ul>
                
            ))}
            
        </>
    )
}