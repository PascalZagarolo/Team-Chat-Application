'use client';
import { AlignLeft, Diamond, Minus } from "lucide-react";

 


interface ChatWelcomeProps {

    type : "channel" | "conversation";
    name : string;
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({
    type,
    name
}) => {
    return ( 
        <div className="space-y-2 mb-4 px-4"> 
        
        {type === "channel" && (
            <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
                <AlignLeft className="h-12 w-12 text-white" />
            </div>
        )}
        <p className="text-xl md:text-3xl font-bold">
            {type === "channel" ? `Willkommen in  ${name}` : name}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        <Minus color="#5C6BC0" />  {type === "channel" ? `Nachrichten die in ${name} gesendet werden, sind für jedes Mitglied von ${name} einsehbar.` : `Dies ist der Anfang deiner Konversation mit ${name}`} <Minus color="#5C6BC0" />
        </p>

        </div>
     );
}
 
export default ChatWelcome;