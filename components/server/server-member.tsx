"use client";

import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile, Server } from '@prisma/client';
import { Shield, ShieldCheck, User2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import UserAvatar from '../user-avatar';



interface ServerMemberProps {
    member : Member & { profile : Profile}
    server : Server
}

const roleIconMap = {
    [MemberRole.GUEST]: <User2 className="h-4 w-4" />,
    [MemberRole.PREMIUM]: <ShieldCheck className="h-4 w-4 ml-2 text-yellow-600" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <Shield className="h-4 w-4 text-rose-500 ml-2 font-bold" />
}

const ServerMember : React.FC<ServerMemberProps> = ({
    member,
    server
}) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    return ( 
        <button onClick={onClick} 
        className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.memberId === member.id && "bg-zinc-700/10 dark:bg-zinc-700/50"
        )}>
            <UserAvatar src={member.profile.imageUrl}
            className='h-8 w-8 md:h-8 md:w-8'/>
            <p className={
                cn("font-semibold text-sm text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-300 dark:group-hover:text-zinc-300 transition",
                params!.memberId = member.id && "text-primary dark:text-zinc-300/90 dark:group-hover:text-white")
            }>
                {member.profile.name}
            </p>
            <div className='ml-auto'>
            {icon}
            </div>
            
        </button>
     );
}
 
export default ServerMember;