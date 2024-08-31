'use client'

import {
    Fragment,
} from 'react';
import {
    signOut,
    useSession
} from 'next-auth/react';
import { useRouter } from 'next/navigation'
import {
    AppBar,
    Box,
    Card,
    CardActionArea,
    CardMedia,
    Container,
    Stack,
    Toolbar,
} from '@mui/material'
import DropDownMenu from "@/components/DropDownMenu"
import SignIn from "./SignIn";
import { signInHelperFn } from '@/app/lib/accessHelpers'
import {
    COMPANY_CC,
    SIGN_OUT_CC,
    VENDOR_MENU_CC,
    VENDOR_SIGN_IN_CC,
    VENDOR_SIGN_UP_CC
} from "@/app/lib/constants";
import { companyMenu, vendorMenu } from "@/app/lib/menus";


export default function Menu() {

    const { data: session, status } = useSession();
    const router = useRouter();

    return (
        <Fragment>
            <AppBar position="static">
                <Container maxWidth="xl" sx={{ paddingX: 0 }}>
                    <Toolbar sx={{
                        marginY: { xs: 2, sm: 0 }, paddingX: 0
                    }}>
                        <Card
                            square={true}
                            sx={{ marginLeft: { xs: 0, sm: 1 } }}>

                            <CardActionArea onClick={() => router.push("/")}>
                                <CardMedia
                                    component="img"
                                    image="/logo.png"
                                    sx={{
                                        height: 64,
                                        width: 64
                                    }} />
                            </CardActionArea>
                        </Card>

                        {/* KEEP!! */}
                        {/* <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(true)}
                            sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' } }}>
                            <MenuIcon />
                        </IconButton> */}


                        {/* <Drawer open={open} onClose={() => setOpen(false)}>
                            

                            <DropDownMenu fn={() => { router.push('/faq') }} menu={[]} menuName={FAQS} singleLevel={true} />
                            {session && <DropDownMenu menu={vendorMenu()} menuName={VENDOR_MENU} singleLevel={false} />}
                            {!session && <SignIn fn={signInHelperFn} title={VENDOR_SIGN_IN} />}
                            {!session && <DropDownMenu fn={() => { router.push('/create-vendor') }} menu={[]} menuName={VENDOR_SIGN_UP} singleLevel={true} />}
                            {session && <DropDownMenu fn={() => signOut()} menu={[]} menuName={SIGN_OUT} singleLevel={true} />}

                        </Drawer> */}


                        <Stack
                            direction={'row'}
                            marginLeft={'auto'}
                            marginRight={{ xs: 'auto', md: 0 }}
                            paddingX={0.5}
                            spacing={{ xs: 0.5, sm: 2 }}>

                            <DropDownMenu
                                fn={() => { router.push('/faq') }}
                                menu={companyMenu()}
                                menuName={COMPANY_CC}
                                singleLevel={false} />

                            {session && <DropDownMenu
                                menu={vendorMenu()}
                                menuName={VENDOR_MENU_CC}
                                singleLevel={false} />}

                            {!session && <SignIn
                                fn={signInHelperFn}
                                title={VENDOR_SIGN_IN_CC} />}

                            {!session && <DropDownMenu
                                fn={() => { router.push('/create-vendor') }}
                                menu={[]}
                                menuName={VENDOR_SIGN_UP_CC}
                                singleLevel={true} />}

                            {session && <DropDownMenu
                                fn={() => signOut()}
                                menu={[]}
                                menuName={SIGN_OUT_CC}
                                singleLevel={true} />}
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>
        </Fragment>
    )
}




