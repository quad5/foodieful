import { mixed, object, shape, string, number, date, InferType } from 'yup';
import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    EMAIL_CC,
    LOGO_FILE,
    MENU_FILE,
    NAME_CC,
    PHONE_NUMBER_CC,
    STATE_CC,
    ZIP_CODE_CC
} from "./constants";

// TODO - DRY (don't repeat yourself)

// Thoughts of separating out address so it can be merged but vendor's address can be optional while listing isn't.

const acceptedLogoTypes = ["image/jpeg", "image/png", "image/svg+xml"]
const twoMB = 2097152

export const tempSchema = object().shape({
    [ADDRESS_LINE_1]: string().max(40).notRequired(),

    [ADDRESS_LINE_2]: string().max(20).notRequired(),

    [CITY_CC]: string().max(30).notRequired(),

    [LOGO_FILE]: mixed()
        .notRequired()
        .test({
            name: 'logoUpload',
            skipAbsent: false,
            test(value, ctx) {
                console.log("__type",)
                if (value && value[0] && value[0].size > twoMB) {
                    return ctx.createError({
                        message: "The file is too large. Limit 2MB"
                    })
                }

                if (value && value[0] && !(acceptedLogoTypes.includes(value[0].type))) {
                    return ctx.createError({
                        message: "We only support JPG/JPEG/PNG/SVG file format."
                    })
                }

                return true
            }
        }),

    [MENU_FILE]: mixed()
        .notRequired()
        .test({
            name: 'menuUpload',
            skipAbsent: false,
            test(value, ctx) {
                if (value && value[0] && value[0].size > twoMB) {
                    return ctx.createError({
                        message: "The file is too large. Limit 2MB"
                    })
                }
                if (value && value[0] && !["application/pdf"].includes(value[0].type)) {
                    return ctx.createError({
                        message: "We only support PDF."
                    })
                }
                return true
            }
        }),

    [NAME_CC]: string()
        .min(2, 'Name must be at least 2 characters long.')
        .max(50, 'Name limit is 50 characters long.')
        .required(),

    [PHONE_NUMBER_CC]: string()
        .notRequired()
        .test({
            name: 'phoneEntered',
            test(value, ctx) {
                if (value) {
                    if (isNaN(parseInt(value))) {
                        return ctx.createError({
                            message: "Phone number should only contain numbers."
                        });
                    }
                    if (value.length != 10) {
                        return ctx.createError({
                            message: "Phone number should only contain 10 digits."
                        });
                    }
                }
                return true;
            }
        }),

    [STATE_CC]: string().notRequired(),

    [ZIP_CODE_CC]: string().notRequired()
        .when(ADDRESS_LINE_1, {
            is: (value) => value,
            then: (schema) => schema.required(`Please enter zip code for ${ADDRESS_LINE_1}`),
            then: (schema) => schema.length(5, 'Zip code must be 5 digits long.'),
            otherwise: (schema) => schema.optional()
        })
        .test({
            name: 'zipCodeEntered',
            skipAbsent: true,
            test(value, ctx) {
                if (value) {
                    if (isNaN(parseInt(value))) {
                        return ctx.createError({
                            message: "Zip code must be numerical value."
                        });
                    }
                    if (value.length != 5) {
                        return ctx.createError({
                            message: "Zip code must be 5 digits long."
                        });
                    }
                }
                return true;
            }
        })
})

export const vendorSchema = object().shape({
    [ADDRESS_LINE_1]: string().max(40).notRequired(),

    [ADDRESS_LINE_2]: string().max(20).notRequired(),

    [CITY_CC]: string().max(30).notRequired(),

    [EMAIL_CC]: string().max(40).email().required(),

    [LOGO_FILE]: mixed()
        .notRequired()
        .test({
            name: 'logoUpload',
            skipAbsent: false,
            test(value, ctx) {
                if (value && value[0] && value[0].size > twoMB) {
                    return ctx.createError({
                        message: "The file is too large. Limit 2MB"
                    })
                }

                if (value && value[0] && !(acceptedLogoTypes.includes(value[0].type))) {
                    return ctx.createError({
                        message: "We only support JPG/JPEG/PNG/SVG file format."
                    })
                }

                return true
            }
        }),

    [MENU_FILE]: mixed()
        .notRequired()
        .test({
            name: 'menuUpload',
            skipAbsent: false,
            test(value, ctx) {
                if (value && value[0] && value[0].size > twoMB) {
                    return ctx.createError({
                        message: "The file is too large. Limit 2MB"
                    })
                }
                if (value && value[0] && !["application/pdf"].includes(value[0].type)) {
                    return ctx.createError({
                        message: "We only support PDF."
                    })
                }
                return true
            }
        }),

    [NAME_CC]: string()
        .min(2, 'Name must be at least 2 characters long.')
        .max(50, 'Name limit is 50 characters long.')
        .required(),

    [PHONE_NUMBER_CC]: string()
        .notRequired()
        .test({
            name: 'phoneEntered',
            test(value, ctx) {
                if (value) {
                    if (isNaN(parseInt(value))) {
                        return ctx.createError({
                            message: "Phone number should only contain numbers."
                        });
                    }
                    if (value.length != 10) {
                        return ctx.createError({
                            message: "Phone number should only contain 10 digits."
                        });
                    }
                }
                return true;
            }
        }),

    [STATE_CC]: string().notRequired(),

    [ZIP_CODE_CC]: string().notRequired()
        .when(ADDRESS_LINE_1, {
            is: (value) => value,
            then: (schema) => schema.required(`Please enter zip code for ${ADDRESS_LINE_1}`),
            then: (schema) => schema.length(5, 'Zip code must be 5 digits long.'),
            otherwise: (schema) => schema.optional()
        })
        .test({
            name: 'zipCodeEntered',
            skipAbsent: true,
            test(value, ctx) {
                if (value) {
                    if (isNaN(parseInt(value))) {
                        return ctx.createError({
                            message: "Zip code must be numerical value."
                        });
                    }
                    if (value.length != 5) {
                        return ctx.createError({
                            message: "Zip code must be 5 digits long."
                        });
                    }
                }
                return true;
            }
        })
})

export const listingSchema = object().shape({
    [ADDRESS_LINE_1]: string().max(40).required("Address is required"),
    [ZIP_CODE_CC]: string().required("Zip code is required")
        .test({
            name: 'zipCodeEntered',
            skipAbsent: true,
            test(value, ctx) {
                if (value) {
                    if (isNaN(parseInt(value))) {
                        return ctx.createError({
                            message: "Zip code must be numerical value."
                        });
                    }
                    if (value.length != 5) {
                        return ctx.createError({
                            message: "Zip code must be 5 digits long."
                        });
                    }
                }
                return true;
            }
        })
})

export const zipCodeSchema = object().shape({
    [ZIP_CODE_CC]: string()
        .test({
            name: 'zipCodeEntered',
            skipAbsent: true,
            test(value, ctx) {
                if (value) {

                    if (isNaN(parseInt(value))) {
                        return ctx.createError({
                            message: "Zip code must be numerical value."
                        });
                    }
                    if (value.length != 5) {
                        return ctx.createError({
                            message: "Zip code must be 5 digits long."
                        });
                    }
                }
                return true;
            }
        })
})

