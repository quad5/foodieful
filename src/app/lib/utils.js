export function constructImageFileUrl(id, size) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=s${size}`
}

export function constructFileUrl(id) {
    return `https://drive.google.com/file/d/${id}/view`
}

export function generateRandomUUID() {
    return crypto.randomUUID();
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