import React from "react";

function Home() {
  return (
    <div className="flex justify-center items-center h-full mt-6 md:mt-10 px-2 md:px-0">
      <div className="w-full max-w-4xl p-6 md:p-10 bg-gray-800/60 backdrop-blur-lg border border-gray-600/30 rounded-2xl shadow-2xl text-center transition-all duration-500 hover:shadow-blue-500/20">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 text-white leading-tight">
          แอปพลิเคชันจำแนกภาพถ่าย SENTINEL-2 <br className="hidden md:block" />
          <span className="text-blue-400"> อ้อย และ มันสำปะหลัง</span>
        </h1>
        <p className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8">
          สำรวจพลังของภาพถ่ายดาวเทียมและ AI ในการจำแนกและวิเคราะห์ข้อมูลการเกษตรอย่างแม่นยำ
        </p>
        
        <div className="overflow-hidden rounded-xl shadow-lg mb-6 md:mb-8 border border-gray-700/50">
          <img
            src="https://dataspace.copernicus.eu/sites/default/files/styles/opengraph/public/media/images/2023-03/sentinel-2.jpg?itok=V6k97eQF"
            alt="Satellite imagery from SENTINEL-2"
            className="w-full h-auto object-cover transform transition duration-700 hover:scale-105"
          />
        </div>

        <div className="text-left space-y-4 bg-gray-900/50 p-4 md:p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg md:text-xl font-semibold text-blue-300">รายละเอียดข้อมูล</h3>
          <p className="text-sm md:text-md text-gray-300 leading-relaxed">
            ภาพถ่ายจากดาวเทียม SENTINEL-2 รายละเอียด 20 เมตร และข้อมูลจุดความร้อนจากดาวเทียม Suomi NPP ระบบ VIIRS วันที่ 5 มีนาคม 2564
          </p>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
            ข้อมูลดังกล่าวจะใช้เป็นข้อมูลพื้นฐานให้กับหน่วยงานที่เกี่ยวข้องในการเข้าตรวจสอบในพื้นที่จริงร่วมกับจังหวัด เพื่อนำไปสู่การวางแผนฟื้นฟู ป้องกัน และสร้างความเข้าใจให้กับประชาชนในพื้นที่ในการสนับสนุนการมีส่วนร่วมของชุมชนและสังคมอย่างยั่งยืน
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;