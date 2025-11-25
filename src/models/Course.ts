import mongoose, { Document, Schema } from 'mongoose';
import './Module'; // ensure Module model is registered

export interface ICourse extends Document {
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  duration: string;
  mode?: string;
  students?: string;
  rating?: number;
  level?: string;
  skills: string[];
  price?: string;
  originalPrice?: string;
  tags: string[];
  category: 'students' | 'professionals' | 'corporates';
  courseCategory?: string;
  instructor?: string;
  lessons?: number;
  projects?: number;
  certificate: boolean;
  language?: string;
  prerequisites?: string;

  curriculum: {
    module: string;
    lessons: number;
    duration: string;
    description: string;
  }[];

  syllabus: {
    module: string;
    topics: string[];
  }[];

  featured: boolean;
  trending: boolean;
  iconName: string;

  // New relation field
  modules: mongoose.Types.ObjectId[];
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: [true, 'Title is required'] },

    subtitle: String,

    description: { type: String, required: [true, 'Description is required'] },

    longDescription: String,

    duration: { type: String, required: [true, 'Duration is required'] },

    mode: {
      type: String,
      enum: [
        'Online',
        'Hybrid',
        'Weekend',
        'Evening',
        'Executive',
        'Weekend Executive',
        'Hybrid Executive',
        'Executive Online',
      ],
    },

    students: String,
    rating: Number,

    level: {
      type: String,
      enum: [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Beginner to Intermediate',
        'Intermediate to Advanced',
        'All Levels',
        'Executive Level',
        'Senior Management',
        'Management Level',
      ],
    },

    skills: { type: [String], default: [] },

    price: String,
    originalPrice: String,

    tags: { type: [String], default: [] },

    category: {
      type: String,
      enum: ['students', 'professionals', 'corporates'],
      required: true,
    },

    courseCategory: {
      type: String,
      enum: [
        'Data Science',
        'Full Stack Development',
        'Cyber Security',
        'Finance & Marketing',
        'Big Data Analytics',
        'Machine Learning',
        'Data Analytics & BI',
        'Business Analytics & AI',
        'Generative AI',
        'HR Analytics',
      ],
    },

    instructor: String,

    lessons: Number,
    projects: Number,

    certificate: { type: Boolean, default: false },

    language: String,

    prerequisites: String,

    curriculum: [
      {
        _id: false,
        module: String,
        lessons: Number,
        duration: String,
        description: String,
      },
    ],

    syllabus: {
      type: [
        {
          _id: false,
          module: {
            type: String,
            required: [true, 'Syllabus module title is required'],
          },
          topics: { type: [String], default: [] },
        },
      ],
      default: [],
    },

    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },

    iconName: { type: String, default: 'Code' },

    // ---- NEW FIELD ----
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
      },
    ],
  },
  { timestamps: true }
);

const Course =
  mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);

export default Course;
