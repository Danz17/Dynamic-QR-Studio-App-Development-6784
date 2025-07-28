import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useQR } from '../../contexts/QRContext';
import { qrService } from '../../services/qrService';
import SafeIcon from '../../common/SafeIcon';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { parse } from 'papaparse';

const { 
  FiUpload, FiDownload, FiPlus, FiCheck, FiAlertTriangle, 
  FiFile, FiFileText, FiList, FiGrid, FiSave
} = FiIcons;

function BulkGenerator() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [qrType, setQrType] = useState('url');
  const [mapping, setMapping] = useState({});
  const [previewData, setPreviewData] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedQRs, setGeneratedQRs] = useState([]);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const { createQRCode } = useQR();
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    setError(null);

    // Read file based on type
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data = [];
        if (file.name.endsWith('.csv')) {
          const result = parse(e.target.result, { header: true });
          data = result.data;
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = XLSX.read(e.target.result, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet);
        }

        // Filter out rows with no values
        data = data.filter(row => Object.values(row).some(val => val));

        if (data.length === 0) {
          setError('The file contains no valid data.');
          return;
        }

        setFileData(data);
        setPreviewData(data.slice(0, 5));
        setStep(2);
      } catch (error) {
        console.error('Error parsing file:', error);
        setError('Failed to parse the file. Please check the format and try again.');
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleMapField = (qrField, fileField) => {
    setMapping({
      ...mapping,
      [qrField]: fileField
    });
  };

  const handleGenerateQRs = async () => {
    if (!mapping.name || !mapping.content) {
      setError('Please map both name and content fields.');
      return;
    }

    setLoading(true);
    setError(null);
    const qrs = [];

    try {
      for (const row of fileData) {
        const name = row[mapping.name];
        const content = row[mapping.content];
        
        if (!name || !content) continue;

        const qrData = {
          name,
          type: qrType,
          content,
          isDynamic: true,
          isActive: true,
          design: {
            dotsOptions: {
              color: '#3b82f6',
              type: 'rounded'
            },
            backgroundOptions: {
              color: '#ffffff'
            }
          }
        };

        const newQR = await createQRCode(qrData);
        qrs.push(newQR);
      }

      setGeneratedQRs(qrs);
      setStep(3);
    } catch (error) {
      console.error('Generation error:', error);
      setError('Failed to generate QR codes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAllQRs = () => {
    // This would typically create a zip file with all QRs
    // For now, we'll just navigate to the manage page
    navigate('/manage');
  };

  const renderUploadStep = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center"
      >
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiUpload} className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Upload Your Data File
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Upload a CSV or Excel file containing the data for your QR codes.
            Each row will generate a separate QR code.
          </p>
        </div>

        <div className="mb-8">
          <div 
            className="max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="text-center">
              <SafeIcon icon={FiFile} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                <span className="text-primary-600 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                CSV or Excel files (max. 5MB)
              </p>
            </div>
          </div>
          {error && (
            <div className="mt-4 text-red-600 text-sm flex items-center justify-center">
              <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">File Requirements:</h3>
          <ul className="text-sm text-left max-w-md mx-auto space-y-2">
            <li className="flex items-start">
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>CSV or Excel file with column headers</span>
            </li>
            <li className="flex items-start">
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>At least one column for QR code name and one for content</span>
            </li>
            <li className="flex items-start">
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span>Maximum 1000 rows per file</span>
            </li>
          </ul>
        </div>
      </motion.div>
    );
  };

  const renderMappingStep = () => {
    const columns = fileData.length > 0 ? Object.keys(fileData[0]) : [];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-6"
      >
        {/* File Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <SafeIcon icon={FiFileText} className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">{file.name}</h3>
              <p className="text-sm text-gray-600">
                {fileData.length} rows • {columns.length} columns
              </p>
            </div>
          </div>
        </div>

        {/* QR Type Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Select QR Code Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {['url', 'text', 'email', 'phone'].map((type) => (
              <button
                key={type}
                onClick={() => setQrType(type)}
                className={`p-4 rounded-lg border-2 transition-colors text-center ${
                  qrType === type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900 capitalize">{type}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* Field Mapping */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Map Your Fields</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Name
              </label>
              <select
                value={mapping.name || ''}
                onChange={(e) => handleMapField('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a field</option>
                {columns.map((column) => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Content
              </label>
              <select
                value={mapping.content || ''}
                onChange={(e) => handleMapField('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a field</option>
                {columns.map((column) => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview Data */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                      {column === mapping.name && (
                        <span className="ml-2 text-primary-600">(Name)</span>
                      )}
                      {column === mapping.content && (
                        <span className="ml-2 text-primary-600">(Content)</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {previewData.length < fileData.length && (
            <p className="text-xs text-gray-500 mt-2">
              Showing {previewData.length} of {fileData.length} rows
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleGenerateQRs}
            disabled={!mapping.name || !mapping.content || loading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                <span>Generate QR Codes</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-sm flex items-center justify-center">
            <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 mr-1" />
            <span>{error}</span>
          </div>
        )}
      </motion.div>
    );
  };

  const renderResultsStep = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Success Message */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            QR Codes Generated Successfully
          </h3>
          <p className="text-gray-600">
            {generatedQRs.length} QR codes have been created. You can now download them or view them in your QR manager.
          </p>
        </div>

        {/* QR Code List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-gray-900">Generated QR Codes</h3>
            <div className="flex space-x-2">
              <button
                onClick={downloadAllQRs}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Download All</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {generatedQRs.slice(0, 5).map((qr) => (
              <div
                key={qr.id}
                className="flex items-center border border-gray-200 rounded-lg p-4"
              >
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{qr.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{qr.content}</p>
                </div>
              </div>
            ))}

            {generatedQRs.length > 5 && (
              <p className="text-center text-sm text-gray-600">
                +{generatedQRs.length - 5} more QR codes
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              setStep(1);
              setFile(null);
              setFileData([]);
              setMapping({});
              setGeneratedQRs([]);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Create More
          </button>
          <button
            onClick={() => navigate('/manage')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiList} className="w-4 h-4" />
            <span>View All QR Codes</span>
          </button>
        </div>
      </motion.div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderUploadStep();
      case 2:
        return renderMappingStep();
      case 3:
        return renderResultsStep();
      default:
        return renderUploadStep();
    }
  };

  return (
    <>
      <Helmet>
        <title>Bulk QR Generator - QR Studio</title>
        <meta name="description" content="Generate multiple QR codes at once by uploading a CSV or Excel file." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bulk QR Generator
            </h1>
            <p className="text-gray-600">
              Generate multiple QR codes at once by uploading a CSV or Excel file.
            </p>
          </motion.div>

          {/* Steps Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center">
              <div className="flex items-center w-full max-w-3xl">
                <div className="relative flex-1">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                    step >= 1 ? 'bg-primary-600' : 'bg-gray-300'
                  }`}>
                    <SafeIcon icon={FiUpload} className="w-5 h-5 text-white" />
                  </div>
                  <p className={`mt-2 text-xs text-center ${
                    step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}>
                    Upload File
                  </p>
                </div>
                
                <div className={`flex-1 h-1 ${
                  step >= 2 ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
                
                <div className="relative flex-1">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                    step >= 2 ? 'bg-primary-600' : 'bg-gray-300'
                  }`}>
                    <SafeIcon icon={FiList} className="w-5 h-5 text-white" />
                  </div>
                  <p className={`mt-2 text-xs text-center ${
                    step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}>
                    Map Fields
                  </p>
                </div>
                
                <div className={`flex-1 h-1 ${
                  step >= 3 ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
                
                <div className="relative flex-1">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                    step >= 3 ? 'bg-primary-600' : 'bg-gray-300'
                  }`}>
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-white" />
                  </div>
                  <p className={`mt-2 text-xs text-center ${
                    step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}>
                    Complete
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>
    </>
  );
}

export default BulkGenerator;