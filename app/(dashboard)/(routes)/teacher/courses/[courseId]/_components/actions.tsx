"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface ActionsProps {
    courseId: string
    disabled: boolean
    isPublished: boolean
}

export const Actions = ({
    courseId,
    disabled,
    isPublished,
}: ActionsProps) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const confetti = useConfettiStore();

    const onDelete = async () => {
        try {
            setIsLoading(true)

            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Course deleted successfully");
            router.refresh();
            router.push(`/teacher/courses`);
        } catch {
            toast.error("Failed to delete course")
        } finally {
            setIsLoading(false)
        }
    }

    const publish = async () => {
        try {
            setIsLoading(true)

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course unpublished successfully");
                router.refresh();
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course published successfully");
                confetti.onOpen();
                router.refresh();
            }
        } catch {
            toast.error("Failed to publish course")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={publish}
                disabled={disabled}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading} >
                <Trash className="h-4 w-4" />
            </Button>
            </ConfirmModal>
        </div>
    )
}