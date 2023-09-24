'use client';

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, PlusSquareIcon, Settings, Settings2, SettingsIcon, Trash2, UserPlus, UserPlus2, Users, Users2 } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";


interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
}



const ServerHeader: React.FC<ServerHeaderProps> = ({
    server,
    role
}) => {
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = role === MemberRole.MODERATOR || isAdmin;
    
    const { onOpen } = useModal();

    return (
        
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-20 border-neutral-200 dark:border-neutral-900 border-b-2
                hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                   {isModerator && (
                    <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"  
                            onClick={() => onOpen("invite", { server })}>
                        Freunde einladen
                        <UserPlus2 className="h-5 w-5 ml-auto" />
                    </DropdownMenuItem>
                   )}
                   {isAdmin && (
                    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer"
                    onClick={() => onOpen("edit", {server})}>
                        Servereinstellungen
                        <Settings2 className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                   )}
                   {isAdmin && (
                    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer"
                    onClick = {() => onOpen("members", { server })}>
                        Verwalte Mitglieder
                        <Users2 className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                   )}
                   {isModerator && (
                    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer"
                    onClick={() => onOpen("createChannel")}>
                        Kanal erstellen
                        <PlusSquareIcon className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                   )}
                   {isModerator && (
                    <DropdownMenuSeparator />
                   )}
                   {isModerator && (
                    <DropdownMenuItem className="px-3 py-2 text-sm font-semibold cursor-pointer text-rose-500"
                    onClick={() => onOpen("delete" , { server })}>
                        Server löschen
                        <Trash2 className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                   )}
                   {!isAdmin && (
                    <DropdownMenuItem className="px-3 py-2 text-sm font-semibold cursor-pointer text-rose-400"
                    onClick={() => onOpen("leave", { server })}>
                        Server verlassen.
                        <Trash2 className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                   )}
            </DropdownMenuContent>
        </DropdownMenu>
        
     );
}
 
export default ServerHeader;