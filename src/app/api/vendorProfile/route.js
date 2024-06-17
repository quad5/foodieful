import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY_CC,
    EMAIL_CC,
    ID,
    NAME_CC,
    STATE_CC,
    TECHNICAL_DIFFICULTIES,
    ZIP_CODE,
 } from "@/app/lib/constants";

 export async function GET(request) {
    const id = parseInt(request.nextUrl.searchParams.get(ID), 10)
  
    try {
        const result = await prisma.vendorProfile.findFirstOrThrow({
            where: {
            id: id,
            },
        })
        return NextResponse.json({ success: true, message: result }, { status: 200 });
    } catch(error) {
        return NextResponse.json({ success: false, message: error.message },{ status: 400 });
    }
}


export async function POST(request) {
    try {
        const data = await request.json()
        const result = await prisma.vendorProfile.create({
            data: {
                addressLine1: data[ADDRESS_LINE_1],
                addressLine2: data[ADDRESS_LINE_2],
                city: data[CITY_CC], 
                name: data[NAME_CC],
                state: data[STATE_CC],  
                zipCode: data[ZIP_CODE],
                vendorUser: {
                    create: {
                        email: data[EMAIL_CC],
                        name: '',
                    }
                }
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch(error) {
        if (error.code === "P2002") {
            return NextResponse.json({ success: false, message: "User with that email already exists" }, { status: 409 });
        }
      
        return NextResponse.json({ success: false, message: TECHNICAL_DIFFICULTIES }, { status: 500 });
    }
}