import QRCodeStyling from 'qr-code-styling';

class QRService {
  constructor() {
    this.mockQRCodes = [
      {
        id: '1',
        name: 'Company Website',
        type: 'url',
        content: 'https://example.com',
        isActive: true,
        isDynamic: true,
        scans: 1250,
        uniqueScans: 890,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        design: {
          width: 300,
          height: 300,
          margin: 10,
          dotsOptions: { color: '#3b82f6', type: 'rounded' },
          backgroundOptions: { color: '#ffffff' },
          cornersSquareOptions: { color: '#1d4ed8', type: 'extra-rounded' },
          cornersDotOptions: { color: '#1d4ed8', type: 'dot' }
        }
      },
      {
        id: '2',
        name: 'WiFi Access',
        type: 'wifi',
        content: { ssid: 'OfficeWiFi', password: 'password123', security: 'WPA' },
        isActive: true,
        isDynamic: false,
        scans: 456,
        uniqueScans: 234,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        design: {
          width: 300,
          height: 300,
          margin: 10,
          dotsOptions: { color: '#10b981', type: 'square' },
          backgroundOptions: { color: '#ffffff' }
        }
      }
    ];
  }

  async getUserQRCodes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockQRCodes);
      }, 500);
    });
  }

  async createQRCode(qrData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newQR = {
          id: Date.now().toString(),
          ...qrData,
          scans: 0,
          uniqueScans: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.mockQRCodes.unshift(newQR);
        resolve(newQR);
      }, 1000);
    });
  }

  async updateQRCode(id, updateData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.mockQRCodes.findIndex(qr => qr.id === id);
        if (index !== -1) {
          this.mockQRCodes[index] = {
            ...this.mockQRCodes[index],
            ...updateData,
            updatedAt: new Date().toISOString()
          };
          resolve(this.mockQRCodes[index]);
        }
      }, 1000);
    });
  }

  async deleteQRCode(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockQRCodes = this.mockQRCodes.filter(qr => qr.id !== id);
        resolve();
      }, 500);
    });
  }

  async duplicateQRCode(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const original = this.mockQRCodes.find(qr => qr.id === id);
        if (original) {
          const duplicate = {
            ...original,
            id: Date.now().toString(),
            name: `${original.name} (Copy)`,
            scans: 0,
            uniqueScans: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          this.mockQRCodes.unshift(duplicate);
          resolve(duplicate);
        }
      }, 1000);
    });
  }

  generateQRCode(data, design = {}) {
    const qrCode = new QRCodeStyling({
      width: design.width || 300,
      height: design.height || 300,
      type: "svg",
      data: typeof data === 'string' ? data : JSON.stringify(data),
      margin: design.margin || 10,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "M"
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 20,
        crossOrigin: "anonymous"
      },
      dotsOptions: {
        color: design.dotsOptions?.color || "#000000",
        type: design.dotsOptions?.type || "square"
      },
      backgroundOptions: {
        color: design.backgroundOptions?.color || "#ffffff"
      },
      cornersSquareOptions: {
        color: design.cornersSquareOptions?.color || "#000000",
        type: design.cornersSquareOptions?.type || "square"
      },
      cornersDotOptions: {
        color: design.cornersDotOptions?.color || "#000000",
        type: design.cornersDotOptions?.type || "square"
      }
    });

    return qrCode;
  }

  async getQRCodeAnalytics(id, timeRange = '7d') {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock analytics data
        const mockData = {
          totalScans: 1250,
          uniqueScans: 890,
          scansByDate: [
            { date: '2024-01-01', scans: 45, uniqueScans: 32 },
            { date: '2024-01-02', scans: 67, uniqueScans: 45 },
            { date: '2024-01-03', scans: 89, uniqueScans: 67 },
            { date: '2024-01-04', scans: 123, uniqueScans: 89 },
            { date: '2024-01-05', scans: 156, uniqueScans: 112 },
            { date: '2024-01-06', scans: 189, uniqueScans: 134 },
            { date: '2024-01-07', scans: 234, uniqueScans: 167 }
          ],
          deviceTypes: [
            { device: 'Mobile', count: 750, percentage: 60 },
            { device: 'Desktop', count: 375, percentage: 30 },
            { device: 'Tablet', count: 125, percentage: 10 }
          ],
          locations: [
            { country: 'United States', count: 500, percentage: 40 },
            { country: 'Canada', count: 250, percentage: 20 },
            { country: 'United Kingdom', count: 187, percentage: 15 },
            { country: 'Germany', count: 125, percentage: 10 },
            { country: 'Others', count: 188, percentage: 15 }
          ],
          referrers: [
            { source: 'Direct', count: 625, percentage: 50 },
            { source: 'Social Media', count: 250, percentage: 20 },
            { source: 'Email', count: 187, percentage: 15 },
            { source: 'Website', count: 125, percentage: 10 },
            { source: 'Others', count: 63, percentage: 5 }
          ]
        };
        resolve(mockData);
      }, 1000);
    });
  }

  async getAdvancedAnalytics(id, timeRange = '7d') {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock advanced analytics data
        const mockData = {
          totalScans: 2450,
          uniqueScans: 1680,
          conversionRate: 12.5,
          avgSessionDuration: 145,
          scanGrowth: 23.4,
          uniqueGrowth: 18.7,
          conversionGrowth: 8.2,
          sessionGrowth: -5.3,
          
          timeSeriesData: [
            { date: '2024-01-01', scans: 85, uniqueScans: 62, conversionRate: 11.2 },
            { date: '2024-01-02', scans: 127, uniqueScans: 89, conversionRate: 13.1 },
            { date: '2024-01-03', scans: 156, uniqueScans: 112, conversionRate: 12.8 },
            { date: '2024-01-04', scans: 203, uniqueScans: 145, conversionRate: 14.2 },
            { date: '2024-01-05', scans: 234, uniqueScans: 167, conversionRate: 13.7 },
            { date: '2024-01-06', scans: 189, uniqueScans: 134, conversionRate: 11.9 },
            { date: '2024-01-07', scans: 298, uniqueScans: 201, conversionRate: 15.3 }
          ],

          performanceData: [
            { time: '00:00', scans: 45, conversions: 5 },
            { time: '04:00', scans: 23, conversions: 2 },
            { time: '08:00', scans: 89, conversions: 12 },
            { time: '12:00', scans: 156, conversions: 24 },
            { time: '16:00', scans: 203, conversions: 31 },
            { time: '20:00', scans: 134, conversions: 18 }
          ],

          deviceTypes: [
            { device: 'Mobile', count: 1470, percentage: 60 },
            { device: 'Desktop', count: 735, percentage: 30 },
            { device: 'Tablet', count: 245, percentage: 10 }
          ],

          locations: [
            { country: 'United States', count: 980 },
            { country: 'Canada', count: 490 },
            { country: 'United Kingdom', count: 367 },
            { country: 'Germany', count: 245 },
            { country: 'France', count: 196 },
            { country: 'Others', count: 172 }
          ],

          ageGroups: [
            { age: '18-24', count: 345, fill: '#3b82f6' },
            { age: '25-34', count: 567, fill: '#10b981' },
            { age: '35-44', count: 423, fill: '#f59e0b' },
            { age: '45-54', count: 234, fill: '#ef4444' },
            { age: '55+', count: 111, fill: '#8b5cf6' }
          ],

          userBehavior: [
            { sessionDuration: 45, pageViews: 3, users: 234 },
            { sessionDuration: 89, pageViews: 5, users: 345 },
            { sessionDuration: 134, pageViews: 7, users: 456 },
            { sessionDuration: 167, pageViews: 4, users: 123 },
            { sessionDuration: 201, pageViews: 9, users: 567 },
            { sessionDuration: 298, pageViews: 12, users: 234 }
          ],

          conversionFunnel: [
            { stage: 'QR Scan', users: 2450, conversions: 2450 },
            { stage: 'Page View', users: 2156, conversions: 2156 },
            { stage: 'Engagement', users: 1834, conversions: 1834 },
            { stage: 'Action', users: 567, conversions: 567 },
            { stage: 'Conversion', users: 306, conversions: 306 }
          ],

          referrers: [
            { source: 'Direct', count: 1225, percentage: 50 },
            { source: 'Social Media', count: 490, percentage: 20 },
            { source: 'Email', count: 367, percentage: 15 },
            { source: 'Website', count: 245, percentage: 10 },
            { source: 'Others', count: 123, percentage: 5 }
          ]
        };
        resolve(mockData);
      }, 1500);
    });
  }

  formatWiFiData(ssid, password, security = 'WPA', hidden = false) {
    return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
  }

  formatVCardData(contact) {
    return `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
ORG:${contact.organization || ''}
TITLE:${contact.title || ''}
TEL:${contact.phone || ''}
EMAIL:${contact.email || ''}
URL:${contact.website || ''}
END:VCARD`;
  }
}

export const qrService = new QRService();