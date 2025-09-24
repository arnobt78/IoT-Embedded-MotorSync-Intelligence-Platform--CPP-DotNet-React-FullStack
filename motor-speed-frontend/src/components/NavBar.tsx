import { API_BASE_URL } from "../services/api";
import { useState, useEffect, useMemo } from "react";

interface NavBarProps {
  darkMode?: boolean;
}

export default function NavBar({ darkMode = false }: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("page") || "dashboard";
  });

  const apiDocsUrl = `${API_BASE_URL}/swagger/index.html`;

  // Navigation sections with IDs - organized by category for dropdowns
  const navigationSections = useMemo(
    () => ({
      main: [
        {
          id: "hero",
          title: "Motor Dashboard",
          description: "Main motor monitoring and control",
        },
        {
          id: "charts",
          title: "Analytics",
          description: "Performance charts and metrics",
        },
        {
          id: "sensor-dashboard",
          title: "Industrial Sensors",
          description: "Real-time sensor data monitoring",
        },
      ],
      advanced: [
        {
          id: "advanced-analytics",
          title: "Advanced Analytics",
          description: "Detailed performance analysis",
        },
        {
          id: "industrial-management",
          title: "Industrial Management",
          description: "Facility and equipment management",
        },
        {
          id: "predictive-maintenance",
          title: "Predictive Maintenance",
          description: "AI-powered failure prediction",
        },
        {
          id: "motor-control",
          title: "Motor Control",
          description: "Real-time motor automation",
        },
      ],
      applications: [
        {
          id: "daily-applications",
          title: "Daily Applications",
          description: "Real-world IoT applications",
        },
        {
          id: "iot-cloud",
          title: "IoT & Cloud Integration",
          description: "Cloud services and connectivity",
        },
        {
          id: "edge-computing",
          title: "Edge Computing",
          description: "Local processing & synchronization",
        },
      ],
    }),
    []
  );

  // Flatten all sections for scroll detection
  const allSections = useMemo(
    () => [
      ...navigationSections.main,
      ...navigationSections.advanced,
      ...navigationSections.applications,
    ],
    [navigationSections]
  );

  // Listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      setCurrentPage(urlParams.get("page") || "dashboard");
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = allSections.map((section) => ({
        ...section,
        element: document.getElementById(section.id),
      }));

      const currentSection = sections.find((section) => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allSections]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Handle dropdown hover with delay
  const handleDropdownEnter = (dropdownId: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setHoveredDropdown(dropdownId);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredDropdown(null);
    }, 150); // 150ms delay before closing
    setDropdownTimeout(timeout);
  };

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? darkMode
              ? "bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700"
              : "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
            : darkMode
            ? "bg-gradient-to-r from-slate-900 to-gray-900"
            : "bg-gradient-to-r from-slate-900 to-blue-900"
        }`}
      >
        <div className="max-w-9xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                if (currentPage === "health") {
                  window.history.pushState({}, "", "?page=dashboard");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                } else {
                  scrollToSection("hero");
                }
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:from-blue-500 group-hover:to-blue-700 transition-all duration-200">
                IoT
              </div>
              <div
                className={`font-bold text-lg tracking-wide transition-colors ${
                  isScrolled
                    ? darkMode
                      ? "text-white"
                      : "text-gray-900"
                    : "text-white"
                }`}
              >
                {currentPage === "health" ? "Home" : "MotorSync Intelligence"}
              </div>
            </div>

            {/* Desktop Navigation - Only show on dashboard page */}
            {currentPage === "dashboard" && (
              <div className="hidden lg:flex items-center space-x-8">
                {/* Main Sections Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("main")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-lg ${
                      isScrolled
                        ? darkMode
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>Monitoring</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        hoveredDropdown === "main" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {hoveredDropdown === "main" && (
                    <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {/* Invisible bridge to prevent gap */}
                      <div className="absolute -top-2 left-0 right-0 h-2"></div>
                      {navigationSections.main.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            activeSection === section.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {section.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Advanced Analytics Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("advanced")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-lg ${
                      isScrolled
                        ? darkMode
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>Analytics</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        hoveredDropdown === "advanced" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {hoveredDropdown === "advanced" && (
                    <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {/* Invisible bridge to prevent gap */}
                      <div className="absolute -top-2 left-0 right-0 h-2"></div>
                      {navigationSections.advanced.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            activeSection === section.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {section.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Applications Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("applications")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-lg ${
                      isScrolled
                        ? darkMode
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>Applications</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        hoveredDropdown === "applications" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {hoveredDropdown === "applications" && (
                    <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {/* Invisible bridge to prevent gap */}
                      <div className="absolute -top-2 left-0 right-0 h-2"></div>
                      {navigationSections.applications.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            activeSection === section.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {section.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* External Links */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* API Docs - Only show on dashboard */}
              {currentPage === "dashboard" && (
                <a
                  href={apiDocsUrl}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isScrolled
                      ? darkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>API Docs</span>
                </a>
              )}

              {/* Home - Only show on health page */}
              {currentPage === "health" && (
                <button
                  onClick={() => {
                    window.history.pushState({}, "", "?page=dashboard");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isScrolled
                      ? darkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Home</span>
                </button>
              )}

              {/* System Health - Always show */}
              <button
                onClick={() => {
                  window.history.pushState({}, "", "?page=health");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isScrolled
                    ? darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>System Health</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
                isScrolled
                  ? darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div
                  className={`w-full h-0.5 bg-current transition-transform duration-200 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></div>
                <div
                  className={`w-full h-0.5 bg-current transition-opacity duration-200 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></div>
                <div
                  className={`w-full h-0.5 bg-current transition-transform duration-200 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Navigation Sections - Only show on dashboard */}
              {currentPage === "dashboard" && (
                <>
                  {Object.entries(navigationSections).map(
                    ([category, sections]) => (
                      <div key={category} className="space-y-1">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                          {category === "main" && "Monitoring"}
                          {category === "advanced" && "Analytics"}
                          {category === "applications" && "Applications"}
                        </div>
                        {sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                              activeSection === section.id
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <div className="font-medium">{section.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {section.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  )}
                </>
              )}

              {/* Mobile External Links */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                {/* API Docs - Only show on dashboard */}
                {currentPage === "dashboard" && (
                  <a
                    href={apiDocsUrl}
                    className="block w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span>API Documentation</span>
                    </div>
                  </a>
                )}

                {/* Home - Only show on health page */}
                {currentPage === "health" && (
                  <button
                    onClick={() => {
                      window.history.pushState({}, "", "?page=dashboard");
                      window.dispatchEvent(new PopStateEvent("popstate"));
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      <span>Home</span>
                    </div>
                  </button>
                )}

                {/* System Health - Always show */}
                <button
                  onClick={() => {
                    window.history.pushState({}, "", "?page=health");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>System Health</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
