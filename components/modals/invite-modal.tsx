'use client';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";



import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCheckIcon, CheckIcon, Copy, RefreshCwIcon } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";




const InviteModal = () => {
    
    const { isOpen , onClose, type, data, onOpen} = useModal();
    const origin = useOrigin();
    const isModalOpen = isOpen && type === "invite";

    const { server } = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        console.log("kopiert")

        setTimeout(() => {
            setCopied(false) 
        },500)
    }

    const genNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite",{server: response.data});
        } catch (error: any) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    
    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Lade Freunde ein
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Einladungslink: 
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        value={inviteUrl}
                        disabled={isLoading}>
                        </Input>
                        <Button size="icon"
                        onClick={onCopy}>
                            { copied ? <CheckIcon className="w-4 h-4"/> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4
                        "
                        disabled={isLoading}
                        onClick={genNew}>
                            Einen neuen Link erstellen
                            <RefreshCwIcon className="w-4 h-4 ml-2"/>
                        </Button>
                </div>
            </DialogContent>
        </Dialog>
     );
}
 
export default InviteModal;