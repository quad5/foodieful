import Image from 'next/image'
import Link from "next/link";
import styles from "./menu.module.css"
import DropDownMenu from "@/components/DropDownMenu/DropDownMenu"
import { auth } from "@/auth"
import SignIn from "../SignIn";
import SignOut from "../SignOut";
import SignUp from '../SignUp';
import { companyMenu } from "@/app/lib/menus";
import { COMPANY, VENDOR_MENU } from "@/app/lib/constants";
import { vendorMenu } from "@/app/lib/menus";

export default async function Menu() {
    const session = await auth();

    return (

        <div className={styles.top}>
            <img className={styles.logo} src="/orange-4547207_1920.png" alt="See ya @ the food truck"/>
            
            {/* <Link  className={styles.logo} href="/">
                {<Image   src="/orange-4547207_1920.png" alt="See ya @ the food truck" width={10} height={20}/>}
            </Link> */}


            

            <div className={styles.menu}>
                <div className={styles.menuItem}>
                    <DropDownMenu menuName={COMPANY} menu={companyMenu()}/>
                    {session && <DropDownMenu menuName={VENDOR_MENU} menu={vendorMenu()}/>}
                    {!session && <SignUp/>}
                    {!session && <SignIn/>}
                    {session && <SignOut/>}
                </div>
            </div>
            
        </div> 
    )
}