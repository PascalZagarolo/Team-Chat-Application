import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string
    }
}



const InvitecodePage : React.FC<InviteCodePageProps> = async ({
    params
}) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    if(!params.inviteCode) {
        redirect("/")
    }

    const existingServer  = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId : profile.id
                }
            }
        }
    })

    if (existingServer) {
        console.log("Nutzer ist schon im Server")
        redirect(`/servers/${existingServer.id}`)
        
    }

    const server = await db.server.update ({
        where : {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                        {
                        profileId : profile.id,
                        }
                    ]
                    }
                }
            });


            if(server) {
                return redirect(`/servers/${server.id}`)
            }
            return null;
    return ( 
        <div> DU WURDEST EINGELADEN !!!</div>
     );
}
 
export default InvitecodePage;