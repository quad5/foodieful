import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { ERROR, FILE_BRACKET } from '@/app/lib/constants'
import { createUUIDFilename, getFileExtension } from '@/app/lib/utils'
import path from 'path'
import { sendLogToNewRelic } from '@/app/lib/apiHelpers'

export async function POST(request) {

    try {
        const filenames = []
        const data = await request.formData()

        for (const file of data.getAll(FILE_BRACKET)) {
            const fileExt = getFileExtension(file.name)
            const filename = createUUIDFilename(file.name)
            filenames.push(filename)
            const dirRelativeToPublicFolder = fileExt

            const dir = path.resolve('./public', dirRelativeToPublicFolder);
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const _path = `/${dir}/${filename}`
            await writeFile(_path, buffer)
        }
        return NextResponse.json({ success: true, message: filenames })
    } catch (error) {
        sendLogToNewRelic(`requestUrl: POST ${request.nextUrl.href} \n` + error)
        return NextResponse.json({ success: false }, { status: 400 });
    }


}