
'use client'

import Link from 'next/link';
import styles from "./dropDownMenu.module.css"
import { usePathname } from 'next/navigation';

/*
    TODO:

        - make drop down content to fit content's size
*/
export default function DropDownMenu(props) {
    const pathname = usePathname()

    const list = props.menu.map(o => {
        const active = o.link === pathname ? 'active' : '';
        return <Link className={active} key={o.title} href={o.link}>{o.title}</Link>
    })
    return (

        <div className={styles.dropdown}>
            <button className={styles.dropbtn}>{props.menuName}</button>
            <div className={styles.dropdownContent}>
                {list}
            </div>
        </div>
    )
}