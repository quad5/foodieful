import {
    CODE,
    DELETE,
    EMAIL,
    GET,
    ID,
    POST,
    PUT,
} from "./constants";


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

export async function getListingByAddressId(email, id) {
    const url = `${host}/api/listings?${EMAIL}=${email}&${ID}=${id}`

    return await genericAPICall(url, GET)
}

export async function updateListingByAddressId(body, id) {
    const url = `${host}/api/listings?${ID}=${id}`

    return await genericAPICall(url, PUT, body)
}

export async function updateVendorUser(body) {
    return await genericAPICall(host + "/api/vendorUser", PUT, body)
}

export async function getVendorUserByEmail(email) {
    return await genericAPICall(host + `/api/vendorUser?${EMAIL}=${email}`, GET)
}

/*
 *  External API calls 
 * 
 * 
 */

export async function getUserLocation() {
    return await genericAPICall('https://geolocation-db.com/json/', GET)
}

export async function  genericAPICall(url, method, body = {}) {
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
