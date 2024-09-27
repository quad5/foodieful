'use client'

import Image from 'next/image'
import {
    useRouter,
    useSearchParams
} from 'next/navigation'

import { useSession } from 'next-auth/react';

import {
    Fragment,
    useEffect,
    useRef,
    useState
} from 'react';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import DeleteIcon from '@mui/icons-material/Delete';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
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
} from '@mui/material'

import { signOutHelperFn } from '@/app/lib/accessHelpers'
import {
    createVendor,
    deleteVendorProfile,
    getVendorProfileByEmail,
    getZipCodeDetails,
    sendLogToNewRelic,
    updateVendorProfile,
} from "@/app/lib/apiHelpers";
import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    DELETE_PROFILE_CC,
    EDIT,
    EDIT_VENDOR_PROFILE_CC,
    ERROR,
    FILE,
    FOOD_MENU_CC,
    LOGO_CC,
    LOGO_FILE,
    LOGO_FILE_ID,
    MAILING_ADDRESS,
    MENU_FILE,
    MENU_FILE_ID,
    MODE,
    NAME_CC,
    NO_ACTION_TAKEN_CC,
    PHONE_NUMBER_CC,
    SAVE_CC,
    SAVED_FOOD_MENU_CC,
    SAVED_LOGO_CC,
    STATE_CC,
    SUCCESSFULLY_DELETED_PROFILE_CC,
    SUCCESSFULLY_UPDATED_PROFILE_CC,
    TECHNICAL_DIFFICULTIES,
    UPDATED_LOGO_CC,
    UPDATED_MENU_CC,
    UPLOAD_LOGO_CC,
    UPLOAD_FOOD_MENU_CC,
    VENDOR_BUSINESS_NAME_CC,
    VENDOR_EMAIL_CC,
    VENDOR_ID,
    VENDOR_PROFILE_CC,
    VIEW,
    ZIP_CODE_CC,
} from "@/app/lib/constants";
import {
    DB_ADDRESS_LINE_1,
    DB_ADDRESS_LINE_2,
    DB_CITY,
    DB_EMAIL,
    DB_ID,
    DB_LOGO_FILE_ID,
    DB_MENU_FILE_ID,
    DB_NAME,
    DB_PHONE_NUMBER,
    DB_STATE,
    DB_ZIP_CODE
} from '@/app/lib/dbFieldConstants';
import {
    deleteFile,
    uploadToGoogleDrive
} from '@/app/lib/google';
import {
    constructFileUrl,
    constructImageFileUrl,
    generateRandomUUID,
    isEmpty,
} from '@/app/lib/utils';
import { tempSchema } from '@/app/lib/validation-schema'

import GenericErrorAlert from '@/components/GenericErrorAlert'
import GenericSuccessAlert from '@/components/GenericSuccessAlert';
import Prompt from '@/components/Prompt';


