import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function DELETE (
    req : Request,
    { params } : { params : { serverId : string}}
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Nicht eingeloggt : " , { status : 401})
        }

        if (!params.serverId) {
            return new NextResponse("ServerId nicht gültig : " , { status : 401})
        }

        const server = await db.server.delete({
            where: {
                id : params.serverId,
                profileId : profile.id
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log(error);
        return new NextResponse("Ein Fehler ist aufgetreten : ", { status : 400})
    }
}

export async function PATCH (
    req : Request,
    { params } : { params : { serverId : string}}
) {
    try {
        const profile = await currentProfile();
        const { imageUrl , name } = await req.json();

        if(!profile) {
            return new NextResponse("Nicht autorisiert", { status : 401})
        }

        const server = await db.server.update({
            where : {
                id : params.serverId
            }, data : {
                imageUrl : imageUrl,
                name : name
            }
        })

        return NextResponse.json(server)

    } catch(error) {
        console.log("Error :: ", error)
        return new NextResponse("Ungültig", { status : 500})
    }
}