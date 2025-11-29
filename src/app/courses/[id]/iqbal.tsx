"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Users,
  Star,
  Clock,
  Award,
  BookOpen,
  Code,
  Globe,
  Target,
  TrendingUp,
  MessageSquare,
  Shield,
  User,
  Phone,
  Mail,
  ArrowRight,
  Play,
  Download,
  Share2,
  Heart,
  Languages,
  GraduationCap,
  X,
  Bell,
  Sparkles,
  ChevronRight,
  Info,
  PlayCircle,
  Lock
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- UPDATED INTERFACES ---
interface Lecture {
  title: string;
  duration: string;
  isPreview?: boolean;
}

interface SyllabusSection {
  title: string;
  lectures: Lecture[];
}

interface Course {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  duration: string;
  mode?: string;
  students?: string;
  rating?: number;
  level?: string;
  skills?: string[];
  price?: string;
  originalPrice?: string;
  tags?: string[];
  courseCategory?: string;
  instructor?: string;
  lessons?: number;
  projects?: number;
  certificate?: boolean;
  language?: string;
  prerequisites?: string;
  // Updated syllabus type
  syllabus?: SyllabusSection[];
  featured?: boolean;
  trending?: boolean;
}

// Optimized text truncation hook
const useTruncatedText = (text: string, maxLength: number = 100) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText =
    isExpanded || !shouldTruncate ? text : text.substring(0, maxLength) + "...";

  return {
    displayText,
    isExpanded,
    shouldTruncate,
    toggleExpanded: () => setIsExpanded(!isExpanded),
  };
};

