import { Channel, Channeltype, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "invite" | "edit" | "members" | "createChannel" | "leave" | "delete" | "deleteChannel" | "editChannel" | "deleteMessage"
| "messageFile";

interface ModalData {
    server? : Server;
    channelType? : Channeltype
    channel? : Channel
    apiUrl? : string;
    query? : Record<string, any>;
}

interface ModalStore {
    type: ModalType | null;
    data : ModalData 
    isOpen: boolean;
    onOpen: (type : ModalType, data? : ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data : {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null }),
}));