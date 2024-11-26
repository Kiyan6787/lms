import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
} 

export const getChapter = async ({
    userId,
    courseId,
    chapterId
}: GetChapterProps) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                price: true,
            }
        });

        const chapter = await db.chapter.findUnique({
            where : {
                id: chapterId,
                isPublished: true,
            }
        });

        if (!chapter || !course) {
            throw new Error("Chapter or Course does not exist");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where : {
                    courseId,
                }
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId,
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position
                    }
                },  
                orderBy: {
                    position: "asc"
                }
            });
        };

        const progress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            progress,
            purchase,
        }

    } catch (error) {
        console.log("GET_CHAPTER_ACTIONS_ERROR",error);
        return {
            chatper: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        }
    }
}