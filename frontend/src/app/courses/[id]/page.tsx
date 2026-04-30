'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Course, Progress, User } from '@/lib/types';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpenIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon,
  AcademicCapIcon, ArrowPathIcon, LockClosedIcon, PlayCircleIcon, UsersIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

  const isEnrolled = progress !== null;
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data.course);

        if (user) {
          try {
            const { data: prog } = await api.get(`/progress/${id}`);
            setProgress(prog.progress);
          } catch { /* not enrolled */ }
        }
      } catch {
        toast.error('Course not found');
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user, router]);

  const handleEnroll = async () => {
    if (!user) { router.push('/login'); return; }
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      const { data } = await api.get(`/progress/${id}`);
      setProgress(data.progress);
      toast.success('Enrolled successfully! Happy learning!');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <Skeleton className="h-64 rounded-2xl mb-6" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!course) return null;

  const instructor = course.instructor as User;
  const totalDuration = course.lessons.reduce((s, l) => s + (l.duration || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="capitalize">{course.category}</Badge>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                  course.level === 'beginner' ? 'bg-green-500/20 text-green-300' :
                  course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>{course.level}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{course.title}</h1>
              <p className="text-slate-300 mb-6 leading-relaxed">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                {course.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">{course.rating.toFixed(1)}</span>
                    <span>({course.totalRatings} ratings)</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  {course.enrolledStudents?.length || 0} students
                </span>
                <span className="flex items-center gap-1">
                  <BookOpenIcon className="h-4 w-4" />
                  {course.lessons.length} lessons
                </span>
                {totalDuration > 0 && (
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    {Math.round(totalDuration / 60)}h total
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-5">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {instructor?.name?.slice(0, 2).toUpperCase() || 'IN'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-slate-400">Instructor</p>
                  <p className="font-medium">{instructor?.name}</p>
                </div>
              </div>
            </div>

            {/* Enroll card (desktop) */}
            <div className="hidden md:block">
              <EnrollCard
                course={course}
                isEnrolled={isEnrolled}
                isInstructor={isInstructor}
                progress={progress}
                enrolling={enrolling}
                onEnroll={handleEnroll}
                courseId={id}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Progress (if enrolled) */}
            {isEnrolled && progress && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-800">Your Progress</span>
                    <span className="text-blue-700 font-bold">{progress.completionPercentage}%</span>
                  </div>
                  <ProgressBar value={progress.completionPercentage} className="h-2 bg-blue-200" />
                  <p className="text-sm text-blue-700 mt-2">
                    {progress.completedLessons.length} of {course.lessons.length} lessons completed
                  </p>
                  {progress.isCompleted && (
                    <div className="mt-3 flex items-center gap-2 text-green-700 font-semibold">
                      <CheckIcon className="h-5 w-5" /> Course Completed!
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Lessons */}
            <div>
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              <div className="space-y-2">
                {course.lessons.length === 0 ? (
                  <p className="text-muted-foreground py-4">No lessons added yet.</p>
                ) : (
                  course.lessons.map((lesson, i) => {
                    const isCompleted = progress?.completedLessons.includes(lesson._id);
                    const isOpen = expandedLesson === i;
                    return (
                      <div key={lesson._id} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedLesson(isOpen ? null : i)}
                          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCompleted ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                            }`}>
                              {isCompleted ? <CheckIcon className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                            </div>
                            <span className="font-medium text-sm">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            {lesson.duration > 0 && (
                              <span className="text-xs">{lesson.duration}m</span>
                            )}
                            {isEnrolled ? (
                              <PlayCircleIcon className="h-4 w-4 text-blue-500" />
                            ) : (
                              <LockClosedIcon className="h-4 w-4" />
                            )}
                            {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 border-t bg-muted/20">
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-3">
                              {lesson.content}
                            </p>
                            {isEnrolled && (
                              <Link href={`/dashboard/learn/${id}/${lesson._id}`}>
                                <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 gap-2">
                                  <PlayCircleIcon className="h-4 w-4" />
                                  {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                                </Button>
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Tags */}
            {course.tags.length > 0 && (
              <div>
                <Separator className="mb-6" />
                <h3 className="font-semibold mb-3">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enroll card (mobile) */}
          <div className="md:hidden">
            <EnrollCard
              course={course}
              isEnrolled={isEnrolled}
              isInstructor={isInstructor}
              progress={progress}
              enrolling={enrolling}
              onEnroll={handleEnroll}
              courseId={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EnrollCard({
  course, isEnrolled, isInstructor, progress, enrolling, onEnroll, courseId,
}: {
  course: Course;
  isEnrolled: boolean;
  isInstructor: boolean;
  progress: Progress | null;
  enrolling: boolean;
  onEnroll: () => void;
  courseId: string;
}) {
  return (
    <Card className="shadow-xl sticky top-20">
      {course.thumbnail && (
        <div className="relative h-40 overflow-hidden rounded-t-xl">
          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
        </div>
      )}
      <CardContent className="p-5 space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </p>
        </div>

        {isEnrolled ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckIcon className="h-5 w-5" />
              <span>Already Enrolled</span>
            </div>
            {progress && (
              <>
                <ProgressBar value={progress.completionPercentage} className="h-2" />
                <p className="text-sm text-muted-foreground">{progress.completionPercentage}% complete</p>
              </>
            )}
            {course.lessons.length > 0 && (
              <Link href={`/dashboard/learn/${courseId}/${course.lessons[0]._id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                  <PlayCircleIcon className="h-4 w-4" />
                  {progress?.completionPercentage === 0 ? 'Start Learning' : 'Continue Learning'}
                </Button>
              </Link>
            )}
          </div>
        ) : isInstructor ? (
          <p className="text-sm text-muted-foreground text-center">Instructors cannot enroll in courses.</p>
        ) : (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={onEnroll}
            disabled={enrolling}
          >
            {enrolling ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <AcademicCapIcon className="h-4 w-4" />}
            {enrolling ? 'Enrolling...' : course.price === 0 ? 'Enroll for Free' : `Enroll for $${course.price}`}
          </Button>
        )}

        <Separator />
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><BookOpenIcon className="h-4 w-4" />{course.lessons.length} lessons</li>
          <li className="flex items-center gap-2 capitalize"><AcademicCapIcon className="h-4 w-4" />{course.level} level</li>
          <li className="flex items-center gap-2"><UsersIcon className="h-4 w-4" />{course.enrolledStudents?.length || 0} students enrolled</li>
        </ul>
      </CardContent>
    </Card>
  );
}
