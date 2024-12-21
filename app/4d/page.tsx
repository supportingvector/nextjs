'use client'; // 必须添加此声明
import { useState } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processedImage, setProcessedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('');
      setUploadProgress(0);
      setProcessingStatus('');
      setProcessedImage(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setUploadStatus('Uploading...');
    
    // Prepare the FormData to send in the request
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Set the headers with API key
    const headers = {
      'X-API-KEY': 'kelingongnnn',  // API key header
    };

    console.log("uploading")
    // Send the file to the backend using fetch with headers
    fetch('http://localhost:5000/uploadinput', {
      method: 'POST',
      body: formData,
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the server returns some information about processing status or the image URL
        setUploadStatus('Upload successful');
        handleProcessing(data);
      })
      .catch((error) => {
        setUploadStatus('Upload failed');
        console.error(error);
      });
  };

  const handleProcessing = (data) => {
    setProcessingStatus('Generating...');
  
    const imageUrl = `http://localhost:5000/outputimg/202412191129.png`;
    const maxAttempts = 24; // 2分钟内尝试的最大次数 (每5秒一次，共24次)
    let attempts = 0;
  
    // 每隔5秒发送一次请求，最多发送24次（2分钟）
    const intervalId = setInterval(() => {
      attempts += 1;
      if (attempts > maxAttempts) {
        // 超过最大尝试次数，停止请求并提示用户
        clearInterval(intervalId);
        setProcessedImage(null);
        setProcessingStatus(
          '请刷新后重试，或直接联系店铺客服工作人员。'
        );
        return;
      }
  
      fetch(imageUrl, { method: 'GET' })
        .then((response) => {
          if (response.ok) {
            // 文件存在，获取图片
            return response.blob(); // 获取二进制数据
          } else {
            // 文件未生成，继续尝试
            throw new Error('File not found');
          }
        })
        .then((blob) => {
          // 将 Blob 数据转换为图片 URL
          const url = URL.createObjectURL(blob);
          setProcessedImage(url); // 显示生成的图片
          setProcessingStatus('Generation complete');
          clearInterval(intervalId); // 成功获取到文件，停止定时请求
        })
        .catch((error) => {
          // 如果文件未生成，继续请求
          console.log('Error fetching image:', error);
        });
    }, 5000); // 每5秒发送一次请求
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: 'auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Upload an Image</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            marginBottom: '15px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%'
          }}
        />
        <button
          onClick={handleUpload}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Upload
        </button>
        {uploadProgress > 0 && (
          <div style={{ marginTop: '20px', width: '100%' }}>
            <progress
              value={uploadProgress}
              max="100"
              style={{ width: '100%', height: '20px', borderRadius: '5px' }}
            />
            <p style={{ textAlign: 'center', color: '#555', marginTop: '10px' }}>{uploadProgress}%</p>
          </div>
        )}
        {uploadStatus && (
          <p
            style={{
              marginTop: '20px',
              textAlign: 'center',
              color: uploadStatus === 'Upload successful' ? 'green' : 'red',
            }}
          >
            {uploadStatus}
          </p>
        )}
        {processingStatus && (
          <p style={{ marginTop: '20px', textAlign: 'center', color: '#007bff' }}>{processingStatus}</p>
        )}
        {processedImage && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <img
              src={processedImage}
              alt="Processed"
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <a
              href={processedImage}
              download="processed-image.jpg"
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                borderRadius: '4px',
                textDecoration: 'none',
              }}
            >
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
