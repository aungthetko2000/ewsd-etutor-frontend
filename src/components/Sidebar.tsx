// src/components/Sidebar.tsx
interface SidebarProps {
  role: 'student' | 'tutor' | 'staff';
}

const Sidebar = ({ role }: SidebarProps) => {
  return (
    <aside style={{ width: '250px', background: '#f4f4f4', padding: '15px' }}>
       {/* Sidebar content... */}
    </aside>
  );
};

export default Sidebar; 