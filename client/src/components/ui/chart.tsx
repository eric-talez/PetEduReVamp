import { Bar, Line, Pie, Doughnut } from "recharts";
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

interface ChartProps {
  data: any;
  type?: "bar" | "line" | "pie" | "doughnut";
  height?: number | string;
  width?: number | string;
}

export function BarChart({
  data,
  type = "bar",
  height = 300,
  width = "100%"
}: ChartProps) {
  if (type === "bar") {
    // 데이터 유효성 검증
    if (!data || !data.labels || !data.datasets) {
      return <div className="flex items-center justify-center h-full text-muted-foreground">차트 데이터를 불러오는 중...</div>;
    }
    
    return (
      <ResponsiveContainer width={width} height={height}>
        <RechartsBarChart data={data.labels.map((label: string, index: number) => {
          const dataPoint: Record<string, any> = { name: label };
          data.datasets.forEach((dataset: any, datasetIndex: number) => {
            dataPoint[dataset.label] = dataset.data[index];
          });
          return dataPoint;
        })}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.datasets.map((dataset: any, index: number) => (
            <Bar 
              key={index} 
              dataKey={dataset.label} 
              fill={dataset.backgroundColor}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width={width} height={height}>
        <RechartsLineChart data={data.labels.map((label: string, index: number) => {
          const dataPoint: Record<string, any> = { name: label };
          data.datasets.forEach((dataset: any, datasetIndex: number) => {
            dataPoint[dataset.label] = dataset.data[index];
          });
          return dataPoint;
        })}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          {data.datasets.map((dataset: any, index: number) => (
            <>
            <Line 
              type="monotone" 
              dataKey={dataset.label} 
              stroke={dataset.backgroundColor}
              activeDot={{ 
                r: 8,
                stroke: dataset.backgroundColor,
                strokeWidth: 2,
                fill: "#fff"
              }}
              dot={{ 
                r: 4,
                strokeWidth: 2,
                fill: "#fff",
                stroke: dataset.backgroundColor
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              itemStyle={{
                color: dataset.backgroundColor,
                fontSize: '14px',
                padding: '4px 0'
              }}
              labelStyle={{
                color: '#64748b',
                fontSize: '12px',
                marginBottom: '4px'
              }}
              cursor={false}
            />
            </>
          ))}
          <Legend />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }

  if (type === "pie" || type === "doughnut") {
    const pieData = data.labels.map((label: string, index: number) => {
      const value = data.datasets[0].data[index];
      const backgroundColor = Array.isArray(data.datasets[0].backgroundColor) 
        ? data.datasets[0].backgroundColor[index] 
        : data.datasets[0].backgroundColor;

      return {
        name: label,
        value,
        backgroundColor
      };
    });

    return (
      <ResponsiveContainer width={width} height={height}>
        <RechartsPieChart>
          <Tooltip />
          <Legend />
          {type === "pie" ? (
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.backgroundColor} />
              ))}
            </Pie>
          ) : (
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              label
            >
              {pieData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.backgroundColor} />
              ))}
            </Pie>
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}