export function isEmpty(obj) {
    for (var x in obj) { return false; }
    return true;
}

export function generateRandomUUID() {
    return crypto.randomUUID();
}

export function getFileExtension(filename) {
    return !filename ? '' : filename.split('.').pop();
}

export const createUUIDFilename = (filename) => {
    return `${generateRandomUUID()}.${getFileExtension(filename)}`
}

export const hyphenatedPhoneNumber = (phoneNumber) => {
    return phoneNumber ? `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}` : ""
}
