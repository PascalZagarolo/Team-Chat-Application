import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    src?: string,
    className?: string,
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    src,
    className
}) => {
    return ( 
        <Avatar className={cn("h-6 w-6 md:h-9 md:w-9")}>
            <AvatarImage src={src} />
        </Avatar>
     );
}
 
export default UserAvatar;
 
