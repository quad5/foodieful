import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params }) {
      try {
          const result = await prisma.zipCode.findFirstOrThrow({
              where: {
                zipCode: params.zipcode,
              },
            })
          return NextResponse.json({ success: true, message: result }, { status: 200 });
      } catch(error) {
          return NextResponse.json({ success: false },{ status: 400 });
      }
}