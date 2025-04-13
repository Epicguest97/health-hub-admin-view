
import MainLayout from "@/components/layout/MainLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentPatients from "@/components/dashboard/RecentPatients";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import { Users, UserPlus, CreditCard, CalendarDays, Activity } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout title="Dashboard">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Patients"
            value="3,456"
            icon={<Users className="h-4 w-4" />}
            description="All registered patients"
            trend="up"
            trendValue="12% from last month"
          />
          <StatsCard
            title="New Patients"
            value="42"
            icon={<UserPlus className="h-4 w-4" />}
            description="Patients this week"
            trend="up"
            trendValue="8% from last week"
          />
          <StatsCard
            title="Total Revenue"
            value="$24,780"
            icon={<CreditCard className="h-4 w-4" />}
            description="Monthly revenue"
            trend="up"
            trendValue="4.3% from last month"
          />
          <StatsCard
            title="Appointments"
            value="187"
            icon={<CalendarDays className="h-4 w-4" />}
            description="Scheduled this week"
            trend="down"
            trendValue="3% from last week"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <RecentPatients />
          <UpcomingAppointments />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
