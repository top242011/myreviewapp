'use client';

import { supabase } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  university_name: string;
  course_code: string;
  course_name: string;
  faculty?: string;
  credits?: number;
}

export default function AddReviewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // State variables for new course details form
  const [newUniversityName, setNewUniversityName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newFaculty, setNewFaculty] = useState('');
  const [newCredits, setNewCredits] = useState('');

  // State variables for the review form
  const [reviewContent, setReviewContent] = useState('');
  const [ratingOverall, setRatingOverall] = useState(3);
  const [ratingDifficulty, setRatingDifficulty] = useState(3);
  const [ratingTeaching, setRatingTeaching] = useState(3);
  const [ratingHomework, setRatingHomework] = useState(3);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Effect hook to debounce course search requests
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        setLoadingSearch(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .or(`course_name.ilike.%${searchTerm}%,course_code.ilike.%${searchTerm}%`)
          .limit(10);

        if (error) {
          console.error('Error searching courses:', error);
          setSearchResults([]);
        } else {
          setSearchResults(data || []);
        }
        setLoadingSearch(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowNewCourseForm(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    let targetCourseId: string | null = null;

    try {
      if (selectedCourse) {
        targetCourseId = selectedCourse.id;
      } else if (showNewCourseForm) {
        if (!newUniversityName || !newCourseCode || !newCourseName) {
          throw new Error('กรุณากรอกข้อมูลมหาวิทยาลัย รหัสวิชา และชื่อวิชาให้ครบถ้วน');
        }

        const { data: newCourseData, error: newCourseError } = await supabase
          .from('courses')
          .insert({
            university_name: newUniversityName,
            course_code: newCourseCode,
            course_name: newCourseName,
            faculty: newFaculty || null,
            credits: newCredits ? parseInt(newCredits) : null,
            is_approved: true,
          })
          .select('id')
          .single();

        if (newCourseError) throw newCourseError;
        targetCourseId = newCourseData.id;

      } else {
        throw new Error('กรุณาเลือกวิชา หรือเพิ่มรายวิชาใหม่');
      }

      const { error: reviewError } = await supabase.from('reviews').insert({
        course_id: targetCourseId,
        content: reviewContent,
        rating_overall: ratingOverall,
        rating_difficulty: ratingDifficulty,
        rating_teaching: ratingTeaching,
        rating_homework: ratingHomework,
        is_anonymous: isAnonymous,
      });

      if (reviewError) throw reviewError;

      setSubmitSuccess(true);
      setSearchTerm('');
      setSearchResults([]);
      setSelectedCourse(null);
      setShowNewCourseForm(false);
      setNewUniversityName('');
      setNewCourseCode('');
      setNewCourseName('');
      setNewFaculty('');
      setNewCredits('');
      setReviewContent('');
      setRatingOverall(3);
      setRatingDifficulty(3);
      setRatingTeaching(3);
      setRatingHomework(3);
      setIsAnonymous(true);

    } catch (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      err: any
    ) {
      console.error('Error submitting review:', err);
      setSubmitError(err.message || 'ไม่สามารถส่งรีวิวได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="min-h-screen">
      {/* Header section with site title and back button */}
      <header className="bg-white bg-opacity-10 backdrop-blur-sm shadow-glass-card rounded-b-3xl mb-8 p-4 md:p-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Back button */}
          <Link href="/" className="text-accent-1 hover:text-primary-light text-lg font-semibold mr-4 transition-colors duration-200 mb-4 md:mb-0">
            &larr; กลับหน้าหลัก
          </Link>
          {/* Site Title / Context */}
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md flex-grow text-center">เพิ่มรีวิวรายวิชา</h1>
          {/* Placeholder for future buttons/alignment */}
          <div className="w-auto md:w-[150px] text-right"></div> {/* Placeholder to align title */}
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto p-6 py-10 max-w-4xl">
        <div className="glass-element p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-md">ค้นหาวิชา หรือเพิ่มวิชาใหม่</h2>

          {/* Search section (shown if no course is selected and new course form is not visible) */}
          {!selectedCourse && !showNewCourseForm && (
            <div className="mb-6">
              <label htmlFor="searchCourse" className="block text-text-base text-base font-bold mb-2">
                ค้นหารายวิชา (ชื่อหรือรหัสวิชา):
              </label>
              <input
                type="text"
                id="searchCourse"
                className="glass-element w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-1 transition-all duration-200"
                placeholder="เช่น Computer Programming, 2110111"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {loadingSearch && <p className="text-text-muted mt-2">กำลังค้นหา...</p>}
              {/* Display search results */}
              {searchTerm.length > 2 && searchResults.length > 0 && (
                <div className="mt-4 border border-glass-border rounded-lg max-h-60 overflow-y-auto">
                  {searchResults.map((course) => (
                    <div
                      key={course.id}
                      className="p-3 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-all duration-200 border-b border-glass-border last:border-b-0"
                      onClick={() => handleSelectCourse(course)}
                    >
                      <p className="font-semibold text-accent-1">{course.course_name}</p>
                      <p className="text-sm text-text-muted">{course.course_code} • {course.university_name}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* Message if no results found, with option to add new course */}
              {searchTerm.length > 2 && !loadingSearch && searchResults.length === 0 && (
                <p className="text-text-muted mt-2">
                  ไม่พบรายวิชาที่ค้นหา
                  <button
                    type="button"
                    onClick={() => setShowNewCourseForm(true)}
                    className="ml-2 text-accent-1 hover:underline"
                  >
                    เพิ่มรายวิชาใหม่?
                  </button>
                </p>
              )}
              {searchTerm.length <= 2 && (
                <p className="text-text-muted mt-2">พิมพ์อย่างน้อย 3 ตัวอักษรเพื่อค้นหา</p>
              )}
            </div>
          )}

          {/* Display selected course details */}
          {selectedCourse && (
            <div className="mb-6 glass-element p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-accent-1">วิชาที่เลือก:</h3>
              <p className="text-lg text-text-base">{selectedCourse.course_name} • {selectedCourse.course_code} • {selectedCourse.university_name}</p>
              {selectedCourse.faculty && <p className="text-text-muted text-md">คณะ: {selectedCourse.faculty}</p>}
              {selectedCourse.credits && <p className="text-text-muted text-md">หน่วยกิต: {selectedCourse.credits}</p>}
              <button
                type="button"
                onClick={() => { setSelectedCourse(null); setSearchTerm(''); setShowNewCourseForm(false); }}
                className="mt-3 text-red-400 hover:underline text-sm"
              >
                ยกเลิกการเลือก
              </button>
            </div>
          )}

          {/* New course details form (shown if explicitly requested and no course is selected) */}
          {(showNewCourseForm && !selectedCourse) && (
            <div className="mb-6 glass-element p-6 border-dashed border-opacity-50">
              <h3 className="text-xl font-bold mb-4 text-white">เพิ่มข้อมูลรายวิชาใหม่:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newUniversityName" className="block text-text-base text-sm font-bold mb-2">มหาวิทยาลัย: <span className="text-red-400">*</span></label>
                  <input type="text" id="newUniversityName" value={newUniversityName} onChange={(e) => setNewUniversityName(e.target.value)} required
                    className="glass-element py-2 px-3 w-full rounded-lg focus:ring-accent-1" />
                </div>
                <div>
                  <label htmlFor="newCourseCode" className="block text-text-base text-sm font-bold mb-2">รหัสวิชา: <span className="text-red-400">*</span></label>
                  <input type="text" id="newCourseCode" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} required
                    className="glass-element py-2 px-3 w-full rounded-lg focus:ring-accent-1" />
                </div>
                <div>
                  <label htmlFor="newCourseName" className="block text-text-base text-sm font-bold mb-2">ชื่อวิชา: <span className="text-red-400">*</span></label>
                  <input type="text" id="newCourseName" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} required
                    className="glass-element py-2 px-3 w-full rounded-lg focus:ring-accent-1" />
                </div>
                <div>
                  <label htmlFor="newFaculty" className="block text-text-base text-sm font-bold mb-2">คณะ/ภาควิชา (ถ้ามี):</label>
                  <input type="text" id="newFaculty" value={newFaculty} onChange={(e) => setNewFaculty(e.target.value)}
                    className="glass-element py-2 px-3 w-full rounded-lg focus:ring-accent-1" />
                </div>
                <div>
                  <label htmlFor="newCredits" className="block text-text-base text-sm font-bold mb-2">หน่วยกิต (ตัวเลข):</label>
                  <input type="number" id="newCredits" value={newCredits} onChange={(e) => setNewCredits(e.target.value)}
                    className="glass-element py-2 px-3 w-full rounded-lg focus:ring-accent-1" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCourseForm(false)}
                className="mt-4 text-red-400 hover:underline text-sm"
              >
                ยกเลิกการเพิ่มวิชาใหม่
              </button>
            </div>
          )}

          {/* Review Form (shown only if a course is selected or new course form is visible) */}
          {(selectedCourse || showNewCourseForm) && (
            <form onSubmit={handleSubmitReview} className="glass-element p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">เขียนรีวิวของคุณ</h2>
              <div className="mb-6">
                <label htmlFor="reviewContent" className="block text-text-base text-base font-bold mb-2">
                  เนื้อหารีวิวของคุณ:
                  <span className="text-sm font-normal text-text-muted block">
                    (เช่น วิชานี้เหมาะกับใคร, คุณได้อะไรจากวิชานี้, ข้อดี/ข้อเสีย, ประสบการณ์สอบ/โปรเจกต์)
                  </span>
                </label>
                <textarea
                  id="reviewContent"
                  className="glass-element w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-1 transition-all duration-200"
                  rows={6}
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  required
                  placeholder="เขียนรีวิวของคุณที่นี่..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[
                  { label: 'ภาพรวม', value: ratingOverall, setter: setRatingOverall },
                  { label: 'ความยาก', value: ratingDifficulty, setter: setRatingDifficulty },
                  { label: 'การสอน', value: ratingTeaching, setter: setRatingTeaching },
                  { label: 'ปริมาณการบ้าน', value: ratingHomework, setter: setRatingHomework },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="block text-text-base text-base font-bold mb-2">
                      {item.label}: <span className="font-normal text-yellow-400 ml-1 star-rating">{renderStars(item.value)}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={item.value}
                      onChange={(e) => item.setter(parseInt(e.target.value))}
                      className="w-full h-2 bg-primary-dark rounded-lg appearance-none cursor-pointer accent-accent-1"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="flex items-center cursor-pointer text-text-base">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary-light rounded-md border-glass-border focus:ring-accent-1 transition-all duration-200"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span className="ml-3 text-base">รีวิวโดยไม่เปิดเผยชื่อ</span>
                </label>
              </div>

              {submitSuccess && (
                <div className="bg-green-600 bg-opacity-70 border border-green-400 text-white px-4 py-3 rounded relative mb-4 shadow-md" role="alert">
                  <span className="block sm:inline">ส่งรีวิวสำเร็จแล้ว! ขอบคุณสำหรับความคิดเห็นของคุณ</span>
                </div>
              )}
              {submitError && (
                <div className="bg-red-600 bg-opacity-70 border border-red-400 text-white px-4 py-3 rounded relative mb-4 shadow-md" role="alert">
                  <span className="block sm:inline">Error: {submitError}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary-gradient w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'กำลังส่งรีวิว...' : 'ส่งรีวิวของคุณ'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
