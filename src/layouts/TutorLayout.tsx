// src/layouts/StudentLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
const TutorLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="tutor" />
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default TutorLayout;