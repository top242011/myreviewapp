'use client'; // Client Component เพราะมีการใช้ useState และ handleSubmit

import { supabase } from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Added for back button
import Head from 'next/head'; // Added for SEO title

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
    const { id } = useParams(); // ดึง id จาก URL
    const [course, setCourse] = useState<Course | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State สำหรับฟอร์มรีวิว
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
                // ดึงข้อมูลวิชา
                const { data: courseData, error: courseError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (courseError) throw courseError;
                setCourse(courseData);

                // ดึงข้อมูลรีวิว
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

            // โหลดรีวิวใหม่หลังจากส่งสำเร็จ
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-xl text-gray-700">กำลังโหลดข้อมูล...</p>
        </div>
    );
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-bold text-red-600 mb-4">Error: {error}</h1>
                <p className="text-gray-700">โปรดลองอีกครั้งในภายหลัง</p>
            </div>
        </div>
    );
    if (!course) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-bold text-gray-700 mb-4">ไม่พบข้อมูลรายวิชา</h1>
                <Link href="/" className="text-blue-600 hover:underline">
                    กลับสู่หน้าหลัก
                </Link>
            </div>
        </div>
    );

    // Function to render star ratings
    const renderStars = (rating: number) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Head>
                <title>{course.course_name} ({course.course_code}) - เว็บรีวิวรายวิชา</title>
                <meta name="description" content={`รีวิววิชา ${course.course_name} (${course.course_code}) ของ ${course.university_name}`} />
            </Head>

            <header className="bg-white shadow-md p-4 flex items-center">
                <Link href="/" className="text-blue-600 hover:text-blue-800 text-lg font-semibold mr-4">
                    &larr; กลับ
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-800 flex-grow text-center">รายละเอียดวิชาและการรีวิว</h1>
            </header>

            <main className="container mx-auto p-6 py-10 max-w-4xl">
                <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-blue-700">{course.course_name}</h2>
                    <p className="text-xl text-gray-700 mb-2">{course.course_code} - {course.university_name}</p>
                    {course.faculty && <p className="text-lg text-gray-600">คณะ: {course.faculty}</p>}
                    {course.credits && <p className="text-lg text-gray-600">หน่วยกิต: {course.credits}</p>}
                </div>

                <h2 className="text-2xl font-bold mb-6 text-gray-800">เขียนรีวิวรายวิชานี้</h2>
                <form onSubmit={handleSubmitReview} className="bg-white p-8 rounded-xl shadow-lg mb-10">
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

                <h2 className="text-2xl font-bold mb-6 text-gray-800">รีวิวทั้งหมดสำหรับวิชานี้</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-lg text-center mt-8">ยังไม่มีรีวิวสำหรับวิชานี้ เป็นคนแรกที่รีวิวเลย!</p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-7 rounded-xl shadow-md border border-gray-200">
                                <p className="text-sm text-gray-500 mb-3">
                                    {review.is_anonymous ? 'ไม่เปิดเผยชื่อ' : 'ผู้ใช้งาน'} •{' '}
                                    {new Date(review.created_at).toLocaleDateString('th-TH', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                                <p className="text-gray-800 text-base leading-relaxed mb-4">{review.content}</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700 font-medium">
                                    <p>ภาพรวม: {renderStars(review.rating_overall)}</p>
                                    <p>ความยาก: {renderStars(review.rating_difficulty)}</p>
                                    <p>การสอน: {renderStars(review.rating_teaching)}</p>
                                    <p>การบ้าน: {renderStars(review.rating_homework)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
