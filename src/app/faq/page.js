'use client'

import { Fragment } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography
} from '@mui/material';

import {
    ANSWER_CC,
    FREQUENTLY_ASKED_QUESTIONS_CC,
    QUESTION_CC,
} from '@/app/lib/constants'

import theme from '@/theme';


export default function FAQ() {

    const faq = [
        {
            [QUESTION_CC]: "What is the purpose of this website?",
            [ANSWER_CC]: "It is for food truck vendors to list their pit stop locations’ address and operating hours, and customers to search said listings by zip code.",
        },
        {
            [QUESTION_CC]: "Which country is this made for?",
            [ANSWER_CC]: "Currently this website is available only in the United States."
        },
        {
            [QUESTION_CC]: "Why am I seeing no listing in my area?",
            [ANSWER_CC]: "Please understand that this is a new website. We are building out our database by reaching out to food truck vendors to sign up and list on our website."
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
            [ANSWER_CC]: "We get your public profile information such as name and image, BUT we do NOT store those in our database."
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
            [QUESTION_CC]: "Where can I create an SVG file for my food truck's logo?",
            [ANSWER_CC]: "We recommend checking out canva.com because they have a lot of free features, free designs, and simple to use."
        },
        {
            [QUESTION_CC]: "How can I contact Foodieful.net for support / more information / features request?",
            [ANSWER_CC]: "You can leave your email and a brief description in the chat widget in the bottom right corner. Or send an email to 'support@foodieful.net'."
        },
    ]

    return (
        <Fragment>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginX: 'auto',
                    maxWidth: 'sm',
                    paddingX: { xs: 2, md: 0 }
                }}>
                <Typography
                    align='center'
                    className='faq-header'
                    sx={{ color: 'white', marginY: '5%' }}
                    variant='h3'>
                    {FREQUENTLY_ASKED_QUESTIONS_CC}
                </Typography>

                {faq.map((i, index) => (
                    <Accordion
                        className='faq-wrapper'
                        key={index}>
                        <AccordionSummary
                            className={`faq-question-${index}`}
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ backgroundColor: index % 2 === 0 ? theme.palette.primary.main : 'white' }}>

                            {i[QUESTION_CC]}
                        </AccordionSummary>

                        <AccordionDetails
                            className={`faq-answer-${index}`}
                            sx={{
                                backgroundColor: theme.palette.secondary.main,
                            }}>

                            {i[ANSWER_CC]}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Fragment>
    )
}