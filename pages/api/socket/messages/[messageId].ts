import { currentProfilePages } from "@/lib/current-profile-for-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";


export default async function handler(
    req : NextApiRequest,
    res : NextApiResponseServerIo
) {
    if(req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "HTTP-Methode nicht erlaubt" });
    }

    try {
        const profile = await currentProfilePages(req);
        const {
            messageId,
            serverId,
            channelId
        } = req.query;
        const { content } = req.body;

        if (!profile) {
            return new NextResponse("Nicht autorisiert (nicht eingeloggt)", { status : 401})
        }

        if (!serverId) {
            return new NextResponse("Kanal(-Id) nicht gefunden", { status : 400})
        }

        if (!channelId) {
            return new NextResponse("Server(-Id) nicht gefunden ", { status : 400})
        }

        const server = await db.server.findFirst({ 
            where : {
                id : serverId as string,
                members : {
                    some : {
                        profileId : profile.id
                    }
                }
            }, include : {
                members : true
            }
        })

        

        const channel = await db.channel.findFirst({ 
            where : {
                id : channelId as string,
                serverId : serverId as string
            }
        })

        if (!server) {
            return new NextResponse("Server nicht gefunden" , { status : 404 })
        }

        const member = await server.members.find((member) => member.profileId === profile.id)

        if (!member) {
            return new NextResponse("Mitglied nicht gefunden" , { status : 404 })
        }

        if (!channel) {
            return new NextResponse("Kanal nicht gefunden" , { status : 404 })
        }

        let message = await db.message.findFirst({ 
            where : {
                id: messageId as string,
                channelId : channelId as string
            }, include : {
                member : {
                    include : {
                        profile : true
                    }
                }
            }
        })

        if(!message || message.deleted ) {
            return res.status(404).json({ error: "Nachricht nicht gefunden" });
        }

        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role = MemberRole.MODERATOR;

        const canModify = isMessageOwner || isAdmin || isModerator

        if (!canModify){
            return res.status(401).json({ error: "Nicht autorisiert" });
        }

        if(req.method === "DELETE") {
            message = await db.message.update({
                where : {
                    id : messageId as string
                },
                data : {
                    fileUrl : null,
                    content : "Diese Nachricht wurde gelöscht",
                    deleted : true
                }, include : {
                    member : {
                        include : {
                            profile : true
                        }
                    }
                }
            })
        }

        if(req.method === "PATCH") {

            if(!isMessageOwner) {
                return res.status(401).json({ error: "Nicht autorisiert, kein Nachrichtenbesitzer ! ! !" });
            }

            message = await db.message.update({
                where : {
                    id : messageId as string
                },
                data : {
                    content,
                }, include : {
                    member : {
                        include : {
                            profile : true
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);

    } catch (error) {
        console.log(error);
        return new NextResponse("Etwas ist schief gelaufen", { status: 500 })
    }
}