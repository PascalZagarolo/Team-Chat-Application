"use client"

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { AlignLeft, CameraIcon, Edit3, FileLock, LockIcon, Mic, Trash2 } from "lucide-react";
import { useParams,  useRouter } from "next/navigation";
import { ActionTooltip } from '../action-tooltip';
import { ModalType, useModal } from "@/hooks/use-modal-store";

const iconMap = {
    [ChannelType.TEXT]: AlignLeft,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: CameraIcon
}

interface ServerChannelProps {
    channel : Channel;
    server: Server;
    role? : MemberRole
   

}

const ServerChannel = ({
    channel,
    server,
    role,
    

}: ServerChannelProps) => {

    

    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel.type];

    const { onOpen } = useModal();

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
    }
    
    //prevent onClick from overwriting
    const onAction = (e : React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { server, channel })
    }

    return ( 
       <button
        onClick={onClick}
        className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            <Icon className="flex-shrink-0 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <p className={cn("text-ellipsis line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-500 dark:text-zinc-300 dark:group-hover:text-zin-300 transition",
            params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
                {channel.name}
            </p>
            {channel.name !== "general" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Bearbeiten">
                        <Edit3 onClick={(e) => onAction(e, "editChannel")}
                        className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
                    </ActionTooltip>
                    
                    <ActionTooltip label="Kanal löschen" >
                        <Trash2 onClick={(e) => onAction(e, "deleteChannel")}
                        className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
                    </ActionTooltip>
                    
                </div>
                
            )}
            { channel.name === "general" && (
                <LockIcon className="ml-auto flex h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            )}
       </button>
     );
}
 
export default ServerChannel;