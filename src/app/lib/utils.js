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