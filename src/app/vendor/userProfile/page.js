import { auth } from "@/auth";
import styles from "./userProfile.module.css"
import Image from "next/image";
import { EMAIL_CC, NAME_CC } from "@/app/lib/constants";


export default async function Page() {
    const session = await auth();
    const image = session.user.image

    return (
        
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                <Image
                    src={session.user.image}
                    alt="Picture of user"
                    width={100}
                    height={100}
                />

            </div>

            <div className={styles.rightContainer}>
                {<div className={styles.nameContainer}>
                    <div className={styles.label}>{NAME_CC}:</div>
                    <div>{session.user.name}</div>
                </div>}

                {<div className={styles.emailContainer}>
                    <div className={styles.label}>{EMAIL_CC}:</div>
                    <div>{session.user.email}</div>
                </div>}
            </div>
        </div>
    )
}