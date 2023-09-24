
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Server } from '@prisma/client';
import { error } from 'console';
import Error from 'next/error';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export async function PATCH (
    req: Request,
    { params } :{ params: { serverId : string}}
) {
    try {
        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("(nicht eingeloggt)", { status : 401})
        }

        if(!params.serverId) {
            return new NextResponse("Kein Server gefunden", { status : 400})
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: uuidv4()
            }
        })

        const newServer = await db.server.findUnique({
            where: {
                id: params.serverId
            }
        })
        if (!newServer) {
            return new NextResponse('Server nicht gefunden', { status : 404})
        }

        
        print(newServer)
        return NextResponse.json(server);
    } catch (error) {
        return new NextResponse('Invalid' , { status : 500})
    }
}

const print = (newServer : Server) => {
    console.log(newServer)
}