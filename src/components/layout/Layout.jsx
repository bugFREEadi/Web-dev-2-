// Layout wrapper — provides sidebar + main content area for authenticated pages
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from '../common/Toast';

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
