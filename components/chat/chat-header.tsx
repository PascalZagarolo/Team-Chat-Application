'use client';

import { AlignLeft, Hash, Menu } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import Image from "next/image";
import UserAvatar from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";
import { ChatAudioButton } from "./chat-audio-button";

import { useParams } from "next/navigation";
import { Profile } from "@prisma/client";
import { db } from "@/lib/db";

interface ChatHeaderProps {
    serverId : string;
    name : string; 
    type : "channel" | "conversation"
    imageUrl? : string;
    receiverId : string;
}



const ChatHeader: React.FC<ChatHeaderProps> = ({
    serverId,
    name,
    type,
    imageUrl,
    receiverId
}) => {

    
     
    
    return ( 
        <div className="text-md font-semibold px-3 flex items-center h-20 border-neutral-200 dark:border-neutral-900 border-b-2 dark:bg-[#19191a]"> 
        <MobileToggle serverId={serverId}/>
        {type === "channel" && (
            <AlignLeft className="h-5 w-5 ml-2" />
        )}
        { type === "conversation" && (
            <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-4 mr-8" />
        )}
        <p className="font-semibold text-md text-black dark:text-white ml-3">
            {name.charAt(0).toUpperCase()+name.slice(1)}
        </p>
        <div className="ml-auto flex items-center">
            {type === "conversation" && (
                <>
                
                <ChatAudioButton />
                <ChatVideoButton />
                </>
            )}
            <SocketIndicator />
            </div> 
        </div>
     );
}
 
export default ChatHeader;