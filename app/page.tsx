import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
import Head from 'next/head'; // Added for SEO metadata

// Forces this page to be rendered dynamically on the server for every request.
// This ensures that data from Supabase is always fresh and not cached statically.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_approved', true); // Filter: Only fetch courses where is_approved is true

  if (error) {
    console.error('Error fetching courses:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 glass-element"> {/* Applied glass-element */}
          <h1 className="text-xl font-bold text-red-400 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูลวิชา</h1> {/* Adjusted color for dark bg */}
          <p className="text-gray-200">โปรดลองอีกครั้งในภายหลัง หรือตรวจสอบการเชื่อมต่อกับฐานข้อมูล</p> {/* Adjusted color */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen"> {/* Removed bg-gray-100 as body handles background */}
      <Head>
        <title>เว็บรีวิวรายวิชา - ค้นหาและรีวิวคอร์สเรียน</title>
        <meta name="description" content="ค้นหารายวิชา, อ่านรีวิว, และเขียนรีวิวสำหรับคอร์สเรียนในมหาวิทยาลัยต่างๆ" />
      </Head>

      {/* Header section with site title and "Add Review" button */}
      <header className="bg-white bg-opacity-10 backdrop-blur-sm shadow-glass-card p-4 text-center relative rounded-b-xl mb-8"> {/* Applied glass-element principles, rounded bottom */}
        <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">เว็บรีวิวรายวิชา</h1> {/* White text, subtle shadow */}
        <p className="text-gray-100 drop-shadow-md">แหล่งข้อมูลประกอบการตัดสินใจลงทะเบียนเรียนที่เชื่อถือได้</p> {/* Light gray text */}
        {/* Button to navigate to the Add Review page */}
        <Link href="/add-review" className="absolute top-4 right-4 btn-accent"> {/* Used btn-accent */}
          + เพิ่มรีวิว
        </Link>
      </header>

      {/* Main content area for displaying courses */}
      <main className="container mx-auto p-6 py-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-white drop-shadow-md">ค้นหารายวิชาที่คุณอยากรู้</h2> {/* White text, shadow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/course/${course.id}`} // Link to the detailed course page
              className="block p-5 glass-element hover:scale-105" // Applied glass-element, added scale effect
            >
              <h3 className="text-2xl font-semibold text-glass-accent-light mb-2">{course.course_name}</h3> {/* Accent color */}
              <p className="text-gray-200 text-lg mb-1">{course.course_code} - {course.university_name}</p> {/* Light gray text */}
              {course.faculty && <p className="text-gray-300 text-base">คณะ: {course.faculty}</p>} {/* Lighter gray */}
              {course.credits && <p className="text-gray-300 text-base">หน่วยกิต: {course.credits}</p>} {/* Lighter gray */}
            </Link>
          ))}
        </div>
        {/* Message displayed if no approved courses are found */}
        {courses?.length === 0 && (
          <p className="text-center mt-12 text-gray-300 text-lg drop-shadow-sm"> {/* Adjusted text color */}
            ยังไม่มีรายวิชาที่ได้รับการอนุมัติในระบบ <Link href="/add-review" className="text-glass-accent-light hover:underline">เพิ่มรีวิววิชาแรกของคุณที่นี่</Link> {/* Accent color link */}
          </p>
        )}
      </main>
    </div>
  );
}
