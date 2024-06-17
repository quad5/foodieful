import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
import {
    CODE,
    LIMIT,
    OFFSET
} from "@/app/lib/constants";
import {
    DB_ZIP_CODE
} from "@/app/lib/dbFieldConstants";

export async function GET(request) {
    const limit = parseInt(request.nextUrl.searchParams.get(LIMIT), 10)
    const offset = parseInt(request.nextUrl.searchParams.get(OFFSET), 10)
    const zipCode = request.nextUrl.searchParams.get(CODE)
    
    try {
        const result = await prisma.$transaction(async (tx) => {
            const zipCodes = await tx.$queryRaw`
            SELECT "zipCode" FROM "ZipCode" WHERE county = 
            (SELECT county from "ZipCode" where "zipCode" = ${zipCode})`

            const locations = await tx.pitStopAddress.findMany({
                skip: offset,
                take: limit,
                where: {
                    [DB_ZIP_CODE]: {in: zipCodes.map(a => a.zipCode)}
                },
                
                include: {
                    schedule: true
                }
            })
            return locations
        })
        return NextResponse.json({ success: true, message: result }, { status: 200 });
    } catch(error) {
        return NextResponse.json({ success: false}, { status: 400 });
    }
}