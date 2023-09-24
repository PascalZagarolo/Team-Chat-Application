'use client';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import qs from "query-string";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";



import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCheckIcon, CheckIcon, Copy, Loader, MoreVerticalIcon, RefreshCwIcon, Shield, ShieldAlert, ShieldBanIcon, ShieldCheck, ShieldCheckIcon, ShieldHalfIcon, ShieldQuestionIcon, User2, X } from "lucide-react";

import { useState } from "react";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import { MemberRole, Member } from '@prisma/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuPortal, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub,
        DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuSubTrigger } from "../ui/dropdown-menu";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";





const MembersModal = () => {
    
    const { isOpen , onClose, type, data, onOpen} = useModal();
    const isModalOpen = isOpen && type === "members";
    const [loadingId, setLoadingId] = useState("");
    const router = useRouter();
    //include members
    const { server } = data as { server : ServerWithMembersWithProfiles};
    
  
    
    const [isLoading, setIsLoading] = useState(false);

    const roleIconMap = {
        "GUEST" : <User2 className="h-4 w-4 ml-2"/>,
        "MODERATOR" : <ShieldCheck className="h-4 w-4 ml-2" />,
        "PREMIUM" : <ShieldHalfIcon className="h-4 w-4 ml-2" />,
        "ADMIN" : <Shield className="h-4 w-4 text-rose-500 ml-2 font-bold" /> 
    }

    const onKick = async (memberId : string) => {
        try {
            setLoadingId(memberId);

            const url = qs.stringifyUrl({
                url : `/api/members/${memberId}`,
                query : {
                    serverId : server?.id,
                    memberId
                }
            });

            const response = await axios.delete(url)
            router.refresh();
            onOpen("members", { server : response.data })

        } catch (error) {
            console.log(error)
        } finally {
            setLoadingId("")
        }
    }
    
    const onRoleChange = async (memberId : string, role : MemberRole) => {
        try {

            setLoadingId(memberId);

            const url = qs.stringifyUrl({
                url : `/api/members/${memberId}`,
                query : {
                    serverId : server?.id
                }
            })

            console.log("Member : ", memberId , "Neue Rolle : ", role)
            const response = await axios.patch(url, { role });

            router.refresh();
            onOpen("members" , { server : response.data })
   
            } catch(error) {
            console.log(error)
            return new NextResponse("Fehler",{ status : 500})
         } finally {
            setLoadingId("");
         }
    }
    
    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Mitglieder verwalten 
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                    {server?.members?.length} Mitglieder
                </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6 ml-3">
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1 ml-3">
                                <div className="text-sm font-semibold flex items-center gap-x-1 mr-2">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500"> {member.profile.email}</p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto mr-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVerticalIcon className="h-4 w-4 text-zinc-500"/>
                                            <DropdownMenuContent side="left">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="flex items-center">
                                                        <ShieldQuestionIcon className="w-4 h-4 mr-2"/>
                                                        <span>
                                                            Berechtigungen
                                                        </span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem onClick={() => {onRoleChange(member.id , "GUEST")}}>
                                                                <ShieldBanIcon className="h-4 w-4 mr-2"/>
                                                                    Gast
                                                                    { member.role === "GUEST" && (
                                                                        <CheckIcon className="ml-auto h-4 w-4 p-auto flex"/>
                                                                                            )}      
                                                                
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => {onRoleChange(member.id , "GUEST")}} >
                                                                <ShieldHalfIcon className="h-4 w-4 mr-2"/>
                                                                    Premium
                                                                    { member.role === "MODERATOR" && (
                                                                        <CheckIcon className="ml-auto h-4 w-4 p-auto flex"/>
                                                                                            )}      
                                                                
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => onRoleChange(member.id , "MODERATOR")}>
                                                                <ShieldCheckIcon className="h-4 w-4 mr-2"/>
                                                                    Moderator
                                                                    { member.role === "MODERATOR" && (
                                                                        <CheckIcon className="ml-auto h-4 w-4 p-auto flex"/>
                                                                                            )}      
                                                                
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => {onKick(member.id)}}>
                                                    <X className="h-4 w-4 flex mr-2"/>
                                                    Vom Server entfernen
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenuTrigger>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id &&(
                                <Loader className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
     );
}
 
export default MembersModal;