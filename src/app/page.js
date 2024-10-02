'use client'

import {
    Fragment,
    useEffect,
    useRef,
    useState
} from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
    Backdrop,
    Box,
    CircularProgress,
    IconButton,
    Stack,
    TextField,
    Typography
} from '@mui/material';

import {
    getLocationsURL,
    getZipCodeDetails,
} from "@/app/lib/apiHelpers"
import {
    DEVELOPMENT,
    PRODUCTION,
    ZIP_CODE_CC
} from '@/app/lib/constants';
import { zipCodeSchema } from '@/app/lib/validation-schema'

import Pagination from '@/components/Pagination';
import ListingCard from '@/components/ListingCard';

import { Button } from '@mui/base';
import {
    createFoler,
    deleteFile,
    listFiles
} from '@/app/lib/google';


export default function HomePage() {
    const inProgressRef = useRef(null)
    const [errorContent, setErrorContent] = useState('')
    const [isFetching, setIsFetching] = useState(false)
    const [zipCode, setZipCode] = useState('')

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await getUserLocation()
    //         setZipCode(result.postal)
    //     }

    //     fetchData().catch((e) => {
    //         console.log("__getUserLocation error", e)
    //     })
    // }, [])

    useEffect(() => {
        if (isFetching && inProgressRef.current) {
            inProgressRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isFetching])

    {/* TODO - remove once a management page has been created. */ }
    const handleDrive = () => {
        //createFoler(PRODUCTION)

        // [].forEach(async (id) => {
        //         console.log("__deleting value", id)
        //         await new Promise(resolve => setTimeout(resolve, 3000));
        //         deleteFile(id)
        //     })

        //listFiles()
    }

    const handleZipCode = async (e) => {

        if (e.target.value.length === 5) {
            setIsFetching(true)
            const result = await getZipCodeDetails(e.target.value)
            setIsFetching(false)
            if (result.success) {

                setErrorContent('')
                setZipCode(e.target.value)
            } else {
                setErrorContent('Invalid Zip Code. ')

            }
        } else {
            try {
                await zipCodeSchema.validate({ [ZIP_CODE_CC]: e.target.value })
            } catch (error) {
                const splitted = error.toString().split(':')
                splitted.shift()
                setErrorContent(splitted.join(' '))
            }
        }

        if (e.target.value.length === 0) {
            setErrorContent('')
            setZipCode('')
        }
    }

    return (
        <Fragment>
            {/* TODO - remove once a management page has been created. */}
            {/* <Button onClick={handleDrive}>
                Click to list files
            </Button> */}
            <div>
                <Backdrop
                    open={isFetching}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress ref={inProgressRef} />
                </Backdrop>
            </div>

            <Stack
                direction={'column'}
                sx={{
                    backgroundColor: 'white',
                    borderRadius: 1,
                    display: 'flex',
                    marginTop: { sm: '15%', xs: '40%' },
                    mx: 'auto',
                    paddingX: 1,
                    textAlign: 'center',
                    width: { xs: '100%', sm: '60%' }
                }}>

                <Typography variant='body' sx={{ marginTop: 1, marginX: 1 }}>
                    Enter a valid zip code to search for food truck{`'`}s locations and hours
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                    }}>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>

                    {/* This TextField is causing "Warning: Extra attributes from the server: data-ddg-inputtype" on DuckDuckGo browser */}
                    <TextField
                        disabled={isFetching}
                        error={!!errorContent}
                        helperText={errorContent}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleZipCode}
                        sx={{
                            backgroundColor: "white",
                            color: 'black',
                            width: '100%',
                            marginRight: 2,
                            marginY: 2,
                            marginLeft: 1
                        }}
                    />
                </Box>
            </Stack>

            {zipCode && <Pagination api={getLocationsURL(zipCode)} card={ListingCard} />}
        </Fragment>
    )
}