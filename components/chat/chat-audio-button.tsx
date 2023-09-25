'use client';

import qs from "query-string";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { Phone, PhoneOff, Video, VideoOff } from "lucide-react";

import { ActionTooltip } from "../action-tooltip";




export const ChatAudioButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const isAudio = searchParams?.get("audio")

    const onClick = () => {
        const url = qs.stringifyUrl({
            url : pathname || "",

            query: {
                audio: isAudio ? undefined : true,
            }
        },{ skipNull : true})
        

        router.push(url);
    }

    const Icon = isAudio ? PhoneOff : Phone;
    const tooltipLabel = !isAudio ? "Sprachanruf beginnen " : "Sprachanruf beenden";

    return (
        <ActionTooltip side="bottom" label={tooltipLabel}>
            <button onClick={onClick} className="hover:opacity-75 transition mr-4">
                <Icon className = "h-5 w-5 text-zinc-500 dark:text-zinc-400"/>
            </button>
        </ActionTooltip>
    )
}