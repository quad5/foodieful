
// import prisma from "../src/app/lib/prisma.js";
// import profile from "../src/data/vendorsProfile.json" assert { type: 'json' }
// import user from "../src/data/vendorsUser.json" assert { type: 'json' }

import { PrismaClient } from "@prisma/client"
import fs from "fs"
import readline from "readline"

const prisma = new PrismaClient();

function seedVendorsProfile() {
    Promise.all(profile.map(d => prisma.vendorProfile.create({ data: d })))
        .then(() => console.info('[SEED] Succussfully create vendors profiles'))
        .catch(e => console.error('[SEED] Failed to create vendor profiles', e))
}

function seedVendorsUser() {
    Promise.all(user.map(d => prisma.vendorUser.create({ data: d })))
        .then(() => console.info('[SEED] Succussfully create vendor user'))
        .catch(e => console.error('[SEED] Failed to create vendor user', e))
}

function loadZipCodeData() {
    const stream = fs.createReadStream("./prisma/zip_code_database_updated.csv");
    const reader = readline.createInterface({ input: stream });


    reader.on("line", async row => {

        const removedQuotes = row.replace(/\"/g, "")
        const splitted = removedQuotes.split(",");

        if (splitted[6] === 'US') {
            await prisma.zipCode.create({
                data: {
                    zipCode: splitted[0],
                    decommissioned: splitted[1] === 0,
                    city: splitted[2],
                    state: splitted[3],
                    county: splitted[4],
                    timeZone: splitted[5],
                    latitude: splitted[7],
                    longitude: splitted[8]
                }
            })
        }
    })
}







//seedVendorsProfile();
//seedVendorsUser();

loadZipCodeData()