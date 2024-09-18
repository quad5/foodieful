import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { sendLogToNewRelic } from "@/app/lib/apiHelpers";
import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    EMAIL,
    EMAIL_CC,
    ERROR,
    ID,
    LOGO_FILENAME,
    MENU_FILENAME,
    NAME_CC,
    PHONE_NUMBER_CC,
    STATE_CC,
    VENDOR_ID,
    ZIP_CODE_CC,
} from "@/app/lib/constants";
import {
    DB_ADDRESS_LINE_1,
    DB_ADDRESS_LINE_2,
    DB_CITY,
    DB_EMAIL,
    DB_ID,
    DB_LOGO_FILENAME,
    DB_MENU_FILENAME,
    DB_NAME,
    DB_PHONE_NUMBER,
    DB_STATE,
    DB_ZIP_CODE
} from "@/app/lib/dbFieldConstants";

export async function DELETE(request) {
    const id = parseInt(request.nextUrl.searchParams.get(ID), 10)

    try {
        const result = await prisma.vendorProfile.delete({
            where: {
                [DB_ID]: id
            }
        })
        return NextResponse.json({ success: true, message: result }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: DELETE ${request.nextUrl.href} \n` + error)
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function GET(request) {
    const email = request.nextUrl.searchParams.get(EMAIL)
    const id = parseInt(request.nextUrl.searchParams.get(ID), 10)
    let result = {}

    try {
        if (id) {
            result = await prisma.vendorProfile.findFirstOrThrow({
                where: {
                    [DB_ID]: id,
                },
            })
        }

        if (email) {
            result = await prisma.vendorProfile.findFirstOrThrow({
                where: {
                    [DB_EMAIL]: email,
                },
            })
        }
        return NextResponse.json({ success: true, message: result }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: GET ${request.nextUrl.href} \n` + error)
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}


export async function POST(request) {
    try {
        const data = await request.json()
        const result = await prisma.vendorProfile.create({
            data: {
                [DB_ADDRESS_LINE_1]: data[ADDRESS_LINE_1],
                [DB_ADDRESS_LINE_2]: data[ADDRESS_LINE_2],
                [DB_CITY]: data[CITY_CC],
                [DB_LOGO_FILENAME]: data[LOGO_FILENAME],
                [DB_MENU_FILENAME]: data[MENU_FILENAME],
                [DB_NAME]: data[NAME_CC],
                [DB_PHONE_NUMBER]: data[PHONE_NUMBER_CC],
                [DB_STATE]: data[STATE_CC],
                [DB_ZIP_CODE]: data[ZIP_CODE_CC],
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: POST ${request.nextUrl.href} \n` + error)
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json()
        const updated = await prisma.vendorProfile.update({
            where: {
                [DB_ID]: data[VENDOR_ID]
            },
            data: {
                [DB_ADDRESS_LINE_1]: data[ADDRESS_LINE_1],
                [DB_ADDRESS_LINE_2]: data[ADDRESS_LINE_2],
                [DB_CITY]: data[CITY_CC],
                [DB_LOGO_FILENAME]: data[LOGO_FILENAME],
                [DB_MENU_FILENAME]: data[MENU_FILENAME],
                [DB_NAME]: data[NAME_CC],
                [DB_PHONE_NUMBER]: data[PHONE_NUMBER_CC],
                [DB_STATE]: data[STATE_CC],
                [DB_ZIP_CODE]: data[ZIP_CODE_CC],
            }
        });
        return NextResponse.json({ success: true, message: updated }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: PUT ${request.nextUrl.href} \n` + error)
        return NextResponse.json({ success: false }, { status: 500 });
    }
}