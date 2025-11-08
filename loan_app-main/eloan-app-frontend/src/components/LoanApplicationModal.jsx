import React, { useState, useEffect } from 'react';
import api from '../api';

function LoanApplicationModal({ loan, isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [bankData, setBankData] = useState({
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    amount_required: '',
    // STATES for file uploads (will store base64 strings)
    aadhar_photo_base64: null,
    pan_photo_base64: null,
    pan_book_photo_base64: null,
    // STATES for file names (for display)
    aadhar_photo_name: '',
    pan_photo_name: '',
    pan_book_photo_name: '',
  });

  // Fetch user data when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1); 
      setError('');
      setLoading(true);
      
      const fetchUserProfile = async () => {
        try {
          const res = await api.get('/users/profile');
          setUserData(res.data);
        } catch (err) {
          setError('Failed to fetch user data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserProfile();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setBankData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };
  
  // FUNCTION to handle file uploads and generate Base64
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // VALIDATION: Ensure file is a PDF
      if (file.type !== 'application/pdf') {
        setError(`Please upload the ${fileType.replace(/_photo/, '').toUpperCase()} as a PDF file only.`);
        e.target.value = null; // Clear the input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setBankData(prev => ({ 
          ...prev, 
          [`${fileType}_base64`]: reader.result,
          [`${fileType}_name`]: file.name
        }));
        setError(''); // Clear error on successful upload
      };
      reader.onerror = () => {
        setError(`Failed to read ${fileType} file.`);
        setBankData(prev => ({ 
            ...prev, 
            [`${fileType}_base64`]: null,
            [`${fileType}_name`]: ''
        }));
      };
      reader.readAsDataURL(file);
    } else {
        setBankData(prev => ({ 
            ...prev, 
            [`${fileType}_base64`]: null,
            [`${fileType}_name`]: ''
        }));
    }
  };
  
  // FUNCTION to clear a specific file
  const handleRemoveFile = (fileType) => {
    setBankData(prev => ({ 
        ...prev, 
        [`${fileType}_base64`]: null,
        [`${fileType}_name`]: '',
    }));
    const inputElement = document.getElementById(fileType);
    if (inputElement) {
        inputElement.value = null;
    }
    setError('');
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- VALIDATION BLOCK ---
    const requestedAmount = parseFloat(bankData.amount_required);
    const maxAmount = parseFloat(loan.max_amount);

    if (!requestedAmount || requestedAmount <= 0) {
      setError('Please enter a valid loan amount.');
      setLoading(false);
      return;
    }
    
    // NOTE: The display max amount is 1000, but we use the actual loan.max_amount for logic
    if (requestedAmount > maxAmount) {
      setError(`The requested amount (₹${requestedAmount.toLocaleString()}) cannot be greater than the maximum allowed amount of ₹${maxAmount.toLocaleString()}.`);
      setLoading(false); 
      return; 
    }
    
    // FILE VALIDATION
    if (!bankData.aadhar_photo_base64 || !bankData.pan_photo_base64 || !bankData.pan_book_photo_base64) {
        setError('Please upload the Aadhar Card, PAN Card, and Pan Book, all in PDF format.');
        setLoading(false);
        return;
    }
    // --- END OF VALIDATION ---

    try {
      const { aadhar_photo_name, pan_photo_name, pan_book_photo_name, ...applicationData } = { 
        ...bankData,
        loan_id: loan.id,
      };
      
      await api.post('/applications/apply', applicationData);
      
      setStep(3); 
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBankData({ 
        account_holder_name: '', 
        account_number: '', 
        ifsc_code: '', 
        amount_required: '',
        aadhar_photo_base64: null,
        pan_photo_base64: null,
        pan_book_photo_base64: null,
        aadhar_photo_name: '',
        pan_photo_name: '',
        pan_book_photo_name: '',
    });
    onClose();
  };
  
  // UTILITY FUNCTION for rendering the file component
  const FileUploadComponent = ({ id, label, fileName, base64Data }) => {
    // Check if the uploaded file is a PDF (since we restrict it now)
    const isPdf = base64Data && base64Data.startsWith('data:application/pdf');

    return (
        <div className="space-y-2 border p-3 rounded-lg">
            <label htmlFor={id} className={labelStyle}>{label} **(PDF Only)**</label>
            
            {!base64Data ? (
                // File Selection UI (No file uploaded)
                <>
                    <input 
                        type="file" 
                        id={id} 
                        accept="application/pdf" // RESTRICTED TO PDF
                        onChange={(e) => handleFileChange(e, id)} 
                        required 
                        className={fileInputStyle}
                    />
                    <label htmlFor={id} className={`flex justify-between items-center cursor-pointer ${inputStyle} text-gray-500 hover:bg-gray-50`}>
                        <span>{fileName || 'Choose PDF File...'}</span>
                        <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md">Browse</span>
                    </label>
                </>
            ) : (
                // Preview UI (File uploaded)
                <div className="flex flex-col items-center space-y-2">
                    <div className="border border-green-500 p-2 rounded-md w-full flex justify-between items-center bg-green-50">
                        <span className="text-sm font-medium text-green-700 truncate">{fileName}</span>
                        <button 
                            type="button" 
                            onClick={() => handleRemoveFile(id)}
                            className="text-red-600 hover:text-red-800 text-lg ml-3 font-bold"
                        >
                            &times;
                        </button>
                    </div>
                    
                    {/* PREVIEW CONTAINER: Always shows text for PDF */}
                    <div className="mt-2 w-full max-h-32 overflow-hidden border rounded-lg flex justify-center items-center bg-gray-100">
                        {isPdf ? (
                            <p className="text-sm text-gray-600 p-4">
                                📄 **PDF uploaded successfully!**
                            </p>
                        ) : (
                            <p className="text-sm text-red-600 p-4">
                                Error: File type is not PDF. Please remove and re-upload.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
  };


  if (!isOpen) return null;
  
  const inputStyle = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green";
  const labelStyle = "block text-sm font-semibold text-gray-700 mb-1";
  const fileInputStyle = "hidden"; // Hide the actual file input

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-dark-slate">
            Apply for: **{loan.loan_name}**
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* We show the error just above the inputs in Step 2 */}
          {error && step === 2 && <p className="text-red-600 text-center mb-4">⚠️ {error}</p>}
          
          {loading && step !== 3 && <p>Loading user data...</p>}
          {error && step === 1 && <p className="text-red-600 text-center">⚠️ {error}</p>}
          
          {/* Step 1: Verify Details */}
          {!loading && step === 1 && userData && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Step 1: Verify Your Details 👤</h4>
              <p className="text-sm text-gray-600">Please confirm your details before proceeding.</p>
              <div className="space-y-2 rounded-md border p-4 bg-gray-50">
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Phone:</strong> {userData.phone}</p>
                <p><strong>Aadhar:</strong> {userData.aadhar}</p>
                <p><strong>PAN:</strong> {userData.pan}</p>
              </div>
              <button
                onClick={() => {
                  setError('');
                  setStep(2);
                }}
                className="w-full bg-primary-green text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-green-dark transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Account & Amount & Documents */}
          {!loading && step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-semibold text-lg">Step 2: Bank & Loan Details 🏦</h4>
              
              {/* Amount Required */}
              <div>
                <label htmlFor="amount_required" className={labelStyle}>
                  {/* EDITED: Change display max amount to 1000 */}
                  Amount Required (Max: **₹{Number(loan.max_amount).toLocaleString() || 1000}**)
                </label>
                <input type="number" id="amount_required" value={bankData.amount_required} onChange={handleChange} required className={inputStyle} min="1"/>
              </div>
              
              {/* Account Holder Name */}
              <div>
                <label htmlFor="account_holder_name" className={labelStyle}>Account Holder Name</label>
                <input type="text" id="account_holder_name" value={bankData.account_holder_name} onChange={handleChange} required className={inputStyle}/>
              </div>
              
              {/* Account Number */}
              <div>
                <label htmlFor="account_number" className={labelStyle}>Account Number</label>
                <input type="text" id="account_number" value={bankData.account_number} onChange={handleChange} required className={inputStyle}/>
              </div>
              
              {/* IFSC Code */}
              <div>
                <label htmlFor="ifsc_code" className={labelStyle}>IFSC Code</label>
                <input type="text" id="ifsc_code" value={bankData.ifsc_code} onChange={handleChange} required className={inputStyle}/>
              </div>
              
              <hr className="my-4" />
              {/* EDITED: Removed 📎 emoji */}
              <h5 className="font-semibold text-md">Document Upload (Required)</h5>

              {/* Aadhar Card Photo Upload with Preview */}
              <FileUploadComponent
                id="aadhar_photo"
                label="Aadhar Card Photo"
                fileName={bankData.aadhar_photo_name}
                base64Data={bankData.aadhar_photo_base64}
              />

              {/* PAN Card Photo Upload with Preview */}
              <FileUploadComponent
                id="pan_photo"
                label="PAN Card Photo"
                fileName={bankData.pan_photo_name}
                base64Data={bankData.pan_photo_base64}
              />

              {/* Pan Book Photo Upload with Preview */}
              <FileUploadComponent
                id="pan_book_photo"
                label="Pan Book Photo"
                fileName={bankData.pan_book_photo_name}
                base64Data={bankData.pan_book_photo_base64}
              />

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-primary-green text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-green-dark transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Apply Now'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-4">
              <h4 className="font-semibold text-lg text-primary-green">Application Submitted! ✅</h4>
              <p>Your application for the **{loan.loan_name}** has been received. We will review it and get back to you soon.</p>
              <button
                onClick={handleClose}
                className="w-full bg-primary-green text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-green-dark transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoanApplicationModal;