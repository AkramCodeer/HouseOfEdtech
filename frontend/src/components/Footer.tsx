import Link from 'next/link';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                EduFlow
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered learning platform for the next generation. Learn from experts, track your progress, and earn certificates.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-foreground transition-colors">Browse Courses</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Become a Student</Link></li>
              <li><Link href="/register?role=instructor" className="hover:text-foreground transition-colors">Become an Instructor</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EduFlow. Built for House of EdTech Assignment.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made by</span>
            <span className="font-semibold text-foreground">Akram</span>
            <span className="mx-1">·</span>
            <Link
              href="https://github.com/AkramCodeer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              GitHub
            </Link>
            <span className="mx-1">·</span>
            <Link
              href="https://www.linkedin.com/in/akram-khan-5a7a06201/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
