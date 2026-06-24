import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      {children}
    </div>
  );
}
