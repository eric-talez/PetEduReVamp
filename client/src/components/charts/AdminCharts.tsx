import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

// 샘플 데이터 (실제 API 데이터로 교체 예정)
const userGrowthData = [
  { month: '7월', newUsers: 145 },
  { month: '8월', newUsers: 187 },
  { month: '9월', newUsers: 234 },
  { month: '10월', newUsers: 298 },
  { month: '11월', newUsers: 342 },
  { month: '12월', newUsers: 387 },
];

const userTypeData = [
  { name: '반려인', value: 78, color: '#3B82F6' },
  { name: '훈련사', value: 12, color: '#10B981' },
  { name: '기관 관리자', value: 8, color: '#8B5CF6' },
  { name: '기타', value: 2, color: '#F59E0B' },
];

const revenueData = [
  { month: '7월', revenue: 12400000 },
  { month: '8월', revenue: 15600000 },
  { month: '9월', revenue: 18900000 },
  { month: '10월', revenue: 21200000 },
  { month: '11월', revenue: 24800000 },
  { month: '12월', revenue: 28300000 },
];

const courseEnrollmentData = [
  { month: '7월', enrollments: 87 },
  { month: '8월', enrollments: 124 },
  { month: '9월', enrollments: 156 },
  { month: '10월', enrollments: 198 },
  { month: '11월', enrollments: 234 },
  { month: '12월', enrollments: 287 },
];

const systemPerformanceData = [
  { time: '00:00', cpu: 45, memory: 52 },
  { time: '04:00', cpu: 38, memory: 48 },
  { time: '08:00', cpu: 65, memory: 67 },
  { time: '12:00', cpu: 78, memory: 82 },
  { time: '16:00', cpu: 85, memory: 88 },
  { time: '20:00', cpu: 72, memory: 75 },
];

interface ChartProps {
  height?: number;
  width?: number;
}

export const UserGrowthChart = ({ height = 300 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={userGrowthData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="newUsers" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const UserTypeChart = ({ height = 300 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={userTypeData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {userTypeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const RevenueChart = ({ height = 300 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`${(value as number).toLocaleString()}원`, '수익']} />
        <Bar dataKey="revenue" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CourseEnrollmentChart = ({ height = 300 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={courseEnrollmentData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="enrollments" stroke="#8B5CF6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const SystemPerformanceChart = ({ height = 300 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={systemPerformanceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="cpu" stroke="#EF4444" strokeWidth={2} name="CPU %" />
        <Line type="monotone" dataKey="memory" stroke="#F59E0B" strokeWidth={2} name="Memory %" />
      </LineChart>
    </ResponsiveContainer>
  );
};

// 통합 대시보드용 차트 컴포넌트
export const CompactUserGrowthChart = ({ height = 200 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={userGrowthData}>
        <XAxis dataKey="month" hide />
        <YAxis hide />
        <Tooltip />
        <Area type="monotone" dataKey="newUsers" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const CompactUserTypeChart = ({ height = 200 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={userTypeData}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={60}
          paddingAngle={5}
          dataKey="value"
        >
          {userTypeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const CompactRevenueChart = ({ height = 200 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={revenueData}>
        <XAxis dataKey="month" hide />
        <YAxis hide />
        <Tooltip formatter={(value) => [`${(value as number).toLocaleString()}원`, '수익']} />
        <Bar dataKey="revenue" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CompactSystemChart = ({ height = 200 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={systemPerformanceData}>
        <XAxis dataKey="time" hide />
        <YAxis hide />
        <Tooltip />
        <Line type="monotone" dataKey="cpu" stroke="#EF4444" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="memory" stroke="#F59E0B" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// 플랫폼 활동 차트 데이터
const platformActivityData = [
  { time: '09:00', logins: 45, registrations: 8, courses: 12 },
  { time: '10:00', logins: 62, registrations: 15, courses: 18 },
  { time: '11:00', logins: 89, registrations: 22, courses: 25 },
  { time: '12:00', logins: 124, registrations: 28, courses: 31 },
  { time: '13:00', logins: 98, registrations: 19, courses: 22 },
  { time: '14:00', logins: 112, registrations: 25, courses: 28 },
  { time: '15:00', logins: 89, registrations: 18, courses: 24 },
  { time: '16:00', logins: 76, registrations: 12, courses: 19 },
];

export const PlatformActivityChart = ({ height = 300 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={platformActivityData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="logins" stroke="#3B82F6" strokeWidth={2} name="로그인" />
        <Line type="monotone" dataKey="registrations" stroke="#10B981" strokeWidth={2} name="신규 가입" />
        <Line type="monotone" dataKey="courses" stroke="#8B5CF6" strokeWidth={2} name="강좌 등록" />
      </LineChart>
    </ResponsiveContainer>
  );
};