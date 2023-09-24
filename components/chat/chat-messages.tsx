'use client';

import { Member, Message, Profile } from '@prisma/client';
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { CircleDashed, Loader, Loader2Icon, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import ChatItem from './chat-item';
import { format } from "date-fns"
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useChatScroll } from '@/hooks/use-chat-scroll';


const DATE_FORMAT = "dd.MM.yy HH:mm"

type MessageWithMemberWithProfile = Message & { 
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name : string;
    member : Member;
    chatId : string;
    apiUrl : string;
    socketUrl : string;
    socketQuery : Record<string, any>;
    paramKey : "channelId" | "conversationId";
    paramValue : string;
    type : "channel" | "conversation";
}



const ChatMessages: React.FC<ChatMessagesProps> = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type

}) => {

    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })

    useChatSocket({ queryKey, addKey, updateKey })
    useChatScroll({ chatRef, bottomRef, loadMore : fetchNextPage, shouldLoadMore : !isFetchingNextPage && !!hasNextPage, count : data?.pages?.[0]?.items?.length ?? 0})

    if (status === "loading") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2Icon className="h-10 w-10 text-zinc-500 animate-spin my-4"/>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Nachrichten werden geladen..
                </p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <CircleDashed className="h-10 w-10 text-zinc-500 my-4"/>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Etwas ist schief gelaufen..
                </p>
            </div>
        )
    }

    return ( 
         <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto ml-3">
            {!hasNextPage && ( <div className="flex-1" /> )}
            {!hasNextPage  && ( <ChatWelcome 
            type={type}
            name={name}
            /> )}

            { hasNextPage && (
                <div className='flex justify-center'>
                    {isFetchingNextPage ? (
                        <Loader  className='h-6 w-6 text-zinc-500 animate-spin my-4'/>
                    ): (

                        <button className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition'
                        onClick={() => fetchNextPage()}>
                            Lade vorherige Nachrichten
                        </button>
                    )
                    }
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((group, i) =>(
                    <Fragment key={i}>
                        {group.items.map((message : MessageWithMemberWithProfile ) =>(
                            <ChatItem 
                            key={message.id}
                            id={message.id}
                            member={message.member}
                            currentMember={member}
                            content={message.content}
                            deleted={message.deleted}
                            timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                            isUpdated={message.updatedAt !== message.createdAt}
                            fileUrl={message.fileUrl}
                            socketUrl={socketUrl}
                            socketQuery={socketQuery}
                             />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref = {bottomRef}/>
        </div>
     );
}
 
export default ChatMessages;