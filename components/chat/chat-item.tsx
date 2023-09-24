'use client';

import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../user-avatar";
import { ActionTooltip } from '../action-tooltip';
import { Label } from '@/components/ui/label';
import { Crown, Edit, Edit2, Edit3, File, PersonStanding, Shield, ShieldCheck, Trash2 } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Form, FormField, FormControl , FormItem  } from "@/components/ui/form";
import * as z from "zod";
import axios from "axios";
import  qs from "query-string"

import { useForm } from "react-hook-form";
import { Content } from "next/font/google";
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ModalType, useModal } from '../../hooks/use-modal-store';

import { useRouter , useParams } from "next/navigation";

interface ChatItemProps {
    id : string;
    content: string;
    member : Member & {
        profile: Profile
    };
    timestamp : string;
    fileUrl : string | null;
    deleted : boolean;
    currentMember : Member;
    isUpdated : boolean;
    socketUrl: string;
    socketQuery: Record<string, any>;
};

const roleIconMap = {
    "GUEST" : <PersonStanding className="h-4 w-4 ml-2 text-zinc-500" />,
    "PREMIUM" : <ShieldCheck className="h-4 w-4 ml-2 text-yellow-600" />,
    "MODERATOR" : <Shield className="h-4 w-4 ml-2 text-blue-600" />,
    "ADMIN" : <Crown className="h-4 w-4 ml-2 text-rose-700" />
}





const ChatItem: React.FC<ChatItemProps> = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
}) => {

    const fileType = fileUrl?.split(".").pop();

    const { onOpen } = useModal();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator =  currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPdf = fileType === "pdf" && fileUrl;
    const isImage = !isPdf && fileUrl;

    const [isEditing, setIsEditing] = useState(false);

    const params = useParams();
    const router = useRouter();

    const onMemberClick = () => {
        if(member.id === currentMember.id) return;

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)

     }

    useEffect(() => {
        const handleKeyDown = (event : any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false);
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])


    const formSchema = z.object({ 
        content: z.string().min(1)
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content : content
        }
    });

    useEffect(() => {
        form.reset({
            content : content
        })
    },[content])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url : `${socketUrl}/${id}`,
                query: socketQuery,
            });

            await axios.patch(url, values);

            form.reset();
            setIsEditing(false);

        } catch(error){
            console.log(error)
        }
    }

    return ( 
        <div className="relative group flex items-center hover:bg-black/5 py-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition" onClick={onMemberClick}>
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline" onClick={onMemberClick}>
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                               {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer" className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48">
                            <Image src={fileUrl}
                            alt={content}
                            fill
                            className="object-cover"
                                />
                        </a>
                    )}
                    {isPdf && (
                        <div className="relative flex items-center p-2 m-2 rounded-md bg-background-10">
                            <File className="h-10 w-10 fill-indigo-300 stroke-indigo-500"/>
                        <a href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400">
                            <p className=" font-semibold"> PDF - Datei </p>
                            <p className="hover:underline"> {content} </p>
                            
                        </a>
                        
                    </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn("text-sm text-zinc-600 dark:text-zinc-300", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
                            {content}
                            { isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (bearbeitet)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full gap-x-2 pt-2">
                                <FormField 
                                    control={form.control}
                                    name = "content"
                                    render = {({field}) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input className="p-2 bg-zinc-200/90 dark:bg-zinc-800/75 border-none border-0 focus-visible:ring-0
                                                     focus:visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                     placeholder="bearbeitete Nachricht."
                                                     {...field}
                                                     disabled={isLoading}/>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button size="sm" variant="primary" disabled={isLoading}>
                                    Speichern
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-400">
                                Esc zum Abbrechen
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    { canEditMessage && (
                        <ActionTooltip label="bearbeiten">
                            <Edit3 className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            onClick={() => setIsEditing(true)}/>
                        </ActionTooltip>
                    )}
                    { canDeleteMessage && (
                        <ActionTooltip label="Nachricht löschen">
                            <Trash2 className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            onClick={() => onOpen("deleteMessage" , { apiUrl : `${socketUrl}/${id}` , query: socketQuery })} />
                        </ActionTooltip>
                    )}
                </div>
            )}
        </div>
     );
}
 
export default ChatItem;