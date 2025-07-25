export default function NavBar() {
  return (
    <nav className="w-full flex items-center justify-between px-4 py-2 bg-blue-700 text-white rounded mb-6 shadow">
      <div className="font-bold text-lg tracking-wide">⚡ Motor Dashboard</div>
      <div className="flex gap-4 text-sm">
        <a href="/" className="hover:underline">Dashboard</a>
        <a href="http://localhost:5001/swagger/index.html" className="hover:underline" target="_blank" rel="noopener noreferrer">API Docs</a>
        <a href="http://localhost:5001/health" className="hover:underline" target="_blank" rel="noopener noreferrer">Health</a>
        <a href="https://github.com/" className="hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </nav>
  );
}
