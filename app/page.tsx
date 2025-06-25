    import { supabase } from '@/utils/supabaseClient';
    import Link from 'next/link';
    import Head from 'next/head'; // Added for SEO title

    export default async function HomePage() {
      const { data: courses, error } = await supabase
        .from('courses')
        .select('*');

      if (error) {
        console.error('Error fetching courses:', error);
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h1 className="text-xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูลวิชา</h1>
              <p className="text-gray-700">โปรดลองอีกครั้งในภายหลัง หรือตรวจสอบการเชื่อมต่อกับฐานข้อมูล</p>
            </div>
          </div>
        );
      }

      return (
        <div className="bg-gray-100 min-h-screen">
          <Head>
            <title>เว็บรีวิวรายวิชา - ค้นหาและรีวิวคอร์สเรียน</title>
            <meta name="description" content="ค้นหารายวิชา, อ่านรีวิว, และเขียนรีวิวสำหรับคอร์สเรียนในมหาวิทยาลัยต่างๆ" />
          </Head>

          <header className="bg-white shadow-md p-4 text-center">
            <h1 className="text-4xl font-extrabold text-blue-700">เว็บรีวิวรายวิชา</h1>
            <p className="text-gray-600 mt-2">แหล่งข้อมูลประกอบการตัดสินใจลงทะเบียนเรียนที่เชื่อถือได้</p>
          </header>

          <main className="container mx-auto p-6 py-10">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">ค้นหารายวิชาที่คุณอยากรู้</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.id}`}
                  className="block p-5 border border-gray-200 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-semibold text-blue-600 mb-2">{course.course_name}</h3>
                  <p className="text-gray-700 text-lg mb-1">{course.course_code} - {course.university_name}</p>
                  {course.faculty && <p className="text-gray-600 text-base">คณะ: {course.faculty}</p>}
                  {course.credits && <p className="text-gray-600 text-base">หน่วยกิต: {course.credits}</p>}
                </Link>
              ))}
            </div>
            {courses?.length === 0 && (
              <p className="text-center mt-12 text-gray-500 text-lg">
                ยังไม่มีรายวิชาในระบบ โปรดเพิ่มวิชาผ่าน Supabase Dashboard เพื่อเริ่มต้น
              </p>
            )}
          </main>
        </div>
      );
    }
    