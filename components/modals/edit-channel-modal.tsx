'use client';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import qs from "query-string";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

import { error } from 'console';
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlignLeft, Mic, Video } from "lucide-react";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Kanalname muss mindestens 1 Zeichen lang sein"
    }).max(20, { message : "Kanalname zu lang"}).refine(
        name => name !== "general",{
            message: "Der Name >'general'< ist reserviert",
        }
    ), type : z.nativeEnum(ChannelType)
})


const EditChannelModal = () => {
    const params = useParams();
    const { isOpen , onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "editChannel";
    const { channelType } = data;
    const router = useRouter();
    const { channel , server } = data;

    const channelRole = {
        "TEXT" : <AlignLeft className="h-4 w-4 ml-2"/>,
        "VIDEO" : <Video className="h-4 w-4 ml-2" />,
        "AUDIO" : <Mic className="h-4 w-4 text-rose-500 ml-2 font-bold" /> 
    }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channelType || ChannelType.TEXT
        }
    });

    useEffect(() => {
       if(channel) {
        form.setValue("name", channel.name);
        form.setValue("type", channel.type);
       }
    },[channel,form])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId : server?.id
                }
            });
            await axios.patch(url, values);
            form.reset();
            router.refresh();
            onClose();
            
        } catch (error) {
            console.log(error, "FEHLER")
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Kanal bearbeiten
                    </DialogTitle>
                    
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                        className="uppercase text-xs font-bol text-zinc-500 dark:text-secondary/70">
                                        Name des Kanals
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Gebe deinem Kanal einen Namen"
                                            {...field}>
                                        </Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                            <FormField 
                            control={form.control}
                            name="type"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Art des Kanals
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger
                                                        className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize
                                                        outline-none">
                                                            <SelectValue placeholder="Wähle die Art deines Kanales"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {Object.values(ChannelType).map((type) =>(
                                                        <SelectItem key={type} value={type} className="capitalize">
                                                             {type.toLowerCase()}
                                                             <div className="ml-auto"> 
                                                             {channelRole[type]}
                                                             </div>
                                                            </SelectItem>
                                                    ))}
                                                </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                                <Button
                                    disabled={isLoading}
                                    variant="primary"
                                    >
                                    Änderungen speichern.
                                </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default EditChannelModal;