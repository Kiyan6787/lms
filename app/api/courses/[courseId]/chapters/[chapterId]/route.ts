import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  });

export async function PATCH(
    req: Request,
    { params }: {params: { courseId: string; chapterId: string; }}
) {
    try {
        const { userId } = auth();
        const {isPublished, ...values} = await req.json();

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

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        });

        //TODO: Handle video upload
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }

            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false
            });

            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id ?? "",
                    chapterId: params.chapterId
                }
            });
        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("CHAPTERS_COURSES_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: {params: { courseId: string; chapterId: string; }}
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

        if (!chapter) {
            return new NextResponse("Chapter Not Found", { status: 404 });
        }

        if (chapter.videoUrl) {
            const exMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (exMuxData) {
                await video.assets.delete(exMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: exMuxData.id
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        });

        const publishedChap = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if (!publishedChap.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(deletedChapter);

    } catch (error) {
        console.log("CHAPTERS_DELETE_COURSES_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}