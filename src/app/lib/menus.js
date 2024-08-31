import {
    MY_PROFILE_CC,
    MANAGE_MY_LISTINGS_CC,
    VENDOR_PROFILE_CC,
} from "./constants"


export function companyMenu() {
    return [
        {
            title: 'FAQs',
            link: '/faq'
        },
        {
            title: 'Privacy',
            link: '/privacy'
        },
        {
            title: 'Terms of Service',
            link: '/terms'
        },
    ]
}

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

