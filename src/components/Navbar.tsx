

interface NavbarProps {
  role: 'student' | 'tutor' | 'staff';
}

const Navbar = ({ role }: NavbarProps) => {
  return (
    <nav style={{ 
      height: '60px', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 20px', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #ddd' 
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Portal
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Welcome, User</span>
        <button style={{ 
          padding: '5px 10px', 
          cursor: 'pointer',
          borderRadius: '4px',
          border: '1px solid #f44336',
          color: '#f44336',
          background: 'none'
        }} onClick={() => window.location.href = '/'}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;