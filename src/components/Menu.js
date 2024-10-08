'use client'

import { usePathname, useRouter } from 'next/navigation'

import {
    signOut,
    useSession
} from 'next-auth/react';

import {
    Fragment,
    useEffect,
    useState,
} from 'react';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

import {
    AppBar,
    Card,
    CardActionArea,
    CardMedia,
    Drawer,
    IconButton,
    Stack,
} from '@mui/material'

import { signInHelperFn } from '@/app/lib/accessHelpers'
import {
    ABOUT_CC,
    MANAGE_MY_LISTINGS_CC,
    MODE,
    SIGN_OUT_CC,
    VENDOR_SIGN_IN_CC,
    VENDOR_SIGN_UP_CC,
    VIEW
} from "@/app/lib/constants";
import { aboutMenu } from "@/app/lib/menus";

import DropDownMenu from "@/components/DropDownMenu"
import SignIn from "@/components/SignIn";

import theme from '@/theme';


export default function Menu() {
    const _100px = 100  // appbar, image, and drawer shares this value
    const pathname = usePathname()
    const router = useRouter();
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);

    // This useEffect is set to close menu when user jumps to different page.
    // TODO: BUG - FOOD-5 - doesn't close menu when user selects an option on the menu that is of current/same path/page.
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
                    menu={aboutMenu()}
                    menuName={ABOUT_CC}
                    singleLevel={false} />

                {
                    session && <DropDownMenu
                        fn={() => { router.push('/vendor') }}
                        menu={[]}
                        menuName={MANAGE_MY_LISTINGS_CC}
                        singleLevel={true}
                    />
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
            <AppBar position="static" sx={{ flexDirection: 'row', height: _100px }}>
                <Card
                    square={true}
                    sx={{ marginLeft: 4 }}>

                    <CardActionArea onClick={() => router.push("/")}>
                        <CardMedia
                            className='menu-foodieful-logo'
                            alt='foodieful-logo'
                            component="img"
                            image="/logo.png"
                            sx={{
                                height: _100px,
                                width: _100px,
                            }}
                        />
                    </CardActionArea>
                </Card>

                <IconButton
                    className='menu-icon'
                    onClick={() => setOpen(true)}
                    sx={{
                        display: { xs: 'flex', sm: 'none' },
                        marginRight: 'auto',
                        paddingLeft: 2
                    }}>
                    <MenuIcon fontSize='large' />
                </IconButton>

                <Drawer
                    anchor='top'
                    className='menu-drawer'
                    open={open}
                    PaperProps={{
                        sx: {
                            backgroundColor: theme.palette.primary.main,
                            height: _100px
                        }
                    }}>

                    {<ClickAwayListener onClickAway={handleClickAway}>
                        <Stack
                            className='menu-menus'
                            direction={'row'}
                            display={{ xs: 'flex', sm: 'none' }}
                            marginLeft={'auto'}
                            marginRight={{ xs: 'auto', md: 0 }}
                            marginY={'auto'}
                            paddingX={1}
                            spacing={1}>
                            {menus()}
                        </Stack>
                    </ClickAwayListener>}
                </Drawer>

                {status !== 'loading' && <Stack
                    className='menu-menus'
                    direction={'row'}
                    display={{ xs: 'none', sm: 'flex' }}
                    marginLeft={'auto'}
                    marginRight={{ xs: 'auto', md: 0 }}
                    marginY={'auto'}
                    paddingX={{ xs: 1, md: 4 }}
                    spacing={1}>
                    {menus()}
                    {session && <IconButton
                        className='menu-account-icon'
                        onClick={() => router.push(`/vendor/profile?${MODE}=${VIEW}`)}>
                        <AccountCircleIcon fontSize='large' />
                    </IconButton>}
                </Stack>}

                {session && <IconButton
                    className='menu-account-icon'
                    href={`/vendor/profile?${MODE}=${VIEW}`} sx={{ display: { xs: 'flex', sm: 'none' }, mr: 1 }}>
                    <AccountCircleIcon fontSize='large' />
                </IconButton>}
            </AppBar>
        </Fragment>
    )
}
