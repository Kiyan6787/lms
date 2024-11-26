import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { list } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }   

        const owner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!owner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for (let item of list) {
            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }   
            });
        }

        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.log("COURSE_REORDER_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}