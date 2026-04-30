'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeftIcon, ArrowPathIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  category: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0),
  thumbnail: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const categories = ['Web Development', 'Data Science', 'Design', 'Marketing', 'Business', 'Mobile Development', 'DevOps', 'AI & Machine Learning'];

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', videoUrl: '', duration: 0 });
  const [addingLesson, setAddingLesson] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: standardSchemaResolver(schema),
  });

  useEffect(() => {
    api.get(`/courses/${id}`).then(({ data }) => {
      const c: Course = data.course;
      setCourse(c);
      reset({
        title: c.title,
        description: c.description,
        category: c.category,
        level: c.level,
        price: c.price,
        thumbnail: c.thumbnail || '',
        tags: c.tags.join(', '),
      });
    }).catch(() => {
      toast.error('Course not found');
      router.push('/dashboard/instructor');
    }).finally(() => setLoading(false));
  }, [id, reset, router]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const tags = data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
      await api.put(`/courses/${id}`, { ...data, tags });
      toast.success('Course updated!');
    } catch {
      toast.error('Failed to update course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.title || !newLesson.content) {
      toast.error('Title and content are required');
      return;
    }
    setAddingLesson(true);
    try {
      const { data } = await api.post(`/courses/${id}/lessons`, newLesson);
      setCourse(data.course);
      setNewLesson({ title: '', content: '', videoUrl: '', duration: 0 });
      toast.success('Lesson added!');
    } catch {
      toast.error('Failed to add lesson');
    } finally {
      setAddingLesson(false);
    }
  };

  const handleGenerateQuiz = async (lessonId: string, content: string) => {
    setGeneratingQuiz(lessonId);
    try {
      await api.post(`/quizzes/course/${id}/generate-ai`, { lessonContent: content, numQuestions: 5 });
      toast.success('AI quiz generated successfully!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to generate quiz');
    } finally {
      setGeneratingQuiz(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/instructor">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground text-sm truncate max-w-xs">{course.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Course Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register('title')} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} {...register('description')} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue={course.category} onValueChange={(v) => setValue('category', v as string)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select defaultValue={course.level} onValueChange={(v) => setValue('level', v as FormData['level'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (USD)</Label>
                <Input type="number" min="0" step="0.01" {...register('price', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input {...register('thumbnail')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input {...register('tags')} />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
              {submitting && <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Lessons */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Lessons ({course.lessons.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {course.lessons.map((lesson, i) => (
            <div key={lesson._id} className="flex items-start justify-between p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{i + 1}. {lesson.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lesson.content}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-3 gap-1 text-xs flex-shrink-0 text-violet-600 border-violet-200 hover:bg-violet-50"
                onClick={() => handleGenerateQuiz(lesson._id, lesson.content)}
                disabled={generatingQuiz === lesson._id}
              >
                {generatingQuiz === lesson._id
                  ? <ArrowPathIcon className="h-3 w-3 animate-spin" />
                  : <SparklesIcon className="h-3 w-3" />}
                AI Quiz
              </Button>
            </div>
          ))}

          {/* Add new lesson */}
          <div className="border-2 border-dashed rounded-lg p-4 space-y-3 mt-4">
            <p className="font-medium text-sm text-muted-foreground">Add New Lesson</p>
            <Input
              placeholder="Lesson title"
              value={newLesson.title}
              onChange={e => setNewLesson(p => ({ ...p, title: e.target.value }))}
            />
            <Textarea
              placeholder="Lesson content..."
              rows={3}
              value={newLesson.content}
              onChange={e => setNewLesson(p => ({ ...p, content: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Video URL (optional)"
                value={newLesson.videoUrl}
                onChange={e => setNewLesson(p => ({ ...p, videoUrl: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Duration (min)"
                value={newLesson.duration}
                onChange={e => setNewLesson(p => ({ ...p, duration: Number(e.target.value) }))}
              />
            </div>
            <Button size="sm" onClick={handleAddLesson} disabled={addingLesson} className="gap-2">
              {addingLesson ? <ArrowPathIcon className="h-3 w-3 animate-spin" /> : <PlusIcon className="h-3 w-3" />}
              Add Lesson
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
