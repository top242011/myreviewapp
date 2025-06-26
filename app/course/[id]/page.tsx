'use client';

import { supabase } from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Course {
  id: string;
  university_name: string;
  course_code: string;
  course_name: string;
  faculty?: string;
  credits?: number;
}

interface Review {
  id: string;
  content: string;
  rating_overall: number;
  rating_difficulty: number;
  rating_teaching: number;
  rating_homework: number;
  is_anonymous: boolean;
  created_at: string;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviewContent, setReviewContent] = useState('');
  const [ratingOverall, setRatingOverall] = useState(3);
  const [ratingDifficulty, setRatingDifficulty] = useState(3);
  const [ratingTeaching, setRatingTeaching] = useState(3);
  const [ratingHomework, setRatingHomework] = useState(3);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCourseAndReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('course_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData);

      } catch (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        err: any
      ) {
        console.error('Error fetching data:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndReviews();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!id) {
      setSubmitError('ไม่พบรหัสวิชา');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('reviews').insert({
        course_id: id as string,
        content: reviewContent,
        rating_overall: ratingOverall,
        rating_difficulty: ratingDifficulty,
        rating_teaching: ratingTeaching,
        rating_homework: ratingHomework,
        is_anonymous: isAnonymous,
      });

      if (error) throw error;

      setSubmitSuccess(true);
      setReviewContent('');
      setRatingOverall(3);
      setRatingDifficulty(3);
      setRatingTeaching(3);
      setRatingHomework(3);
      setIsAnonymous(true);

      const { data: updatedReviews, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .eq('course_id', id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setReviews(updatedReviews);

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-main text-text-base">
      <p className="text-xl">กำลังโหลดข้อมูล...</p>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-main text-text-base">
      <div className="text-center p-8 glass-element">
        <h1 className="text-xl font-bold text-red-400 mb-4">Error: {error}</h1>
        <p className="text-text-muted">โปรดลองอีกครั้งในภายหลัง</p>
      </div>
    </div>
  );
  if (!course) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-main text-text-base">
      <div className="text-center p-8 glass-element">
        <h1 className="text-xl font-bold text-text-base mb-4">ไม่พบข้อมูลรายวิชา</h1>
        <Link href="/" className="text-accent-1 hover:underline">
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header section with site title and back button */}
      <header className="bg-white bg-opacity-10 backdrop-blur-sm shadow-glass-card rounded-b-3xl mb-8 p-4 md:p-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Back button */}
          <Link href="/" className="text-accent-1 hover:text-primary-light text-lg font-semibold mr-4 transition-colors duration-200 mb-4 md:mb-0">
            &larr; กลับหน้าหลัก
          </Link>
          {/* Site Title / Course Context (centered for this page) */}
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md flex-grow text-center">รายละเอียดวิชา</h1>
          {/* Placeholder for future buttons, e.g., Bookmark */}
          <div className="w-auto md:w-[150px] text-right"> {/* Placeholder to align title */}
            <button className="glass-element px-3 py-2 rounded-lg text-text-base text-sm hover:bg-white hover:bg-opacity-20 transition-colors hidden md:inline-block">
              Bookmark ❤️
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 py-10 max-w-4xl">
        {/* Course details block */}
        <div className="glass-element p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2 text-accent-1 drop-shadow-md glow-text">{course.course_name}</h2>
          <p className="text-text-base text-xl mb-2">{course.course_code} • {course.university_name}</p>
          {course.faculty && <p className="text-text-muted text-lg">คณะ: {course.faculty}</p>}
          {course.credits && <p className="text-text-muted text-lg">หน่วยกิต: {course.credits}</p>}
        </div>

        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-md glow-text">เขียนรีวิวรายวิชานี้</h2>
        {/* Review submission form */}
        <form onSubmit={handleSubmitReview} className="glass-element p-8 mb-10">
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

        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-md glow-text">รีวิวทั้งหมดสำหรับวิชานี้</h2>
        {reviews.length === 0 ? (
          <p className="text-text-muted text-lg text-center mt-8 drop-shadow-sm">ยังไม่มีรีวิวสำหรับวิชานี้ เป็นคนแรกที่รีวิวเลย!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="glass-element p-7">
                <p className="text-sm text-text-muted mb-3">
                  {review.is_anonymous ? 'ไม่เปิดเผยชื่อ' : 'ผู้ใช้งาน'} •{' '}
                  {new Date(review.created_at).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-text-base text-base leading-relaxed mb-4">{review.content}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-text-muted font-medium">
                  <p>ภาพรวม: <span className="star-rating">{renderStars(review.rating_overall)}</span></p>
                  <p>ความยาก: <span className="star-rating">{renderStars(review.rating_difficulty)}</span></p>
                  <p>การสอน: <span className="star-rating">{renderStars(review.rating_teaching)}</span></p>
                  <p>การบ้าน: <span className="star-rating">{renderStars(review.rating_homework)}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
