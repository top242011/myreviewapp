import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
// No Head import needed for App Router

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_approved', true);

  if (error) {
    console.error('Error fetching courses:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg text-text-light">
        <div className="text-center p-8 glass-element">
          <h1 className="text-xl font-bold text-red-400 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูลวิชา</h1>
          <p className="text-text-muted">โปรดลองอีกครั้งในภายหลัง หรือตรวจสอบการเชื่อมต่อกับฐานข้อมูล</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header and Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-10 backdrop-blur-md shadow-glass-sm rounded-b-3xl px-4 py-3 md:px-6 md:py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo / Site Title */}
          <Link href="/" className="text-4xl font-extrabold text-white text-shadow-glow mb-4 md:mb-0 hover:scale-105 transition-transform duration-200">
            LearnRadar
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex flex-grow justify-center space-x-8 lg:space-x-12 mx-8">
            <Link href="#search" className="text-text-light hover:text-accent-pink text-lg font-semibold transition-colors duration-200 relative group">
              ค้นหารายวิชา
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-pink group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#trending" className="text-text-light hover:text-accent-pink text-lg font-semibold transition-colors duration-200 relative group">
              วิชายอดนิยม
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-pink group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/marketplace" className="text-text-light hover:text-accent-pink text-lg font-semibold transition-colors duration-200 relative group">
              Marketplace (Mock)
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-pink group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Auth/User Buttons */}
          <div className="flex items-center space-x-3">
            <button className="btn-primary-gradient text-sm md:text-base px-4 py-2">เข้าสู่ระบบ</button>
            <button className="btn-accent-gradient text-sm md:text-base px-4 py-2">สมัครสมาชิก</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center p-6 pt-24 md:pt-32 pb-10"> {/* Adjusted padding-top for fixed header */}
        <div className="container mx-auto text-center glass-element p-8 md:p-12 rounded-3xl shadow-glass-lg overflow-hidden relative">
          {/* Decorative rotating background */}
          <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-spin-slow"></div>

          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight text-shadow-glow">
              รีวิววิชาเรียนจาก<br className="md:hidden"/>นักศึกษาจริง
            </h1>
            <p className="text-lg md:text-xl text-text-light mb-8 drop-shadow-sm max-w-2xl mx-auto">
              ค้นหาวิชาเรียนที่ใช่สำหรับคุณ พร้อมรีวิวจากเพื่อนนักศึกษา
            </p>
            <Link href="#search-section" className="btn-primary-gradient text-lg px-8 py-3 rounded-full shadow-lg">
              เริ่มค้นหาวิชา
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto p-6 py-10 mt-8" id="search-section">
        {/* Search & Filter Section */}
        <section className="glass-element p-6 md:p-8 mb-12 rounded-xl shadow-glass-card" id="search">
          <h2 className="text-3xl font-bold mb-6 text-white text-shadow-glow">ค้นหารายวิชาที่คุณอยากรู้</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              className="glass-element flex-grow px-4 py-3 rounded-lg text-text-light placeholder-text-muted focus:ring-accent-pink"
              placeholder="ค้นหาวิชาเรียน, อาจารย์, รหัสวิชา..."
              readOnly // Mockup for now
            />
            <button className="btn-primary-gradient px-6 py-3 rounded-lg text-lg">ค้นหา</button>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <span className="text-text-light font-semibold text-lg mr-2">ตัวกรอง:</span>
            <select className="glass-element px-4 py-2 rounded-lg text-text-light">
              <option className="bg-primary-dark text-text-light">ทุกมหาวิทยาลัย</option>
              <option className="bg-primary-dark text-text-light">จุฬาลงกรณ์มหาวิทยาลัย</option>
              <option className="bg-primary-dark text-text-light">มหาวิทยาลัยธรรมศาสตร์</option>
            </select>
            <select className="glass-element px-4 py-2 rounded-lg text-text-light">
              <option className="bg-primary-dark text-text-light">ทุกคณะ</option>
              <option className="bg-primary-dark text-text-light">วิศวกรรมศาสตร์</option>
              <option className="bg-primary-dark text-text-light">แพทยศาสตร์</option>
            </select>
            <select className="glass-element px-4 py-2 rounded-lg text-text-light">
              <option className="bg-primary-dark text-text-light">เรียงตาม</option>
              <option className="bg-primary-dark text-text-light">คะแนนสูงสุด</option>
              <option className="bg-primary-dark text-text-light">รีวิวล่าสุด</option>
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
                  className="block p-6 glass-element hover:scale-[1.02] transform transition-all duration-300 cursor-pointer relative"
                >
                  {/* Decorative top border gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-card-border"></div>
                  
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <span className="bg-primary-dark text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">{course.course_code}</span>
                    <div className="flex items-center text-yellow-400">
                      <span className="star-rating mr-1">★★★★☆</span>
                      <span>4.8</span>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-accent-pink mb-2 text-shadow-glow">{course.course_name}</h4>
                  <p className="text-text-muted mb-3">อ.ดร.สมชาย ใจดี (Mock)</p> {/* Mock Instructor */}
                  <div className="flex justify-between text-sm text-text-muted mb-4">
                    <span>📚 127 รีวิว</span>
                    <span>👥 580 คน</span>
                    <span>⏱️ {course.credits || 3} หน่วยกิต</span>
                  </div>
                  <p className="text-text-base text-sm line-clamp-3">
                    วิชาพื้นฐานการเขียนโปรแกรม สอนดีมาก อาจารย์ใจดี ใช้ Python เป็นหลัก มีแลปทุกสัปดาห์... (Mock Preview)
                  </p>
                </Link>
              ))}
            </div>
            {courses?.length === 0 && (
              <p className="text-center mt-12 text-text-muted text-lg drop-shadow-sm">
                ยังไม่มีรายวิชาที่ได้รับการอนุมัติในระบบ <Link href="/add-review" className="text-accent-pink hover:underline">เพิ่มรีวิววิชาแรกของคุณที่นี่</Link>
              </p>
            )}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-1 glass-element p-6 rounded-xl shadow-glass-card h-fit sticky top-24"> {/* Adjusted sticky top for fixed header */}
            <h3 className="text-2xl font-bold mb-6 text-white text-shadow-glow">🔥 วิชายอดนิยม</h3>
            <ul className="space-y-4">
              {[
                { title: 'Introduction to Psychology', stats: '★4.7 • 234 รีวิว' },
                { title: 'Digital Marketing', stats: '★4.6 • 189 รีวิว' },
                { title: 'Data Science Fundamentals', stats: '★4.8 • 156 รีวิว' },
                { title: 'Creative Writing', stats: '★4.9 • 98 รีวิว' },
              ].map((item, index) => (
                <li key={index} className="pb-4 border-b border-glass-border-light last:border-b-0 hover:bg-white hover:bg-opacity-10 rounded-lg p-2 -mx-2 transition-colors duration-200 cursor-pointer">
                  <h4 className="font-semibold text-text-light text-lg">{item.title}</h4>
                  <p className="text-sm text-text-muted">{item.stats}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4 text-white text-shadow-glow">🚀 การดำเนินการด่วน</h3>
              <div className="space-y-3">
                <Link href="/add-review" className="btn-primary-gradient block text-center">เขียนรีวิวใหม่</Link>
                <button className="btn-primary-gradient bg-opacity-80 hover:bg-opacity-100 block w-full text-center">ดูประวัติการรีวิว (Mock)</button>
                <button className="btn-primary-gradient bg-opacity-80 hover:bg-opacity-100 block w-full text-center">บันทึกวิชาที่สนใจ (Mock)</button>
                <Link href="/marketplace" className="btn-accent-gradient block text-center">🛒 ดูชีทสรุป (Mock)</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white bg-opacity-10 backdrop-blur-sm shadow-glass-sm mt-12 p-6 text-center rounded-t-3xl">
        <div className="container mx-auto">
          <p className="text-text-muted">&copy; 2025 LearnRadar. สร้างโดยนักศึกษา เพื่อนักศึกษา</p>
        </div>
      </footer>

      {/* Floating Add Button */}
      <Link href="/add-review" className="fixed bottom-6 right-6 w-16 h-16 btn-accent-gradient rounded-full flex items-center justify-center text-3xl shadow-glass-lg hover:scale-110 transition-transform duration-300 z-40" title="เขียนรีวิวใหม่">
        ✏️
      </Link>
    </div>
  );
}
