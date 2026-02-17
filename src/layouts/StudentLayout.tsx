// src/layouts/StudentLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
const StudentLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="student" />
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;