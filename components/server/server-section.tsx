
"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole, Member } from '@prisma/client';
import { ActionTooltip } from "../action-tooltip";
import { PlusIcon, Settings2, Share, User, User2, UserCheck, UserCircle } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType : "channels" | "members";
    channelType?: ChannelType;
    server? : ServerWithMembersWithProfiles
}

const ServerSection: React.FC<ServerSectionProps> = ({
    label,
    role,
    sectionType,
    channelType,
    server
}) => {
    const { onOpen } = useModal()
    return ( 
        <div className="flex items-center justify-between py-2 ml-3">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip label="erstelle einen Kanal" side="top">
                    <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    onClick={() => onOpen("createChannel", { channelType })}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                    </button>
                </ActionTooltip>
            )}
            { role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Mitglieder verwalten" side="top">
                    <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    onClick={() => onOpen("members",{ server })}>
                        <UserCircle className="h-4 w-4 mr-2" />
                    </button>
                </ActionTooltip>
                
            )}
        </div>
     );
}
 
export default ServerSection;