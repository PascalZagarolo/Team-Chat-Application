import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole, Member } from '@prisma/client';
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { AlignLeft, CameraIcon, Mic, Pen, Shield, ShieldCheck, User2 } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";
import { type } from "os";

interface ServerSidebarProps { 
    serverId : string;
}

const ServerSidebar: React.FC<ServerSidebarProps> = async ({
    serverId
}) => {
    const iconMap = {
        [ChannelType.TEXT]: <AlignLeft className="mr-2 h-4 w-4" />,
        [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
        [ChannelType.VIDEO]: <CameraIcon className="mr-2 h-4 w-4" />
    }
    
    const roleIconMap = {
        [MemberRole.GUEST]: <User2 className="h-4 w-4 ml-2" />,
        [MemberRole.PREMIUM]: <ShieldCheck className="h-4 w-4 ml-2 text-yellow-600" />,
        [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
        [MemberRole.ADMIN]: <Shield className="h-4 w-4 text-rose-500 ml-2 font-bold" />
    }

    const profile = await currentProfile();
    if(!profile) {
        return redirect("/");
    }
    const server = await db.server.findUnique({ 
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);

    //remove ourselves from the members list
    const members = server?.members.filter((member) => member.profileId !== profile?.id);

    if(!server) {
        redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile?.id)?.role;


    return ( 
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#19191a] bg-[#F2F3F5]">
            <ServerHeader 
            server={server}
            role={role}
            />
            <ScrollArea>
                <div className="mt-2">
                    <ServerSearch 
                    data = {[
                        {
                            label: "Textkanäle",
                            type: "channel",
                            data : textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                             }))
                        },
                        {
                            label: "Sprachkanäle",
                            type: "channel",
                            data : audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type],
                                type : channel.type
                             }))
                        },
                        {
                            label: "Video-Kanäle",
                            type: "channel",
                            data : videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type],
                                type : channel.type
                             }))
                        }, {
                            label: "Mitglieder",
                            type: "member",
                            data : members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.role]
                             }))
                        },
                    ]}/>
                </div>
                <Separator className="bg-zinc-600 dark:bg-zinc-900 rounded-md my-2"/>
                <div className="space-y-[2px]">
                {!!textChannels?.length && (
                    <div className="mb-2 ">
                        <ServerSection
                        label="Textkanäle"
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                        role={role} />
                        {textChannels.map((channel) => (
                            <ServerChannel 
                            key={channel.id}
                            channel={channel}
                            role={role}
                            server={server}
                           
                            />
                        ))}     
                    </div>
                
                )}
                </div>
                <div className="space-y-[2px]">
                {!!audioChannels?.length && (
                    <div className="mb-2 ">
                        <ServerSection
                        label="Sprachkanäle"
                        sectionType="channels"
                        channelType={ChannelType.AUDIO}
                        
                        role={role} />
                        {audioChannels.map((channel) => (
                            <ServerChannel 
                            key={channel.id}
                            channel={channel}
                            role={role}
                            server={server}
                            />
                        ))}     
                    </div>
                )}
                </div>
                <div className="space-y-[2px]">
                {!!videoChannels?.length && (
                    <div className="mb-2 ">
                        <ServerSection
                        label="Videokanäle"
                        sectionType="channels"
                        channelType={ChannelType.VIDEO}
                        role={role} />
                        {videoChannels.map((channel) => (
                            <ServerChannel 
                            key={channel.id}
                            channel={channel}
                            
                            role={role}
                            server={server}
                            />
                        ))}     
                    </div>
                )}
                </div>
                <div className="space-y-[1.5px]">
                {!!members?.length && (
                    <div className="mb-2 ">
                        <ServerSection
                        label="Mitglieder"
                        sectionType="members"
                        server={server}
                        role={role} />
                        {members.map((member) => (
                            <ServerMember
                            key={member.id}
                            member={member}
                            server={server} />
                        ))}     
                    </div>
                )}
                </div>
            </ScrollArea>
        </div>
     );
}
 
export default ServerSidebar;