'use client'

import { Fragment, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Collapse,
    Divider,
    Icon,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { getFileExtension, hyphenatePhoneNumber } from "@/app/lib/utils";
import {
    FOOD_MENU_CC,
    OPERATING_HOURS_CC,
    PHONE_NUMBER_CC,
    PIT_STOP_ADDRESS_CC,
} from "@/app/lib/constants"
import {
    DB_ADDRESS_LINE_1,
    DB_CITY,
    DB_LOGO_FILENAME,
    DB_MENU_FILENAME,
    DB_NAME,
    DB_PHONE_NUMBER,
    DB_STATE,
    DB_VENDOR_PROFILE,
    DB_ZIP_CODE
} from "@/app/lib/dbFieldConstants"


import { convertToOperatingHours } from '@/app/lib/fullCalendar/event-utils'

export default function ListingCard(props) {
    const [open, setOpen] = useState(false)
    const data = props.data
    const operatingHours = convertToOperatingHours(data.schedule)

    const handleCardClick = () => {
        setOpen(!open)
    }

    return (
        <Fragment>
            <Card
                className="listing-card-wrapper"
                sx={{
                    flexGrow: 1,
                    maxHeight: '100%',
                }}>
                <CardActionArea onClick={handleCardClick}>
                    <CardContent>
                        <Stack
                            direction='row'
                            display={'flex'}
                            spacing={2}>

                            {getFileExtension(data[DB_VENDOR_PROFILE][DB_LOGO_FILENAME]) ? <CardMedia
                                alt="vendor-logo"
                                component="img"
                                image={`/${getFileExtension(data[DB_VENDOR_PROFILE][DB_LOGO_FILENAME])}/${data[DB_VENDOR_PROFILE][DB_LOGO_FILENAME]}`}
                                sx={{
                                    height: 50,
                                    objectFit: 'contain',
                                    width: 50
                                }} /> :
                                <Icon
                                    className="listing-card-no-logo"
                                    sx={{
                                        height: 50,
                                        width: 50
                                    }}>
                                    <ImageNotSupportedIcon fontSize='large' />
                                </Icon>}

                            <Typography
                                className="listing-card-vendor-name"
                                variant='h6'>
                                {data[DB_VENDOR_PROFILE][DB_NAME]}
                            </Typography>
                        </Stack>

                        <Collapse
                            in={open}
                            timeout="auto"
                            unmountOnExit>

                            <Stack spacing={2}>
                                <Divider
                                    className="listing-card-phone-number-divider"
                                    sx={{ fontSize: 'medium' }}>{PHONE_NUMBER_CC}</Divider>
                                <ListItem>
                                    <ListItemIcon>
                                        <PhoneIcon fontSize='large' />
                                    </ListItemIcon>
                                    <ListItemText
                                        className="listing-card-phone-number"
                                        primary={hyphenatePhoneNumber(data[DB_VENDOR_PROFILE][DB_PHONE_NUMBER])} />
                                </ListItem>

                                <Divider
                                    className="listing-card-address-divider"
                                    sx={{ fontSize: 'medium' }}>{PIT_STOP_ADDRESS_CC}</Divider>
                                <ListItem>
                                    <ListItemIcon>
                                        <PlaceIcon fontSize='large' />
                                    </ListItemIcon>
                                    <Box direction={'row'}>
                                        <ListItemText
                                            className='listing-card-address1'
                                            primary={data[DB_ADDRESS_LINE_1]} />
                                        <ListItemText
                                            className="listing-card-city-state-zipcode"
                                            primary={`${data[DB_CITY]}, ${data[DB_STATE]} ${data[DB_ZIP_CODE]}`} />
                                    </Box>
                                </ListItem>

                                <Divider
                                    className="listing-card-operating-hours-divider"
                                    sx={{ fontSize: 'medium' }}>{OPERATING_HOURS_CC}</Divider>
                                <ListItem>
                                    <ListItemIcon>
                                        <ScheduleIcon fontSize='large' />
                                    </ListItemIcon>
                                    <Box>
                                        {operatingHours.map((i, index) => {
                                            return <ListItemText primary={`${i.day}: ${i.time}`} key={index} />
                                        })}
                                    </Box>
                                </ListItem>
                            </Stack>
                        </Collapse>
                    </CardContent>
                </CardActionArea>
                <Button
                    className="listing-card-menu"
                    disabled={!data[DB_VENDOR_PROFILE][DB_MENU_FILENAME]}
                    fullWidth
                    href={data[DB_VENDOR_PROFILE][DB_MENU_FILENAME] && `/${getFileExtension(data[DB_VENDOR_PROFILE][DB_MENU_FILENAME])}/${data[DB_VENDOR_PROFILE][DB_MENU_FILENAME]}`}
                    size='small'
                    sx={{ marginBottom: 3 }}
                    target="_blank"
                    variant="contained">
                    {FOOD_MENU_CC}
                </Button>
            </Card>
        </Fragment>
    )
}


