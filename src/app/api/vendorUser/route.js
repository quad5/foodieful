import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
import { sendLogToNewRelic } from "@/app/lib/apiHelpers";
import { EMAIL, ERROR } from "@/app/lib/constants"


export async function GET(request) {
    const email = request.nextUrl.searchParams.get(EMAIL)

    try {
        const result = await prisma.vendorUser.findFirstOrThrow({
            where: {
                email: email,
            },
        })

        return NextResponse.json({ success: true, message: result }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: GET ${request.nextUrl.href} \n` + error)
        return NextResponse.json({ success: false }, { status: 400 });
    }

}

export async function PUT(request) {
    try {
        const data = await request.json();

        const updateUser = await prisma.vendorUser.update({
            where: {
                email: data.email,
            },
            data: {
                name: data.name,
            },
        })
        return NextResponse.json({ success: true, message: updateUser }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: ${request.nextUrl.href} \n body: ${data} \n` + error)
        return NextResponse.json({ success: false }, { status: 400 });
    }
}