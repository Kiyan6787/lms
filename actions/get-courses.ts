import { db } from "@/lib/db"
import { Category, Course } from "@prisma/client"
import { getProgress } from "./get-progress"

type CourseWithProgressWithCategory = Course & {
    progress: number;
    category: Category | null;
    chapters: {id: string}[];
}

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;  
}

export const getCourses = async ({
    userId,
    title,
    categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId: categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: 0
                    }
                }

                const percent = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: percent
                }
            })
        );

        return coursesWithProgress;

    } catch (error) {
        console.log("GET_COURSES_ERROR", error);
        return [];
    }
}