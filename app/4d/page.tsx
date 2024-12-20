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

    // Simulate upload progress
    const simulateUpload = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(simulateUpload);
          setUploadStatus('Upload successful');
          handleProcessing();
        }
        return Math.min(prev + 20, 100);
      });
    }, 500);
  };

  const handleProcessing = () => {
    setProcessingStatus('Generating...');

    // Simulate image processing
    setTimeout(() => {
      // Convert selected image to grayscale (client-side processing)
      const reader = new FileReader();
      reader.onload = (e) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
          }

          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL('image/jpeg'));
          setProcessingStatus('Generation complete');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(selectedFile);
    }, 2000); // Simulate 2 seconds processing time
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
              style={{ width: '100%', borderRadius: '8px', filter: 'grayscale(100%)' }}
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
