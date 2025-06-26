import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
// Removed: import Head from 'next/head'; // No Head component in App Router pages

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_approved', true);

  if (error) {
    console.error('Error fetching courses:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <div className="text-center p-8 bg-white bg-opacity-15 backdrop-blur-md rounded-xl shadow-lg border border-white border-opacity-30">
          <h1 className="text-xl font-bold text-red-400 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูลวิชา</h1>
          <p className="text-gray-200">โปรดลองอีกครั้งในภายหลัง หรือตรวจสอบการเชื่อมต่อกับฐานข้อมูล</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header section with site title and "Add Review" button */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 shadow-xl p-4 text-center relative rounded-b-3xl mb-8">
        <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-md">เว็บรีวิวรายวิชา</h1>
        <p className="text-purple-200 drop-shadow-sm">แหล่งข้อมูลประกอบการตัดสินใจลงทะเบียนเรียนที่เชื่อถือได้</p>
        <Link href="/add-review" className="absolute top-4 right-4 btn-accent">
          + เพิ่มรีวิว
        </Link>
      </header>

      {/* Main content area for displaying courses */}
      <main className="container mx-auto p-6 py-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-white drop-shadow-md">ค้นหารายวิชาที่คุณอยากรู้</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/course/${course.id}`}
              className="block p-5 bg-white bg-opacity-15 backdrop-blur-md rounded-xl shadow-lg border border-white border-opacity-30 hover:scale-105 transform transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-pink-300 mb-2">{course.course_name}</h3>
              <p className="text-gray-200 text-lg mb-1">{course.course_code} - {course.university_name}</p>
              {course.faculty && <p className="text-gray-300 text-base">คณะ: {course.faculty}</p>}
              {course.credits && <p className="text-gray-300 text-base">หน่วยกิต: {course.credits}</p>}
            </Link>
          ))}
        </div>
        {courses?.length === 0 && (
          <p className="text-center mt-12 text-gray-300 text-lg drop-shadow-sm">
            ยังไม่มีรายวิชาที่ได้รับการอนุมัติในระบบ <Link href="/add-review" className="text-pink-300 hover:underline">เพิ่มรีวิววิชาแรกของคุณที่นี่</Link>
          </p>
        )}
      </main>
    </div>
  );
}
