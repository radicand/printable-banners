interface HeaderProps {
  onNewBanner: () => void;
}

export default function Header({ onNewBanner }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Printable Banners
            </h1>
          </div>

          <nav className="flex items-center space-x-4">
            <button onClick={onNewBanner} className="btn-primary">
              New Banner
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
