'use client';

// Import necessary modules from React, Next.js, and Supabase
import { supabase } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import Link from 'next/link';
// Removed: import Head from 'next/head'; // This import is no longer needed in App Router pages

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
      if (searchTerm.trim().length > 2) { // Only perform search if more than 2 characters
        setLoadingSearch(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .or(`course_name.ilike.%${searchTerm}%,course_code.ilike.%${searchTerm}%`) // Search by course name or code (case-insensitive)
          .limit(10); // Limit results to 10 for performance

        if (error) {
          console.error('Error searching courses:', error);
          setSearchResults([]); // Clear results on error
        } else {
          setSearchResults(data || []); // Update search results
        }
        setLoadingSearch(false); // Clear loading state
      } else {
        setSearchResults([]); // Clear results if search term is too short
      }
    }, 500); // 500ms debounce time

    // Cleanup function to clear the timeout
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Re-run effect when searchTerm changes

  // Function to handle selection of an existing course from search results
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course); // Set the selected course
    setShowNewCourseForm(false); // Hide the new course form
    setSearchTerm(''); // Clear the search input
    setSearchResults([]); // Clear the search results display
  };

  // Function to handle review submission (for existing or new courses)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Set submitting state
    setSubmitError(null); // Clear previous errors
    setSubmitSuccess(false); // Clear previous success messages

    let targetCourseId: string | null = null; // Variable to hold the course ID for the review

    try {
      if (selectedCourse) {
        // Case 1: An existing course has been selected
        targetCourseId = selectedCourse.id;
      } else if (showNewCourseForm) {
        // Case 2: User intends to add a new course
        // Validate required fields for a new course
        if (!newUniversityName || !newCourseCode || !newCourseName) {
          throw new Error('กรุณากรอกข้อมูลมหาวิทยาลัย รหัสวิชา และชื่อวิชาให้ครบถ้วน');
        }

        // Insert new course data into the 'courses' table
        const { data: newCourseData, error: newCourseError } = await supabase
          .from('courses')
          .insert({
            university_name: newUniversityName,
            course_code: newCourseCode,
            course_name: newCourseName,
            faculty: newFaculty || null, // Use null if faculty is empty
            credits: newCredits ? parseInt(newCredits) : null, // Convert credits to integer, use null if empty
            is_approved: true, // NEW: New courses are automatically approved
          })
          .select('id') // Select only the ID of the newly inserted course
          .single(); // Expect a single result

        if (newCourseError) throw newCourseError; // Throw error if insertion fails
        targetCourseId = newCourseData.id; // Get the ID of the newly created course

      } else {
        // Case 3: Neither an existing course is selected nor the new course form is shown
        throw new Error('กรุณาเลือกวิชา หรือเพิ่มรายวิชาใหม่');
      }

      // Insert the review data into the 'reviews' table, linked to the target course ID
      const { error: reviewError } = await supabase.from('reviews').insert({
        course_id: targetCourseId,
        content: reviewContent,
        rating_overall: ratingOverall,
        rating_difficulty: ratingDifficulty,
        rating_teaching: ratingTeaching,
        rating_homework: ratingHomework,
        is_anonymous: isAnonymous,
      });

      if (reviewError) throw reviewError; // Throw error if review insertion fails

      setSubmitSuccess(true); // Show success message
      // Reset all form fields after successful submission
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
      // Corrected ESLint disable position for 'any' type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      err: any
    ) {
      console.error('Error submitting review:', err);
      setSubmitError(err.message || 'ไม่สามารถส่งรีวิวได้'); // Display error message
    } finally {
      setIsSubmitting(false); // Clear submitting state
    }
  };

  // Helper function to render star ratings visually
  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="min-h-screen"> {/* Removed bg-gray-100 */}
      {/* No <Head> component here. Metadata is handled by layout.tsx's export const metadata */}

      {/* Header section */}
      <header className="bg-white bg-opacity-10 backdrop-blur-sm shadow-glass-card p-4 flex items-center rounded-b-xl mb-8"> {/* Applied glass-element principles, rounded bottom */}
        <Link href="/" className="text-glass-accent-light hover:text-glass-primary-light text-lg font-semibold mr-4 transition-colors duration-200"> {/* Accent color, hover effect */}
          &larr; กลับ
        </Link>
        <h1 className="text-3xl font-extrabold text-white flex-grow text-center drop-shadow-lg">เพิ่มรีวิวรายวิชา</h1> {/* White text, shadow */}
      </header>

      {/* Main content area */}
      <main className="container mx-auto p-6 py-10 max-w-4xl">
        <div className="glass-element p-8 mb-8"> {/* Applied glass-element */}
          <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-md">ค้นหาวิชา หรือเพิ่มวิชาใหม่</h2> {/* White text, shadow */}

          {/* Search section (shown if no course is selected and new course form is not visible) */}
          {!selectedCourse && !showNewCourseForm && (
            <div className="mb-6">
              <label htmlFor="searchCourse" className="block text-gray-100 text-base font-bold mb-2"> {/* Light text */}
                ค้นหารายวิชา (ชื่อหรือรหัสวิชา):
              </label>
              <input
                type="text"
                id="searchCourse"
                className="shadow-inner appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 transition-all duration-200"
                placeholder="เช่น Computer Programming, 2110111"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {loadingSearch && <p className="text-gray-300 mt-2">กำลังค้นหา...</p>} {/* Light gray text */}
              {/* Display search results */}
              {searchTerm.length > 2 && searchResults.length > 0 && (
                <div className="mt-4 border border-white border-opacity-30 rounded-lg max-h-60 overflow-y-auto"> {/* Light border */}
                  {searchResults.map((course) => (
                    <div
                      key={course.id}
                      className="p-3 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-all duration-200 border-b border-white border-opacity-20 last:border-b-0" // Hover effect
                      onClick={() => handleSelectCourse(course)}
                    >
                      <p className="font-semibold text-glass-accent-light">{course.course_name}</p> {/* Accent color */}
                      <p className="text-sm text-gray-200">{course.course_code} - {course.university_name}</p> {/* Light gray text */}
                    </div>
                  ))}
                </div>
              )}
              {/* Message if no results found, with option to add new course */}
              {searchTerm.length > 2 && !loadingSearch && searchResults.length === 0 && (
                <p className="text-gray-300 mt-2"> {/* Light gray text */}
                  ไม่พบรายวิชาที่ค้นหา
                  <button
                    type="button"
                    onClick={() => setShowNewCourseForm(true)}
                    className="ml-2 text-glass-accent-light hover:underline" // Accent color link
                  >
                    เพิ่มรายวิชาใหม่?
                  </button>
                </p>
              )}
              {searchTerm.length <= 2 && (
                <p className="text-gray-300 mt-2">พิมพ์อย่างน้อย 3 ตัวอักษรเพื่อค้นหา</p> {/* Light gray text */}
              )}
            </div>
          )}

          {/* Display selected course details */}
          {selectedCourse && (
            <div className="mb-6 bg-white bg-opacity-10 border border-white border-opacity-30 p-4 rounded-lg shadow-md"> {/* Glass effect */}
              <h3 className="text-xl font-bold text-glass-accent-light">วิชาที่เลือก:</h3> {/* Accent color */}
              <p className="text-lg text-gray-100">{selectedCourse.course_name} ({selectedCourse.course_code}) - {selectedCourse.university_name}</p> {/* Light text */}
              {selectedCourse.faculty && <p className="text-md text-gray-200">คณะ: {selectedCourse.faculty}</p>} {/* Light text */}
              {selectedCourse.credits && <p className="text-md text-gray-200">หน่วยกิต: {selectedCourse.credits}</p>} {/* Light text */}
              <button
                type="button"
                onClick={() => { setSelectedCourse(null); setSearchTerm(''); setShowNewCourseForm(false); }}
                className="mt-3 text-red-400 hover:underline text-sm" // Adjusted red
              >
                ยกเลิกการเลือก
              </button>
            </div>
          )}

          {/* New course details form (shown if explicitly requested and no course is selected) */}
          {(showNewCourseForm && !selectedCourse) && (
            <div className="mb-6 glass-element p-6 border-dashed border-opacity-50"> {/* Applied glass-element, adjusted border */}
              <h3 className="text-xl font-bold mb-4 text-white">เพิ่มข้อมูลรายวิชาใหม่:</h3> {/* White text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newUniversityName" className="block text-gray-100 text-sm font-bold mb-2">มหาวิทยาลัย: <span className="text-red-400">*</span></label> {/* Light text, adjusted red */}
                  <input type="text" id="newUniversityName" value={newUniversityName} onChange={(e) => setNewUniversityName(e.target.value)} required
                    className="shadow-inner appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="newCourseCode" className="block text-gray-100 text-sm font-bold mb-2">รหัสวิชา: <span className="text-red-400">*</span></label> {/* Light text, adjusted red */}
                  <input type="text" id="newCourseCode" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} required
                    className="shadow-inner appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="newCourseName" className="block text-gray-100 text-sm font-bold mb-2">ชื่อวิชา: <span className="text-red-400">*</span></label> {/* Light text, adjusted red */}
                  <input type="text" id="newCourseName" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} required
                    className="shadow-inner appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="newFaculty" className="block text-gray-100 text-sm font-bold mb-2">คณะ/ภาควิชา (ถ้ามี):</label> {/* Light text */}
                  <input type="text" id="newFaculty" value={newFaculty} onChange={(e) => setNewFaculty(e.target.value)}
                    className="shadow-inner appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="newCredits" className="block text-gray-100 text-sm font-bold mb-2">หน่วยกิต (ตัวเลข):</label> {/* Light text */}
                  <input type="number" id="newCredits" value={newCredits} onChange={(e) => setNewCredits(e.target.value)}
                    className="shadow-inner appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 transition-all duration-200" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCourseForm(false)}
                className="mt-4 text-red-400 hover:underline text-sm" // Adjusted red
              >
                ยกเลิกการเพิ่มวิชาใหม่
              </button>
            </div>
          )}

          {/* Review Form (shown only if a course is selected or new course form is visible) */}
          {(selectedCourse || showNewCourseForm) && (
            <form onSubmit={handleSubmitReview} className="glass-element p-8"> {/* Applied glass-element */}
              <h2 className="text-2xl font-bold mb-4 text-white">เขียนรีวิวของคุณ</h2> {/* White text */}
              <div className="mb-6">
                <label htmlFor="reviewContent" className="block text-gray-100 text-base font-bold mb-2"> {/* Light text */}
                  เนื้อหารีวิวของคุณ:
                  <span className="text-sm font-normal text-gray-300 block"> {/* Light gray text */}
                    (เช่น วิชานี้เหมาะกับใคร, คุณได้อะไรจากวิชานี้, ข้อดี/ข้อเสีย, ประสบการณ์สอบ/โปรเจกต์)
                  </span>
                </label>
                <textarea
                  id="reviewContent"
                  className="shadow-inner appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 transition-all duration-200"
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
                    <label className="block text-gray-100 text-base font-bold mb-2"> {/* Light text */}
                      {item.label}: <span className="font-normal text-glass-accent-light ml-1 star-rating">{renderStars(item.value)}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={item.value}
                      onChange={(e) => item.setter(parseInt(e.target.value))}
                      className="w-full h-2 bg-blue-400 rounded-lg appearance-none cursor-pointer accent-glass-accent-light"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="flex items-center cursor-pointer text-gray-100"> {/* Light text */}
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-glass-primary-light rounded-md border-gray-400 focus:ring-glass-accent-light transition-all duration-200"
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
                className="btn-gradient w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
