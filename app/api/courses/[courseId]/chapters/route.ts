import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const owner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        });

        if (!owner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const prevChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: "desc",
            },
        });

        const nextPos = prevChapter ? prevChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position: nextPos,
            }
        });

        return NextResponse.json(chapter);

    } catch {
        console.log("CHAPTERS", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}