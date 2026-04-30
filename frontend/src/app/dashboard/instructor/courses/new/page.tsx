'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeftIcon, ArrowPathIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  videoUrl: z.string().optional(),
  duration: z.number().min(0).default(0),
});

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0).default(0),
  thumbnail: z.string().optional(),
  tags: z.string().optional(),
  lessons: z.array(lessonSchema),
});

type FormData = z.infer<typeof schema>;

const categories = ['Web Development', 'Data Science', 'Design', 'Marketing', 'Business', 'Mobile Development', 'DevOps', 'AI & Machine Learning'];

export default function CreateCoursePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [publishAfter, setPublishAfter] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { level: 'beginner', price: 0, lessons: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lessons' });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const tags = data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
      const { data: res } = await api.post('/courses', { ...data, tags });

      if (publishAfter) {
        await api.put(`/courses/${res.course._id}`, { isPublished: true });
      }

      for (const lesson of data.lessons) {
        await api.post(`/courses/${res.course._id}/lessons`, lesson);
      }

      toast.success(publishAfter ? 'Course created and published!' : 'Course saved as draft!');
      router.push('/dashboard/instructor');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/instructor">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground text-sm">Fill in the details below to create your course</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Course Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input id="title" placeholder="e.g. Complete Web Development Bootcamp" {...register('title')} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" placeholder="What will students learn?" rows={4} {...register('description')} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select onValueChange={(v) => setValue('category', v as string)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Level</Label>
                <Select defaultValue="beginner" onValueChange={(v) => setValue('level', v as FormData['level'])}>
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
                <Label htmlFor="price">Price (USD)</Label>
                <Input id="price" type="number" min="0" step="0.01" placeholder="0"
                  {...register('price', { valueAsNumber: true })} />
                <p className="text-xs text-muted-foreground">Set to 0 for a free course</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input id="thumbnail" type="url" placeholder="https://..." {...register('thumbnail')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="javascript, react, web (comma-separated)" {...register('tags')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lessons ({fields.length})</CardTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append({ title: '', content: '', videoUrl: '', duration: 0 })}
              className="gap-2"
            >
              <PlusIcon className="h-4 w-4" /> Add Lesson
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="text-sm">No lessons yet. Add your first lesson!</p>
              </div>
            )}
            {fields.map((field, i) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-blue-600">Lesson {i + 1}</span>
                  <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)} className="text-red-500 h-7 w-7 p-0">
                    <TrashIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input placeholder="Lesson title" {...register(`lessons.${i}.title`)} />
                {errors.lessons?.[i]?.title && <p className="text-xs text-red-500">{errors.lessons[i]?.title?.message}</p>}
                <Textarea placeholder="Lesson content (used for AI quiz generation)" rows={3} {...register(`lessons.${i}.content`)} />
                {errors.lessons?.[i]?.content && <p className="text-xs text-red-500">{errors.lessons[i]?.content?.message}</p>}
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Video URL (optional)" {...register(`lessons.${i}.videoUrl`)} />
                  <Input type="number" placeholder="Duration (minutes)" min="0"
                    {...register(`lessons.${i}.duration`, { valueAsNumber: true })} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex gap-3 justify-end">
          <Button type="submit" variant="outline" disabled={submitting} onClick={() => setPublishAfter(false)}>
            {submitting && !publishAfter ? <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" /> : null}
            Save as Draft
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting} onClick={() => setPublishAfter(true)}>
            {submitting && publishAfter ? <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" /> : null}
            Create & Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
