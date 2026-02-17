import { createBrowserRouter } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import TutorLayout from '../layouts/TutorLayout';
import StaffLayout from '../layouts/StaffLayout';
import StudentDashboard from '../pages/student/StudentDashboard';
import TutorDashboard from '../pages/tutor/TutorDashboard';
import StaffDashboard from '../pages/staff/StaffDashboard';
import Login from '../pages/Login';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      { path: "dashboard", element: <StudentDashboard /> },
    ],
  },
  {
    path: "/tutor",
    element: <TutorLayout />,
    children: [
      { path: "dashboard", element: <TutorDashboard /> },
    ],
  },
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [
      { path: "dashboard", element: <StaffDashboard /> },
    ],
  }
]);