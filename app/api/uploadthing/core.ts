import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";

 
const f = createUploadthing();
 
const handleAuth = () => {
    const { userId } = auth();

    if(!userId) {
        throw new Error("Nicht autorisiert")

    }

    return {userId : userId}
}
 
export const ourFileRouter = {
    serverImage: f({ image : { maxFileSize: "4MB" , maxFileCount : 1} })
        .middleware(() =>  handleAuth())
        .onUploadComplete(() => {}),

        messageFile: f([ "image", "pdf", "video"])
        .middleware(() =>  handleAuth())
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
