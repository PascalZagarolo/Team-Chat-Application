import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server"

export async function PATCH(
    req : Request,
    { params } : { params : { channelId : string}}
) {
    try {

        const profile = await currentProfile();
        const { name, type } = await req.json()
        const { searchParams } = new URL(req.url)

        if (!profile) {
            return new NextResponse("Nicht eingeloggt : ", { status : 401})
        }

        const serverId = searchParams.get("serverId")

        if(!serverId) {
            return new NextResponse("Server nicht vorhanden : ", { status : 401})
        }

        if(!params.channelId) {
            return new NextResponse("Kanal nicht gefunden : ", { status : 401 })
        }

        if(name === "general") {
        return new NextResponse("Der General Kanal ist reserviert und kann nicht geändert werden : ", { status : 401 })
        }

        const server = await db.server.update({
            where : {
                id: serverId,
                    members : {
                        some: {
                            profileId: profile.id,
                            role : {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                            }
                        }
                    }
                }, data : {
                    channels : {
                        update : {
                            where : {
                                id : params.channelId,
                                NOT : {
                                    name : "general"
                                }
                            }, data : {
                                name,
                                type,
                            }
                        }
                    }
                }
        });
        console.log("Kanal bearbeiten");
        return NextResponse.json(server)
        

    } catch(error) {
        console.log(error)
        return new NextResponse("Etwas ist schief gelaufen : ", { status : 500})
    }
}



export async function DELETE(
    req : Request,
    { params } : { params : { channelId : string}}
) {
    try {

        const profile = await currentProfile();

        const { searchParams } = new URL(req.url)

        if (!profile) {
            return new NextResponse("Nicht eingeloggt : ", { status : 401})
        }

        const serverId = searchParams.get("serverId")

        if(!serverId) {
            return new NextResponse("Server nicht vorhanden : ", { status : 401})
        }

        if(!params.channelId) {
            return new NextResponse("Kanal nicht gefunden : ", { status : 401 })
        }

        const server = await db.server.update({
            where : {
                id: serverId,
                    members : {
                        some: {
                            profileId: profile.id,
                            role : {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                            }
                        }
                    }
                },
                data : {
                    channels : {
                        delete: {
                            id : params.channelId,
                            name : {
                                not : "general"
                            }
                        }
                    }
                }
        });
        console.log("Kanal löschen");
        return NextResponse.json(server)
        

    } catch(error) {
        console.log(error)
        return new NextResponse("Etwas ist schief gelaufen : ", { status : 500})
    }
}