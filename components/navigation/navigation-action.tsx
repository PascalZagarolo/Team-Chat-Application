"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { Separator } from "../ui/separator";



const NavigationAction = () => {

    const { onOpen } = useModal();

    return ( 
        <div>
            <ActionTooltip
                side="right"
                align="center"
                label="füge einen neuen Server hinzu"> 
                <button className="group flex items-center"
                    onClick={() => onOpen("createServer")}>
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[6px] group-hover:rounded-[16px] transition-all overflow-hidden items-center
                         justify-center bg-background dark:bg-neutral-700 group-hover:bg-[##3e75b7]">
                    <Plus className="group-hover:text-white transition text-[#3e75b7] dark:text-[#3e75b7]
                        "size={20} />
                    </div>
                </button>
            </ActionTooltip> 
           
        </div>
     );
}
 
export default NavigationAction;