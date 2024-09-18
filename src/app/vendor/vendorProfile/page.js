'use client'

import {
    Fragment,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    useRouter,
    useSearchParams
} from 'next/navigation'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import Prompt from '@/components/Prompt';
import {
    Backdrop,
    Button,
    CircularProgress,
    Collapse,
    Divider,
    FormHelperText,
    IconButton,
    ImageListItem,
    ImageListItemBar,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    DELETE_PROFILE_CC,
    EDIT,
    EDIT_VENDOR_PROFILE_CC,
    EMAIL_CC,
    FILE_BRACKET,
    FOOD_MENU_CC,
    LOGO_CC,
    LOGO_FILE,
    LOGO_FILENAME,
    MAILING_ADDRESS,
    MENU_FILE,
    MENU_FILENAME,
    MODE,
    NAME_CC,
    NO_ACTION_TAKEN_CC,
    PDF,
    PHONE_NUMBER_CC,
    POST,
    SAVE_CC,
    SAVED_FOOD_MENU_CC,
    SAVED_LOGO_CC,
    STATE_CC,
    SUCCESSFULLY_DELETED_PROFILE_CC,
    SUCCESSFULLY_UPDATED_PROFILE_CC,
    SVG,
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
    DB_LOGO_FILENAME,
    DB_MENU_FILENAME,
    DB_NAME,
    DB_PHONE_NUMBER,
    DB_STATE,
    DB_ZIP_CODE
} from '@/app/lib/dbFieldConstants';
import { tempSchema, vendorSchema } from '@/app/lib/validation-schema'

