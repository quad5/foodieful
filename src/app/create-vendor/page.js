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
    Backdrop,
    Button,
    CircularProgress,
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
    PHONE_NUMBER_CC,
    POST,
    SIGN_UP_CC,
    STATE_CC,
    TECHNICAL_DIFFICULTIES,
    UPLOAD_LOGO_CC,
    UPLOAD_FOOD_MENU_CC,
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
    const [processingZipcode, setProcessingZipcode] = useState(false)
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
            setProcessingZipcode(true)
            const result = await getZipCodeDetails(e.target.value)
            setProcessingZipcode(false)

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
        e.preventDefault()
        setOpenErrorAlert(false)
        setDisableElement(true)
        setIsSaving(true)

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
                    setDisableElement(false)
                    setOpenErrorAlert(true)
                }
            }
        } else {
            setDisableElement(false)
            setIsSaving(false)
            setOpenErrorAlert(true)
        }
    }

    return (
        <Fragment>
            <div>
                <Backdrop
                    className='create-vendor-progress-wrapper'
                    open={isSaving}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress
                        className='create-vendor-progress'
                        ref={inProgressRef} />
                </Backdrop>
            </div>

            {openSuccessAlert && <GenericSuccessAlert
                closeFn={() => router.push("/")}
                message={alertMessage}
                ref={alertRef} />}

            {openErrorAlert && <GenericErrorAlert
                closeFn={() => setOpenErrorAlert(false)}
                message={TECHNICAL_DIFFICULTIES}
                ref={alertRef} />}

            <Typography
                align='center'
                className='create-vendor-header'
                sx={{ color: 'white', marginBottom: 4 }}
                variant='h3'>
                {VENDOR_SIGN_UP_CC}
            </Typography>

            <Stack
                className='create-vendor-wrapper'
                direction={'column'}
                sx={{
                    backgroundColor: 'white',
                    display: 'flex',
                    mx: 'auto',
                    paddingX: 2,
                    width: { xs: '100%', sm: '60%', md: '40%' }
                }}>

                <form
                    onChange={handleAlertClose}
                    onSubmit={handleSubmit(onSubmit)}>
                    <Stack
                        className='create-vendor-form'
                        direction={'column'}
                        spacing={2}
                        marginY={4}>

                        <TextField
                            className='create-vendor-name'
                            disabled={disableElement}
                            error={errors[NAME_CC]}
                            helperText={errors[NAME_CC]?.message}
                            InputLabelProps={{ shrink: true }}
                            label={VENDOR_BUSINESS_NAME_CC}
                            size='small'
                            variant='outlined'
                            {...register(NAME_CC)} />

                        <TextField
                            className='create-vendor-email'
                            disabled={disableElement}
                            error={errors[EMAIL_CC]}
                            helperText={errors[EMAIL_CC]?.message}
                            InputLabelProps={{ shrink: true }}
                            label={VENDOR_EMAIL_CC}
                            size='small'
                            variant='outlined'
                            {...register(EMAIL_CC)} />

                        <TextField
                            className='create-vendor-phone-number'
                            disabled={disableElement}
                            error={errors[PHONE_NUMBER_CC]}
                            helperText={errors[PHONE_NUMBER_CC]?.message}
                            InputLabelProps={{ shrink: true }}
                            label={PHONE_NUMBER_CC}
                            size='small'
                            variant='outlined'
                            {...register(PHONE_NUMBER_CC)} />

                        <Button
                            className='create-vendor-upload-logo'
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

                        {errors[LOGO_FILE] && <FormHelperText
                            className='create-vendor-logo-error'
                            error={errors[LOGO_FILE]}>{errors[LOGO_FILE]?.message}
                        </FormHelperText>}

                        {logoFile && <FormHelperText
                            className='create-vendor-selected-logo'
                            sx={{ overflowWrap: 'break-word' }}>
                            {`Selected logo file ${logoFile.name}`}
                        </FormHelperText>}

                        <Button
                            className='create-vendor-upload-menu'
                            component="label"
                            disabled={disableElement}
                            onChange={(e) => setMenuFile(e.target.files?.[0])}
                            size='small'
                            startIcon={<UploadFileIcon />}
                            variant="contained">
                            {UPLOAD_FOOD_MENU_CC}
                            <input
                                style={{ display: 'none' }}
                                type='file'
                                {...register(MENU_FILE)} />
                        </Button>

                        {errors[MENU_FILE] && <FormHelperText
                            className='create-vendor-menu-error'
                            error={errors[MENU_FILE]}>{errors[MENU_FILE]?.message}
                        </FormHelperText>}

                        {menuFile && <FormHelperText
                            className='create-vendor-selected-menu'
                            sx={{ overflowWrap: 'break-word' }}>{`Selected menu file ${menuFile.name}`}
                        </FormHelperText>}

                        <Divider className='create-vendor-divider-address'>{MAILING_ADDRESS}</Divider>

                        <TextField
                            className='create-vendor-address1'
                            error={errors[ADDRESS_LINE_1]}
                            disabled={disableElement}
                            helperText={errors[ADDRESS_LINE_1]?.message}
                            InputLabelProps={{ shrink: true }}
                            label={ADDRESS_LINE_1}
                            size='small'
                            variant='outlined'
                            {...register(ADDRESS_LINE_1)} />

                        <TextField
                            className='create-vendor-address2'
                            disabled={disableElement}
                            error={errors[ADDRESS_LINE_2]}
                            InputLabelProps={{ shrink: true }}
                            label={ADDRESS_LINE_2}
                            size='small'
                            variant='outlined'
                            {...register(ADDRESS_LINE_2)} />

                        <TextField
                            className='create-vendor-city'
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
                            className='create-vendor-state'
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
                            className='create-vendor-zipcode'
                            disabled={disableElement}
                            error={errors[ZIP_CODE_CC] || zipCodeError}
                            helperText={errors[ZIP_CODE_CC]?.message || zipCodeError}
                            InputLabelProps={{ shrink: true }}
                            label={ZIP_CODE_CC}
                            onKeyUp={handleZipCode}
                            size='small'
                            variant='outlined'
                            {...register(ZIP_CODE_CC)} />

                        {processingZipcode && <CircularProgress className='create-vendor-zipcode-circular-progress' />}

                        <Button
                            className='create-vendor-sign-up'
                            disabled={disableElement}
                            mx='auto'
                            size='small'
                            type='submit'
                            variant="contained">
                            {SIGN_UP_CC}
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Fragment>
    );
} 