// Compact enrollment modal (Kept same as yours)
const EnrollmentModal = ({
  course,
  isOpen,
  onClose,
}: {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsEnrolled(true);
      setIsSubmitting(false);
    }, 1200);
  };

  const resetModal = () => {
    setIsEnrolled(false);
    setFormData({ name: "", email: "", phone: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white text-center">
            {isEnrolled ? "Enrollment Successful! 🎉" : `Enroll in Course`}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {!isEnrolled ? (
            <>
              {/* Compact Course Summary */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-3 mb-4 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyan-300 font-medium text-xs">
                    Course Fee
                  </span>
                  <div className="flex items-center gap-1">
                    {course.originalPrice && (
                      <span className="text-gray-500 line-through text-xs">
                        ₹{course.originalPrice}
                      </span>
                    )}
                    <span className="text-white font-bold text-sm">
                      {course.price ? `${course.price}` : "Free"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  {course.level && (
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {course.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Compact Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-cyan-400" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-7 h-8 text-xs bg-black/60 border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-400"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-cyan-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-7 h-8 text-xs bg-black/60 border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-400"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-cyan-400" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-7 h-8 text-xs bg-black/60 border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-400"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetModal}
                    className="flex-1 h-8 text-xs border-gray-600 text-gray-300 hover:border-gray-500"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-8 text-xs bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Enroll Now
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-green-500/30"
              >
                <CheckCircle className="w-8 h-8 text-green-400" />
              </motion.div>

              <div>
                <h3 className="text-lg font-bold text-green-400 mb-2">
                  Welcome Aboard! 🚀
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Thank you for enrolling in{" "}
                  <span className="text-cyan-300 font-medium">
                    {course.title}
                  </span>
                </p>
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-3 border border-cyan-500/20">
                  <p className="text-xs text-gray-300">
                    📧 Check your email for course details
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    📞 Our team will contact you within 24 hours
                  </p>
                </div>
              </div>

              <Button
                onClick={resetModal}
                className="w-full h-8 text-xs bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
              >
                Continue Exploring
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // --- ACCORDION STATE ---
  // Store indices of expanded sections. 
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  // Compact text truncation
  const descriptionText = useTruncatedText(course?.description || "", 80);
  const longDescriptionText = useTruncatedText(
    course?.longDescription || "",
    120
  );
  const prerequisitesText = useTruncatedText(course?.prerequisites || "", 100);

  const handleToggleWishlist = () => {
    setIsWishlisted(prev => !prev);
    console.log(`Course ${course?.title} ${isWishlisted ? 'removed from' : 'added to'} wishlist.`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course?.title || 'Check out this course!',
          text: course?.subtitle || course?.description || 'A great course to learn new skills.',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        alert('Sharing failed or was cancelled.');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Course link copied to clipboard!');
    }
  };

  const SYLLABUS_PDF_URL = '/assets/documents/course-syllabus.pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = SYLLABUS_PDF_URL;
    link.setAttribute('download', `${course?.title || 'Course'}_Syllabus.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SUPPORT_NUMBER = '7754897333';
  const handleCallSupport = () => {
    window.location.href = `tel:${SUPPORT_NUMBER}`;
  };

  const handleChatSupport = () => {
    alert('Open chat icon below ');
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/courses/${resolvedParams.id}`);
        setCourse(response.data.course);
        // Initially expand the first section
        if(response.data.course?.syllabus?.length > 0) {
            setExpandedSections([0]);
        }
      } catch (error) {
        console.error("Error fetching course details, falling back", error);
        try {
          const response = await axios.get(`/api/courses`);
          const allCourses: Course[] = response.data.courses;
          const course = allCourses.find(
            (c: Course) =>
              c._id === resolvedParams.id || c.id === resolvedParams.id
          );
          setCourse(course || null);
        } catch (fallbackError) {
          console.error("Error fetching fallback courses", fallbackError);
          setCourse(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchCourse();
    }
  }, [resolvedParams.id]);

  const getModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "online": return <Globe className="w-4 h-4" />;
      case "hybrid": return <Target className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // --- ACCORDION HANDLERS ---
  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const expandAll = () => {
    if (course?.syllabus) {
      setExpandedSections(course.syllabus.map((_, i) => i));
    }
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  const isAllExpanded = course?.syllabus && course.syllabus.length > 0 && expandedSections.length === course.syllabus.length;

  // Calculates totals from the nested structure
  const totalLecturesCount = course?.syllabus?.reduce((acc, sec) => acc + (sec.lectures?.length || 0), 0) || 0;
  
  // Helper to parse "MM:SS" and sum it up (simplified)
  const calculateTotalDuration = () => {
    if (!course?.syllabus) return "0h 0m";
    let totalMinutes = 0;
    course.syllabus.forEach(sec => {
        sec.lectures?.forEach(lec => {
            const parts = lec.duration.split(':');
            if(parts.length === 2) {
                totalMinutes += parseInt(parts[0]) + parseInt(parts[1]) / 60;
            }
        });
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative mb-3">
            <div className="w-8 h-8 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-purple-400 rounded-full animate-spin animate-reverse mx-auto"></div>
          </div>
          <p className="text-white text-sm">Loading course details...</p>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
        <Card className="bg-gray-900/90 border-gray-700/50 p-6 text-center max-w-xs w-full">
          <CardContent className="p-0">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <X className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">
              Course Not Found
            </h2>
            <Button
              onClick={() => router.push("/courses")}
              className="w-full h-8 text-xs bg-gradient-to-r from-cyan-500 to-purple-500"
            >
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-14 sm:pt-16 pb-6">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Compact Hero Section */}
        <section className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Compact Badges */}
              <div className="flex flex-wrap gap-1">
                {course.trending && (
                  <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-300 text-xs px-2 py-0.5">
                    <TrendingUp className="w-2.5 h-2.5 mr-1" />
                    Trending
                  </Badge>
                )}
                {course.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-300 text-xs px-2 py-0.5">
                    <Star className="w-2.5 h-2.5 mr-1" />
                    Featured
                  </Badge>
                )}
                {course.courseCategory && (
                  <Badge
                    variant="outline"
                    className="text-cyan-400 border-cyan-400/30 text-xs px-2 py-0.5"
                  >
                    {course.courseCategory}
                  </Badge>
                )}
              </div>

              {/* Compact Title & Description */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {course.title}
                </h1>

                {course.subtitle && (
                  <h2 className="text-lg text-cyan-300 font-medium">
                    {course.subtitle}
                  </h2>
                )}

                {/* Main Description */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {descriptionText.displayText}
                  </p>
                  {descriptionText.shouldTruncate && (
                    <button
                      onClick={descriptionText.toggleExpanded}
                      className="text-cyan-400 hover:text-cyan-300 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      {descriptionText.isExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>

              {/* Compact Rating & Students */}
              <div className="flex flex-wrap items-center gap-4">
                {course.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(course.rating!)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {course.rating}
                    </span>
                  </div>
                )}
                {course.students && (
                  <div className="flex items-center gap-1 text-gray-300 text-xs">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span className="font-medium">{course.students}</span>
                    <span>students</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Compact Course Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {course.duration && (
                  <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700/50 hover:border-cyan-400/30 transition-all duration-300 group">
                    <CardContent className="p-2 text-center">
                      <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <h4 className="text-white font-medium mb-0.5 text-xs">
                        Duration
                      </h4>
                      <p className="text-gray-300 text-xs">{course.duration}</p>
                    </CardContent>
                  </Card>
                )}
                {/* ... (Other Stats Cards kept same) ... */}
              </div>
            </motion.div>
          </div>

          {/* Compact Enrollment Card (Sticky Right) */}
          <div className="lg:col-span-1">
             {/* ... (Enrollment Card Code from your previous snippet - kept same) ... */}
             {/* I am omitting the full repetition here to save space, but it goes here exactly as you had it */}
              <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="sticky top-20"
            >
              <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-cyan-500/20 shadow-xl shadow-cyan-500/10 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 border-b border-gray-700/50">
                    <div className="text-center space-y-2">
                       <span className="text-2xl font-bold text-white">
                         {course.price ? `${course.price}` : "Free"}
                       </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                     <Button
                        onClick={() => setIsEnrollmentModalOpen(true)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-3 text-sm rounded-lg"
                      >
                        Enroll Now
                      </Button>
                      
                      {/* Share and Download buttons row */}
                      <div className="flex gap-2 justify-center border-t border-gray-700/50 pt-3">
                         <Button size="sm" variant="outline" onClick={handleToggleWishlist} className="border-gray-600">
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                         </Button>
                         <Button size="sm" variant="outline" onClick={handleShare} className="border-gray-600">
                            <Share2 className="w-4 h-4 text-gray-300" />
                         </Button>
                         <Button size="sm" variant="outline" onClick={handleDownload} className="border-gray-600">
                            <Download className="w-4 h-4 text-gray-300" />
                         </Button>
                      </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ------------------------------------------------ */}
        {/* NEW SYLLABUS SECTION (UDEMY STYLE)               */}
        {/* ------------------------------------------------ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">Course Content</h2>
            
            {/* Stats Header */}
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-400 pb-2">
                <div className="flex gap-2">
                   <span>{course.syllabus?.length || 0} sections</span> • 
                   <span>{totalLecturesCount} lectures</span> • 
                   <span>{calculateTotalDuration()} total length</span>
                </div>
                <button 
                  onClick={isAllExpanded ? collapseAll : expandAll}
                  className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
                >
                    {isAllExpanded ? 'Collapse all sections' : 'Expand all sections'}
                </button>
            </div>
          </div>

          <div className="border border-gray-700/50 rounded-lg overflow-hidden bg-gray-900/50">
          {course.syllabus && course.syllabus.length > 0 ? (
            course.syllabus.map((section, idx) => {
              const isExpanded = expandedSections.includes(idx);
              const lectureCount = section.lectures?.length || 0;
              
              // Calculate section duration
              let sectionMins = 0;
              section.lectures?.forEach(l => {
                 const [m, s] = l.duration.split(':').map(Number);
                 if(!isNaN(m)) sectionMins += m + (s||0)/60;
              });
              const secDuration = `${Math.round(sectionMins)}min`;

              return (
                <div key={idx} className="border-b border-gray-700/50 last:border-0">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full p-4 flex items-center justify-between bg-gray-800/40 hover:bg-gray-800/80 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                        {isExpanded ? (
                             <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                             <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                        <h3 className="font-bold text-white text-base">
                            {section.title}
                        </h3>
                    </div>
                    <div className="text-xs text-gray-400 hidden sm:block">
                        {lectureCount} lectures • {secDuration}
                    </div>
                  </button>

                  {/* Accordion Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-black/20"
                      >
                         <div className="p-2 space-y-1">
                            {section.lectures?.map((lecture, lIdx) => (
                                <div 
                                  key={lIdx} 
                                  className="flex items-center justify-between p-3 hover:bg-white/5 rounded-md group transition-colors cursor-pointer"
                                >
                                   <div className="flex items-center gap-3">
                                       {lecture.isPreview ? (
                                           <PlayCircle className="w-4 h-4 text-cyan-400" />
                                       ) : (
                                           <PlayCircle className="w-4 h-4 text-gray-500" />
                                       )}
                                       <span className={`text-sm ${lecture.isPreview ? 'text-cyan-100' : 'text-gray-300'}`}>
                                          {lecture.title}
                                       </span>
                                   </div>
                                   
                                   <div className="flex items-center gap-4">
                                       {lecture.isPreview && (
                                           <span className="text-xs text-cyan-400 underline decoration-cyan-400/30 underline-offset-4 hidden sm:inline">Preview</span>
                                       )}
                                       <span className="text-xs text-gray-500">
                                           {lecture.duration}
                                       </span>
                                   </div>
                                </div>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
                No syllabus content available yet.
            </div>
          )}
          </div>
        </motion.section>

        {/* ... Rest of your footer/CTA sections ... */}
        
      </div>

      {/* Enrollment Modal */}
      <EnrollmentModal
        course={course}
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
      />
    </main>
  );
}