import {
    createVendor,
    deleteVendorProfile,
    getVendorProfileByEmail,
    getZipCodeDetails,
    updateVendorProfile,
    upload
} from "@/app/lib/apiHelpers";
import GenericErrorAlert from '@/components/GenericErrorAlert'
import GenericSuccessAlert from '@/components/GenericSuccessAlert';
import { signOutHelperFn } from '@/app/lib/accessHelpers'


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
    const [logoFilename, setLogoFilename] = useState('')
    const [menuFile, setMenuFile] = useState(null)
    const [menuFilename, setMenuFilename] = useState('')
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
        setZipCodeError('');
        e.preventDefault()

        if (formHasChanged) {
            if (logoFile || menuFile) {
                setIsSaving(true)
                const uploadResp = await uploadFile()
                if (uploadResp.success) {
                    if (uploadResp.message.hasOwnProperty(SVG)) {
                        setLogoFilename(uploadResp.message[SVG])
                        data[LOGO_FILENAME] = uploadResp.message[SVG]
                    }

                    if (uploadResp.message.hasOwnProperty(PDF)) {
                        setMenuFilename(uploadResp.message[PDF])
                        data[MENU_FILENAME] = uploadResp.message[PDF]
                    }
                } else {
                    setIsSaving(false)
                    setOpenErrorAlert(true)
                }
            }

            let response = {}
            data[CITY_CC] = city
            data[STATE_CC] = state
            if (mode === EDIT) {
                data[VENDOR_ID] = vendorProfile[DB_ID]
                response = await updateVendorProfile(data)
            } else {
                response = await createVendor(data)
            }

            setIsSaving(false)
            if (!zipCodeError) {
                if (response.success) {
                    setAlertMessage(SUCCESSFULLY_UPDATED_PROFILE_CC)
                    setLogoFile(null)
                    setMenuFile(null)
                    setOpenSuccessAlert(true)
                } else {
                    setIsSaving(false)
                    setOpenErrorAlert(true)
                }
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
                    open={isFetching || isSaving}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress ref={inProgressRef} />
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
                content={"All of your listings, user profile, and vendor profile information will be permanently deleted!. You will not be able to recover it."}
                handleClose={handleClosePrompt}
                handleOK={handleOK}
                open={openDeleteConfirmation}
                title={"Permanently delete profile and related items?"} />}

            {!isFetching && <Typography
                align='center'
                sx={{ color: 'white', marginBottom: 4 }}
                variant='h3'>
                {mode === VIEW ? VENDOR_PROFILE_CC : EDIT_VENDOR_PROFILE_CC}
            </Typography>}

            {!isFetching && <Stack
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
                        direction={'column'}
                        marginY={4}
                        spacing={2}>

                        {mode === VIEW && <Button
                            disabled={isSaving}
                            href={`/vendor/vendorProfile?${MODE}=${EDIT}`}
                            size='small'
                            variant="contained">
                            {EDIT_VENDOR_PROFILE_CC}
                        </Button>}

                        {mode === VIEW && vendorProfile[DB_LOGO_FILENAME] && <ImageListItem>
                            <Image
                                alt="saved-logo"
                                height={400}
                                loading="lazy"
                                src={`/svg/${vendorProfile[DB_LOGO_FILENAME]}`}
                                width={400} />
                        </ImageListItem>}

                        <TextField
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
                            defaultValue={vendorProfile[DB_EMAIL]}
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            label={VENDOR_EMAIL_CC}
                            size='small'
                            variant={'filled'} />

                        <TextField
                            defaultValue={vendorProfile[DB_PHONE_NUMBER]}
                            disabled={isSaving || !enableForEditting || openSuccessAlert}
                            error={errors[PHONE_NUMBER_CC]}
                            helperText={errors[PHONE_NUMBER_CC]?.message}
                            InputLabelProps={{ shrink: true }}
                            label={PHONE_NUMBER_CC}
                            size='small'
                            variant={mode === EDIT ? 'outlined' : 'filled'}
                            {...register(PHONE_NUMBER_CC)} />

                        {mode === EDIT && <Divider sx={{ paddingY: 1 }}>{LOGO_CC}</Divider>}

                        {mode === EDIT && <Button
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
                            error={errors[LOGO_FILE]}>{errors[LOGO_FILE]?.message}
                        </FormHelperText>}

                        {!errors[LOGO_FILE] && logoFile && <Collapse
                            in={logoFile}
                            sx={{ border: 'solid' }}
                            timeout="auto"
                            unmountOnExit>

                            <IconButton sx={{ display: 'flex', ml: 'auto' }}
                                onClick={handleCancelLogoUpload}>
                                <DeleteIcon fontSize='large' />
                            </IconButton>

                            <ImageListItem>
                                <Image
                                    alt="preview-logo"
                                    height={400}
                                    loading="lazy"
                                    src={URL.createObjectURL(logoFile)}
                                    width={400} />

                                <Typography
                                    sx={{ textAlign: 'center' }}>
                                    {`Preview of selected file: ${logoFile?.name}`}
                                </Typography>
                            </ImageListItem>
                        </Collapse>}

                        {mode === EDIT &&
                            (!openSuccessAlert && vendorProfile[DB_LOGO_FILENAME] || (openSuccessAlert && !logoFilename)) &&
                            <ImageListItem
                                sx={{ border: 'solid' }}>
                                <Image
                                    alt="saved-logo"
                                    height={400}
                                    loading="lazy"
                                    src={`/svg/${vendorProfile[DB_LOGO_FILENAME]}`}
                                    width={400} />
                                <ImageListItemBar
                                    position="below"
                                    sx={{ textAlign: 'center' }}
                                    title={SAVED_LOGO_CC} />
                            </ImageListItem>}

                        {mode == EDIT && openSuccessAlert && logoFilename && <ImageListItem
                            sx={{ border: 'solid' }}>
                            <Image
                                alt="updated-logo"
                                height={400}
                                loading="lazy"
                                src={`/svg/${logoFilename}`}
                                width={400} />
                            <ImageListItemBar
                                position="below"
                                sx={{ textAlign: 'center' }}
                                title={UPDATED_LOGO_CC} />
                        </ImageListItem>}

                        {mode === EDIT && !vendorProfile[DB_LOGO_FILENAME] && <IconButton
                            disabled
                            sx={{
                                mx: 'auto'
                            }}>
                            <ImageNotSupportedIcon fontSize='large' />
                        </IconButton>}

                        {mode === EDIT && <Divider sx={{ paddingY: 1 }}>{FOOD_MENU_CC}</Divider>}

                        {mode === EDIT && <Button
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
                            error={errors[MENU_FILE]}>{errors[MENU_FILE]?.message}
                        </FormHelperText>}

                        {!errors[MENU_FILE] && menuFile && <Collapse
                            in={menuFile}
                            sx={{ border: 'solid' }}
                            timeout="auto"
                            unmountOnExit>

                            <IconButton sx={{ display: 'flex', ml: 'auto' }}
                                onClick={handleCancelMenuUpload}>
                                <DeleteIcon fontSize='large' />
                            </IconButton>

                            <Button
                                disabled={isSaving}
                                fullWidth
                                href={URL.createObjectURL(menuFile)}
                                size='small'
                                sx={{ marginBottom: 2 }}
                                target="_blank"
                                variant='contained'>
                                {`Preview selected file ${menuFile?.name}`}

                            </Button>
                        </Collapse>}

                        {!openSuccessAlert && vendorProfile[DB_MENU_FILENAME] && <Button
                            disabled={isSaving}
                            fullWidth
                            href={`/pdf/${vendorProfile[DB_MENU_FILENAME]}`}
                            size='small'
                            target="_blank"
                            variant="contained">
                            {mode === EDIT ? SAVED_FOOD_MENU_CC : FOOD_MENU_CC}
                        </Button>}

                        {openSuccessAlert && menuFilename && <Button
                            fullWidth
                            href={`/pdf/${menuFilename}`}
                            size='small'
                            target="_blank"
                            variant="contained">
                            {UPDATED_MENU_CC}
                        </Button>}

                        {mode === EDIT && !vendorProfile[DB_MENU_FILENAME] && <IconButton
                            disabled
                            sx={{
                                mx: 'auto'
                            }}>
                            <FolderOffIcon fontSize='large' />
                        </IconButton>}

                        <Divider sx={{ paddingY: 1 }}>{MAILING_ADDRESS}</Divider>

                        <TextField
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
                            disabled={isSaving || !enableForEditting || openSuccessAlert}
                            error={errors[ADDRESS_LINE_2]}
                            InputLabelProps={{ shrink: true }}
                            label={ADDRESS_LINE_2}
                            size='small'
                            defaultValue={vendorProfile[DB_ADDRESS_LINE_2]}
                            variant={mode === EDIT ? 'outlined' : 'filled'}
                            {...register(ADDRESS_LINE_2)} />

                        <TextField
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

                        {processingZipcode && <CircularProgress />}

                        {mode === EDIT && <Button
                            disabled={isSaving || openSuccessAlert}
                            mx='auto'
                            size='small'
                            type='submit'
                            variant="contained">
                            {SAVE_CC}
                        </Button>}
                    </Stack>
                </form>
                <Button
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