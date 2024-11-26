"use client";

import * as z from 'zod';
import axios from 'axios';
import {Button} from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Video } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Chapter, Course, MuxData } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';
import MuxPlayer from "@mux/mux-player-react"

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
};

const formschema = z.object({
    videoUrl: z.string().min(1)
});

export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((prev) => !prev);
    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof formschema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);
            toast.success("Video Added");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )} 
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Upload a Video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className='h-4 w-4 mr-2'/>
                            Change Video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <Video className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2'>
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endpoint='chapterVideo'
                        onChange={(url) => {
                            if (url) {
                                onSubmit({videoUrl: url});
                            }
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        	Upload a video to be displayed in the chapter
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className='text-xs text-muted-foreground mt-2'>
                    Videos can take some time to process. Refresh page if there is no video
                </div>
            )}
        </div>
    )
}