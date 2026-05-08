import React, { useState, useRef } from "react";

function UploadImage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
    event.target.value = null; 
  };

  const removeImage = (indexToRemove, event) => {
    event.stopPropagation();
    setSelectedImages((prev) => {
      const updatedImages = [...prev];
      URL.revokeObjectURL(updatedImages[indexToRemove].preview);
      updatedImages.splice(indexToRemove, 1);
      return updatedImages;
    });
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      setShowPopup(true);
      return;
    }

    setIsLoading(true);
    const apiUrl = process.env.REACT_APP_BACKEND_API || "http://127.0.0.1:5000";

    try {
      const uploadPromises = selectedImages.map(async (item) => {
        const formData = new FormData();
        formData.append("image", item.file);

        const response = await fetch(`${apiUrl}/predict`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return { 
            fileName: item.file.name, 
            previewUrl: item.preview,
            result: data.result, 
            percentages: data.percentages,
            heatmapImage: data.heatmap_image 
          };
        } else {
          throw new Error(`Error uploading ${item.file.name}`);
        }
      });

      const resultsData = await Promise.all(uploadPromises);
      setResults(resultsData);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:", error);
    } finally {
      setIsLoading(false);
      setShowPopup(true);
    }
  };

  const refreshPage = () => {
    setSelectedImages([]);
    setResults([]);
    setShowPopup(false);
    setFullscreenImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 text-white w-full px-4 mb-10">
      <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-600/30 shadow-2xl rounded-3xl p-8 md:p-12 max-w-3xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
          อัปโหลดภาพ Sentinel-2 (หลายภาพ)
        </h1>
        <p className="text-gray-400 mb-8 text-md md:text-lg">
          เพิ่มภาพได้เรื่อยๆ และสามารถกดรูปถังขยะเพื่อลบภาพที่ไม่ต้องการก่อนวิเคราะห์ได้
        </p>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        <div className={`mb-8 border-2 border-dashed border-gray-500 transition-all duration-300 rounded-2xl bg-gray-900/50 ${selectedImages.length > 0 ? 'p-4' : 'hover:border-blue-400 hover:bg-blue-900/20 cursor-pointer p-8 flex flex-col items-center justify-center min-h-[250px]'}`}
             onClick={() => selectedImages.length === 0 && fileInputRef.current.click()}
        >
          {selectedImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative aspect-square bg-gray-800 rounded-lg border border-gray-600 overflow-hidden shadow-sm group/item">
                  <img src={img.preview} alt={`Preview ${index}`} className="w-full h-full object-cover opacity-90 group-hover/item:opacity-50 transition-opacity" />
                  
                  <button
                    onClick={(e) => removeImage(index, e)}
                    className="absolute inset-0 m-auto w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-10 shadow-lg transform hover:scale-110"
                    title="ลบรูปนี้"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))}

              <div
                onClick={() => fileInputRef.current.click()}
                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-500 hover:border-blue-400 hover:bg-blue-900/30 rounded-lg cursor-pointer transition-all text-gray-400 hover:text-blue-400 bg-gray-800/30"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                <span className="text-sm font-medium">เพิ่มภาพ</span>
              </div>
            </div>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="text-gray-300 font-medium text-lg">คลิก หรือ ลากไฟล์ภาพมาวางที่นี่</p>
            </>
          )}
        </div>

        {selectedImages.length > 0 && (
           <p className="text-sm text-blue-400 mb-6 text-right font-medium">ภาพที่เตรียมประมวลผล: {selectedImages.length} ไฟล์</p>
        )}

        <button
          onClick={handleUpload}
          disabled={isLoading || selectedImages.length === 0}
          className={`w-full text-lg font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
            isLoading || selectedImages.length === 0
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {isLoading ? `กำลังประมวลผล ${selectedImages.length} ภาพ...` : "อัปโหลดและจำแนกภาพทั้งหมด"}
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-40 px-4 py-10">
          <div className="bg-gray-900 border border-gray-700 p-6 md:p-8 rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col max-h-full">
            
            <h2 className="text-2xl text-blue-400 font-bold mb-6 text-center border-b border-gray-700 pb-4">
              สรุปผลการจำแนกภาพ ({results.length} ภาพ)
            </h2>

            <div className="overflow-y-auto pr-2 space-y-6 mb-6 custom-scrollbar">
              {results.length > 0 ? (
                results.map((res, idx) => (
                  <div key={idx} className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700 flex flex-col md:flex-row gap-6 items-center">
                    
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-400 mb-1">ภาพต้นฉบับ</span>
                        <img 
                          src={res.previewUrl} 
                          alt="Original" 
                          onClick={() => setFullscreenImage(res.previewUrl)} // เพิ่ม Event ขยายภาพ
                          className="w-24 h-24 md:w-28 md:h-28 object-contain bg-gray-900 rounded-xl border border-gray-600 p-1 cursor-pointer hover:scale-105 hover:border-gray-400 transition-all duration-200"
                        />
                      </div>
                      
                      {res.heatmapImage && (
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-blue-400 mb-1">จุดที่ AI โฟกัส</span>
                          <img 
                            src={res.heatmapImage} 
                            alt="Heatmap" 
                            onClick={() => setFullscreenImage(res.heatmapImage)} // เพิ่ม Event ขยายภาพ
                            className="w-24 h-24 md:w-28 md:h-28 object-contain bg-gray-900 rounded-xl border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)] p-1 cursor-pointer hover:scale-105 hover:border-blue-400 transition-all duration-200"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full text-left">
                      <p className="text-sm text-gray-400 truncate w-48 md:w-full mb-1" title={res.fileName}>
                        ไฟล์: {res.fileName}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                         <span className="text-gray-300">ผลลัพธ์:</span>
                         <span className={`text-xl font-bold ${res.result === 'Cassava' ? 'text-green-400' : 'text-yellow-400'}`}>
                           {res.result}
                         </span>
                      </div>
                      <div className="space-y-1 text-sm bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                        <div className="flex justify-between">
                          <span className="text-gray-400">อ้อย:</span>
                          <span className="text-blue-400">{res.percentages["SugarCane"] ? res.percentages["SugarCane"].toFixed(2) + "%" : "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">มันสำปะหลัง:</span>
                          <span className="text-cyan-400">{res.percentages["Cassava"] ? res.percentages["Cassava"].toFixed(2) + "%" : "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xl font-bold text-red-400 text-center my-10">
                  กรุณาเลือกรูปภาพก่อนอัปโหลด!
                </p>
              )}
            </div>
            
            <button
              onClick={refreshPage}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-colors focus:outline-none mt-auto"
            >
              ทำรายการใหม่
            </button>
          </div>
        </div>
      )}

      {fullscreenImage && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/95 z-50 p-4 cursor-pointer backdrop-blur-md transition-opacity"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative flex flex-col items-center justify-center max-w-full max-h-full">
            <button 
              className="absolute -top-12 right-0 text-gray-400 hover:text-white p-2 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(null);
              }}
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <img 
              src={fullscreenImage} 
              alt="Fullscreen View" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadImage;