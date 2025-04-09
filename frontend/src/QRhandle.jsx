import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRHandle = ({ uniqueId, isAdmin }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const generateQR = () => (
    <QRCode 
      value={uniqueId} 
      size={256} 
      level={'H'} 
      includeMargin={true} 
    />
  );

  const startQRScanner = () => {
    if (!isAdmin) {
      setError('Unauthorized access');
      return;
    }

    const scanner = new Html5QrcodeScanner('reader', { 
      qrbox: 250,
      fps: 10 
    });

    scanner.render(onScanSuccess, onScanError);
  };

  const onScanSuccess = async (decodedText) => {
    try {
      const response = await fetch('/api/verify-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ uniqueId: decodedText })
      });

      if (response.ok) {
        const memberData = await response.json();
        setScanResult(memberData);
      } else {
        throw new Error('Invalid member');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const onScanError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div>
      {generateQR()}
      <div id="reader" style={{width: '100%'}}></div>
      <button onClick={startQRScanner}>
        Scan QR Code
      </button>
      {scanResult && (
        <div>
          <h3>Member Verified</h3>
          <p>Name: {scanResult.name}</p>
          <p>Email: {scanResult.email}</p>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default QRHandle;

// import React, { useState, useEffect } from 'react';
// import { QrCodeIcon, CopyIcon, CheckIcon } from 'lucide-react';
// import QRCode from 'qrcode.react';
// import { v4 as uuidv4 } from 'uuid';

// // Member Profile Component
// const MemberProfile = () => {
//   const [memberId, setMemberId] = useState('');
//   const [adminCode, setAdminCode] = useState('');
//   const [qrCodeImage, setQrCodeImage] = useState('');
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     // Generate unique ID and admin code on component mount
//     const uniqueId = uuidv4().replace(/-/g, '').substring(0, 12);
//     const adminVerificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
//     setMemberId(uniqueId);
//     setAdminCode(adminVerificationCode);
//   }, []);

//   const handleCopyMemberId = () => {
//     navigator.clipboard.writeText(memberId);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Member Profile</h2>
      
//       <div className="mb-4">
//         <label className="block text-gray-700 font-bold mb-2">Your Unique Member ID</label>
//         <div className="flex items-center">
//           <input 
//             type="text" 
//             value={memberId} 
//             readOnly 
//             className="flex-grow p-2 border rounded-l"
//           />
//           <button 
//             onClick={handleCopyMemberId}
//             className="bg-blue-500 text-white p-2 rounded-r"
//           >
//             {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
//           </button>
//         </div>
//       </div>
      
//       <div className="mb-4 text-center">
//         <h3 className="font-semibold mb-2">Your Membership QR Code</h3>
//         <QRCode 
//           value={JSON.stringify({
//             memberId: memberId,
//             adminCode: adminCode
//           })} 
//           size={256} 
//           level={'H'}
//         />
//       </div>
//     </div>
//   );
// };

// // Admin Verification Component
// const AdminVerification = () => {
//   const [scannedData, setScannedData] = useState(null);
//   const [verificationStatus, setVerificationStatus] = useState(null);

//   const handleQRScan = (data) => {
//     try {
//       const parsedData = JSON.parse(data);
//       setScannedData(parsedData);
      
//       // Simulated verification process
//       // In a real app, this would involve backend verification
//       const isValid = parsedData.memberId && parsedData.adminCode;
//       setVerificationStatus(isValid ? 'success' : 'failed');
//     } catch (error) {
//       setVerificationStatus('failed');
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Admin Verification</h2>
      
//       <div className="mb-4">
//         <label className="block text-gray-700 font-bold mb-2">Scan Member QR Code</label>
//         <div className="bg-gray-100 p-4 rounded text-center">
//           <QrCodeIcon size={64} className="mx-auto mb-4 text-gray-500" />
//           <p className="text-gray-600">Use a QR code scanner to verify membership</p>
//         </div>
//       </div>
      
//       {scannedData && (
//         <div className="mt-4">
//           <h3 className="font-semibold">Scanned Information</h3>
//           <div className={`p-3 rounded ${
//             verificationStatus === 'success' 
//               ? 'bg-green-100 text-green-800' 
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {verificationStatus === 'success' ? (
//               <>
//                 <p>Member ID: {scannedData.memberId}</p>
//                 <p className="text-green-700">✓ Verification Successful</p>
//               </>
//             ) : (
//               <p className="text-red-700">✗ Verification Failed</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export { MemberProfile, AdminVerification };