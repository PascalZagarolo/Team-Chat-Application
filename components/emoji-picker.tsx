"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"

import  Picker  from "@emoji-mart/react"
import { useTheme } from "next-themes";
import { SmilePlus } from "lucide-react";
import data from "@emoji-mart/data"


interface EmojiPickerProps {
    onChange: (value : string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
    onChange
}) => {
    const { resolvedTheme } = useTheme();
    return ( 
        <Popover>
            <PopoverTrigger>
                <SmilePlus className="text-zinc-500 dark:text-zinc-400
                hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
                <PopoverContent
                side="right"
                sideOffset={32}
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
                    <Picker 
                        data={data}
                        onEmojiSelect={(emoji : any) => onChange(emoji.native)}
                        theme = {resolvedTheme}
                    />
                </PopoverContent>
            </PopoverTrigger>
        </Popover>
     );
}
 
export default EmojiPicker;