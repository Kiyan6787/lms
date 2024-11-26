import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const owner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!owner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unpublishedChap = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: false
            }
        });

        const chapsinCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if (!chapsinCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(unpublishedChap);
    } catch (error) {
        console.log("UNPUBLISH ERROR", error);    
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}