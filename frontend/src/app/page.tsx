'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';
import { Course } from '@/lib/types';
import api from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRightIcon, BookOpenIcon, AcademicCapIcon, SparklesIcon,
  TrophyIcon, UsersIcon, BoltIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { icon: UsersIcon, label: 'Active Students', value: '10,000+' },
  { icon: BookOpenIcon, label: 'Courses Available', value: '500+' },
  { icon: AcademicCapIcon, label: 'Expert Instructors', value: '200+' },
  { icon: TrophyIcon, label: 'Certificates Issued', value: '25,000+' },
];

const features = [
  {
    icon: SparklesIcon,
    title: 'AI-Generated Quizzes',
    desc: 'Our AI automatically creates quizzes from lesson content to reinforce your learning.',
  },
  {
    icon: BoltIcon,
    title: 'Track Your Progress',
    desc: 'Visual progress tracking keeps you motivated and shows exactly where you stand.',
  },
  {
    icon: TrophyIcon,
    title: 'Earn Certificates',
    desc: 'Complete courses and earn shareable certificates to showcase your skills.',
  },
];

export default function LandingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses?limit=6').then(({ data }) => {
      setCourses(data.courses || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 text-white py-24 md:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
              <SparklesIcon className="h-4 w-4 text-yellow-300" />
              AI-Powered Learning Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Learn Smarter, <br />
              <span className="text-yellow-300">Achieve More</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Access expert-led courses, get AI-generated quizzes tailored to each lesson, track your progress, and earn certificates — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 gap-2">
                  Start Learning Free <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white/40 text-black hover:bg-white/10 px-8">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-400/30 blur-3xl" />
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 mb-3 mx-auto">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EduFlow?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to learn effectively, all in one platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-8 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white mb-4 mx-auto">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Featured Courses</h2>
              <p className="text-muted-foreground mt-1">Hand-picked courses from expert instructors</p>
            </div>
            <Link href="/courses">
              <Button variant="outline" className="gap-2 hidden sm:flex">
                View All <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpenIcon className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>No courses published yet. Check back soon!</p>
              <Link href="/register?role=instructor" className="mt-4 inline-block">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Become an Instructor</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of learners already advancing their careers with EduFlow.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-10 gap-2">
              Get Started for Free <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
