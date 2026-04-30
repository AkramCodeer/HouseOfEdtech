import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  _id: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface IQuiz extends Document {
  _id: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  lesson?: mongoose.Types.ObjectId;
  title: string;
  questions: IQuestion[];
  passingScore: number;
  isAIGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizAttempt extends Document {
  student: mongoose.Types.ObjectId;
  quiz: mongoose.Types.ObjectId;
  answers: number[];
  score: number;
  passed: boolean;
  attemptedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
});

const quizSchema = new Schema<IQuiz>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    lesson: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    questions: [questionSchema],
    passingScore: { type: Number, default: 70 },
    isAIGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const quizAttemptSchema = new Schema<IQuizAttempt>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ type: Number }],
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  attemptedAt: { type: Date, default: Date.now },
});

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);
