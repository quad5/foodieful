import { NextResponse } from "next/server";

import { sendLogToNewRelic } from "@/app/lib/apiHelpers";
import {
    ACTIVE_LISTING,
    EMAIL,
    ERROR,
    ID,
    PIT_STOP_ADDRESS,
    SCHEDULES,
} from "@/app/lib/constants"
import {
    DB_ACTIVE,
    DB_ADDRESS_LINE_1,
    DB_CITY,
    DB_ID,
    DB_STATE,
    DB_ZIP_CODE,
} from "@/app/lib/dbFieldConstants";
import prisma from "@/app/lib/prisma"


export async function DELETE(request) {
    const email = request.nextUrl.searchParams.get(EMAIL)
    const addressId = request.nextUrl.searchParams.get(ID)

    try {
        await prisma.pitStopAddress.delete({
            where: {
                [DB_ID]: parseInt(addressId, 10)
            },
            include: {
                vendorProfile: {
                },
            }
        })

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: DELETE ${request.nextUrl.href} \n` + error)
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function GET(request) {
    const addressId = parseInt(request.nextUrl.searchParams.get(ID), 10)
    const isActive = request.nextUrl.searchParams.get(ACTIVE_LISTING)
    const email = request.nextUrl.searchParams.get(EMAIL)

    try {
        let result = {}
        if (addressId) {    // get a specified listing based on addressId
            result = await prisma.pitStopAddress.findUnique({
                where: {
                    [DB_ID]: addressId,
                },
                include: {
                    schedule: true
                }
            })
        }
        else if (isActive) {
            result = await prisma.pitStopAddress.findMany({
                where: {
                    vendorProfile: {
                        email: {
                            equals: email
                        }
                    },

                    AND: {
                        [DB_ACTIVE]: {
                            equals: String(isActive).toLowerCase() === "true"
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    schedule: true
                }
            })
        } else {    // get all
            result = await prisma.pitStopAddress.findMany({
                where: {
                    vendorProfile: {
                        email: {
                            equals: email
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    schedule: true
                }
            })
        }

        return NextResponse.json({ success: true, message: result }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: GET ${request.nextUrl.href} \n` + error)
        return NextResponse.json({ success: false });
    }
}

export async function POST(request) {
    const data = await request.json();
    const email = request.nextUrl.searchParams.get(EMAIL)
    let addAddressResult = {}

    try {
        await prisma.$transaction(async (tx) => {
            addAddressResult = await tx.vendorProfile.update({
                where: {
                    email: email
                },
                data: {
                    pitStopAddress: {
                        create: {
                            [DB_ACTIVE]: data[ACTIVE_LISTING],
                            [DB_ADDRESS_LINE_1]: data[PIT_STOP_ADDRESS][DB_ADDRESS_LINE_1],
                            [DB_CITY]: data[PIT_STOP_ADDRESS][DB_CITY],
                            [DB_STATE]: data[PIT_STOP_ADDRESS][DB_STATE],
                            [DB_ZIP_CODE]: data[PIT_STOP_ADDRESS][DB_ZIP_CODE],
                        },
                    },
                },
                include: {
                    pitStopAddress: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 1,
                    },
                }
            })

            for (const e of data[SCHEDULES]) {
                const obj = parseEvent(e)

                await tx.pitStopAddress.update({
                    where: {
                        id: addAddressResult.pitStopAddress[0].id
                    },
                    data: {
                        schedule: {
                            create: obj

                        }
                    }
                })
            }
        })

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: POST ${request.nextUrl.href} \n body: ${data} \n` + error)
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

export async function PUT(request) {
    const data = await request.json();
    const addressId = parseInt(request.nextUrl.searchParams.get(ID), 10)

    try {
        await prisma.$transaction(async (tx) => {

            await tx.pitStopAddress.update({
                where: {
                    id: addressId
                },
                data: {
                    [DB_ACTIVE]: data[ACTIVE_LISTING],
                    [DB_ADDRESS_LINE_1]: data[PIT_STOP_ADDRESS][DB_ADDRESS_LINE_1],
                    [DB_CITY]: data[PIT_STOP_ADDRESS][DB_CITY],
                    [DB_STATE]: data[PIT_STOP_ADDRESS][DB_STATE],
                    [DB_ZIP_CODE]: data[PIT_STOP_ADDRESS][DB_ZIP_CODE],
                }
            })

            const currentSchedules = await tx.$queryRaw`SELECT "eventId" FROM "Schedule" WHERE "pitStopAddressId" = ${addressId};`

            await tx.pitStopAddress.update({
                where: {
                    id: addressId
                },
                data: {
                    schedule: {
                        delete: currentSchedules
                    }
                }
            })

            for (const e of data[SCHEDULES]) {
                const obj = parseEvent(e)

                await tx.pitStopAddress.update({
                    where: {
                        id: addressId
                    },
                    data: {
                        schedule: {
                            create: obj
                        }
                    }
                })
            }
        })
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        sendLogToNewRelic(ERROR, `requestUrl: PUT ${request.nextUrl.href} \n body: ${data} \n` + error)
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

/*
    parse event from FullCalendar to DB fields
*/
function parseEvent(eventInfo) {
    const endDate = new Date(eventInfo.end)
    const startDate = new Date(eventInfo.start)

    return {
        eventId: eventInfo.id,
        dayOfWeek: [startDate.getUTCDay()],     // TODO - update when implementing recurring
        startHours: startDate.getUTCHours(),
        startMinutes: startDate.getUTCMinutes(),
        endHours: endDate.getUTCHours(),
        endMinutes: endDate.getMinutes(),
    }
}