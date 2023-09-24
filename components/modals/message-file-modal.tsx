'use client';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import qs from "query-string";

import {
    Dialog,
    DialogDescription,
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
import FileUpload from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
    
    fileUrl: z.string().min(1, {
        message: "Eine Datei ist benötigt"
    })
})


const MessageFileModal = () => {
    const { isOpen, onClose, type, data} = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === "messageFile";
    const { apiUrl, query } = data;

   
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ""
        }
    });

    const handleClose = () => {
        form.reset;
        onClose();
    }

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })
            await axios.post(url, {...values, content: values.fileUrl});
            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error, "FEHLER")
        }
    }


    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Füge eine Datei an
                    </DialogTitle>
                    <DialogDescription className="text-center
                        text-zinc-500">
                        Sende eine Datei..
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField 
                                control={form.control}
                                name="fileUrl" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload 
                                            endpoint="messageFile"
                                            value={field.value}
                                            onChange={field.onChange}/>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                            
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                                <Button
                                    disabled={isLoading}
                                    variant="primary"
                                    >
                                    Datei senden
                                </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default MessageFileModal;