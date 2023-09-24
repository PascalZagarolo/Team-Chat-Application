import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db"

export const initialProfile = async () => {

    const user = await currentUser();

    if (!user) {
        redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: user?.id
        }
    });

    if (profile) {
        return profile;
    }


    const fullName = user?.lastName === null ? user?.firstName : `${user?.firstName} ${user?.lastName}`;
   
    const newProfile = await db.profile.create({
        data :
            {
            userId: user!.id,
            name: `${fullName}`,
            username: fullName!.charAt(0).toUpperCase() + fullName!.slice(1).toLowerCase(),
            imageUrl: user!.imageUrl,
            email: user!.emailAddresses[0].emailAddress
        }
    });
   
    

    
    
    return newProfile;
}