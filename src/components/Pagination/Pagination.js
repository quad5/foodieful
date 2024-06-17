"use client";


import React, { useEffect, useState } from "react";
import styles from "./pagination.module.css";
import {
    GET
} from "@/app/lib/constants"
import { genericAPICall } from "@/app/lib/apiHelpers";
import { TECHNICAL_DIFFICULTIES } from "@/app/lib/constants";


const PREVIOUS_DISABLED = "previous_disabled";
const PREVIOUS_ENABLED = "";
const NEXT_DISABLED = "next_disabled";
const NEXT_ENABLED = "";

export default function Pagination (props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState({message: []})
    const [nextButtonDisabled, setNextButtonDisabled] = useState(NEXT_ENABLED);
    const [offset, setOffset] = useState(0);
    const [previousButtonDisabled, setPreviousButtonDisabled] = useState(PREVIOUS_DISABLED);

    const api = props.api;
    const Component = props.card
    const limit = 2
    const url = process.env.NEXT_PUBLIC_URL;

    useEffect(() => {
        const fetchData = async () => {
            const result = await genericAPICall(`${api}&limit=${limit}&offset=${offset}`, GET)
            if (result.success) {
                setData(result);
            } else {
                alert(TECHNICAL_DIFFICULTIES)
            }
        }
     
        fetchData().catch((e) => {
            alert(TECHNICAL_DIFFICULTIES)
        })
    }, [props, offset])

    const handlePrevious = async(e) => {
        if (currentPage > 1) {
            if (currentPage - 1 === 1) {
                setPreviousButtonDisabled(PREVIOUS_DISABLED);
                setOffset(0);
                setCurrentPage(currentPage - 1)
            } else {
                setOffset((currentPage - 2) * limit);
                setCurrentPage(currentPage - 1);
            }

            // if ((currentPage - 1) < Math.ceil(totalRecords/limit)) {
            //     setNextButtonDisabled(NEXT_ENABLED);
            // }
        }
    }
    
    const handleNext = async(e) => {
        if (currentPage + 1 === 2) {
            setPreviousButtonDisabled(PREVIOUS_ENABLED);
        }
        // if ((currentPage + 2) > Math.ceil(totalRecords/limit)) {
        //     setNextButtonDisabled(NEXT_DISABLED);
        // }
        setOffset(currentPage * limit);
        setCurrentPage(currentPage + 1);
    }


    return (
        <div>
            {data.message.length == 0 && <div className={styles.zeroListing}>No listing found in your area</div>}

            <div className={styles.pagination}>
                <button className={`${styles.previous} ${previousButtonDisabled}`} onClick={handlePrevious}>Previous</button>
                <div className={styles.pageNumber}>{currentPage}</div>
                <button className={`${styles.next} ${nextButtonDisabled}`} onClick={handleNext}>Next</button>
            </div>

            <div className={styles.listings}>
                {data.message.length > 0 && data.message.map((item, index) => (
                    <ul key={index}>
                        <Component data={item}/>
                    </ul>
                ))}
            </div>

            {/* // This works when component is SSR. Doesn't work as Client component
            <div className={styles.pagination}>
                <form action={handlePrevious}>
                    <button className={styles.previous}>Previous</button>
                </form>
                <div className={styles.pageNumber}>Current Page Number</div>
                <form action={handleNext}>
                    <button className={styles.next}>Next</button>
                </form>
            </div> */}

        </div>
    );
}