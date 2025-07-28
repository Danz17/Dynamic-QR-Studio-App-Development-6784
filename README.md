# QR Studio Pro - Production-Ready QR Code Generator & Analytics Platform

A comprehensive, production-ready QR code management platform built with React, featuring advanced analytics, team collaboration, and multi-language support.

![QR Studio](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🎯 Core Features
- **Dynamic & Static QR Codes** - Create editable QR codes or static ones for print
- **9+ QR Code Types** - URL, Text, WiFi, vCard, Email, Social Media, App Download, Menu, Coupon
- **Advanced Design Customization** - Colors, styles, sizes, and branding options
- **Real-time Preview** - See your QR code as you design it
- **Bulk Generation** - CSV/Excel import for mass QR code creation
- **Landing Page Builder** - Drag-and-drop landing pages for QR destinations

### 📊 Analytics & Insights
- **Comprehensive Analytics** - Track scans, locations, devices, and referrers
- **Interactive Charts** - Visual data representation with Recharts
- **Time-based Filtering** - 7 days, 30 days, custom ranges
- **Export Options** - CSV, XLSX data export
- **Scan Alerts** - Email notifications for scan thresholds

### 👥 Team Collaboration
- **Role-based Access** - Super Admin, Admin, Editor, Viewer roles
- **Team Invitations** - Email-based team member invitations
- **Shared Workspaces** - Collaborate on QR code projects
- **Permission Management** - Granular access controls

### 🌍 Multi-language Support
- **3 Languages** - English, Spanish, Filipino
- **RTL Support** - Right-to-left language compatibility
- **User Preferences** - Per-user language settings
- **Admin Controls** - Site-wide language management

### ⚙️ Advanced Features
- **Password Protection** - Secure QR codes with passwords
- **Expiry Dates** - Time-limited QR code access
- **Scan Limits** - Usage-based restrictions
- **SMTP Configuration** - Custom email delivery
- **API Access** - RESTful API for integrations
- **White-labeling** - Custom branding options

### 🔧 Admin Features
- **Super Admin Console** - Site-wide settings management
- **SMTP Configuration** - Email delivery setup (Custom, Mailgun, SendGrid)
- **Feature Toggles** - Enable/disable platform features
- **User Management** - Role assignments and permissions
- **Branding Controls** - Logo, colors, and theme customization

## 🚀 Tech Stack

### Frontend
- **React 18** - Latest React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing with HashRouter
- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data updates
- **Edge Functions** - Serverless function execution

### Libraries & Tools
- **QR Code Generation** - qrcode.react for QR code rendering
- **Charts** - Recharts for analytics visualization
- **Internationalization** - react-i18next for multi-language support
- **File Processing** - XLSX and Papaparse for data import
- **Email Templates** - Nodemailer with template rendering
- **Form Validation** - Built-in validation with error handling

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend)
- Git

### Quick Start

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

4. **Database Setup**
   
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
   CREATE POLICY "Users can read own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

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

   CREATE POLICY "Users can manage own QR codes" ON qr_codes
     USING (auth.uid() = user_id);

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

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 🔐 Authentication & Roles

### User Roles
- **Super Admin** (`superAdmin`) - Full system access, site configuration
- **Admin** (`admin`) - Team management, advanced features
- **Editor** (`editor`) - Create and edit QR codes
- **Viewer** (`viewer`) - Read-only access to QR codes and analytics

