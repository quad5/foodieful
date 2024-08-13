import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";

import { EMAIL } from "@/app/lib/constants"


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
        console.log("/GET vendorUser, result", error)
        return NextResponse.json({ success: false }, { status: 400 });
    }

}

export async function PUT(request) {
    try {
        const data = await request.json();
        console.log("__/PUT vendorUser, data", data)

        const updatedUser = await prisma.vendorUser.update({
            where: {
                email: data.email,
                // email: null
            },
            data: {
                name: data.name,
            },
        })
        return NextResponse.json({ success: true, message: updatedUser })
        // return NextResponse.json({ success: true, message: updateUser }, { status: 200 });
    } catch (error) {
        console.log("/PUT vendorUser, result", error)
        throw error
        // return NextResponse.json({ message: error })
        // return NextResponse.json({ success: false, message: error }, { status: 400 });
    }
}