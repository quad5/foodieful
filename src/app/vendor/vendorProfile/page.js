
import { auth } from "@/auth";
import styles from "./vendorProfile.module.css"
import Image from "next/image";
import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    LABEL,
    STATE_CC,
    VENDOR_NAME,
    ZIP_CODE,
} from "@/app/lib/constants";

import { getVendorProfileById, getVendorUserByEmail } from "@/app/lib/apiHelpers";


export default async function Page() {
    const session = await auth();
    const venderUserResult = await getVendorUserByEmail(session.user.email)
    const vendorId = venderUserResult.message.vendorProfileId
    const vendorProfileResult = await getVendorProfileById(vendorId)

    return (
        
        <div className={styles.container}>
        
            <div className={styles.leftContainer}>
                <Image
                    src="/orange-4547207_1920.png"    // temporary image
                    alt="Picture of user"
                    width={100}
                    height={100}
                />

            </div>

            <div className={styles.rightContainer}>

                {<div className={styles.contentContainer}>
                    <div className={LABEL}>{VENDOR_NAME}:</div>
                    <div>{vendorProfileResult.message.name}</div>
                </div>}
                
                {<div className={styles.contentContainer}>
                    <div className={LABEL}>{ADDRESS_LINE_1}:</div>
                    <div>{vendorProfileResult.message.addressLine1}</div>
                </div>}

                {<div className={styles.contentContainer}>
                    <div className={LABEL}>{ADDRESS_LINE_2}:</div>
                    <div>{vendorProfileResult.message.addressLine2}</div>
                </div>}

                {<div className={styles.contentContainer}>
                    <div className={LABEL}>{CITY_CC}:</div>
                    <div>{vendorProfileResult.message.city}</div>
                </div>}

                {<div className={styles.contentContainer}>
                    <div className={LABEL}>{STATE_CC}:</div>
                    <div>{vendorProfileResult.message.state}</div>
                </div>}

                {<div className={styles.contentContainer}>
                    <div className={LABEL}>{ZIP_CODE}:</div>
                    <div>{vendorProfileResult.message.zipCode}</div>
                </div>}
            </div>
        </div>   
    )
}