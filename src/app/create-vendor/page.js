"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { yupResolver } from '@hookform/resolvers/yup';
import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CANCEL_CC,
    CITY_CC,
    EMAIL_CC,
    LABEL,
    MAILING_ADDRESS,
    NAME_CC,
    REQUIRED_CC,
    SHOW_MODAL,
    SIGN_UP,
    STATE_CC,
    VENDOR_EMAIL,
    VENDOR_NAME,
    ZIP_CODE,
} from "@/app/lib/constants";

import {
    ERROR_MSG_MEDIUM,
    ERROR_MSG_SMALL,
    LINEFORM,
    TEXTFIELD
} from "@/app/lib/globalClassNames"

import styles from "./createVendor.module.css"
import { vendorSchema } from '@/app/lib/validation-schema'
import { createVendor, getZipCodeDetails } from '@/app/lib/apiHelpers';



export default function Page() { 
    const methods = useForm({
        resolver: yupResolver(vendorSchema),
        });
    const router = useRouter()
    const [errorContent, setErrorContent] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods

    const handleCancel = () => {
        router.push("/")
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

        const response = await createVendor(data)

        if (!errorContent) {
            if(!response.success) {
                setErrorContent(response.message)
                return;
            } else {
                localStorage.setItem(SHOW_MODAL, 'Vendor profile successfully created. Please sign in using provided email.')
                router.push("/")      
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.signUpFormContainer}>
                {errorContent && <div className={ERROR_MSG_MEDIUM}>{`Error - ${errorContent}`}</div>}
                
                <div className={LINEFORM}>
                    <label className={`${LABEL} ${styles.required}`}>{VENDOR_NAME}</label>
                    <input className={TEXTFIELD} {...register(NAME_CC)} type="text" placeholder="Enter vendor's name"/>
                </div>
                {errors[NAME_CC] && <span className={ERROR_MSG_SMALL}>{errors[NAME_CC].message}</span>}

                <div className={LINEFORM}>
                    <label className={`${LABEL} ${styles.required}`}>{VENDOR_EMAIL}</label>
                    <input className={TEXTFIELD} {...register(EMAIL_CC)} type="text" 
                    placeholder="Enter a valid vendor's Google/Yahoo email domain"/>
                </div>
                {errors[EMAIL_CC] && <span className={ERROR_MSG_SMALL}>{errors[EMAIL_CC].message}</span>}

                <div className={styles.mailingAddress}>{MAILING_ADDRESS}</div>

                <div className={LINEFORM}>
                    <label className={`${LABEL} ${styles.addressLabel}`}>{ADDRESS_LINE_1}</label>
                    <input className={TEXTFIELD} {...register(ADDRESS_LINE_1)} type="text" 
                    placeholder="Enter vendor's mailing address"/>
                </div>
                <div className={LINEFORM}>
                    <label className={`${LABEL} ${styles.addressLabel}`}>{ADDRESS_LINE_2}</label>
                    <input className={TEXTFIELD} type="text" />
                </div>
                <div className={LINEFORM}>
                    <label className={`${LABEL} ${styles.addressLabel}`}>{CITY_CC}</label>
                    <input className={TEXTFIELD} {...register(CITY_CC)}  readOnly value={city}/>
                </div>
                <div className={LINEFORM}>
                    <label className={`${LABEL} ${styles.addressLabel}`}>{STATE_CC}</label>
                    <input className={TEXTFIELD} {...register(STATE_CC)} readOnly value={state}/>
                </div>
                <div className={LINEFORM}>
                    <label className={`${LABEL} ${styles.addressLabel}`}>{ZIP_CODE}</label>
                    <input className={TEXTFIELD} {...register(ZIP_CODE)} onChange={handleZipCode} type="text" 
                    placeholder='Enter a valid zip code' />
                </div>
                {errors[ZIP_CODE] && <span className={ERROR_MSG_SMALL}>{errors[ZIP_CODE].message}</span>}
                
                <div className={`${styles.requiredLegend} ${styles.requiredLine}`}>{REQUIRED_CC}</div>
                <div className={styles.buttons}>
                <button className={styles.submitButton} type="submit">{SIGN_UP}</button>
                <button className={styles.submitButton} type="submit" onClick={handleCancel}>{CANCEL_CC}</button>
                </div> 
            </form>
        </>
    ); 
} 