import React from "react";

function Profile() {
  const students = [
    { name: "นาย ปิยดนัย โครงกลาง", id: "650112418059", img: "/images/piyadanai.jpg" },
    { name: "นาย ธเนศ ไตแดง", id: "650112418053", img: "/images/thanet.jpg" }
  ];

  return (
    <div className="flex flex-col items-center justify-center mt-6 md:mt-10 pb-10 px-2 md:px-0">
      <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-600/30 rounded-3xl p-6 md:p-10 max-w-4xl w-full shadow-2xl text-center">
        
        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-8 md:mb-10">
          ทีมผู้จัดทำโครงการ
        </h1>

        {/* ผู้จัดทำ 2 คน */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-10 md:mb-12">
          {students.map((student, index) => (
            <div key={index} className="flex flex-col items-center group cursor-default">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-cyan-300 mb-4 transition-transform duration-500 group-hover:scale-110 shadow-lg">
                <img
                  src={student.img}
                  alt={student.name}
                  className="w-full h-full object-cover rounded-full border-4 border-gray-900"
                />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{student.name}</h2>
              <p className="text-xs md:text-sm text-gray-400 mt-1 uppercase tracking-wide">รหัสนักศึกษา {student.id}</p>
            </div>
          ))}
        </div>

        {/* เส้นคั่น */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-8 md:my-10"></div>

        {/* อาจารย์ที่ปรึกษา */}
        <div className="flex flex-col items-center group cursor-default">
          <h1 className="text-xl md:text-2xl font-bold text-blue-400 mb-4 md:mb-6">อาจารย์ที่ปรึกษา</h1>
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-pink-500 mb-4 transition-transform duration-500 group-hover:scale-105 shadow-lg">
            <img
              src="/images/sangdaow.jpg"
              alt="อาจารย์ ดร.แสงดาว นพพิทักษ์"
              className="w-full h-full object-cover rounded-full border-4 border-gray-900"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-2">อาจารย์ ดร.แสงดาว นพพิทักษ์</h2>
          <p className="text-sm md:text-md text-gray-400 mt-1">อาจารย์ที่ปรึกษาโครงการ</p>
        </div>

        <div className="mt-10 md:mt-12 pt-6 border-t border-gray-700/50">
          <h3 className="text-lg md:text-xl font-medium tracking-widest text-gray-300">สาขาวิชาเทคโนโลยีสารสนเทศ</h3>
        </div>

      </div>
    </div>
  );
}

export default Profile;