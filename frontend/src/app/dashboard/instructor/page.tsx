'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Course } from '@/lib/types';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpenIcon, PencilSquareIcon, EyeIcon, PlusIcon, TrashIcon,
  UsersIcon, ChartBarIcon, AcademicCapIcon,
} from '@heroicons/react/24/outline';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

export default function InstructorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role === 'student') { router.push('/dashboard'); return; }

    api.get('/courses/my-courses').then(({ data }) => {
      setCourses(data.courses || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, router]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/courses/${deleteId}`);
      setCourses(prev => prev.filter(c => c._id !== deleteId));
      toast.success('Course deleted');
    } catch {
      toast.error('Failed to delete course');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await api.put(`/courses/${course._id}`, { isPublished: !course.isPublished });
      setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isPublished: !c.isPublished } : c));
      toast.success(course.isPublished ? 'Course unpublished' : 'Course published!');
    } catch {
      toast.error('Failed to update course');
    }
  };

  if (!user) return null;

  const totalStudents = courses.reduce((s, c) => s + (c.enrolledStudents?.length || 0), 0);
  const published = courses.filter(c => c.isPublished).length;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your courses and track performance</p>
        </div>
        <Link href="/dashboard/instructor/courses/new">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <PlusIcon className="h-4 w-4" /> New Course
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpenIcon, label: 'Total Courses', value: courses.length, color: 'text-blue-600 bg-blue-100' },
          { icon: EyeIcon, label: 'Published', value: published, color: 'text-green-600 bg-green-100' },
          { icon: UsersIcon, label: 'Total Students', value: totalStudents, color: 'text-violet-600 bg-violet-100' },
          { icon: AcademicCapIcon, label: 'Draft', value: courses.length - published, color: 'text-yellow-600 bg-yellow-100' },
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

      {/* Courses list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-blue-600" />
            My Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpenIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium mb-2">No courses yet</p>
              <p className="text-sm mb-4">Create your first course to start teaching</p>
              <Link href="/dashboard/instructor/courses/new">
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <PlusIcon className="h-4 w-4" /> Create Course
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course._id} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/20 transition-colors">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <BookOpenIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{course.title}</h3>
                      <Badge
                        variant={course.isPublished ? 'default' : 'secondary'}
                        className={course.isPublished ? 'bg-green-100 text-green-700' : ''}
                      >
                        {course.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpenIcon className="h-3 w-3" />{course.lessons?.length || 0} lessons</span>
                      <span className="flex items-center gap-1"><UsersIcon className="h-3 w-3" />{course.enrolledStudents?.length || 0} students</span>
                      <span className="capitalize">{course.level}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTogglePublish(course)}
                      className="text-xs"
                    >
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Link href={`/dashboard/instructor/courses/${course._id}/edit`}>
                      <Button size="sm" variant="outline">
                        <PencilSquareIcon className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/courses/${course._id}`}>
                      <Button size="sm" variant="outline">
                        <EyeIcon className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => setDeleteId(course._id)} className="text-red-500 hover:text-red-600">
                      <TrashIcon className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              This will permanently delete the course and all related data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Course'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
