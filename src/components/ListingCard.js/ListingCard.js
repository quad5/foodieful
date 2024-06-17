import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import styles from "./listingCard.module.css"
import {
    ADDRESS_LINE_1,
    CITY_CC,
    LABEL,
    STATE_CC,
    ZIP_CODE,
} from "@/app/lib/constants"
import {
    DB_ADDRESS_LINE_1,
    DB_CITY,
    DB_STATE,
    DB_ZIP_CODE
} from "@/app/lib/dbFieldConstants"
import {
    CALENDAR,
    FORM_CONTAINER,
    LINEFORM,
    TEXTFIELD,
} from '@/app/lib/globalClassNames';
import { convertToFullCalendarEvent } from '@/app/lib/fullCalendar/event-utils'

export default function ListingCard(props) {
    const data = props.data

    return (
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
                    initialEvents={convertToFullCalendarEvent(data.schedule)}
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
                    <input className={TEXTFIELD} readOnly value={data[DB_ADDRESS_LINE_1]}/>
                </div>

                <div className={LINEFORM}>
                    <label className={LABEL}>{CITY_CC}</label>
                    <input className={TEXTFIELD}  readOnly value={data[DB_CITY]}/>
                </div>
                <div className={LINEFORM}>
                    <label className={LABEL}>{STATE_CC}</label>
                    <input className={TEXTFIELD} readOnly value={data[DB_STATE]}/>
                </div>
                <div className={LINEFORM}>
                    <label className={LABEL}>{ZIP_CODE}</label>
                    <input className={TEXTFIELD} readOnly value={data[DB_ZIP_CODE]} />
                </div>

            </form>

            
        </div>
    )
}