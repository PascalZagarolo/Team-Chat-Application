import qs from "query-string"
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider"

interface ChatQueryProps {
    queryKey : string;
    apiUrl: string;
    paramKey : "channelId" | "conversationId"
    paramValue : string
}

export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
}: ChatQueryProps) => {

    const { isConnected } = useSocket();

    const fetchMassages = async ({
        pageParam = undefined
    }) => {
        const url = qs.stringifyUrl({ 
            url : apiUrl,
            query: {
                cursor : pageParam,
                [paramKey] : paramValue,
            }
        }, { skipNull : true});

        const res = await fetch(url);
        return res.json()
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMassages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }


}






