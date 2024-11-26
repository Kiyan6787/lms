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

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId
            }
        });

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const publishedChap = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedChap);
    } catch (error) {
        console.log("PUBLISH ERROR", error);    
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}