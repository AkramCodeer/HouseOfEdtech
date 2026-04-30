'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeftIcon, ArrowRightIcon, CheckIcon, CheckCircleIcon, ArrowPathIcon,
  ArrowUturnLeftIcon, SparklesIcon, TrophyIcon, XMarkIcon, XCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface QuizFeedback {
  question: string;
  yourAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation?: string;
}

interface QuizResult {
  score: number;
  passed: boolean;
  feedback: QuizFeedback[];
}

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [quiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }

    api.get(`/quizzes/${quizId}`).catch(() => {
      // Quiz endpoint might need adjustment - try fetching via course
    });
    setLoading(false);
  }, [quizId, user, router]);

  const handleAnswer = (qIndex: number, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const answersArray = quiz.questions.map((_, i) => answers[i] ?? -1);
    if (answersArray.some(a => a === -1)) {
      toast.error('Please answer all questions before submitting');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers: answersArray });
      setResult(data);
    } catch {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <XCircleIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-bold mb-2">Quiz not found</h2>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  const totalQ = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPct = (answeredCount / totalQ) * 100;

  // Results view
  if (result) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Score card */}
        <Card className={cn('mb-6 border-2', result.passed ? 'border-green-300' : 'border-red-300')}>
          <CardContent className="p-8 text-center">
            <div className={cn(
              'h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4',
              result.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            )}>
              {result.passed ? <TrophyIcon className="h-10 w-10" /> : <ArrowUturnLeftIcon className="h-10 w-10" />}
            </div>
            <h2 className="text-3xl font-bold mb-1">{result.score}%</h2>
            <p className={cn('text-lg font-semibold mb-2', result.passed ? 'text-green-600' : 'text-red-600')}>
              {result.passed ? 'Passed!' : 'Not Passed'}
            </p>
            <p className="text-muted-foreground text-sm">
              {result.passed
                ? `Great job! You passed with ${result.score}%`
                : `You need ${quiz.passingScore}% to pass. Keep practicing!`}
            </p>
          </CardContent>
        </Card>

        {/* Feedback */}
        <div className="space-y-4 mb-6">
          <h3 className="font-bold text-lg">Question Review</h3>
          {result.feedback.map((fb, i) => (
            <Card key={i} className={cn('border', fb.isCorrect ? 'border-green-200' : 'border-red-200')}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                    fb.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  )}>
                    {fb.isCorrect ? <CheckIcon className="h-3.5 w-3.5" /> : <XMarkIcon className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-2">{i + 1}. {fb.question}</p>
                    <div className="space-y-1 text-xs">
                      <p className={cn('flex items-center gap-1', fb.isCorrect ? 'text-green-600' : 'text-red-600')}>
                        Your answer: {quiz.questions[i]?.options[fb.yourAnswer] || 'No answer'}
                      </p>
                      {!fb.isCorrect && (
                        <p className="text-green-600">
                          Correct: {quiz.questions[i]?.options[fb.correctAnswer]}
                        </p>
                      )}
                      {fb.explanation && (
                        <p className="text-muted-foreground mt-1 italic">{fb.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRetry} className="gap-2">
            <ArrowUturnLeftIcon className="h-4 w-4" /> Try Again
          </Button>
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
            Done
          </Button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          {quiz.isAIGenerated && (
            <Badge className="bg-violet-100 text-violet-700 gap-1">
              <SparklesIcon className="h-3 w-3" /> AI Generated
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Progress value={progressPct} className="flex-1 h-2" />
          <span className="text-sm text-muted-foreground flex-shrink-0">
            {answeredCount}/{totalQ} answered
          </span>
        </div>
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">Question {currentQ + 1} of {totalQ}</span>
            {answers[currentQ] !== undefined && (
              <Badge variant="secondary" className="text-xs">Answered</Badge>
            )}
          </div>
          <CardTitle className="text-lg leading-snug">{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(currentQ, i)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all text-sm',
                  answers[currentQ] === i
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-border hover:border-blue-300 hover:bg-muted/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs border-2 transition-colors',
                    answers[currentQ] === i ? 'border-blue-500 bg-blue-500 text-white' : 'border-border'
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={currentQ === 0}
          onClick={() => setCurrentQ(q => q - 1)}
          className="gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Previous
        </Button>

        <div className="flex items-center gap-2">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={cn(
                'h-2.5 w-2.5 rounded-full transition-all',
                i === currentQ ? 'bg-blue-600 w-5' : answers[i] !== undefined ? 'bg-green-400' : 'bg-muted-foreground/30'
              )}
            />
          ))}
        </div>

        {currentQ < totalQ - 1 ? (
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => setCurrentQ(q => q + 1)}
          >
            Next <ArrowRightIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 gap-2"
            onClick={handleSubmit}
            disabled={submitting || answeredCount < totalQ}
          >
            {submitting ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <CheckCircleIcon className="h-4 w-4" />}
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
