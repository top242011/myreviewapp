import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';

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
    <div className="min-h-screen flex flex-col">
      {/* Header and Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-b-3xl px-4 py-3 md:px-6 md:py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo / Site Title */}
          <Link href="/" className="text-4xl font-extrabold text-white text-shadow-glow mb-4 md:mb-0 hover:scale-105 transition-transform duration-200">
            LearnRadar
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex flex-grow justify-center space-x-8 lg:space-x-12 mx-8">
            <Link href="#search-section" className="text-gray-100 hover:text-pink-400 text-lg font-semibold transition-colors duration-200 relative group">
              ค้นหารายวิชา
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#trending-section" className="text-gray-100 hover:text-pink-400 text-lg font-semibold transition-colors duration-200 relative group">
              วิชายอดนิยม
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/marketplace" className="text-gray-100 hover:text-pink-400 text-lg font-semibold transition-colors duration-200 relative group">
              Marketplace (Mock)
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Auth/User Buttons */}
          <div className="flex items-center space-x-3">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all text-sm md:text-base">เข้าสู่ระบบ</button>
            <button className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-red-400 hover:to-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all text-sm md:text-base">สมัครสมาชิก</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center p-6 pt-24 md:pt-32 pb-10"> {/* Adjusted padding-top for fixed header */}
        <div className="container mx-auto text-center bg-white bg-opacity-15 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-lg border border-white border-opacity-30 overflow-hidden relative">
          {/* Decorative rotating background */}
          <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_0%,_transparent_70%)] animate-spin-slow"></div>

          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight text-shadow-glow">
              รีวิววิชาเรียนจาก<br className="md:hidden"/>นักศึกษาจริง
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 drop-shadow-sm max-w-2xl mx-auto">
              ค้นหาวิชาเรียนที่ใช่สำหรับคุณ พร้อมรีวิวจากเพื่อนนักศึกษา
            </p>
            <Link href="#search-section" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all text-lg">
              เริ่มค้นหาวิชา
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto p-6 py-10 mt-8">
        {/* Search & Filter Section */}
        <section className="bg-white bg-opacity-15 backdrop-blur-md p-6 md:p-8 mb-12 rounded-xl shadow-lg border border-white border-opacity-30" id="search-section">
          <h2 className="text-3xl font-bold mb-6 text-white text-shadow-glow">ค้นหารายวิชาที่คุณอยากรู้</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              className="bg-white bg-opacity-25 border border-white border-opacity-40 flex-grow px-4 py-3 rounded-lg text-gray-100 placeholder-gray-300 focus:ring-pink-400 focus:outline-none focus:border-pink-400 transition-all"
              placeholder="ค้นหาวิชาเรียน, อาจารย์, รหัสวิชา..."
              readOnly // Mockup for now
            />
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-lg text-lg shadow-md transition-all">ค้นหา</button>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <span className="text-gray-100 font-semibold text-lg mr-2">ตัวกรอง:</span>
            <select className="bg-white bg-opacity-25 border border-white border-opacity-40 px-4 py-2 rounded-lg text-gray-100 focus:ring-pink-400 focus:outline-none focus:border-pink-400">
              <option className="bg-indigo-800 text-gray-100">ทุกมหาวิทยาลัย</option>
              <option className="bg-indigo-800 text-gray-100">จุฬาลงกรณ์มหาวิทยาลัย</option>
              <option className="bg-indigo-800 text-gray-100">มหาวิทยาลัยธรรมศาสตร์</option>
            </select>
            <select className="bg-white bg-opacity-25 border border-white border-opacity-40 px-4 py-2 rounded-lg text-gray-100 focus:ring-pink-400 focus:outline-none focus:border-pink-400">
              <option className="bg-indigo-800 text-gray-100">ทุกคณะ</option>
              <option className="bg-indigo-800 text-gray-100">วิศวกรรมศาสตร์</option>
              <option className="bg-indigo-800 text-gray-100">แพทยศาสตร์</option>
            </select>
            <select className="bg-white bg-opacity-25 border border-white border-opacity-40 px-4 py-2 rounded-lg text-gray-100 focus:ring-pink-400 focus:outline-none focus:border-pink-400">
              <option className="bg-indigo-800 text-gray-100">เรียงตาม</option>
              <option className="bg-indigo-800 text-gray-100">คะแนนสูงสุด</option>
              <option className="bg-indigo-800 text-gray-100">รีวิวล่าสุด</option>
            </select>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Course Grid */}
          <section className="lg:col-span-3">
            <h3 className="text-3xl font-bold mb-6 text-white text-shadow-glow">รีวิวรายวิชาล่าสุด</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses?.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.id}`}
                  className="block p-6 bg-white bg-opacity-15 backdrop-blur-md rounded-xl shadow-lg border border-white border-opacity-30 hover:scale-[1.02] transform transition-all duration-300 cursor-pointer relative"
                >
                  {/* Decorative top border gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-orange-400"></div>
                  
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <span className="bg-indigo-800 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">{course.course_code}</span>
                    <div className="flex items-center text-yellow-400">
                      <span className="text-xl mr-1">★★★★☆</span>
                      <span>4.8</span>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-pink-300 mb-2 text-shadow-glow">{course.course_name}</h4>
                  <p className="text-gray-300 mb-3">อ.ดร.สมชาย ใจดี (Mock)</p> {/* Mock Instructor */}
                  <div className="flex justify-between text-sm text-gray-300 mb-4">
                    <span>📚 127 รีวิว</span>
                    <span>👥 580 คน</span>
                    <span>⏱️ {course.credits || 3} หน่วยกิต</span>
                  </div>
                  <p className="text-gray-100 text-sm line-clamp-3">
                    วิชาพื้นฐานการเขียนโปรแกรม สอนดีมาก อาจารย์ใจดี ใช้ Python เป็นหลัก มีแลปทุกสัปดาห์... (Mock Preview)
                  </p>
                </Link>
              ))}
            </div>
            {courses?.length === 0 && (
              <p className="text-center mt-12 text-gray-300 text-lg drop-shadow-sm">
                ยังไม่มีรายวิชาที่ได้รับการอนุมัติในระบบ <Link href="/add-review" className="text-pink-300 hover:underline">เพิ่มรีวิววิชาแรกของคุณที่นี่</Link>
              </p>
            )}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-1 bg-white bg-opacity-15 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white border-opacity-30 h-fit sticky top-24" id="trending-section">
            <h3 className="text-2xl font-bold mb-6 text-white text-shadow-glow">🔥 วิชายอดนิยม</h3>
            <ul className="space-y-4">
              {[
                { title: 'Introduction to Psychology', stats: '★4.7 • 234 รีวิว' },
                { title: 'Digital Marketing', stats: '★4.6 • 189 รีวิว' },
                { title: 'Data Science Fundamentals', stats: '★4.8 • 156 รีวิว' },
                { title: 'Creative Writing', stats: '★4.9 • 98 รีวิว' },
              ].map((item, index) => (
                <li key={index} className="pb-4 border-b border-white border-opacity-30 last:border-b-0 hover:bg-white hover:bg-opacity-10 rounded-lg p-2 -mx-2 transition-colors duration-200 cursor-pointer">
                  <h4 className="font-semibold text-gray-100 text-lg">{item.title}</h4>
                  <p className="text-sm text-gray-300">{item.stats}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4 text-white text-shadow-glow">🚀 การดำเนินการด่วน</h3>
              <div className="space-y-3">
                <Link href="/add-review" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all block text-center">เขียนรีวิวใหม่</Link>
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all block w-full text-center">ดูประวัติการรีวิว (Mock)</button>
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-opacity-80 hover:bg-opacity-100 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all block w-full text-center">บันทึกวิชาที่สนใจ (Mock)</button>
                <Link href="/marketplace" className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-red-400 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all block text-center">🛒 ดูชีทสรุป (Mock)</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg mt-12 p-6 text-center rounded-t-3xl">
        <div className="container mx-auto">
          <p className="text-gray-300">&copy; 2025 LearnRadar. สร้างโดยนักศึกษา เพื่อนักศึกษา</p>
        </div>
      </footer>

      {/* Floating Add Button */}
      <Link href="/add-review" className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-red-400 rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform duration-300 z-40" title="เขียนรีวิวใหม่">
        ✏️
      </Link>
    </div>
  );
}
