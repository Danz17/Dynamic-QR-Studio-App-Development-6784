# QR Studio Pro 📱

![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A comprehensive, production-ready QR code management platform built with React, featuring advanced analytics, team collaboration, and multi-language support.

![QR Studio Pro Screenshot](https://i.imgur.com/hCnGhS2.png)

## 🚀 Features

### Core Functionality
- **Dynamic & Static QR Codes**: Create editable QR codes or static ones for print
- **Multiple QR Types**: URL, Text, WiFi, vCard, Email, Social Media, App Download, Menu, Coupon
- **Advanced Customization**: Colors, styles, sizes, and branding options
- **Real-time Preview**: See your QR code as you design it
- **Bulk Generation**: CSV/Excel import for mass QR code creation
- **Landing Page Builder**: Create custom landing pages for your QR destinations

### Analytics & Insights
- **Comprehensive Analytics**: Track scans, locations, devices, and referrers
- **Interactive Charts**: Visual data representation with Recharts
- **Time-based Filtering**: 7 days, 30 days, custom ranges
- **Export Options**: CSV, XLSX data export

### Team Collaboration
- **Role-based Access**: Super Admin, Admin, Editor, Viewer roles
- **Team Invitations**: Email-based team member invitations
- **Shared Workspaces**: Collaborate on QR code projects
- **Permission Management**: Granular access controls

### Internationalization
- **Multiple Languages**: English, Spanish, Filipino
- **User Preferences**: Per-user language settings

### Security & Administration
- **Password Protection**: Secure QR codes with passwords
- **Expiry Dates**: Time-limited QR code access
- **Scan Limits**: Usage-based restrictions
- **Admin Console**: Site-wide settings management

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **State Management**: Zustand, React Query
- **QR Generation**: qrcode.react, qr-code-styling
- **Charts**: Recharts
- **Internationalization**: react-i18next
- **File Processing**: XLSX, Papaparse
- **Forms & Validation**: Built-in validation

## 📋 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/qr-studio-pro.git
cd qr-studio-pro
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**  
Update `src/lib/supabase.js` with your Supabase credentials:
```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
```

### Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  plan TEXT DEFAULT 'free',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create QR codes table
CREATE TABLE qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  design JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_dynamic BOOLEAN DEFAULT true,
  password TEXT,
  expiry_date TIMESTAMP,
  scan_limit INTEGER,
  scans INTEGER DEFAULT 0,
  unique_scans INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for QR codes
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own QR codes" ON qr_codes USING (auth.uid() = user_id);

-- Create site settings table
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  smtp_config JSONB DEFAULT '{}',
  site_config JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
```

## 🔐 Authentication & Demo Credentials

### User Roles
- **Super Admin** (`superAdmin`) - Full system access, site configuration
- **Admin** (`admin`) - Team management, advanced features
- **Editor** (`editor`) - Create and edit QR codes
- **Viewer** (`viewer`) - Read-only access to QR codes and analytics

### Demo Credentials
- **Super Admin**:
  - **Email**: `alaa@nulled.ai`
  - **Password**: `password`

- **Regular User**:
  - **Email**: `demo@example.com`
  - **Password**: `password`

## 📱 Responsive Design

The application is fully responsive across all device sizes:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🌐 Internationalization

### Supported Languages
- **English** (en) - Default
- **Spanish** (es) - Full translation
- **Filipino** (tl) - Full translation

## 📊 Analytics & Tracking

### Metrics Tracked
- **Total Scans**: All-time scan count
- **Unique Scans**: Unique device scans
- **Device Types**: Mobile, Desktop, Tablet breakdown
- **Geographic Data**: Country-based scan locations
- **Referrer Sources**: Traffic source analysis
- **Time-based Trends**: Scan patterns over time

## 🚀 Deployment

### Build Command
```bash
npm run build
```

### Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_VERSION=1.0.0
VITE_APP_NAME="QR Studio"
```

## 🔒 Security Features

- **Row Level Security**: Database-level access controls
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Protection**: Input sanitization and validation
- **Secure Authentication**: JWT-based secure authentication
- **HTTPS Only**: Secure data transmission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Built with ❤️ and frustration by Alaa Qweider**
- React community for excellent documentation
- Tailwind CSS for the utility-first approach
- Supabase for the backend infrastructure
- All contributors and testers