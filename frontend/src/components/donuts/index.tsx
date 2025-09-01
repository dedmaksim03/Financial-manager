import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import styles from './index.module.css';
import { CategoryResponse } from '../../models/response/CategoryResponse';

type Props = {
  data: CategoryResponse[];
  title: string;
};

export const DonutChart: React.FC<Props> = ({ data, title }) => {
  const total = data.reduce((acc, cur) => acc + cur.sum, 0);

  const centerTextColor =
    title === 'Доходы' ? 'green' :
    title === 'Расходы' ? 'red' :
    'black';

  return (

  <div className={styles.donutChartWrapper}>
    <h3 style={{ fontSize: '3vh', marginBottom: '1vh' }}>{title}</h3>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data.map(d => ({ name: d.name, color: d.color, value: d.sum }))}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="80%"
          paddingAngle={3}
          stroke="#fff"
          strokeWidth={2}
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [
            `${value.toLocaleString()} ₽`,
            name,
          ]}
          contentStyle={{ backgroundColor: '#fff', borderRadius: '5px', borderColor: '#ccc' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: 'calc(1vw + 1vh)',
            fontWeight: 'bold',
            fill: centerTextColor,
          }}
        >
          {title === "Расходы" ? '-' : '+'}{total?.toLocaleString()} ₽
        </text>
      </PieChart>
    </ResponsiveContainer>
    <Legend />
  </div>

  );
};
