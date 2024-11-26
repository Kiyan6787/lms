"use client"

interface CourseEnrollButtonProps {
    price: number
    courseId: string
}

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"

export const CourseEnrollButton = ({
    price,
    courseId
}: CourseEnrollButtonProps) => {
    return (
        <Button className="w-full md:w-auto" size="sm">
            Buy this for {formatPrice(price)}
        </Button>
    )
}