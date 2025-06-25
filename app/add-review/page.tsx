'use client';

// Import necessary modules from React, Next.js, and Supabase
import { supabase } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

// Define interface for Course data structure
interface Course {
  id: string;
  university_name: string;
  course_code: string;
  course_name: string;
  faculty?: string;
  credits?: number;
}

// Main component for the Add Review page
export default function AddReviewPage() {
  // State variables for search functionality
  const [searchTerm, setSearchTerm] = useState(''); // Stores the user's search input
  const [searchResults, setSearchResults] = useState<Course[]>([]); // Stores results from course search
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // Stores the course selected by the user
  const [showNewCourseForm, setShowNewCourseForm] = useState(false); // Controls visibility of the new course form
  const [loadingSearch, setLoadingSearch] = useState(false); // Indicates if search results are being loaded

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
  const [isAnonymous, setIsAnonymous] = useState(true); // Default to anonymous review
  const [isSubmitting, setIsSubmitting] = useState(false); // Indicates if the form is being submitted
  const [submitSuccess, setSubmitSuccess] = useState(false); // Shows success message after submission
  const [submitError, setSubmitError] = useState<string | null>(null); // Shows error message if submission fails

  // Effect hook to debounce course search requests
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Only perform search if the search term has more than 2 characters
      if (searchTerm.trim().length > 2) {
        setLoadingSearch(true); // Set loading state
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
            is_approved: true, // ***** NEW: New courses are automatically approved *****
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

    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>เพิ่มรีวิวรายวิชา - เว็บรีวิวรายวิชา</title>
        <meta name="description" content="เพิ่มรีวิวสำหรับรายวิชาที่มีอยู่ หรือเสนอรายวิชาใหม่พร้อมรีวิว" />
      </Head>

      {/* Header section */}
      <header className="bg-white shadow-md p-4 flex items-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 text-lg font-semibold mr-4">
          &larr; กลับ
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-800 flex-grow text-center">เพิ่มรีวิวรายวิชา</h1>
      </header>

      {/* Main content area */}
      <main className="container mx-auto p-6 py-10 max-w-4xl">
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">ค้นหาวิชา หรือเพิ่มวิชาใหม่</h2>

          {/* Search section (shown if no course is selected and new course form is not visible) */}
          {!selectedCourse && !showNewCourseForm && (
            <div className="mb-6">
              <label htmlFor="searchCourse" className="block text-gray-700 text-base font-bold mb-2">
                ค้นหารายวิชา (ชื่อหรือรหัสวิชา):
              </label>
              <input
                type="text"
                id="searchCourse"
                className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                placeholder="เช่น Computer Programming, 2110111"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {loadingSearch && <p className="text-gray-500 mt-2">กำลังค้นหา...</p>}
              {/* Display search results */}
              {searchTerm.length > 2 && searchResults.length > 0 && (
                <div className="mt-4 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {searchResults.map((course) => (
                    <div
                      key={course.id}
                      className="p-3 cursor-pointer hover:bg-blue-50 border-b last:border-b-0"
                      onClick={() => handleSelectCourse(course)}
                    >
                      <p className="font-semibold text-blue-700">{course.course_name}</p>
                      <p className="text-sm text-gray-600">{course.course_code} - {course.university_name}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* Message if no results found, with option to add new course */}
              {searchTerm.length > 2 && !loadingSearch && searchResults.length === 0 && (
                <p className="text-gray-500 mt-2">
                  ไม่พบรายวิชาที่ค้นหา
                  <button
                    type="button"
                    onClick={() => setShowNewCourseForm(true)}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    เพิ่มรายวิชาใหม่?
                  </button>
                </p>
              )}
              {searchTerm.length <= 2 && (
                <p className="text-gray-500 mt-2">พิมพ์อย่างน้อย 3 ตัวอักษรเพื่อค้นหา</p>
              )}
            </div>
          )}

          {/* Display selected course details */}
          {selectedCourse && (
            <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800">วิชาที่เลือก:</h3>
              <p className="text-lg text-blue-700">{selectedCourse.course_name} ({selectedCourse.course_code}) - {selectedCourse.university_name}</p>
              {selectedCourse.faculty && <p className="text-md text-blue-600">คณะ: {selectedCourse.faculty}</p>}
              {selectedCourse.credits && <p className="text-md text-blue-600">หน่วยกิต: {selectedCourse.credits}</p>}
              <button
                type="button"
                onClick={() => { setSelectedCourse(null); setSearchTerm(''); setShowNewCourseForm(false); }}
                className="mt-3 text-red-600 hover:underline text-sm"
              >
                ยกเลิกการเลือก
              </button>
            </div>
          )}

          {/* New course details form (shown if explicitly requested and no course is selected) */}
          {(showNewCourseForm && !selectedCourse) && (
            <div className="mb-6 border border-dashed border-gray-300 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">เพิ่มข้อมูลรายวิชาใหม่:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newUniversityName" className="block text-gray-700 text-sm font-bold mb-2">มหาวิทยาลัย: <span className="text-red-500">*</span></label>
                  <input type="text" id="newUniversityName" value={newUniversityName} onChange={(e) => setNewUniversityName(e.target.value)} required
                    className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="newCourseCode" className="block text-gray-700 text-sm font-bold mb-2">รหัสวิชา: <span className="text-red-500">*</span></label>
                  <input type="text" id="newCourseCode" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} required
                    className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="newCourseName" className="block text-gray-700 text-sm font-bold mb-2">ชื่อวิชา: <span className="text-red-500">*</span></label>
                  <input type="text" id="newCourseName" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} required
                    className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="newFaculty" className="block text-gray-700 text-sm font-bold mb-2">คณะ/ภาควิชา (ถ้ามี):</label>
                  <input type="text" id="newFaculty" value={newFaculty} onChange={(e) => setNewFaculty(e.target.value)}
                    className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="newCredits" className="block text-gray-700 text-sm font-bold mb-2">หน่วยกิต (ตัวเลข):</label>
                  <input type="number" id="newCredits" value={newCredits} onChange={(e) => setNewCredits(e.target.value)}
                    className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCourseForm(false)}
                className="mt-4 text-red-600 hover:underline text-sm"
              >
                ยกเลิกการเพิ่มวิชาใหม่
              </button>
            </div>
          )}

          {/* Review Form (shown only if a course is selected or new course form is visible) */}
          {(selectedCourse || showNewCourseForm) && (
            <form onSubmit={handleSubmitReview} className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">เขียนรีวิวของคุณ</h2>
              <div className="mb-6">
                <label htmlFor="reviewContent" className="block text-gray-700 text-base font-bold mb-2">
                  เนื้อหารีวิวของคุณ:
                  <span className="text-sm font-normal text-gray-500 block">
                    (เช่น วิชานี้เหมาะกับใคร, คุณได้อะไรจากวิชานี้, ข้อดี/ข้อเสีย, ประสบการณ์สอบ/โปรเจกต์)
                  </span>
                </label>
                <textarea
                  id="reviewContent"
                  className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
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
                    <label className="block text-gray-700 text-base font-bold mb-2">
                      {item.label}: <span className="font-normal text-blue-600 ml-1">{item.value} ดาว</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={item.value}
                      onChange={(e) => item.setter(parseInt(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500 transition-all duration-200"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span className="ml-3 text-gray-700 text-base">รีวิวโดยไม่เปิดเผยชื่อ</span>
                </label>
              </div>

              {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">ส่งรีวิวสำเร็จแล้ว! ขอบคุณสำหรับความคิดเห็นของคุณ</span>
                </div>
              )}
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">Error: {submitError}</span>
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
