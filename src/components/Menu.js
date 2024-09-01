'use client'

import {
    Fragment,
    useEffect,
    useState,
} from 'react';
import {
    signOut,
    useSession
} from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation'
import {
    AppBar,
    Box,
    Card,
    CardActionArea,
    CardMedia,
    Drawer,
    IconButton,
    Stack,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
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
import theme from '@/theme';


export default function Menu() {
    const pathname = usePathname()
    const router = useRouter();
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);

    // This useEffect is set to close menu when user jumps to different page.
    // TODO: BUG - doesn't close menu when user selects an option on the menu that is of current/same path/page.
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    const handleClickAway = () => {
        setOpen(false)
    }

    const menus = () => {
        return (
            <>

                <DropDownMenu
                    fn={() => { router.push('/faq') }}
                    menu={companyMenu()}
                    menuName={COMPANY_CC}
                    singleLevel={false} />

                {
                    session && <DropDownMenu
                        menu={vendorMenu()}
                        menuName={VENDOR_MENU_CC}
                        singleLevel={false} />
                }

                {
                    !session && <SignIn
                        fn={signInHelperFn}
                        title={VENDOR_SIGN_IN_CC} />
                }

                {
                    !session && <DropDownMenu
                        fn={() => { router.push('/create-vendor') }}
                        menu={[]}
                        menuName={VENDOR_SIGN_UP_CC}
                        singleLevel={true} />
                }

                {
                    session && <DropDownMenu
                        fn={() => signOut()}
                        menu={[]}
                        menuName={SIGN_OUT_CC}
                        singleLevel={true} />
                }
            </>
        )
    }

    return (
        <Fragment>
            <AppBar position="static" sx={{ flexDirection: 'row' }}>
                <Card
                    square={true}
                    sx={{ marginLeft: 4 }}>

                    <CardActionArea onClick={() => router.push("/")}>
                        <CardMedia
                            component="img"
                            image="/logo.png"
                            sx={{
                                height: 100,
                                width: 100,


                            }}
                        />
                    </CardActionArea>
                </Card>

                <IconButton
                    onClick={() => setOpen(true)}
                    sx={{
                        display: { xs: 'flex', sm: 'none' },
                        marginRight: 'auto',
                        paddingLeft: 2
                    }}>
                    <MenuIcon />
                </IconButton>

                <Drawer
                    anchor='top'
                    open={open}
                    PaperProps={{
                        sx: {
                            backgroundColor: theme.palette.primary.main
                        }
                    }}>

                    {<ClickAwayListener onClickAway={handleClickAway}>
                        <Stack

                            marginY={2}
                            direction={'row'}
                            marginLeft={'auto'}
                            marginRight={{ xs: 'auto', md: 0 }}
                            paddingX={4}
                            spacing={2}>

                            {menus()}
                        </Stack>
                    </ClickAwayListener>}
                </Drawer>

                <Stack

                    marginY={2}
                    direction={'row'}
                    display={{ xs: 'none', sm: 'flex' }}
                    marginLeft={'auto'}
                    marginRight={{ xs: 'auto', md: 0 }}
                    paddingX={4}
                    spacing={2}>

                    {menus()}
                </Stack>
            </AppBar>
        </Fragment>
    )
}
