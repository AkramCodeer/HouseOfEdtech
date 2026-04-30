'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Progress as ProgressType } from '@/lib/types';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRightIcon, BookOpenIcon, ClockIcon, AcademicCapIcon,
  Squares2X2Icon, PlayCircleIcon, TrophyIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [progresses, setProgresses] = useState<ProgressType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role === 'instructor') { router.push('/dashboard/instructor'); return; }

    api.get('/progress').then(({ data }) => {
      setProgresses(data.progresses || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;

  const completed = progresses.filter(p => p.isCompleted).length;
  const inProgress = progresses.filter(p => !p.isCompleted && p.completionPercentage > 0).length;
  const avgProgress = progresses.length > 0
    ? Math.round(progresses.reduce((s, p) => s + p.completionPercentage, 0) / progresses.length)
    : 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {progresses.length === 0
              ? 'Start your learning journey today'
              : `You have ${inProgress} course${inProgress !== 1 ? 's' : ''} in progress`}
          </p>
        </div>
        <Link href="/courses">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2 hidden sm:flex">
            <BookOpenIcon className="h-4 w-4" /> Browse Courses
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpenIcon, label: 'Enrolled', value: progresses.length, color: 'text-blue-600 bg-blue-100' },
          { icon: PlayCircleIcon, label: 'In Progress', value: inProgress, color: 'text-yellow-600 bg-yellow-100' },
          { icon: TrophyIcon, label: 'Completed', value: completed, color: 'text-green-600 bg-green-100' },
          { icon: AcademicCapIcon, label: 'Avg Progress', value: `${avgProgress}%`, color: 'text-violet-600 bg-violet-100' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enrolled courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2">
            <Squares2X2Icon className="h-5 w-5 text-blue-600" />
            My Courses
          </CardTitle>
          <Link href="/courses">
            <Button variant="ghost" size="sm" className="gap-1 text-blue-600">
              Browse more <ArrowRightIcon className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : progresses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpenIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium mb-2">No courses yet</p>
              <p className="text-sm mb-4">Enroll in a course to start learning</p>
              <Link href="/courses">
                <Button className="bg-blue-600 hover:bg-blue-700">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {progresses.map((prog) => {
                const course = prog.course as { _id: string; title: string; thumbnail?: string; instructor?: { name: string } };
                return (
                  <div key={prog._id} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <BookOpenIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{course.title}</h3>
                        {prog.isCompleted && (
                          <Badge className="bg-green-100 text-green-700 text-xs flex-shrink-0">Completed</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <Progress value={prog.completionPercentage} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground flex-shrink-0">{prog.completionPercentage}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ClockIcon className="h-3 w-3" />
                        <span>Last accessed {formatDistanceToNow(new Date(prog.lastAccessedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <Link href={`/courses/${course._id}`}>
                      <Button size="sm" variant="outline" className="flex-shrink-0 gap-1">
                        <PlayCircleIcon className="h-3.5 w-3.5" />
                        {prog.completionPercentage === 0 ? 'Start' : prog.isCompleted ? 'Review' : 'Continue'}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