export default function VendorProfile() {

    const alertRef = useRef(null)
    const inProgressRef = useRef(null);
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession();
    const [city, setCity] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [enableForEditting, setEnableForEditting] = useState(false)
    const [formHasChanged, setFormHasChanged] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [logoFile, setLogoFile] = useState(null)
    const [logoFileId, setLogoFileId] = useState('')
    const [menuFile, setMenuFile] = useState(null)
    const [menuFileId, setMenuFileId] = useState('')
    const [mode, setMode] = useState('')
    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false)
    const [processingZipcode, setProcessingZipcode] = useState(false)
    const [state, setState] = useState('')
    const [vendorProfile, setVendorProfile] = useState();

    const [zipCode, setZipCode] = useState('')
    const [zipCodeError, setZipCodeError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const profile = await getVendorProfileByEmail(session?.user.email)

            if (profile.success) {
                setCity(profile.message[DB_CITY])
                setState(profile.message[DB_STATE])
                setVendorProfile(profile.message)
            } else {
                setOpenErrorAlert(true)
            }
            setIsFetching(false)
        }

        if (session) {
            fetchData()
        } else {
            setIsFetching(true)
        }
    }, [session])

    useEffect(() => {
        setMode(searchParams.get(MODE))
        mode === EDIT ? setEnableForEditting(true) : setEnableForEditting(false)
    }, [mode, searchParams])

    useEffect(() => {
        if ((isFetching || isSaving) && inProgressRef.current) {
            inProgressRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if ((openErrorAlert && alertRef.current) || (openSuccessAlert && alertRef.current)) {
            alertRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isFetching, isSaving, openErrorAlert, openSuccessAlert])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(tempSchema),
        mode: 'onChange',
    });

    const handleErrorAlertClose = () => {
        setOpenErrorAlert(false)
        setIsSaving(false)
    }

    const handleCancelLogoUpload = () => {
        setLogoFile(null)
    }

    const handleCancelMenuUpload = () => {
        setMenuFile(null)
    }

    const handleFormOnChange = () => {
        if (!formHasChanged) {
            setFormHasChanged(true)
        }
        setOpenErrorAlert(false)
        setOpenSuccessAlert(false)
    }

    const handleClosePrompt = () => {
        setOpenDeleteConfirmation(false)
    }

    const handleDelete = () => {
        setOpenDeleteConfirmation(true)
    }

    const handleOK = async () => {
        const result = await deleteVendorProfile(vendorProfile[DB_ID])

        if (result.success) {
            setAlertMessage(SUCCESSFULLY_DELETED_PROFILE_CC)
            setOpenDeleteConfirmation(false)
            setOpenSuccessAlert(true)
            await signOutHelperFn()
            window.location.reload();
        } else {
            setOpenErrorAlert(true)
            setOpenDeleteConfirmation(false)
        }
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

    async function onSubmit(data, e) {
        e.preventDefault()

        if (formHasChanged) {
            if (logoFile && !openErrorAlert) {
                setIsSaving(true)
                const formData = new FormData()
                formData.append(FILE, logoFile)
                const fileMetadata = {
                    mimeType: "image/svg+xml",
                    name: `${generateRandomUUID()}.svg`,
                    parents: [process.env.NEXT_PUBLIC_FOLDER_ID]
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
                if (!openErrorAlert) {
                    if (vendorProfile[DB_LOGO_FILE_ID]) {
                        await deleteFile(vendorProfile[DB_LOGO_FILE_ID])
                            .catch((error) => {
                                sendLogToNewRelic(ERROR, `On delete log file, ${error}`)
                                setIsSaving(false)
                                // no need to prompt error because it doesn't affect foodieful application
                            })
                    }
                }
            }

            if (menuFile && !openErrorAlert) {
                setIsSaving(true)
                const formData = new FormData()
                formData.append(FILE, menuFile)
                const fileMetadata = {
                    mimeType: "application/pdf",
                    name: `${generateRandomUUID()}.pdf`,
                    parents: [process.env.NEXT_PUBLIC_FOLDER_ID]
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

                if (!openErrorAlert) {
                    if (vendorProfile[DB_MENU_FILE_ID]) {
                        await deleteFile(vendorProfile[DB_MENU_FILE_ID])
                            .catch((error) => {
                                sendLogToNewRelic(ERROR, `On delete menu file, ${error}`)
                                setIsSaving(false)
                                // no need to prompt error because it doesn't affect foodieful application
                            })
                    }
                }
            }

            if (!openErrorAlert) {
                let response = {}
                data[CITY_CC] = city
                data[STATE_CC] = state
                if (mode === EDIT) {
                    data[VENDOR_ID] = vendorProfile[DB_ID]
                    response = await updateVendorProfile(data)
                } else {
                    response = await createVendor(data)
                }

                if (response.success) {
                    setAlertMessage(SUCCESSFULLY_UPDATED_PROFILE_CC)
                    setLogoFile(null)
                    setMenuFile(null)
                    setOpenSuccessAlert(true)
                } else {
                    setIsSaving(false)
                    setOpenErrorAlert(true)
                }
                setIsSaving(false)
            }
        } else {
            setAlertMessage(NO_ACTION_TAKEN_CC)
            setOpenSuccessAlert(true)
        }
    }

    return (
        <Fragment>
            <div>
                <Backdrop
                    className='profile-progress-wrapper'
                    open={isFetching || isSaving}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress
                        className='profile-progress'
                        ref={inProgressRef} />
                </Backdrop>
            </div>

            {openSuccessAlert && <GenericSuccessAlert
                closeFn={() => router.push("/")}
                message={alertMessage}
                ref={alertRef} />}

            {openErrorAlert && <GenericErrorAlert
                closeFn={handleErrorAlertClose}
                message={TECHNICAL_DIFFICULTIES}
                ref={alertRef} />}

            {openDeleteConfirmation && <Prompt
                className='profile-deletion-confirmation'
                content={"All of your listings, user profile, and vendor profile information will be permanently deleted!. You will not be able to recover it."}
                handleClose={handleClosePrompt}
                handleOK={handleOK}
                open={openDeleteConfirmation}
                title={"Permanently delete profile and related items?"} />}

            {!isFetching && <Typography
                align='center'
                className='profile-header'
                sx={{ color: 'white', marginBottom: 4 }}
                variant='h3'>
                {mode === VIEW ? VENDOR_PROFILE_CC : EDIT_VENDOR_PROFILE_CC}
            </Typography>}

            {!isFetching && <Stack
                className='profile-wrapper'
                direction={'column'}
                sx={{
                    backgroundColor: 'white',
                    display: 'flex',
                    mx: 'auto',
                    paddingX: 2,
                    width: { xs: '100%', sm: '60%', md: '40%' }
                }}>

                <form
                    onChange={handleFormOnChange}
                    onSubmit={handleSubmit(onSubmit)}>
                    <Stack
                        className='profile-form'
                        direction={'column'}
                        marginY={4}
                        spacing={2}>

                        {mode === VIEW && <Button
                            className='profile-edit-button'
                            disabled={isSaving}
                            href={`/vendor/profile?${MODE}=${EDIT}`}
                            size='small'
                            variant="contained">
                            {EDIT_VENDOR_PROFILE_CC}
                        </Button>}

                        {mode === VIEW && vendorProfile[DB_LOGO_FILE_ID] &&
                            <Box className='profile-saved-logo' sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Image
                                    alt="saved-logo"
                                    height={200}
                                    loading="lazy"
                                    quality={100}
                                    src={constructImageFileUrl(vendorProfile[DB_LOGO_FILE_ID], 400)}
                                    width={200}
                                />
                            </Box>}

                        <TextField
                            className='profile-name'
                            defaultValue={vendorProfile[DB_NAME]}
                            disabled={isSaving || !enableForEditting || openSuccessAlert}
                            error={errors[NAME_CC]}
                            helperText={errors[NAME_CC]?.message}
                            InputLabelProps={{ shrink: true }}
                            label={VENDOR_BUSINESS_NAME_CC}
                            size='small'
                            variant={mode === EDIT ? 'outlined' : 'filled'}
                            {...register(NAME_CC)} />

                        <TextField
                            className='profile-email'
                            defaultValue={vendorProfile[DB_EMAIL]}
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            label={VENDOR_EMAIL_CC}
                            size='small'
                            variant={'filled'} />

                        <TextField
                            className='profile-phone-number'
                            defaultValue={vendorProfile[DB_PHONE_NUMBER]}
                            disabled={isSaving || !enableForEditting || openSuccessAlert}
                            error={errors[PHONE_NUMBER_CC]}
                            helperText={errors[PHONE_NUMBER_CC]?.message}
                            InputLabelProps={{ shrink: true }}
                            label={PHONE_NUMBER_CC}
                            size='small'
                            variant={mode === EDIT ? 'outlined' : 'filled'}
                            {...register(PHONE_NUMBER_CC)} />

                        {mode === EDIT && <Divider className='profile-logo-divider' sx={{ paddingY: 1 }}>{LOGO_CC}</Divider>}

                        {mode === EDIT && <Button
                            className='profile-upload-logo'
                            component="label"
                            disabled={isSaving || openSuccessAlert}
                            onChange={(e) => setLogoFile(e.target.files?.[0])}
                            size='small'
                            startIcon={<UploadFileIcon />}
                            variant="contained">
                            {UPLOAD_LOGO_CC}
                            <input
                                style={{ display: 'none' }}
                                type='file'
                                {...register(LOGO_FILE)} />
                        </Button>}

                        {errors[LOGO_FILE] && <FormHelperText
                            className='profile-logo-error'
                            error={errors[LOGO_FILE]}>{errors[LOGO_FILE]?.message}
                        </FormHelperText>}

                        {!errors[LOGO_FILE] && logoFile && <Box
                            className='profile-preview-logo-wrapper'
                            sx={{ border: 'solid' }}>

                            <IconButton
                                className='profile-preview-delete-logo-icon'
                                onClick={handleCancelLogoUpload}
                                sx={{ display: 'flex', ml: 'auto' }}>
                                <DeleteIcon fontSize='large' />
                            </IconButton>

                            <Box
                                className='profile-preview-logo-image-wrapper'
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    alt="preview-logo"
                                    className='profile-preview-image'
                                    height={200}
                                    loading="lazy"
                                    src={URL.createObjectURL(logoFile)}
                                    width={200} />
                            </Box>
                            <Typography
                                className='profile-selected-logo-filename'
                                sx={{ textAlign: 'center' }}>
                                {`Preview of selected file: ${logoFile?.name}`}
                            </Typography>
                        </Box>}

                        {mode === EDIT &&
                            (!openSuccessAlert && vendorProfile[DB_LOGO_FILE_ID] || (openSuccessAlert && !logoFileId)) &&
                            <Box
                                className='profile-saved-logo-wrapper'
                                sx={{ border: 'solid' }}>
                                <Box
                                    sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Image
                                        alt="saved-logo"
                                        className='profile-saved-logo-image'
                                        height={200}
                                        loading="lazy"
                                        src={constructImageFileUrl(vendorProfile[DB_LOGO_FILE_ID], 400)}
                                        width={200} />
                                </Box>
                                <Typography
                                    className='profiled-saved-logo-text'
                                    sx={{ textAlign: 'center' }}>
                                    {SAVED_LOGO_CC}
                                </Typography>
                            </Box>
                        }

                        {mode == EDIT && openSuccessAlert && logoFileId &&
                            <Box
                                className='profile-updated-logo-wrapper'
                                sx={{ border: 'solid' }}>
                                <Box

                                    sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Image
                                        alt="updated-logo"
                                        className='profile-updated-logo-image'
                                        height={200}
                                        loading="lazy"
                                        src={constructImageFileUrl(logoFileId, 400)}
                                        width={200} />
                                </Box>
                                <Typography
                                    className='profile-updated-logo-text'
                                    sx={{ textAlign: 'center' }}>
                                    {UPDATED_LOGO_CC}
                                </Typography>
                            </Box>
                        }

                        {mode === EDIT && !vendorProfile[DB_LOGO_FILE_ID] && <IconButton
                            className='profile-no-image'
                            disabled
                            sx={{
                                mx: 'auto'
                            }}>
                            <ImageNotSupportedIcon fontSize='large' />
                        </IconButton>}

                        {mode === EDIT && <Divider
                            className='profile-menu-divider'
                            sx={{ paddingY: 1 }}>{FOOD_MENU_CC}</Divider>}

                        {mode === EDIT && <Button
                            className='profile-upload-menu'
                            component="label"
                            disabled={isSaving || openSuccessAlert}
                            onChange={(e) => setMenuFile(e.target.files?.[0])}
                            size='small'
                            startIcon={<UploadFileIcon />}
                            variant="contained">
                            {UPLOAD_FOOD_MENU_CC}
                            <input
                                style={{ display: 'none' }}
                                type='file'
                                {...register(MENU_FILE)} />
                        </Button>}

                        {errors[MENU_FILE] && <FormHelperText
                            className='profile-menu-error'
                            error={errors[MENU_FILE]}>{errors[MENU_FILE]?.message}
                        </FormHelperText>}

                        {!errors[MENU_FILE] && menuFile && <Box
                            className='profile-preview-menu-wrapper'
                            sx={{ border: 'solid' }}>

                            <IconButton
                                className='profile-preview-delete-menu-icon'
                                onClick={handleCancelMenuUpload}
                                sx={{ display: 'flex', ml: 'auto' }}>
                                <DeleteIcon fontSize='large' />
                            </IconButton>

                            <Button
                                className='profile-preview-menu'
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

                        {!openSuccessAlert && vendorProfile[DB_MENU_FILE_ID] && <Button
                            className='profile-menu'
                            disabled={isSaving}
                            fullWidth
                            href={constructFileUrl(vendorProfile[DB_MENU_FILE_ID])}
                            size='small'
                            target="_blank"
                            variant="contained">
                            {mode === EDIT ? SAVED_FOOD_MENU_CC : FOOD_MENU_CC}
                        </Button>}

                        {openSuccessAlert && menuFileId && <Button
                            className='profile-updated-menu'
                            fullWidth
                            href={constructFileUrl(menuFileId)}
                            size='small'
                            target="_blank"
                            variant="contained">
                            {UPDATED_MENU_CC}
                        </Button>}

                        {mode === EDIT && !vendorProfile[DB_MENU_FILE_ID] && <IconButton
                            className='profile-no-menu'
                            disabled
                            sx={{
                                mx: 'auto'
                            }}>
                            <FolderOffIcon fontSize='large' />
                        </IconButton>}

                        <Divider className='profile-address-divider' sx={{ paddingY: 1 }}>{MAILING_ADDRESS}</Divider>

                        <TextField
                            className='profile-address1'
                            error={errors[ADDRESS_LINE_1]}
                            disabled={isSaving || !enableForEditting || openSuccessAlert}
                            helperText={errors[ADDRESS_LINE_1]?.message}
                            InputLabelProps={{ shrink: true }}
                            label={ADDRESS_LINE_1}
                            size='small'
                            defaultValue={vendorProfile[DB_ADDRESS_LINE_1]}
                            variant={mode === EDIT ? 'outlined' : 'filled'}
                            {...register(ADDRESS_LINE_1)} />

                        <TextField
                            className='profile-address2'
                            disabled={isSaving || !enableForEditting || openSuccessAlert}
                            error={errors[ADDRESS_LINE_2]}
                            InputLabelProps={{ shrink: true }}
                            label={ADDRESS_LINE_2}
                            size='small'
                            defaultValue={vendorProfile[DB_ADDRESS_LINE_2]}
                            variant={mode === EDIT ? 'outlined' : 'filled'}
                            {...register(ADDRESS_LINE_2)} />

                        <TextField
                            className='profile-city'
                            disabled={!enableForEditting || openSuccessAlert}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                            label={CITY_CC}
                            size='small'
                            value={mode === VIEW ? vendorProfile[DB_CITY] : city}
                            variant={'filled'}
                            {...register(CITY_CC)} />

                        <TextField
                            className='profile-state'
                            disabled={!enableForEditting || openSuccessAlert}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: true,
                            }}
                            label={STATE_CC}
                            size='small'
                            value={mode === VIEW ? vendorProfile[DB_STATE] : state}
                            variant={'filled'}
                            {...register(STATE_CC)} />

                        <TextField
                            className='profile-zipcode'
                            disabled={isSaving || !enableForEditting || openSuccessAlert}
                            error={errors[ZIP_CODE_CC] || zipCodeError}
                            helperText={errors[ZIP_CODE_CC]?.message || zipCodeError}
                            InputLabelProps={{ shrink: true }}
                            label={ZIP_CODE_CC}
                            onKeyUp={handleZipCode}
                            size='small'
                            defaultValue={vendorProfile[DB_ZIP_CODE]}
                            variant={mode === EDIT ? 'outlined' : 'filled'}
                            {...register(ZIP_CODE_CC)} />

                        {processingZipcode && <CircularProgress className='profile-zipcode-progress' />}

                        {mode === EDIT && <Button
                            className='profile-save'
                            disabled={isSaving || openSuccessAlert || !isEmpty(errors) || zipCodeError}
                            mx='auto'
                            size='small'
                            type='submit'
                            variant="contained">
                            {SAVE_CC}
                        </Button>}
                    </Stack>
                </form>
                <Button
                    className='profile-delete'
                    fullWidth
                    onClick={handleDelete}
                    size='large'
                    sx={{ backgroundColor: 'red', marginX: 'auto', marginY: 4 }}
                    variant="contained">
                    {DELETE_PROFILE_CC}
                </Button>
            </Stack>}
        </Fragment>
    );
}