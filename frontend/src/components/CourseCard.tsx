import Link from 'next/link';
import Image from 'next/image';
import { Course, User } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpenIcon, UsersIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface CourseCardProps {
  course: Course;
}

const levelColor = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function CourseCard({ course }: CourseCardProps) {
  const instructor = course.instructor as User;

  return (
    <Link href={`/courses/${course._id}`} className="block group h-full">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 border-border/60">
        {/* Thumbnail */}
        <div className="relative h-44 bg-gradient-to-br from-blue-500 to-violet-600 overflow-hidden flex-shrink-0">
          {course.thumbnail ? (
            <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpenIcon className="h-12 w-12 text-white/70" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${levelColor[course.level]}`}>
              {course.level}
            </span>
          </div>
          {course.price === 0 && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-600 text-white">Free</span>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{course.category}</p>
          <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                {instructor?.name?.slice(0, 2).toUpperCase() || 'IN'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{instructor?.name || 'Instructor'}</span>
          </div>
        </CardContent>

        <CardFooter className="px-4 py-3 border-t bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpenIcon className="h-3.5 w-3.5" />
              {course.lessons?.length ?? 0} lessons
            </span>
            <span className="flex items-center gap-1">
              <UsersIcon className="h-3.5 w-3.5" />
              {course.enrolledStudents?.length ?? 0}
            </span>
            {course.rating > 0 && (
              <span className="flex items-center gap-1">
                <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
                {course.rating.toFixed(1)}
              </span>
            )}
          </div>
          <span className="font-bold text-sm text-blue-600">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
