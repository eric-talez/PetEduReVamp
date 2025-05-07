import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface MiniChartProps {
  data: { name: string; value: number }[];
  stroke?: string;
  fill?: string;
  height?: number;
  positive?: boolean;
}

export function MiniChart({ 
  data, 
  stroke = "#16a34a", 
  fill = "rgba(22, 163, 74, 0.2)", 
  height = 40,
  positive = true
}: MiniChartProps) {
  // 사용할 색상 결정 (positive가 false면 빨간색 계열로 변경)
  const chartStroke = positive ? stroke : "#e11d48";
  const chartFill = positive ? fill : "rgba(225, 29, 72, 0.2)";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${positive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartStroke} stopOpacity={0.3} />
            <stop offset="95%" stopColor={chartStroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" hide />
        <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={chartStroke}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="transparent"
          fill={`url(#gradient-${positive ? 'up' : 'down'})`}
          fillOpacity={1}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SparkLineChart({ 
  data, 
  stroke = "#16a34a", 
  fill = "rgba(22, 163, 74, 0.2)", 
  height = 20,
  positive = true
}: MiniChartProps) {
  // 사용할 색상 결정 (positive가 false면 빨간색 계열로 변경)
  const chartStroke = positive ? stroke : "#e11d48";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={chartStroke}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}