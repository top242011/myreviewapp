'use client'; // Client Component because it uses useState and handleSubmit

import { supabase } from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head'; // Added for SEO metadata

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
    const { id } = useParams(); // Get course ID from URL parameters
    const [course, setCourse] = useState<Course | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for review form fields
    const [reviewContent, setReviewContent] = useState('');
    const [ratingOverall, setRatingOverall] = useState(3);
    const [ratingDifficulty, setRatingDifficulty] = useState(3);
    const [ratingTeaching, setRatingTeaching] = useState(3);
    const [ratingHomework, setRatingHomework] = useState(3);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Effect to fetch course and review data when the ID changes
    useEffect(() => {
        if (!id) return;

        const fetchCourseAndReviews = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch course details
                const { data: courseData, error: courseError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (courseError) throw courseError;
                setCourse(courseData);

                // Fetch reviews for the course
                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('course_id', id)
                    .order('created_at', { ascending: false }); // Order by creation date, newest first

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
    }, [id]); // Dependency array: re-run when 'id' changes

    // Function to handle review form submission
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
            // Insert new review into the 'reviews' table
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
            // Reset form fields after successful submission
            setReviewContent('');
            setRatingOverall(3);
            setRatingDifficulty(3);
            setRatingTeaching(3);
            setRatingHomework(3);
            setIsAnonymous(true);

            // Re-fetch reviews to update the list on the page
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

    // Helper function to render star ratings visually
    const renderStars = (rating: number) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    // Loading, Error, and Not Found states
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl text-gray-200">กำลังโหลดข้อมูล...</p> {/* Adjusted text color */}
        </div>
    );
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8 glass-element"> {/* Applied glass-element */}
                <h1 className="text-xl font-bold text-red-400 mb-4">Error: {error}</h1> {/* Adjusted color */}
                <p className="text-gray-200">โปรดลองอีกครั้งในภายหลัง</p> {/* Adjusted color */}
            </div>
        </div>
    );
    if (!course) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8 glass-element"> {/* Applied glass-element */}
                <h1 className="text-xl font-bold text-gray-100 mb-4">ไม่พบข้อมูลรายวิชา</h1> {/* Adjusted color */}
                <Link href="/" className="text-glass-accent-light hover:underline"> {/* Accent color link */}
                    กลับสู่หน้าหลัก
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen"> {/* Removed bg-gray-100 */}
            <Head>
                <title>{course.course_name} ({course.course_code}) - เว็บรีวิวรายวิชา</title>
                <meta name="description" content={`รีวิววิชา ${course.course_name} (${course.course_code}) ของ ${course.university_name}`} />
            </Head>

            {/* Header section */}
            <header className="bg-white bg-opacity-10 backdrop-blur-sm shadow-glass-card p-4 flex items-center rounded-b-xl mb-8"> {/* Applied glass-element principles, rounded bottom */}
                <Link href="/" className="text-glass-accent-light hover:text-glass-primary-light text-lg font-semibold mr-4 transition-colors duration-200"> {/* Accent color, hover effect */}
                    &larr; กลับ
                </Link>
                <h1 className="text-3xl font-extrabold text-white flex-grow text-center drop-shadow-lg">รายละเอียดวิชาและการรีวิว</h1> {/* White text, shadow */}
            </header>

            <main className="container mx-auto p-6 py-10 max-w-4xl">
                {/* Course details block */}
                <div className="glass-element p-8 mb-8"> {/* Applied glass-element */}
                    <h2 className="text-3xl font-bold mb-2 text-glass-accent-light drop-shadow-md">{course.course_name}</h2> {/* Accent color, shadow */}
                    <p className="text-gray-100 text-xl mb-2">{course.course_code} - {course.university_name}</p> {/* Light gray text */}
                    {course.faculty && <p className="text-gray-200 text-lg">คณะ: {course.faculty}</p>} {/* Lighter gray */}
                    {course.credits && <p className="text-gray-200 text-lg">หน่วยกิต: {course.credits}</p>} {/* Lighter gray */}
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-md">เขียนรีวิวรายวิชานี้</h2> {/* White text, shadow */}
                {/* Review submission form */}
                <form onSubmit={handleSubmitReview} className="glass-element p-8 mb-10"> {/* Applied glass-element */}
                    <div className="mb-6">
                        <label htmlFor="reviewContent" className="block text-gray-100 text-base font-bold mb-2"> {/* Light text */}
                            เนื้อหารีวิวของคุณ:
                            <span className="text-sm font-normal text-gray-300 block"> {/* Lighter gray text */}
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
                                    {item.label}: <span className="font-normal text-glass-accent-light ml-1 star-rating">{renderStars(item.value)}</span> {/* Accent color, star-rating class */}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={item.value}
                                    onChange={(e) => item.setter(parseInt(e.target.value))}
                                    className="w-full h-2 bg-blue-400 rounded-lg appearance-none cursor-pointer accent-glass-accent-light" // Accent color slider
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center cursor-pointer text-gray-100"> {/* Light text */}
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-glass-primary-light rounded-md border-gray-400 focus:ring-glass-accent-light transition-all duration-200" // Accent color for checkbox
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            <span className="ml-3 text-base">รีวิวโดยไม่เปิดเผยชื่อ</span>
                        </label>
                    </div>

                    {submitSuccess && (
                        <div className="bg-green-600 bg-opacity-70 border border-green-400 text-white px-4 py-3 rounded relative mb-4 shadow-md" role="alert"> {/* Improved success message style */}
                            <span className="block sm:inline">ส่งรีวิวสำเร็จแล้ว! ขอบคุณสำหรับความคิดเห็นของคุณ</span>
                        </div>
                    )}
                    {submitError && (
                        <div className="bg-red-600 bg-opacity-70 border border-red-400 text-white px-4 py-3 rounded relative mb-4 shadow-md" role="alert"> {/* Improved error message style */}
                            <span className="block sm:inline">Error: {submitError}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-gradient w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed" // Used btn-gradient
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'กำลังส่งรีวิว...' : 'ส่งรีวิวของคุณ'}
                    </button>
                </form>

                <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-md">รีวิวทั้งหมดสำหรับวิชานี้</h2> {/* White text, shadow */}
                {reviews.length === 0 ? (
                    <p className="text-gray-300 text-lg text-center mt-8 drop-shadow-sm">ยังไม่มีรีวิวสำหรับวิชานี้ เป็นคนแรกที่รีวิวเลย!</p> {/* Adjusted text color */}
                ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="glass-element p-7"> {/* Applied glass-element */}
                            <p className="text-sm text-gray-200 mb-3"> {/* Light gray text */}
                                {review.is_anonymous ? 'ไม่เปิดเผยชื่อ' : 'ผู้ใช้งาน'} •{' '}
                                {new Date(review.created_at).toLocaleDateString('th-TH', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            <p className="text-gray-100 text-base leading-relaxed mb-4">{review.content}</p> {/* Light gray text */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-200 font-medium"> {/* Light gray text */}
                                <p>ภาพรวม: <span className="star-rating">{renderStars(review.rating_overall)}</span></p> {/* star-rating class */}
                                <p>ความยาก: <span className="star-rating">{renderStars(review.rating_difficulty)}</span></p> {/* star-rating class */}
                                <p>การสอน: <span className="star-rating">{renderStars(review.rating_teaching)}</span></p> {/* star-rating class */}
                                <p>การบ้าน: <span className="star-rating">{renderStars(review.rating_homework)}</span></p> {/* star-rating class */}
                            </div>
                        </div>
                    ))}
                </div>
        )}
            </main>
        </div>
    );
}
