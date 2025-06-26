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
      <div className="min-h-screen flex items-center justify-center bg-gradient-main text-text-base">
        <div className="text-center p-8 glass-element">
          <h1 className="text-xl font-bold text-red-400 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูลวิชา</h1>
          <p className="text-text-muted">โปรดลองอีกครั้งในภายหลัง หรือตรวจสอบการเชื่อมต่อกับฐานข้อมูล</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header and Navigation Bar */}
      <header className="bg-white bg-opacity-10 backdrop-blur-sm shadow-glass-card rounded-b-3xl mb-8 p-4 md:p-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo / Site Title */}
          <Link href="/" className="text-4xl font-extrabold text-white drop-shadow-md mb-4 md:mb-0">
            LearnRadar
          </Link>

          {/* Search Bar (Mockup for future) */}
          <div className="relative w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="ค้นหารายวิชา, มหาวิทยาลัย..."
              className="glass-element w-full px-4 py-2 rounded-lg text-text-base placeholder-text-muted focus:ring-accent-1"
              readOnly // Make it read-only for mockup
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
          </div>

          {/* Navigation/Action Buttons */}
          <nav className="flex items-center space-x-4">
            <Link href="/add-review" className="btn-accent-gradient text-sm md:text-base">
              + เพิ่มรีวิว
            </Link>
            {/* Mockup for future features */}
            <button className="glass-element px-3 py-2 rounded-lg text-text-base text-sm md:text-base hover:bg-white hover:bg-opacity-20 transition-colors">
              <span className="hidden md:inline">บัญชีของฉัน</span> 👤
            </button>
            <button className="glass-element px-3 py-2 rounded-lg text-text-base text-sm md:text-base hover:bg-white hover:bg-opacity-20 transition-colors">
              <span className="hidden md:inline">รายการโปรด</span> ❤️
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto p-6 py-10">
        <h2 className="text-4xl font-bold mb-10 text-center text-white glow-text">
          ค้นหารายวิชาที่คุณอยากรู้
        </h2>

        {/* Filters/Tags (Mockup for future) */}
        <div className="glass-element p-5 mb-10 rounded-xl flex flex-wrap justify-center gap-3">
          <span className="text-text-base font-semibold mr-3">ตัวกรอง:</span>
          <button className="bg-primary-light bg-opacity-70 text-white text-sm px-4 py-2 rounded-full hover:bg-opacity-90 transition-opacity">#GenEd</button>
          <button className="bg-primary-light bg-opacity-70 text-white text-sm px-4 py-2 rounded-full hover:bg-opacity-90 transition-opacity">#มีชีท</button>
          <button className="bg-primary-light bg-opacity-70 text-white text-sm px-4 py-2 rounded-full hover:bg-opacity-90 transition-opacity">#มีพรีเซนต์</button>
          <button className="bg-primary-light bg-opacity-70 text-white text-sm px-4 py-2 rounded-full hover:bg-opacity-90 transition-opacity">#เน้นปฏิบัติ</button>
          {/* Mockup for Marketplace link */}
          <Link href="/marketplace" className="btn-accent-gradient text-sm px-4 py-2 rounded-full shadow-md ml-auto">
            🛒 ดูชีทสรุป (ในอนาคต)
          </Link>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/course/${course.id}`}
              className="block p-6 glass-element hover:scale-[1.02] transform transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-2xl font-bold text-accent-1 mb-2 glow-text">{course.course_name}</h3>
              <p className="text-text-muted text-lg mb-1">{course.course_code} • {course.university_name}</p>
              {course.faculty && <p className="text-text-muted text-base">คณะ: {course.faculty}</p>}
              {course.credits && <p className="text-text-muted text-base">หน่วยกิต: {course.credits}</p>}
              {/* Mockup for Average Rating/Review Count */}
              <div className="flex items-center text-text-base mt-4">
                <span className="star-rating mr-2">⭐⭐⭐⭐</span>
                <span className="text-sm">(24 รีวิว)</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Message if no approved courses are found */}
        {courses?.length === 0 && (
          <p className="text-center mt-12 text-text-muted text-lg drop-shadow-sm">
            ยังไม่มีรายวิชาที่ได้รับการอนุมัติในระบบ <Link href="/add-review" className="text-accent-1 hover:underline">เพิ่มรีวิววิชาแรกของคุณที่นี่</Link>
          </p>
        )}
      </main>

      {/* Mockup for Future Pages (simple placeholder for navigation) */}
      <div className="hidden"> {/* Hidden for now, but demonstrates future routes */}
        <Link href="/marketplace"></Link>
        <Link href="/my-account"></Link>
        <Link href="/my-bookmarks"></Link>
      </div>
    </div>
  );
}
