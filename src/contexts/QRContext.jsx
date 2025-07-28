import React, { createContext, useContext, useState, useEffect } from 'react';
import { qrService } from '../services/qrService';
import toast from 'react-hot-toast';

const QRContext = createContext();

export function useQR() {
  const context = useContext(QRContext);
  if (!context) {
    throw new Error('useQR must be used within a QRProvider');
  }
  return context;
}

export function QRProvider({ children }) {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const codes = await qrService.getUserQRCodes();
      setQrCodes(codes);
    } catch (error) {
      toast.error('Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  };

  const createQRCode = async (qrData) => {
    try {
      const newQR = await qrService.createQRCode(qrData);
      setQrCodes(prev => [newQR, ...prev]);
      toast.success('QR code created successfully!');
      return newQR;
    } catch (error) {
      toast.error('Failed to create QR code');
      throw error;
    }
  };

  const updateQRCode = async (id, updateData) => {
    try {
      const updatedQR = await qrService.updateQRCode(id, updateData);
      setQrCodes(prev => prev.map(qr => qr.id === id ? updatedQR : qr));
      toast.success('QR code updated successfully!');
      return updatedQR;
    } catch (error) {
      toast.error('Failed to update QR code');
      throw error;
    }
  };

  const deleteQRCode = async (id) => {
    try {
      await qrService.deleteQRCode(id);
      setQrCodes(prev => prev.filter(qr => qr.id !== id));
      toast.success('QR code deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete QR code');
      throw error;
    }
  };

  const duplicateQRCode = async (id) => {
    try {
      const duplicated = await qrService.duplicateQRCode(id);
      setQrCodes(prev => [duplicated, ...prev]);
      toast.success('QR code duplicated successfully!');
      return duplicated;
    } catch (error) {
      toast.error('Failed to duplicate QR code');
      throw error;
    }
  };

  const value = {
    qrCodes,
    loading,
    templates,
    fetchQRCodes,
    createQRCode,
    updateQRCode,
    deleteQRCode,
    duplicateQRCode,
    setTemplates
  };

  return (
    <QRContext.Provider value={value}>
      {children}
    </QRContext.Provider>
  );
}