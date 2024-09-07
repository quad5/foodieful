"use client";

import {
    Fragment,
    useEffect,
    useRef,
    useState
} from "react";
import MPagination from '@mui/material/Pagination';
import {
    Box,
    Grid,
    Typography
} from '@mui/material'
import GenericErrorAlert from "./GenericErrorAlert";

import {
    GET,
    LIMIT,
    NO_LISTING_FOUND_CC,
    OFFSET,
    TECHNICAL_DIFFICULTIES,
    TOTAL_COUNT,
} from "@/app/lib/constants"
import { genericAPICall } from "@/app/lib/apiHelpers";

export default function Pagination(props) {

    const alertRef = useRef(null)
    const [data, setData] = useState({ message: [] })
    const [offset, setOffset] = useState(0);
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [totalCount, setTotalCount] = useState(-1)
    const Component = props.card
    const limit = 10

    useEffect(() => {
        const fetchData = async () => {
            const result = await genericAPICall(`${props.api}&${TOTAL_COUNT}=true`, GET)
            result.success ? setTotalCount(result.message) : setOpenErrorAlert(true)
        }

        fetchData()
    }, [props])

    useEffect(() => {
        const fetchData = async () => {
            const result = await genericAPICall(`${props.api}&${LIMIT}=${limit}&${OFFSET}=${offset}`, GET)
            result.success ? setData(result.message) : setOpenErrorAlert(true)
        }

        fetchData()
    }, [props, offset])

    useEffect(() => {
        if (openErrorAlert && alertRef.current) {
            alertRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [openErrorAlert])

    const handlePaginationClick = (e, selectedPageNumber) => {
        setOffset((selectedPageNumber * limit) - limit)
    }

    return (
        <Fragment>
            {openErrorAlert && <GenericErrorAlert
                closeFn={() => { setOpenErrorAlert(false) }}
                message={TECHNICAL_DIFFICULTIES}
                ref={alertRef} />}
            {totalCount == 0 && <Typography
                align="center"
                mt={4}
                variant="h5"
                sx={{ color: "white" }}>
                {NO_LISTING_FOUND_CC}
            </Typography>}

            <Box
                display="flex"
                justifyContent="center"
                my={4}>

                {<MPagination
                    color="primary"
                    count={Math.ceil(totalCount / limit)}
                    onChange={handlePaginationClick} />}
            </Box>

            <Grid
                container
                marginBottom={'20%'}
                spacing={2}
                sx={{
                    justifyContent: 'center',
                    px: 4
                }}>

                {data.length > 0 && data.map((i, index) => (
                    <Grid
                        key={index}
                        item
                        xs={'auto'}
                        style={{ width: 410 }}>
                        <Component data={i} />
                    </Grid>
                ))}
            </Grid>
        </Fragment>
    );
}