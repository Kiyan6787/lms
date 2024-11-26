"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import React from "react"

interface ConfirmModalProps {
    children: React.ReactNode
    onConfirm: () => void
}

export const ConfirmModal = ({ 
    children, 
    onConfirm 
}: ConfirmModalProps) => {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm</AlertDialogTitle>
                    <AlertDialogDescription>You cannot undo this action</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}