import { db } from "./db";


export const getOrCreateFriendRequest = async (profileOneId: string, profileTwoId : string) => {

    let request = await findRequest(profileOneId, profileTwoId) || await getOrCreateFriendRequest(profileTwoId, profileOneId);

    
    if(!request) {
        request = await createNewRequest(profileOneId, profileTwoId);
    }

    return request;
 }


 export const findRequest = async (profileOneId : string, profileTwoId : string) => {
    try {
        return await db.request.findFirst({ 
            where : {
                AND : [
                    {   
                        profileOneId : profileOneId,
                        profileTwoId : profileTwoId,
                    }
                ]
            }, include : {
                profileOne :{
                    include : {
                        request: true
                    }
                }, profileTwo : {
                    include : {
                        request : true
                    }
                }
            }
    })} catch {
        console.log("Error : friendrequest.ts [FindRequest]");
        return null;
    }
 }


 export const createNewRequest = async (profileOneId : string, profileTwoId : string) => {
    try {
        return await db.request.create({ 
            data : {
                profileId : profileTwoId,
                profileOneId,
                profileTwoId
            }, include : {
                profileOne : {
                    include : {
                        request : true
                    }
                }, profileTwo : {
                    include : {
                        request : true
                    }
                }
            }
        })
    } catch{
        console.log("Error : friendrequest.ts [CreateNewRequest]");
        return null;
    }
 }