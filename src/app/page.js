'use client'

import {
    Fragment,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    Backdrop,
    Box,
    CircularProgress,
    Container,
    IconButton,
    TextField
} from '@mui/material';
import Pagination from '@/components/Pagination';
import ListingCard from '@/components/ListingCard';
import {
    ZIP_CODE_CC
} from './lib/constants';
import {
    getLocationsURL,
    getZipCodeDetails
} from "@/app/lib/apiHelpers"
import SearchIcon from '@mui/icons-material/Search';
import { zipCodeSchema } from '@/app/lib/validation-schema'

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
            <div>
                <Backdrop
                    open={isFetching}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress ref={inProgressRef} />
                </Backdrop>
            </div>

            <Container
                maxWidth='sm'
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: { md: '15%', xs: '50%' }
                }}>
                <Box
                    sx={{
                        backgroundColor: "common.white",
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
                        label="Enter a zip code to search for food truck's locations and hours"
                        onChange={handleZipCode}
                        sx={{
                            backgroundColor: "common.white",
                            color: 'black',
                            width: '100%',
                            marginRight: 2,
                            marginY: 2,
                        }}
                    />
                </Box>
            </Container>
            {zipCode && <Pagination api={getLocationsURL(zipCode)} card={ListingCard} />}
        </Fragment>
    )
}