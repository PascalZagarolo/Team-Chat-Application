'use client';

import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => { 

    const { isConnected } = useSocket();

    if (!isConnected) {
        return (
            <Badge variant="outline" className="bg-yellow-600 text-white border-none">
                Verbindung mit dem Server fehlgeschlagen. Versuche erneut...
            </Badge>
        )
    }

    return (
        <Badge variant="outline" className="bg-emerald-700 text-white border-none">
            Online
        </Badge>
    )
}