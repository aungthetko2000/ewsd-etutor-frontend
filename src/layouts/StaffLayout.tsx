// src/layouts/StudentLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
const StaffLayout= () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="staff" />
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default StaffLayout;