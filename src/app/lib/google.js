"use server"

import { google } from "googleapis";

import { Readable } from "stream";

import { FILE, ID } from "@/app/lib/constants";


const auth = new google.auth.GoogleAuth({
    keyFilename: './credential.json',
    scopes: ["https://www.googleapis.com/auth/drive"],
})

const driveService = google.drive({ version: "v3", auth });

export async function listFiles() {
    driveService.files.list({
        fields: "nextPageToken, files(id, name)"
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var files = response.data.files;
        if (files.length == 0) {
            console.log('No files found.');
        } else {
            console.log('\nFiles:');
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.log('%s (%s)', file.name, file.id);
            }
        }
    })
}

export async function uploadToGoogleDrive(file, fileMetadata) {
    const _file = file.get(FILE)
    const fileBuffer = _file.stream();

    const response = await driveService.files.create({
        requestBody: fileMetadata,
        media: {
            body: Readable.from(fileBuffer)
        },
        fields: ID,
    })

    const docId = response.data.id;

    // Add permissions (a must)
    await driveService.permissions.create({
        fileId: docId,
        requestBody: {
            role: "reader",
            type: "anyone",
        },
    })

    return docId
}

export async function deleteFile(id) {
    driveService.files.delete({
        fileId: id
    }, function (error) {
        if (error) {
            console.log('The API returned an error: ' + error);
            return;
        }
    })
}

