"use client";

import * as z from 'zod';
import axios from 'axios';
import {Button} from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Attachment, Course } from '@prisma/client';
import { FileUpload } from '@/components/file-upload';

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[]};
    courseId: string;
};

const formschema = z.object({
    url: z.string().min(1, {
        message: "Attachments are required"
    })
});

export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((prev) => !prev);
    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof formschema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, data);
            toast.success("Attachments updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted");
            router.refresh();
        } catch {
            toast.error("An error occurred");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )} 
                    {!isEditing && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                   {initialData.attachments.length === 0 && (
                    <p className='text-sm mt-2 text-slate-500 italic'>
                        No attachments uploaded yet.
                    </p>
                   )} 
                   {initialData.attachments.length > 0 && (
                    <div className='space-y-2'>
                        {initialData.attachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className='flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-md'
                            >
                                <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                <p className='text-xs truncate'>
                                    {attachment.name}
                                </p>
                                {deletingId === attachment.id && (
                                    <div>
                                        <Loader2 className='h-4 w-4 animate-spin'/>
                                    </div>
                                )}
                                {deletingId !== attachment.id && (
                                    <button
                                        className='ml-auto hover:opacity-75 transition'
                                        onClick={() => onDelete(attachment.id)}
                                    >
                                        <X className='h-4 w-4'/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                   )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endpoint='courseAttachment'
                        onChange={(url) => {
                            if (url) {
                                onSubmit({url: url});
                            }
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        	Add anything your students might need.
                    </div>
                </div>
            )}
        </div>
    )
}