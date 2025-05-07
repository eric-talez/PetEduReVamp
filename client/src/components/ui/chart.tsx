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
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px'
            }}
            formatter={(value: any, name: string) => [value, name]}
            labelStyle={{
              color: '#666',
              marginBottom: '4px'
            }}
          />
          <Legend />
          {data.datasets.map((dataset: any, index: number) => (
            <Line 
              key={index} 
              type="monotone" 
              dataKey={dataset.label} 
              stroke={dataset.backgroundColor}
              activeDot={{ r: 8 }}
              dot={{ 
                r: 4,
                strokeWidth: 2,
                fill: "#fff",
                stroke: dataset.backgroundColor
              }}
            />
          ))}
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