import {
    ACTIVE_LISTING,
    CODE,
    DELETE,
    EMAIL,
    GET,
    ID,
    POST,
    PUT,
} from "./constants";
import axios from "axios";

const host = process.env.NEXT_PUBLIC_URL;

export async function createVendor(body) {
    return await genericAPICall(host + "/api/vendorProfile", POST, body)
}

export async function getVendorProfileById(id) {
    return await genericAPICall(host + `/api/vendorProfile?${ID}=${id}`, GET)
}

export async function getZipCodeDetails(zipCode) {
    return await genericAPICall(host + `/api/getZipCodeDetails/${zipCode}`, GET)
}

export async function createListing(body, email) {
    const url = `${host}/api/listings?${EMAIL}=${email}`

    return await genericAPICall(url, POST, body)
}

export async function deleteListingByAddressId(email, addressId) {
    const url = `${host}/api/listings?${EMAIL}=${email}&${ID}=${addressId}`

    return await genericAPICall(url, DELETE)
}

// Return listings of vendor with specified email
export async function getListings(email) {
    const url = `${host}/api/listings?${EMAIL}=${email}`

    return await genericAPICall(url, GET)
}

export async function getListingByAddressId(id) {
    return await genericAPIGET(`${host}/api/listings?${ID}=${id}`)
    // return await axios.get(`${host}/api/listings?${ID}=${id}`)
    // const url = `${host}/api/listings?${EMAIL}=${email}&${ID}=${id}`

    // return await genericAPICall(url, GET)
}

export async function getListingsByActive(email, isActive) {
    return await axios.get(`${host}/api/listings?${EMAIL}=${email}&${ACTIVE_LISTING}=${isActive}`)
    // const url = `${host}/api/listings?${EMAIL}=${email}&${ACTIVE_LISTING}=${isActive}`

    // return await genericAPICall(url, GET)
}

export function getListingsURL(email) {
    return `${host}/api/listings?${EMAIL}=${email}`
}

// Return all vendors' listings that matched specified zipcode's county
export async function getLocations(zipCode) {
    let url = `${host}/api/locations?${CODE}=${zipCode}`

    return await genericAPICall(url, GET)
}

export function getLocationsURL(zipCode) {
    return `${host}/api/locations?${CODE}=${zipCode}`
}



export async function updateListingByAddressId(body, id) {
    const url = `${host}/api/listings?${ID}=${id}`

    return await genericAPICall(url, PUT, body)
}

// export async function updateVendorUser(body) {
//     return await genericAPICall(host + "/api/vendorUser", PUT, body)
// }

export async function getVendorUserByEmail(email) {
    return await genericAPICall(host + `/api/vendorUser?${EMAIL}=${email}`, GET)
}

export async function upload(body) {
    const url = `${host}/api/upload`
    const response = await fetch(url, body)
    return await response.json()
}
/*
 *  External API calls 
 * 
 * 
 */

export async function getUserLocation() {
    return await genericAPICall('https://geolocation-db.com/json/', GET)
}

export async function genericAPICall(url, method, body = {}) {
    let response = {}
    if (method === GET) {
        response = await fetch(url);
    } else {
        response = await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    return await response.json()
}

export async function genericAPICall2(url, method, body = {}) {
    const host = process.env.NEXT_PUBLIC_URL;
    let response = {}
    if (method === GET) {
        response = await fetch(host + url);
    } else {
        response = await fetch(host + url, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    return await response.json()
}

export async function genericAPIGET(url) {
    try {
        const respone = await axios.get(url)
        console.log("__in genericAPIGET, response", respone)
    } catch (error) {
        console.log("in genericAPIGET, error catch", error)
    }
}