import {
    MY_PROFILE_CC,
    MANAGE_MY_LISTINGS_CC,
    VENDOR_PROFILE_CC,
} from "./constants"


// export function companyMenu() {
//     return [
//         {
//             title: 'Home Page',
//             link: '/'
//         },
//         {
//             title: 'FAQs',
//             link: '/faq'
//         }
//     ]
// }

export function vendorMenu() {
    return [
        {
            title: MANAGE_MY_LISTINGS_CC,
            link: '/vendor'
        },
        {
            title: VENDOR_PROFILE_CC,
            link: '/vendor/vendorProfile'
        },
        {
            title: MY_PROFILE_CC,
            link: '/vendor/userProfile'
        }
    ]
}

