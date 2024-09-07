import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
import { sendLogToNewRelic } from "@/app/lib/apiHelpers";
import {
    CODE,
    ERROR,
    TOTAL_COUNT,
    LIMIT,
    OFFSET
} from "@/app/lib/constants";
import {
    DB_ACTIVE,
    DB_LOGO_FILENAME,
    DB_MENU_FILENAME,
    DB_NAME,
    DB_PHONE_NUMBER,
    DB_ZIP_CODE
} from "@/app/lib/dbFieldConstants";

export async function GET(request) {
    const limit = parseInt(request.nextUrl.searchParams.get(LIMIT), 10)
    const offset = parseInt(request.nextUrl.searchParams.get(OFFSET), 10)
    const totalCount = Boolean(request.nextUrl.searchParams.get(TOTAL_COUNT))
    const zipCode = request.nextUrl.searchParams.get(CODE)


    try {

        const result = await prisma.$transaction(async (tx) => {
            const zipCodes = await tx.$queryRaw`
            SELECT "zipCode" FROM "ZipCode" WHERE county = 
            (SELECT county from "ZipCode" where "zipCode" = ${zipCode})`

            if (totalCount) {
                const count = await tx.pitStopAddress.count({
                    where: {
                        [DB_ZIP_CODE]: { in: zipCodes.map(a => a.zipCode) },
                        AND: {
                            [DB_ACTIVE]: {
                                equals: true
                            }


                        }
                    },
                })
                return count
            } else {
                const locations = await tx.pitStopAddress.findMany({
                    skip: offset,
                    take: limit,
                    where: {
                        [DB_ZIP_CODE]: { in: zipCodes.map(a => a.zipCode) },
                        AND: {
                            [DB_ACTIVE]: {
                                equals: true
                            }


                        }
                    },

                    include: {
                        schedule: true,
                        vendorProfile: {
                            select: {
                                [DB_LOGO_FILENAME]: true,
                                [DB_MENU_FILENAME]: true,
                                [DB_NAME]: true,
                                [DB_PHONE_NUMBER]: true,
                            },
                        }
                    }
                })

                return locations
            }
        })

        return NextResponse.json({ success: true, message: result }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: GET ${request.nextUrl.href} \n` + error)
        return NextResponse.json({ success: false }, { status: 400 });
    }
}