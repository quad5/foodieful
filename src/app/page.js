'use client'

import { zipCodeSchema } from '@/app/lib/validation-schema'
import { useEffect, useState } from 'react';
import styles from './page.module.css'
import "./globals.css";
import Pagination from '@/components/Pagination/Pagination';
import GenericModal from '@/components/GenericModal/GenericModal';
import ListingCard from '@/components/ListingCard.js/ListingCard';
import {
    SHOW_MODAL,
    ZIP_CODE
} from './lib/constants';
import {
    getLocationsURL,
    getUserLocation,
    getZipCodeDetails
} from "@/app/lib/apiHelpers"

import {
    ERROR_MSG_MEDIUM,
    LINEFORM,
    TEXTFIELD
} from './lib/globalClassNames';


export default function HomePage() {
    const [errorContent, setErrorContent] = useState('')
    const [modalContent, setModalContent] = useState('');
    const [zipCode, setZipCode] = useState('')

    useEffect(() => {
        const value = localStorage.getItem(SHOW_MODAL)
        if (value != null) {
            setModalContent(value)
        } else {
            setModalContent('')
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const result = await getUserLocation()
            setZipCode(result.postal)
        }

        fetchData()
    }, [])

    const handleZipCode = async (e) => {

        if (e.target.value.length === 5) {
            const result = await getZipCodeDetails(e.target.value)

            if (result.success) {
                setErrorContent('')
                setZipCode(e.target.value)
            } else {
                setErrorContent('Invalid Zip Code. ')
            }
        } else {
            try {
                await zipCodeSchema.validate({[ZIP_CODE] : e.target.value})
            } catch(error) {
                const splitted = error.toString().split(':')
                splitted.shift()
                setErrorContent(splitted.join(' '))
            }
            
        }

        if (e.target.value.length === 0) {
            setErrorContent('')
            setZipCode('')
        }
    }
    
    return (
        <>  
            {modalContent && <GenericModal content={modalContent}/>}
            <form className={styles.container}>
                {errorContent && <div className={ERROR_MSG_MEDIUM}>{`Error - ${errorContent}`}</div>}
                <div className={LINEFORM}>
                    <input className={TEXTFIELD} onChange={handleZipCode} type="text" 
                    placeholder='Enter a valid zip code to get started' />
                </div>
            </form>
            {zipCode && <Pagination api={getLocationsURL(zipCode)} card={ListingCard}/>}
        </>
    )
}