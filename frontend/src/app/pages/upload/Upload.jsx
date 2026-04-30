import React, { useState } from "react";

function UploadImage() {
  const apiUrl = process.env.REACT_APP_BACKEND_API || "http://127.0.0.1:5000";
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [percentages, setPercentages] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // สร้าง URL สำหรับแสดงภาพที่เลือก
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setShowPopup(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
        setPercentages(data.percentages);
      } else {
        console.error("Error from server:", response.statusText);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:", error);
    } finally {
      setIsLoading(false);
      setShowPopup(true);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 text-white w-full px-4">
      <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-600/30 shadow-2xl rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
          อัปโหลดภาพ Sentinel-2
        </h1>
        <p className="text-gray-400 mb-8 text-md md:text-lg">
          ระบบ AI จะทำการประมวลผลเพื่อจำแนก "อ้อย" หรือ "มันสำปะหลัง" โดยอัตโนมัติ
        </p>

        {/* Custom File Input (อัปโหลดโซน) */}
        <div className="mb-8 relative group">
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-gray-500 group-hover:border-blue-400 group-hover:bg-blue-900/20 transition-all duration-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-900/50">
            <svg
              className="w-12 h-12 text-gray-400 group-hover:text-blue-400 mb-4 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="text-gray-300 font-medium text-lg">
              {selectedFile ? selectedFile.name : "คลิก หรือ ลากไฟล์ภาพมาวางที่นี่"}
            </p>
            {!selectedFile && (
              <p className="text-sm text-gray-500 mt-2">รองรับไฟล์ .jpg, .png</p>
            )}
          </div>
        </div>

        {/* พรีวิวรูปภาพก่อนอัปโหลด */}
        {preview && (
          <div className="mb-8 flex flex-col items-center">
            <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">
              ภาพที่รอประมวลผล
            </p>
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-[0_0_20px_rgba(96,165,250,0.3)] border border-gray-600 transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        {/* ปุ่มอัปโหลด */}
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`w-full text-lg font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
            isLoading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-400 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(59,130,246,0.4)] text-white"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              กำลังประมวลผลด้วย AI...
            </span>
          ) : (
            "อัปโหลดและจำแนกภาพ"
          )}
        </button>
      </div>

      {/* Popup Modal แสดงผลลัพธ์ */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 px-4">
          <div className="bg-gray-900/90 border border-gray-700 p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">
            {result ? (
              <>
                <div className="mb-6 inline-block bg-blue-900/30 p-4 rounded-full border border-blue-500/50">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h2 className="text-xl text-gray-300 font-semibold mb-2">ผลการจำแนกภาพคือ</h2>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-6 drop-shadow-md">
                  {result}
                </p>
                
                <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700 text-left">
                  <p className="text-sm text-gray-400 mb-2 font-semibold">ความน่าจะเป็น:</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">อ้อย</span>
                    <span className="text-blue-400 font-bold">
                      {percentages["SugarCane"] ? percentages["SugarCane"].toFixed(2) + "%" : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">มันสำปะหลัง</span>
                    <span className="text-cyan-400 font-bold">
                      {percentages["Cassava"] ? percentages["Cassava"].toFixed(2) + "%" : "-"}
                    </span>
                  </div>
                </div>

                {preview && (
                  <div className="mb-8">
                    <img
                      src={preview}
                      alt="Uploaded Preview"
                      className="w-full h-40 object-cover border border-gray-600 rounded-lg shadow-md"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="mb-6">
                <div className="inline-block bg-red-900/30 p-4 rounded-full border border-red-500/50 mb-4">
                   <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <p className="text-xl font-bold text-red-400">
                  กรุณาเลือกรูปภาพก่อนอัปโหลด!
                </p>
              </div>
            )}
            
            <button
              onClick={refreshPage}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              ทำรายการใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadImage;