import { Category, Course } from "@prisma/client";
import { CourseCard } from "./course-card";

type CourseWithProgWithCat = Course & {
    category: Category | null;
    chapters: {id :string}[];
    progress: number | null;
}

interface CoursesListProps {
    items: CourseWithProgWithCat[];
}

export const CoursesList = ({
    items
}: CoursesListProps) => {
    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            {items.map((course) => (
                <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    imageUrl={course.imageUrl!}
                    chaptersLength={course.chapters.length}
                    price={course.price!}
                    category={course?.category?.name!}
                    progress={course.progress}
                />
            ))}
        </div>
        {items.length === 0 && (
            <div className="text-center text-sm text-muted-foreground mt-10 italic">
                No courses found
            </div>
        )}
        </div>
    )
}