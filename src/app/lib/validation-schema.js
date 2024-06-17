import { object, shape, string, number, date, InferType } from 'yup';
import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    EMAIL_CC,
    NAME_CC,
    STATE_CC,
    ZIP_CODE
} from "./constants"; 

// Thoughts of separating out address so it can be merged but vendor's address can be optional while listing isn't.


export const vendorSchema = object().shape({
    [ADDRESS_LINE_1]: string().max(40).notRequired(),

    [ADDRESS_LINE_2]: string().max(20).notRequired(),

    [CITY_CC]: string().max(30).notRequired(),

    [EMAIL_CC]: string().max(40).email().required(),

    [NAME_CC]: string()
      .min(2, 'Name must be at least 2 characters long.')
      .max(50, 'Name limit is 50 characters long.')
      .required(),
    
    [STATE_CC]: string().notRequired(),

    [ZIP_CODE]: string().notRequired()
        .when(ADDRESS_LINE_1,  {
            is: (value) => value,
            then: (schema) => schema.required(`Please enter zip code for ${ADDRESS_LINE_1}`),
            then: (schema) => schema.length(5, 'Zip code must be 5 digits long.'),
            otherwise: (schema) => schema.optional()
        })
        .test({name:'zipCodeEntered',
        skipAbsent: true,
        test(value, ctx) {
            console.log("__in zipcode test, value", value)
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
    [ZIP_CODE]: string().required("Zip code is required")
        .test({name:'zipCodeEntered',
        skipAbsent: true,
        test(value, ctx) {
            console.log("__in zipcode test, value", value)
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
    [ZIP_CODE]: string()
        .test({name:'zipCodeEntered',
        skipAbsent: true,
        test(value, ctx) {
            console.log("__in zipcode test, value", value)
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

