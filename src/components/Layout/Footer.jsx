import React from 'react';

function Footer() {
  const version = process.env.VITE_APP_VERSION || '1.0.0';

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            Built with ❤️ and frustration by Alaa Qweider
          </p>
          <p className="text-gray-500 text-xs mt-2 md:mt-0">
            v{version}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;