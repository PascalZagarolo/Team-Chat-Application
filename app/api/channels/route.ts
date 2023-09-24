import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { Member, MemberRole } from '@prisma/client';
import { db } from "@/lib/db";

export async function POST(
    req : Request,
) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();

        const  { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if(!profile) {
            return new NextResponse("Nicht eingeloggt / nicht autorisiert " , { status : 401})
        }

        if (!serverId) {
            return new NextResponse("Kein gültiger Server gefunden: ", { status : 400})
        }

        if(name === "general") {
            return new NextResponse("Der Name general ist reserviert : ", { status : 400})
        }

        const server = await db.server.update({
            where : {
                id : serverId,
                members : {
                    some : {
                        profileId : profile.id,
                        role : {
                            in: [MemberRole.MODERATOR, MemberRole.ADMIN]
                        }
                    }
                }
            }, data : {
                channels : {
                    create : {
                        profileId : profile.id,
                        name,
                        type
                    }
                }
            }
        });

        return NextResponse.json(server)

    } catch(error) {
        console.log(error);
        return new NextResponse("Ein Fehler ist aufgetreten : " , { status : 500 })
    }
}