'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CourseCard from '@/components/CourseCard';
import { Course } from '@/lib/types';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpenIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const categories = ['Web Development', 'Data Science', 'Design', 'Marketing', 'Business', 'Mobile Development', 'DevOps', 'AI & Machine Learning'];
const levels = ['beginner', 'intermediate', 'advanced'];

function CoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const page = Number(searchParams.get('page') || 1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (level) params.set('level', level);
      params.set('page', String(page));
      params.set('limit', '12');

      const { data } = await api.get(`/courses?${params}`);
      setCourses(data.courses || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, level, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (level) params.set('level', level);
    params.set('page', '1');
    router.push(`/courses?${params}`);
  };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setLevel('');
    router.push('/courses');
  };

  const hasFilters = search || category || level;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Browse Courses</h1>
        <p className="text-muted-foreground">
          {total > 0 ? `${total} courses available` : 'Explore our course catalog'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={(v) => setCategory(v ?? '')}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={(v) => setLevel(v ?? '')}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((l) => (
                <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" /> Search
          </Button>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <XMarkIcon className="h-4 w-4 mr-2" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('page', String(p));
                    router.push(`/courses?${params}`);
                  }}
                  className={p === page ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  {p}
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpenIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="mb-4">Try adjusting your search or filters.</p>
          <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense>
      <CoursesContent />
    </Suspense>
  );
}
