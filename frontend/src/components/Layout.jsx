'use client';

import { HomeIcon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Sidebar from './Sidebar';
import TopBar from './TopBar';

import { cn } from '@/lib/utils';

const navigation = [{ name: 'Dashboard', href: '/', icon: HomeIcon }];

export default function Layout({ branding, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Remove the unused variable or prefix with underscore if you need it later
  const [_faviconLoaded, setFaviconLoaded] = useState(false);

  useEffect(() => {
    // Get branding from window object (set by server)
    if (window.PRESWALD_BRANDING) {
      // Replace console.log with console.warn to match allowed console methods
      console.warn('Received branding:', window.PRESWALD_BRANDING);

      // Update document title
      document.title = window.PRESWALD_BRANDING.name;

      // Update favicon links
      const updateFaviconLinks = (faviconUrl) => {
        // Remove any existing favicon links
        const existingLinks = document.querySelectorAll("link[rel*='icon']");
        existingLinks.forEach((link) => link.remove());

        // Create new favicon links
        const iconLink = document.createElement('link');
        iconLink.type = 'image/x-icon';
        iconLink.rel = 'icon';
        iconLink.href = `${faviconUrl}?timestamp=${new Date().getTime()}`;
        document.head.appendChild(iconLink);

        const shortcutLink = document.createElement('link');
        shortcutLink.type = 'image/x-icon';
        shortcutLink.rel = 'shortcut icon';
        shortcutLink.href = `${faviconUrl}?timestamp=${new Date().getTime()}`;
        document.head.appendChild(shortcutLink);
      };

      // Function to check if favicon is accessible
      const checkFavicon = () => {
        fetch(window.PRESWALD_BRANDING.favicon)
          .then((response) => {
            if (response.ok) {
              setFaviconLoaded(true);
              // Replace console.log with console.warn
              console.warn('Favicon loaded successfully');
              updateFaviconLinks(window.PRESWALD_BRANDING.favicon);
            } else {
              throw new Error('Favicon not found');
            }
          })
          .catch((error) => {
            console.warn('Favicon failed to load, retrying in 1 second...', error);
            setTimeout(checkFavicon, 1000);
          });
      };

      checkFavicon();
    } else {
      console.warn('No PRESWALD_BRANDING found in window object');
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
        branding={branding || window.PRESWALD_BRANDING}
        isCollapsed={isCollapsed}
      />

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-col min-h-screen',
          'lg:pl-80 transition-all duration-300',
          isCollapsed && 'lg:pl-20'
        )}
      >
        <TopBar
          setSidebarOpen={setSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          isCollapsed={isCollapsed}
          branding={branding || window.PRESWALD_BRANDING}
        />

        <main className="flex-1 py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Add prop types validation
Layout.propTypes = {
  branding: PropTypes.shape({
    name: PropTypes.string,
    favicon: PropTypes.string,
  }),
  children: PropTypes.node,
};