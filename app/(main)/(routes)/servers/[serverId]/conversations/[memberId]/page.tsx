import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";

import { useParams , redirect } from "next/navigation";

interface MemberIdPageProps {
    params : {
        serverId : string;
        memberId : string;
    }, searchParams : {
        video? : boolean;
        audio? : boolean;
    }
}


const MemberIdPage: React.FC<MemberIdPageProps> = async ({
    params,
    searchParams
}) => {

    const profile = await currentProfile()
    

    if (!profile) {
        return redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where : {
            serverId : params?.serverId,
            profileId : profile.id
        }, include : {
            profile : true
        }
    })

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, params?.memberId)

    if (!conversation) {
        return redirect(`/servers/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.id !== currentMember.id ? memberOne : memberTwo;

    const receiverId = otherMember.profileId;
    
    return ( 
        <div className="bg-white dark:bg-[#19191a] flex flex-col h-full">
            <ChatHeader
            imageUrl={otherMember.profile.imageUrl}
            name={otherMember.profile.name}
            serverId = {params.serverId}
            
            type="conversation" />

            {searchParams.video && (
                <MediaRoom 
                chatId={conversation.id}
                audio={true}
                video={true}/>
            )}

            {searchParams.audio && (
                <MediaRoom 
                chatId={conversation.id}
                audio={true}
                video={false}/>
                )}
            
            {!searchParams.video && !searchParams.audio && (
                <>
                    <ChatMessages 
                    member = { currentMember }
                    name= {otherMember.profile.name}
                    chatId={conversation.id}
                    type="conversation"
                    apiUrl="/api/direct-messages"
                    paramKey="conversationId"
                    paramValue={conversation.id}
                    socketUrl="/api/socket/direct-messages"
                    socketQuery={{
                        conversationId : conversation.id
                    }}
                    />

                    <ChatInput 
                    name = {otherMember.profile.name}
                    type="conversation"
                    apiUrl="/api/socket/direct-messages"
                    query={{
                        conversationId : conversation.id
                    }}/>
                </>
            )}
            
        </div>
     );
}
 
export default MemberIdPage;