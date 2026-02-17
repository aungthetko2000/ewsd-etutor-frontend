import PermissionGate from "./auth/PermissionGate";
import StaffDashBoard from "./StaffDashboard";

const Dashboard = () => {
  return (
    <>
      <div>
        <PermissionGate permissions={["VIEW_STAFF_DASHBOARD"]}>
          <StaffDashBoard />
        </PermissionGate>
      </div>
    </>
  );
};

export default Dashboard;
