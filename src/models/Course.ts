import mongoose, { Document, Schema } from 'mongoose';

// Interface for a single lecture/video inside a section
interface ILecture {
  title: string;
  duration: string; // e.g., "10:05"
  isPreview?: boolean; // To show a "play" icon or "lock" icon
}

// Interface for a syllabus section (e.g., "Introduction to Data Science")
interface ISyllabusSection {
  title: string;
  lectures: ILecture[];
}

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

  // We keep this for backward compatibility if you use it elsewhere, 
  // but 'syllabus' below is now the main one.
  curriculum: {
    module: string;
    lessons: number;
    duration: string;
    description: string;
  }[];

  // --- UPDATED STRUCTURE FOR UDEMY STYLE ACCORDION ---
  syllabus: ISyllabusSection[];

  featured: boolean;
  trending: boolean;
  iconName: string;
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
        'Online', 'Hybrid', 'Weekend', 'Evening', 'Executive',
        'Weekend Executive', 'Hybrid Executive', 'Executive Online',
      ],
    },
    students: String,
    rating: Number,
    level: {
      type: String,
      enum: [
        'Beginner', 'Intermediate', 'Advanced', 'Beginner to Intermediate',
        'Intermediate to Advanced', 'All Levels', 'Executive Level',
        'Senior Management', 'Management Level',
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
        'Data Science', 'Full Stack Development', 'Cyber Security',
        'Finance & Marketing', 'Big Data Analytics', 'Machine Learning',
        'Data Analytics & BI', 'Business Analytics & AI', 'Generative AI',
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

    // --- UPDATED SYLLABUS SCHEMA ---
    syllabus: [
      {
        _id: false, // We don't need IDs for sections usually
        title: { type: String, required: true }, // e.g. "Introduction to Data Science"
        lectures: [
          {
            _id: false,
            title: { type: String, required: true }, // e.g. "What is Data Science?"
            duration: { type: String, default: "05:00" }, // e.g. "9:10"
            isPreview: { type: Boolean, default: false }
          }
        ]
      },
    ],

    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    iconName: { type: String, default: 'Code' },
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);

export default Course;