import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const hadPubChap = course.chapters.some((chap) => chap.isPublished);

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hadPubChap) {
            return new NextResponse("Some fields are missing", { status: 400 });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("PUBLISH_COURSE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}