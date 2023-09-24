import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE (
    req: Request,
    { params } : { params : { memberId : string}}
) {
    try {
        
        const profile = await currentProfile();

        const  { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if(!profile) {
            return new NextResponse("Nicht eingeloggt : " ,{ status : 401})
        }

        if (!serverId) {
            return new NextResponse("Kein Server gefunden: ", { status : 400})
        }

        if(!params.memberId) {
            return new NextResponse("Kein passender Nutzer im Server gefunden")
         }

        const server = await db.server.update({
            where : {
                id : serverId,
                profileId : profile.id,
            },
            data :{
                members : {
                    deleteMany : {
                        id : params.memberId,
                        profileId : {
                            not : profile.id
                        }
                    }
                }
            },
            include : {
                members :{
                    include : {
                        profile : true
                    },
                    orderBy : {
                        role : "asc"
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch {
        console.log("(members/[memberId]) DELETE");
        return new NextResponse("Ein Fehler ist beim löschen aufgetreten : " , { status : 500 })
    }
}

export async function PATCH (
    req : Request, 
    { params } : { params : { memberId : string}}
) {
    try {

        const profile = await currentProfile();
        const { searchParams } = new URL(req.url)
        const { role } = await req.json()

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Nicht eingeloggt ", { status : 401})
        }

        if (!serverId) {
            return new NextResponse("Kein Server gefunden : ",  { status : 400})
        }

        if (!params.memberId) {
            return new NextResponse("Kein passender Nutzer gefunden : " , { status: 400})
        }

        const server = await db.server.update({
            where : {
                id : serverId,
                profileId : profile.id
            }, data : {
                members : {
                    update : {
                        where :{
                            id : params.memberId,
                            profileId : {
                                not: profile.id
                            }
                        }, data : {
                            role
                        }
                    }
                }
            },
            include : {
                members: {
                    include : {
                        profile : true
                    }, orderBy : {
                        role: "asc"
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("(members/[memberId])");
        return new NextResponse("Ein Fehler ist aufgetreten : " , { status : 500})
    }
}