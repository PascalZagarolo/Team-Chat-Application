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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";



import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCheckIcon, CheckIcon, Copy, Ghost, RefreshCwIcon } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { error } from 'console';
import { useParams, useRouter } from "next/navigation";






const DeleteChannelModal = () => {
    
    const { isOpen , onClose, type, data, onOpen} = useModal();
    const origin = useOrigin();
    const isModalOpen = isOpen && type === "deleteChannel";

    const { server, channel } = data;
    const router = useRouter();
  
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    

    const onClick = async () => {
        try {

            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId : server?.id
                }
            })

            setIsLoading(true)
            console.log("GEKLICKT")
            await axios.delete(url)
            
            onClose();
            router.refresh();
            router.push(`/servers/${server?.id}`)
            
        } catch (error) {
            console.log("Ein Fehler ist aufgetreten :", error)
        } finally {
            setIsLoading(false)
        }
    }
    
    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Kanal löschen ?
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-700">
                    Möchtest du den Kanal wirklich löschen? Jegliche Daten gehen verloren. <span className="font-bold text-rose-500 ml-auto">{channel?.name}</span> wird gelöscht.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-5 bg-gray-100">
                <div className="flex items-center justify-between w-full">
                        <Button
                        disabled={isLoading}
                        onClick={onClose}
                        variant="ghost">
                            Abbrechen
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onClick}>
                            Kanal endgültig löschen.
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default DeleteChannelModal;