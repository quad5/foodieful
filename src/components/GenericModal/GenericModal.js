'use client'

import styles from "./genericModal.module.css"
import { CLOSE_CC, SHOW_MODAL } from "@/app/lib/constants"
import { useRouter } from 'next/navigation'


export default function GenericModal(props) {


    const router = useRouter();
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {props.content}

                <form action={async () => {
                    localStorage.removeItem(SHOW_MODAL)
                    router.refresh()
                }}>
                    
                    <button className={styles.closeButton} type="submit">{CLOSE_CC}</button> 
                </form>
            </div>
        </div>
    )
}