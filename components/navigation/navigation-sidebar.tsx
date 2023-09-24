import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import NavigationAction from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSideBar = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    return ( 
        <div
            className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#161617] bg-[#d1d2d4] py-3 "> 
            <NavigationAction />
            <Separator
            className="h-[2px] bg-zinc-300 dark:bg-zinc-900 rounded-md w-10 mx-auto" 
            />
                <ScrollArea className="flex-1 w-full">
                    {servers.map((servers) => (
                        <div key={servers.id} className="mb-5">
                            <NavigationItem id={servers.id} imageUrl={servers.imageUrl} name={servers.name}/>
                        </div>
                    ))}
                </ScrollArea>
                <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                        <ModeToggle />
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "h-[40px] w-[40px]"
                                }
                            }} />
                </div>
            </div>
     );
}
 
export default NavigationSideBar;