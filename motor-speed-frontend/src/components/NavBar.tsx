import { API_BASE_URL } from '../services/api';

export default function NavBar() {
  const apiDocsUrl = `${API_BASE_URL}/swagger/index.html`;
  const healthUrl = `${API_BASE_URL}/health`;
  return (
    <nav className="w-full flex items-center justify-between px-4 py-2 bg-blue-700 text-white rounded mb-6 shadow">
      <div className="font-bold text-lg tracking-wide">⚡ Motor Dashboard</div>
      <div className="flex gap-4 text-sm">
        <a href="/" className="hover:underline">Dashboard</a>
        <a href={apiDocsUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">API Docs</a>
        <a href={healthUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">Health</a>
        <a href="https://github.com/arnobt78/Embedded-Motor-Engine-Speed-Temperature-Measurement--CPP-DotNet-React" className="hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </nav>
  );
}
