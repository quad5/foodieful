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


const host = process.env.NEXT_PUBLIC_URL;

export async function createVendor(body) {
    return await genericAPICall(host + "/api/vendorProfile", POST, body)
}

export async function deleteVendorProfile(id) {
    return await genericAPICall(host + `/api/vendorProfile?${ID}=${id}`, DELETE)
}

export async function getVendorProfileByEmail(email) {
    return await genericAPICall(host + `/api/vendorProfile?${EMAIL}=${email}`, GET)
}

export async function getVendorProfileById(id) {
    return await genericAPICall(host + `/api/vendorProfile?${ID}=${id}`, GET)
}

export async function updateVendorProfile(body) {
    return await genericAPICall(host + "/api/vendorProfile", PUT, body)
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
    const url = `${host}/api/listings?${ID}=${id}`

    return await genericAPICall(url, GET)
}

export async function getListingsByActive(email, active) {
    const url = `${host}/api/listings?${EMAIL}=${email}&${ACTIVE_LISTING}=${active}`

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

export async function updateListingByAddressId(body, id) {
    const url = `${host}/api/listings?${ID}=${id}`

    return await genericAPICall(url, PUT, body)
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

export async function sendLogToNewRelic(logLevel, data) {
    fetch("https://log-api.newrelic.com/log/v1", {
        body: JSON.stringify({ level: logLevel, message: `${data}` }),
        headers: {
            'Api-Key': process.env.NEW_RELIC_LICENSE_KEY,
            "Content-Type": "application/json",
        },
        method: POST
    })
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
