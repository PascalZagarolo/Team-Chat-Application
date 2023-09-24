"use client";

import Image from "next/image";
import { ActionTooltip } from "../action-tooltip";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string
}


const NavigationItem: React.FC<NavigationItemProps> = ({
    id,
    imageUrl,
    name
}) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${id}`)
    }
    return ( 
        <ActionTooltip
        side="right"
        align="center"
        label={name}>
            <button
                onClick={onClick}
                className="group relative flex items-center">
                    <div className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                        params?.serverId !== id && "group-hover:h-[20px]",
                        params?.serverId === id ? "h-[48px]" : "h-[8px]"
                    )}>
                    </div>
                    <div className={cn(
                        "relative group flex mx-3 h-[48px] w-[48px] rounded-[6px] group-hover:rounded-[12px] transition-all overflow-hidden items-center",
                        params?.serverId === id && "bg-primary/10 text-primary rounded-[36px]"
                    )}>
                        <Image src={imageUrl} fill alt="Server"/>
                    </div>
            </button>
        </ActionTooltip>
     );
}
 
export default NavigationItem;
 
