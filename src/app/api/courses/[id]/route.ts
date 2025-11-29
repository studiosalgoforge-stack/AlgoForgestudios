/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { CourseService } from '@/lib/courseService';
import mongoose from 'mongoose';
import "@/models/Content";
import "@/models/Module";
import "@/models/Course";

// --- UPDATED VALIDATION FOR NEW SYLLABUS STRUCTURE ---
const validateUpdateData = (data: any) => {
  if (data.syllabus !== undefined) {
    if (!Array.isArray(data.syllabus)) {
      throw new Error('Syllabus must be an array');
    }

    data.syllabus = data.syllabus.map((section: any, i: number) => {
      if (!section || typeof section !== 'object') {
        throw new Error(`Syllabus item at index ${i} must be an object`);
      }

      // Check for the new 'title' field
      if (!section.title || typeof section.title !== 'string') {
        throw new Error(`Syllabus section title at index ${i} is required`);
      }

      // Ensure lectures array exists
      if (!section.lectures) section.lectures = [];
      else if (!Array.isArray(section.lectures)) {
        throw new Error(`Lectures at index ${i} must be an array`);
      }

      // Sanitize lectures
      const sanitizedLectures = section.lectures.map((lec: any) => ({
        title: lec.title || "Untitled Lecture",
        duration: lec.duration || "00:00",
        isPreview: !!lec.isPreview
      }));

      return {
        title: section.title.trim(),
        lectures: sanitizedLectures
      };
    });
  }

  delete data._id;
  delete data.createdAt;
  delete data.updatedAt;

  return data;
};

/* --------------------------------------
   GET /api/courses/[id]
-------------------------------------- */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params; 

    const { searchParams } = new URL(req.url);
    const populate = searchParams.get('populate');

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const course = await CourseService.getCourseById(id, populate === 'true');

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error: any) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

/* --------------------------------------
   PUT /api/courses/[id]
-------------------------------------- */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params; 

    const updateData = await req.json();
    const validated = validateUpdateData(updateData);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const course = await CourseService.updateCourse(id, validated);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error: any) {
    console.error('Error updating course:', error);

    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message, details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

/* --------------------------------------
   PATCH /api/courses/[id]
-------------------------------------- */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params; 

    const updateData = await req.json();
    const validated = validateUpdateData(updateData);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const course = await CourseService.patchCourse(id, validated);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error: any) {
    console.error('Error patching course:', error);

    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message, details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

/* --------------------------------------
   DELETE /api/courses/[id]
-------------------------------------- */
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const course = await CourseService.deleteCourse(id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Course deleted successfully',
      course
    });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}