"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { File, FileEdit, X } from "lucide-react";
import { error } from "console";
import  Image from 'next/image';

interface FileUploadProps {
    endpoint: "messageFile" | "serverImage";
    value? : string;
    onChange: (url?:string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
    endpoint,
    value,
    onChange
}) => {

    const fileType = value?.split(".").pop();

    if(value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image
                fill
                src={value}
                alt="Upload"
                className="rounded-full"
                />

                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500
                    text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button">
                        <X className="h-5 w-5"/>
                </button>
            </div>
        )
    }

    if(value && fileType === "pdf") {
        return (
        <div className="relative flex items-center p-2 m-2 rounded-md bg-background-10">
            <File className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
            <a href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
                { value }
            </a>
            <button
                    onClick={() => onChange("")}
                    className="bg-rose-500
                    text-white p-1 rounded-full absolute -top-5 -right-2 shadow-sm"
                    type="button">
                        <X className="h-4 w-4"/>
                </button>
        </div>
        )
    }

    return ( 
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError ={(error : Error) => {
                console.log("Fehler : ", error);
            }}/>     
        
    );
}
 
export default FileUpload;