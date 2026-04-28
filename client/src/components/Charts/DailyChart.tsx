import { Flex } from 'antd';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { useDailySaleQuery } from '../../redux/features/management/saleApi';
import Loader from '../Loader';
import { months } from '../../utils/generateDate';

export default function DailyChart() {
  const { data: dailyData, isLoading } = useDailySaleQuery(undefined);

  if (isLoading)
    return (
      <Flex justify="center" align="center" style={{ height: 300 }}>
        <Loader />
      </Flex>
    );

  const data = dailyData?.data.map(
    (item: {
      day: number;
      month: number;
      year: number;
      totalRevenue: number;
      totalQuantity: number;
    }) => ({
      name: `${item.day} ${months[item.month - 1]}`,
      revenue: item.totalRevenue,
      quantity: item.totalQuantity,
    })
  );

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: -10,
            bottom: 10,
          }}
        >
          {/* Softer grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

          {/* Axis styling */}
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Custom Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
            }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
          />

          {/* Legend */}
          <Legend />

          {/* Revenue Area */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />

          {/* Quantity Area */}
          <Area
            type="monotone"
            dataKey="quantity"
            stroke="#22c55e"
            fill="url(#colorQuantity)"
            strokeWidth={2}
          />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
            </linearGradient>

            <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}