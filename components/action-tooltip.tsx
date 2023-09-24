"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import { Label } from '@/components/ui/label';

interface ActionTooltipProps{
    label: string;
    align?: "start" | "center" | "end";
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
}

export const ActionTooltip = ({
    label,
    align,
    children,
    side
}: ActionTooltipProps) => {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={50}>
                    <TooltipTrigger asChild>
                        {children}
                    </TooltipTrigger>
                    <TooltipContent side={side} align={align}>
                        <p className="font-semibold text-sm capitalize">
                            {label}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
}

