"use client"

import {
    Fragment,
    useEffect,
    useRef,
    useState
} from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    FormHelperText,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GenericErrorAlert from '@/components/GenericErrorAlert';
import GenericSuccessAlert from '@/components/GenericSuccessAlert';
import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    EMAIL_CC,
    FILE_BRACKET,
    LOGO_FILE,
    LOGO_FILENAME,
    MAILING_ADDRESS,
    MENU_FILE,
    MENU_FILENAME,
    NAME_CC,
    POST,
    SIGN_UP_CC,
    STATE_CC,
    TECHNICAL_DIFFICULTIES,
    UPLOAD_LOGO_CC,
    UPLOAD_MENU_CC,
    VENDOR_BUSINESS_NAME_CC,
    VENDOR_EMAIL_CC,
    VENDOR_SIGN_UP_CC,
    ZIP_CODE_CC,
} from "@/app/lib/constants";
import { vendorSchema } from '@/app/lib/validation-schema'
import { createVendor, getZipCodeDetails, upload } from '@/app/lib/apiHelpers';




export default function CreateVendor() {
    const alertRef = useRef(null)
    const inProgressRef = useRef(null);
    const router = useRouter()
    const [city, setCity] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [disableElement, setDisableElement] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [logoFile, setLogoFile] = useState(null)
    const [menuFile, setMenuFile] = useState(null)
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false)
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [zipCodeError, setZipCodeError] = useState('')

    const methods = useForm({
        resolver: yupResolver(vendorSchema),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods

    useEffect(() => {
        if (isSaving && inProgressRef.current) {
            inProgressRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if ((openErrorAlert && alertRef.current) || (openSuccessAlert && alertRef.current)) {
            alertRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSaving, openErrorAlert, openSuccessAlert])



    const handleAlertClose = () => {
        setOpenErrorAlert(false)
        setDisableElement(false)
    }

    const handleZipCode = async (e) => {
        setZipCode(e.target.value)

        if (e.target.value.length === 5) {
            const result = await getZipCodeDetails(e.target.value)

            if (result.success) {
                setCity(result.message.city)
                setState(result.message.state)
                setZipCodeError('')
            } else {
                setZipCodeError('Invalid Zip Code. ')
            }
        } else {
            setCity('')
            setState('')
        }
    }

    const uploadFile = async () => {
        const data = new FormData()
        if (logoFile) {
            data.append(FILE_BRACKET, logoFile);
        }
        if (menuFile) {
            data.append(FILE_BRACKET, menuFile);
        }

        return await upload({
            method: POST,
            body: data
        })
    }

    async function onSubmit(data, e) {
        setDisableElement(true)
        setIsSaving(true)
        // e.preventDefault()


        const uploadResp = await uploadFile()
        if (uploadResp.success) {
            data[CITY_CC] = city
            data[LOGO_FILENAME] = uploadResp.message[0]
            data[MENU_FILENAME] = uploadResp.message[1]
            data[STATE_CC] = state

            setZipCodeError('');
            const response = await createVendor(data)
            setIsSaving(false)
            if (!zipCodeError) {
                if (response.success) {
                    setAlertMessage('Vendor profile successfully created. Please sign in using provided email.')
                    setLogoFile(null)

                    setMenuFile(null)

                    setOpenSuccessAlert(true)
                } else {
                    setAlertMessage(TECHNICAL_DIFFICULTIES)
                    setDisableElement(false)
                    setOpenErrorAlert(true)
                }
            }
        } else {
            setDisableElement(false)
            setIsSaving(false)
            setOpenErrorAlert(true)
            setAlertMessage(TECHNICAL_DIFFICULTIES)
        }
    }

    return (
        <Fragment>
            {isSaving &&
                <Stack
                    alignItems='center'>
                    <CircularProgress
                        ref={inProgressRef}
                    />
                </Stack>
            }
            {openSuccessAlert && <GenericSuccessAlert
                closeFn={() => router.push("/")}
                message={alertMessage}
                ref={alertRef}
            />}
            {openErrorAlert && <GenericErrorAlert
                closeFn={() => setOpenErrorAlert(false)}
                message={alertMessage}
                ref={alertRef}
            />}

            <Typography
                align='center'
                sx={{ color: 'common.white', marginY: '5%' }}
                variant='h3'>
                {VENDOR_SIGN_UP_CC}
            </Typography>

            <Container
                sx={{
                    backgroundColor: 'common.white',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: { xs: '20%' }
                }}
                maxWidth='xs'>

                <Box
                    sx={{ width: '100%' }}>
                    <form
                        onChange={handleAlertClose}
                        onSubmit={handleSubmit(onSubmit)}>
                        <Stack
                            direction={'column'}
                            spacing={2}
                            marginY={2}>

                            <TextField
                                disabled={disableElement}
                                error={!!errors[NAME_CC]}
                                helperText={errors[NAME_CC]?.message}
                                InputLabelProps={{ shrink: true }}
                                label={VENDOR_BUSINESS_NAME_CC}
                                required
                                size='small'
                                variant='outlined'
                                {...register(NAME_CC)} />

                            <TextField
                                disabled={disableElement}
                                error={errors[EMAIL_CC]}
                                helperText={errors[EMAIL_CC]?.message}
                                InputLabelProps={{ shrink: true }}
                                label={VENDOR_EMAIL_CC}
                                required
                                size='small'
                                variant='outlined'
                                {...register(EMAIL_CC)} />

                            <Button
                                component="label"
                                disabled={disableElement}
                                onChange={(e) => setLogoFile(e.target.files?.[0])}
                                size='small'
                                startIcon={<UploadFileIcon />}
                                variant="contained">
                                {UPLOAD_LOGO_CC}
                                <input
                                    style={{ display: 'none' }}
                                    type='file'
                                    {...register(LOGO_FILE)} />
                            </Button>

                            {!!errors[LOGO_FILE] && <FormHelperText
                                error={!!errors[LOGO_FILE]}>{errors[LOGO_FILE]?.message}
                            </FormHelperText>}

                            {logoFile && <FormHelperText
                                sx={{ overflowWrap: 'break-word' }}>
                                {`Selected logo file ${logoFile.name}`}
                            </FormHelperText>}

                            <Button
                                component="label"
                                disabled={disableElement}
                                onChange={(e) => setMenuFile(e.target.files?.[0])}
                                size='small'
                                startIcon={<UploadFileIcon />}
                                variant="contained">
                                {UPLOAD_MENU_CC}
                                <input
                                    style={{ display: 'none' }}
                                    type='file'
                                    {...register(MENU_FILE)} />
                            </Button>

                            {!!errors[MENU_FILE] && <FormHelperText
                                error={!!errors[MENU_FILE]}>{errors[MENU_FILE]?.message}
                            </FormHelperText>}

                            {menuFile && <FormHelperText
                                sx={{ overflowWrap: 'break-word' }}>{`Selected menu file ${menuFile.name}`}
                            </FormHelperText>}

                            <Divider>{MAILING_ADDRESS}</Divider>

                            <TextField
                                error={errors[ADDRESS_LINE_1]}
                                disabled={disableElement}
                                helperText={errors[ADDRESS_LINE_1]?.message}
                                InputLabelProps={{ shrink: true }}
                                label={ADDRESS_LINE_1}
                                size='small'
                                variant='outlined'
                                {...register(ADDRESS_LINE_1)} />

                            <TextField
                                disabled={disableElement}
                                error={errors[ADDRESS_LINE_2]}
                                InputLabelProps={{ shrink: true }}
                                label={ADDRESS_LINE_2}
                                size='small'
                                variant='outlined'
                                {...register(ADDRESS_LINE_2)} />

                            <TextField
                                disabled={disableElement}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                label={CITY_CC}
                                size='small'
                                value={city}
                                variant='filled'
                                {...register(CITY_CC)} />

                            <TextField
                                disabled={disableElement}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                label={STATE_CC}
                                size='small'
                                value={state}
                                variant='filled'
                                {...register(STATE_CC)} />

                            <TextField
                                disabled={disableElement}
                                error={!!errors[ZIP_CODE_CC] || zipCodeError}
                                helperText={errors[ZIP_CODE_CC]?.message || zipCodeError}
                                InputLabelProps={{ shrink: true }}
                                label={ZIP_CODE_CC}
                                onKeyUp={handleZipCode}
                                size='small'
                                variant='outlined'
                                {...register(ZIP_CODE_CC)} />

                            <Button
                                disabled={disableElement}
                                mx='auto'
                                size='small'
                                type='submit'
                                variant="contained"
                            >{SIGN_UP_CC}</Button>
                        </Stack>
                    </form>
                </Box>
            </Container>
        </Fragment>
    );
} 