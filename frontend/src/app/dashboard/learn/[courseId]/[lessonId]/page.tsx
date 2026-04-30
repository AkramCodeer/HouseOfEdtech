'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Course, Progress } from '@/lib/types';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeftIcon, ArrowRightIcon, CheckIcon, CheckCircleIcon, ChevronLeftIcon,
  ChevronRightIcon, ArrowTopRightOnSquareIcon, ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export default function LessonViewerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }

    const load = async () => {
      try {
        const [{ data: courseData }, { data: progData }] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/progress/${courseId}`),
        ]);
        setCourse(courseData.course);
        setProgress(progData.progress);
      } catch {
        toast.error('Failed to load lesson');
        router.push(`/courses/${courseId}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, user, router]);

  const currentIndex = course?.lessons.findIndex(l => l._id === lessonId) ?? -1;
  const currentLesson = course?.lessons[currentIndex] ?? null;
  const prevLesson = currentIndex > 0 ? course?.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && course && currentIndex < course.lessons.length - 1
    ? course.lessons[currentIndex + 1] : null;

  const isCompleted = progress?.completedLessons.includes(lessonId);

  const handleMarkComplete = async () => {
    if (isCompleted) return;
    setMarking(true);
    try {
      const { data } = await api.post(`/progress/${courseId}/lessons/${lessonId}/complete`);
      setProgress(data.progress);
      toast.success('Lesson marked as complete!');
      if (data.progress.isCompleted) {
        toast.success('Congratulations! You completed the course!', { duration: 5000 });
      }
    } catch {
      toast.error('Failed to mark lesson complete');
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-72 border-r p-4 space-y-3 hidden md:block">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-muted/20 overflow-y-auto flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b">
          <Link href={`/courses/${courseId}`}>
            <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
              <ArrowLeftIcon className="h-4 w-4" /> Back to Course
            </Button>
          </Link>
          <h2 className="font-semibold text-sm mt-3 line-clamp-2">{course.title}</h2>
          {progress && (
            <div className="mt-2">
              <ProgressBar value={progress.completionPercentage} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">{progress.completionPercentage}% complete</p>
            </div>
          )}
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {course.lessons.map((lesson, i) => {
            const isActive = lesson._id === lessonId;
            const isDone = progress?.completedLessons.includes(lesson._id);
            return (
              <Link key={lesson._id} href={`/dashboard/learn/${courseId}/${lesson._id}`}>
                <div className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors',
                  isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}>
                  <div className={cn(
                    'h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
                    isDone ? 'bg-green-100 text-green-600' : isActive ? 'bg-blue-600 text-white' : 'bg-muted-foreground/20'
                  )}>
                    {isDone ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className="line-clamp-2 leading-snug">{lesson.title}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 md:hidden">
            <Link href={`/courses/${courseId}`} className="hover:text-foreground">
              ← Back to course
            </Link>
          </div>

          {/* Lesson header */}
          <div className="mb-6">
            <p className="text-sm text-blue-600 font-medium mb-1">
              Lesson {currentIndex + 1} of {course.lessons.length}
            </p>
            <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
          </div>

          {/* Video */}
          {currentLesson.videoUrl && (
            <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
              <iframe
                src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                title={currentLesson.title}
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-slate max-w-none mb-8">
            <div className="p-6 bg-card border rounded-xl leading-relaxed text-foreground whitespace-pre-wrap">
              {currentLesson.content}
            </div>
          </div>

          {/* Video link if not embeddable */}
          {currentLesson.videoUrl && (
            <a href={currentLesson.videoUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="mb-6 gap-2">
                <ArrowTopRightOnSquareIcon className="h-4 w-4" /> Open Video
              </Button>
            </a>
          )}

          <Separator className="my-6" />

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {prevLesson && (
                <Link href={`/dashboard/learn/${courseId}/${prevLesson._id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ChevronLeftIcon className="h-4 w-4" /> Previous
                  </Button>
                </Link>
              )}
            </div>

            <Button
              onClick={handleMarkComplete}
              disabled={isCompleted || marking}
              className={cn(
                'gap-2',
                isCompleted ? 'bg-green-600 hover:bg-green-600 cursor-default' : 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              {marking ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : isCompleted ? (
                <CheckCircleIcon className="h-4 w-4" />
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
              {isCompleted ? 'Completed!' : 'Mark as Complete'}
            </Button>

            {nextLesson ? (
              <Link href={`/dashboard/learn/${courseId}/${nextLesson._id}`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2">
                  Next <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href={`/courses/${courseId}`}>
                <Button size="sm" variant="outline" className="gap-2">
                  Back to Course <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Complete course message */}
          {progress?.isCompleted && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
              <CheckCircleIcon className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-green-800 text-lg">Course Completed!</h3>
              <p className="text-green-700 text-sm mt-1">Congratulations on finishing the course.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
