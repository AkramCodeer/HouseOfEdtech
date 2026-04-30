import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  lessons: ILesson[];
  enrolledStudents: mongoose.Types.ObjectId[];
  tags: string[];
  isPublished: boolean;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: Number, default: 0 },
  order: { type: Number, required: true },
});

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    price: { type: Number, default: 0, min: 0 },
    lessons: [lessonSchema],
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<ICourse>('Course', courseSchema);
