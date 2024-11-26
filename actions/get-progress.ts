import { db } from "@/lib/db"

export const getProgress = async (
    userId: string,
    courseId: string
): Promise<number> => {
    try {
        const pubChaps = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            },
            select: {
                id: true
            }
        });

        const pubChapIds = pubChaps.map(chap => chap.id);

        const validCompletedChaps = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: pubChapIds
                },
                isCompleted: true
            }
        });

        const percent = (validCompletedChaps / pubChaps.length) * 100;

        return percent;

    } catch (error) {
        console.log("GET_PROGRESS_ERROR", error);
        return 0;    
    }
}