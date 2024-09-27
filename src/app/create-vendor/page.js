"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
    Fragment,
    useEffect,
    useRef,
    useState
} from 'react';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormHelperText,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import {
    createVendor,
    getZipCodeDetails,
    sendLogToNewRelic
} from '@/app/lib/apiHelpers';
import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    EMAIL_CC,
    ERROR,
    FILE,
    LOGO_FILE,
    LOGO_FILE_ID,
    MAILING_ADDRESS,
    MENU_FILE,
    MENU_FILE_ID,
    NAME_CC,
    PHONE_NUMBER_CC,
    SAVED_FOOD_MENU_CC,
    SAVED_LOGO_CC,
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
import { uploadToGoogleDrive } from '@/app/lib/google';
import {
    constructFileUrl,
    constructImageFileUrl,
    generateRandomUUID,
    isEmpty
} from '@/app/lib/utils';
import { vendorSchema } from '@/app/lib/validation-schema'

import GenericErrorAlert from '@/components/GenericErrorAlert';
import GenericSuccessAlert from '@/components/GenericSuccessAlert';


export default function CreateVendor() {
    const alertRef = useRef(null)
    const inProgressRef = useRef(null);
    const router = useRouter()
    const [city, setCity] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [disableElement, setDisableElement] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [logoFile, setLogoFile] = useState(null)
    const [logoFileId, setLogoFileId] = useState('')
    const [menuFile, setMenuFile] = useState(null)
    const [menuFileId, setMenuFileId] = useState('')
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false)
    const [processingZipcode, setProcessingZipcode] = useState(false)
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [zipCodeError, setZipCodeError] = useState('')

    // const methods = useForm({
    //     resolver: yupResolver(vendorSchema),
    // });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(vendorSchema),
        mode: 'onChange',
    });

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

    const handleCancelLogoUpload = () => {
        setLogoFile(null)
    }

    const handleCancelMenuUpload = () => {
        setMenuFile(null)
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

    async function onSubmit(data, e) {
        e.preventDefault()
        setOpenErrorAlert(false)
        setDisableElement(true)

        if (logoFile && !openErrorAlert) {
            setIsSaving(true)
            const formData = new FormData()
            formData.append(FILE, logoFile)
            const fileMetadata = {
                name: `${generateRandomUUID()}.svg`,
                mimeType: "image/svg+xml",
            };

            await uploadToGoogleDrive(formData, fileMetadata)
                .then(docId => {
                    setLogoFileId(docId)
                    data[LOGO_FILE_ID] = docId
                })
                .catch((error) => {
                    sendLogToNewRelic(ERROR, `On upload logo file, ${error}`)
                    setIsSaving(false)
                    setOpenErrorAlert(true)
                    setOpenSuccessAlert(false)
                })
        }

        if (menuFile && !openErrorAlert) {
            setIsSaving(true)
            const formData = new FormData()
            formData.append(FILE, menuFile)
            const fileMetadata = {
                name: `${generateRandomUUID()}.pdf`,
                mimeType: "application/pdf",
            };
            await uploadToGoogleDrive(formData, fileMetadata)
                .then(docId => {
                    setMenuFileId(docId)
                    data[MENU_FILE_ID] = docId
                }).catch((error) => {
                    sendLogToNewRelic(ERROR, `On upload menu file, ${error}`)
                    setIsSaving(false)
                    setOpenErrorAlert(true)
                    setOpenSuccessAlert(false)
                })
        }

        if (!openErrorAlert) {
            data[CITY_CC] = city
            data[STATE_CC] = state

            const response = await createVendor(data)
            if (response.success) {
                setAlertMessage('Vendor profile successfully created. Please sign in using provided email.')
                setLogoFile(null)
                setMenuFile(null)
                setOpenSuccessAlert(true)
            } else {
                setDisableElement(false)
                setOpenErrorAlert(true)
            }
            setIsSaving(false)
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

                        {!errors[LOGO_FILE] && logoFile && <Box
                            className='create-vendor-preview-logo-wrapper'
                            sx={{ border: 'solid' }}>

                            <IconButton
                                className='create-vendor-preview-delete-logo-icon'
                                onClick={handleCancelLogoUpload}
                                sx={{ display: 'flex', ml: 'auto' }}>
                                <DeleteIcon fontSize='large' />
                            </IconButton>

                            <Box
                                className='create-vendor-preview-logo-image-wrapper'
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    alt="preview-logo"
                                    className='create-vendor-preview-image'
                                    height={200}
                                    loading="lazy"
                                    src={URL.createObjectURL(logoFile)}
                                    width={200} />
                            </Box>
                            <Typography
                                className='create-vendor-selected-logo-filename'
                                sx={{ textAlign: 'center' }}>
                                {`Preview of selected file: ${logoFile?.name}`}
                            </Typography>
                        </Box>}

                        {openSuccessAlert && logoFileId &&
                            <Box
                                className='create-vendor-saved-logo-wrapper'
                                sx={{ border: 'solid' }}>
                                <Box

                                    sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Image
                                        alt="saved-logo"
                                        className='create-vendor-saved-logo-image'
                                        height={200}
                                        loading="lazy"
                                        src={constructImageFileUrl(logoFileId, 400)}
                                        width={200} />
                                </Box>
                                <Typography
                                    className='create-vendor-saved-logo-text'
                                    sx={{ textAlign: 'center' }}>
                                    {SAVED_LOGO_CC}
                                </Typography>
                            </Box>}

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

                        {!errors[MENU_FILE] && menuFile && <Box
                            className='create-vendor-preview-menu-wrapper'
                            sx={{ border: 'solid' }}>

                            <IconButton
                                className='create-vendor-preview-delete-menu-icon'
                                onClick={handleCancelMenuUpload}
                                sx={{ display: 'flex', ml: 'auto' }}>
                                <DeleteIcon fontSize='large' />
                            </IconButton>

                            <Button
                                className='create-vendor-preview-menu'
                                disabled={isSaving}
                                fullWidth
                                href={URL.createObjectURL(menuFile)}
                                size='small'
                                sx={{ marginBottom: 2 }}
                                target="_blank"
                                variant='contained'>
                                {`Preview selected file: ${menuFile?.name}`}
                            </Button>
                        </Box>}

                        {openSuccessAlert && menuFileId && <Button
                            className='create-vendor-saved-menu'
                            fullWidth
                            href={constructFileUrl(menuFileId)}
                            size='small'
                            target="_blank"
                            variant="contained">
                            {SAVED_FOOD_MENU_CC}
                        </Button>}

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
                            disabled={disableElement || !isEmpty(errors) || zipCodeError}
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