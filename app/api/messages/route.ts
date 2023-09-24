import { NextResponse } from "next/server";
import { Message } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 12;

export async function GET(
  req: Request
) {
  try {
    const { searchParams } = new URL(req.url)

        const profile = await currentProfile();
        const cursor =  searchParams.get("cursor");
        const channelId = searchParams.get("channelId");

    if(!profile){
        return new NextResponse("Nicht autorisiert: ", { status : 401})
    }

    if(!channelId){
        return new NextResponse("Kanal nicht gefunden: ", { status : 400})
    }

    let messages: Message[] = []

    if(cursor) {
        messages = await db.message.findMany({ 
            take: MESSAGES_BATCH,
            skip: 1,
            cursor: {
                id : cursor,
            }, where : {
                channelId : channelId
            }, include : {
                member: {
                    include : {
                        profile : true,
                    }
                }
            }, orderBy : {
                createdAt : "desc"
            }
        })
    } else {
        messages = await db.message.findMany({
            take : MESSAGES_BATCH,
            where : {
                channelId
            }, include : {
                member: {
                    include : {
                        profile : true
                    }
                }
            }, orderBy : {
                createdAt : "desc"
            }
        })
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}