### Demo Credentials
- **Email**: `alaa@nulled.ai`
- **Password**: `password`
- **Role**: Super Admin

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) - Main brand color
- **Secondary**: Slate (#64748b) - Supporting elements
- **Success**: Green (#10b981) - Success states
- **Warning**: Amber (#f59e0b) - Warning states
- **Error**: Red (#ef4444) - Error states

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: Bold, various sizes (text-xl to text-4xl)
- **Body**: Regular weight, readable line heights

### Components
- **Cards**: White background, subtle shadows, rounded corners
- **Buttons**: Primary, secondary, outline variants with hover states
- **Forms**: Consistent styling with validation states
- **Modals**: Centered overlays with backdrop blur

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Features
- **Hamburger Navigation** - Mobile-friendly navigation
- **Stacked Layouts** - Mobile-optimized card stacking
- **Touch Targets** - Properly sized interactive elements
- **Responsive Tables** - Horizontal scroll on mobile

## 🌐 Internationalization

### Supported Languages
- **English** (en) - Default
- **Spanish** (es) - Full translation
- **Filipino** (tl) - Full translation

### Adding New Languages

1. Create translation file in `src/i18n/locales/[language].json`
2. Add language to `availableLanguages` in settings
3. Update language selector component

## 📊 Analytics & Tracking

### Metrics Tracked
- **Total Scans** - All-time scan count
- **Unique Scans** - Unique device scans
- **Device Types** - Mobile, Desktop, Tablet breakdown
- **Geographic Data** - Country-based scan locations
- **Referrer Sources** - Traffic source analysis
- **Time-based Trends** - Scan patterns over time

### Privacy Compliance
- **GDPR Ready** - User data controls and deletion
- **No Personal Data** - Only aggregate analytics stored
- **Opt-out Options** - User-controlled tracking preferences

## 🔧 Configuration

### Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_VERSION=1.0.0
VITE_APP_NAME="QR Studio"
```

### Feature Flags
Control features via the admin console:
- Email Notifications
- Team Collaboration
- Landing Page Builder
- API Access
- Bulk Generation
- Analytics

## 🚀 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel Deployment
1. Import project from GitHub in Vercel
2. Framework preset: Vite
3. Add environment variables in project settings

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist` folder to your web server
3. Configure server for SPA routing

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests** - Component and utility testing
- **Integration Tests** - Feature workflow testing
- **E2E Tests** - Cypress for end-to-end testing

## 📈 Performance

### Optimization Features
- **Code Splitting** - Lazy loading of route components
- **Image Optimization** - WebP format with fallbacks
- **Bundle Analysis** - Webpack bundle analyzer integration
- **Caching Strategy** - Service worker for offline functionality

### Performance Metrics
- **First Contentful Paint** - < 1.5s
- **Largest Contentful Paint** - < 2.5s
- **Cumulative Layout Shift** - < 0.1
- **First Input Delay** - < 100ms

## 🔒 Security

### Security Features
- **Row Level Security** - Database-level access controls
- **CSRF Protection** - Cross-site request forgery prevention
- **XSS Protection** - Input sanitization and validation
- **Rate Limiting** - API request throttling
- **Secure Headers** - Security-focused HTTP headers

### Best Practices
- **Input Validation** - Client and server-side validation
- **Secure Storage** - Encrypted sensitive data
- **Authentication** - JWT-based secure authentication
- **HTTPS Only** - Secure data transmission

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Create a Pull Request

### Code Standards
- **ESLint** - JavaScript/React linting
- **Prettier** - Code formatting
- **Conventional Commits** - Standardized commit messages
- **Component Guidelines** - Reusable, documented components

### Pull Request Guidelines
- Clear description of changes
- Screenshots for UI changes
- Test coverage for new features
- Documentation updates if needed

## 📞 Support

### Documentation
- **User Guide** - Complete user documentation
- **API Documentation** - RESTful API reference
- **Component Library** - Design system documentation
- **Deployment Guide** - Step-by-step deployment instructions

### Getting Help
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Community support and questions
- **Email Support** - alaa@nulled.ai for direct support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Built with ❤️ and frustration by Alaa Qweider**
- React community for excellent documentation
- Tailwind CSS for the utility-first approach
- Supabase for the backend infrastructure
- All contributors and testers

---

## 📋 Changelog

### Version 1.0.0 (Current)
- ✅ Initial production release
- ✅ Complete vStandard compliance
- ✅ Multi-language support (EN, ES, TL)
- ✅ Super Admin console
- ✅ Team collaboration features
- ✅ Advanced QR customization
- ✅ Bulk generation with CSV import
- ✅ Landing page builder
- ✅ Email notification system
- ✅ Comprehensive analytics
- ✅ Mobile-responsive design
- ✅ API documentation
- ✅ Security hardening

### Upcoming Features (v1.1.0)
- 🔄 Advanced API integrations
- 🔄 White-label customization
- 🔄 Advanced user management
- 🔄 Webhook support
- 🔄 Advanced reporting
- 🔄 Mobile app companion

---

**Made for creators, by creators. Start building amazing QR experiences today!** 🚀