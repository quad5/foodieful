"use client"

import {
    Card,
    CardContent,
    Collapse,
    Container,
    Divider,
    ListItemButton,
    ListItemIcon,
    Stack,
    Typography
} from '@mui/material';
import { Fragment, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
    ANSWER_CC,
    FREQUENTLY_ASKED_QUESTIONS_CC,
    QUESTION_CC,
} from '@/app/lib/constants'
import theme from '@/theme';

export default function Page() {
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const faq = [
        {
            [QUESTION_CC]: "What is the purpose of this website?",
            [ANSWER_CC]: "It is for food truck vendors to list their pit stop locations’ address and operating hours, and customers to search said listings by zip code.",
        },
        {
            [QUESTION_CC]: "How can food truck vendors get started listing their pit stop addresses?",
            [ANSWER_CC]: "First, they need to sign up by providing their food truck’s business name and a valid Google or Yahoo email address. Then, they use said email address to login and begin creating pit stop locations."
        },
        {
            [QUESTION_CC]: "Does this website save login’s information such as password?",
            [ANSWER_CC]: "No, we do not. Authentication is done through respective email provider (ie Google/Yahoo)."
        },
        {
            [QUESTION_CC]: "What information does Foodieful.net get from Google/Yahoo and store in our database?",
            [ANSWER_CC]: "Your public profile information such as name and image/picture."
        },
        {
            [QUESTION_CC]: "Can food truck vendors list multiple pit stop location’s addresses?",
            [ANSWER_CC]: "Yes! In addition, the site allows vendors to activate and deactivate listings."
        },
        {
            [QUESTION_CC]: "How do I select the time on the calendar?",
            [ANSWER_CC]: "You place the mouse onto the start hour and the day of the week you want, then press and hold the mouse to the end hour."
        },
        {
            [QUESTION_CC]: "Can food truck vendors list multiple pit stop location’s operating hours?",
            [ANSWER_CC]: "Yes!"
        },
        {
            [QUESTION_CC]: "How can I contact Foodieful.net for support / more information / feature request?",
            [ANSWER_CC]: "You can leave your email and a brief description in the chat widget in the right hand corner."
        },
    ]

    const handleClick = (index) => {
        if (index !== selectedIndex) {
            setSelectedIndex(index)
        } else {
            setSelectedIndex(-1)
        }
    }

    return (
        <Fragment>
            <Typography
                align='center'
                sx={{ color: 'common.white', marginY: '5%' }}
                variant='h3'>
                {FREQUENTLY_ASKED_QUESTIONS_CC}
            </Typography>
            <Container
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: { xs: '20%' }
                }}
                maxWidth='sm'
                disableGutters>
                <Card
                    sx={{
                        display: 'flex',
                        mx: 'auto'
                    }}>
                    <CardContent>
                        {faq.map((i, index) => (
                            <Stack
                                key={index}
                                spacing={3}
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: 'common.white',
                                }}>
                                <Stack
                                    direction='column'
                                    display='flex'
                                    flex={1}>
                                    <ListItemButton
                                        onClick={() => handleClick(index)}>
                                        <Typography
                                            align='left'
                                            sx={{ color: 'common.black', marginTop: 4 }}
                                            variant='h5'>
                                            {i[QUESTION_CC]}
                                        </Typography>
                                        <ListItemIcon
                                            sx={{ marginLeft: 'auto' }}>
                                            {index === selectedIndex ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                                        </ListItemIcon>
                                    </ListItemButton>

                                    <Collapse
                                        in={index === selectedIndex}
                                        timeout="auto" unmountOnExit>
                                        <Typography
                                            sx={{
                                                backgroundColor: theme.palette.secondary.main,
                                                color: 'common.black',
                                                paddingY: 3,
                                                paddingLeft: 5
                                            }}
                                            variant='h5'>
                                            {i[ANSWER_CC]}
                                        </Typography>
                                    </Collapse>
                                </Stack>
                                <Divider
                                    orientation="horizontal"
                                    flexItem
                                    sx={{
                                        borderBottomWidth: index < faq.length - 1 ? 10 : 0,
                                        borderColor: 'white'
                                    }} />
                            </Stack>
                        ))}
                    </CardContent>
                </Card>
            </Container>
        </Fragment>
    )
}