import {
    JPEG,
    JPG,
    PNG,
    SVG
} from "@/app/lib/constants";

export function constructImageFileUrl(id, size) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=s${size}`
}

export function constructFileUrl(id) {
    return `https://drive.google.com/file/d/${id}/view`
}

export function generateRandomUUID() {
    return crypto.randomUUID();
}

export function getFileExtension(filename) {
    return !filename ? '' : filename.split('.').pop();
}

export function getLogoMimeType(ext) {
    return {
        [JPEG]: "image/jpeg",
        [JPG]: "image/jpeg",
        [PNG]: "image/png",
        [SVG]: "image/svg+xml",
    }[ext]
}

export const hyphenatePhoneNumber = (phoneNumber) => {
    return phoneNumber ? `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}` : ""
}

export const hyphenateText = (text) => {
    if (text.includes(' ')) {
        const splitted = text.split(' ')
        return splitted.join('-')
    }
    return text;
}

export function isEmpty(obj) {
    for (var x in obj) { return false; }
    return true;
}