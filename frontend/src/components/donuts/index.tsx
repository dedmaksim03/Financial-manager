import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import styles from './index.module.css';
import { CategoryResponse } from '../../models/response/CategoryResponse';

type Props = {
  data: CategoryResponse[];
  title: string;
};

export const DonutChart: React.FC<Props> = ({ data, title }) => {
  const total = data.reduce((acc, cur) => acc + cur.sum, 0);

  // Определяем цвет текста в центре по заголовку
  const centerTextColor =
    title === 'Доходы' ? 'green' :
    title === 'Расходы' ? 'red' :
    'black'; // по умолчанию, если другой тайтл

  return (
    <div className={styles.donutChartWrapper}>
      <h3 style={{fontSize: '3vh'}}>{title}</h3>
      <PieChart width={350} height={350}>
        <Pie
          data={data.map(d => ({ name: d.name, color: d.color, value: d.sum }))}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={100}
          outerRadius={130}
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
            fontSize: '28px',
            fontWeight: 'bold',
            fill: centerTextColor, // Устанавливаем цвет текста
          }}
        >
          {title == "Расходы" ? '-' : '+'}{total?.toLocaleString()} ₽
        </text>
      </PieChart>
      <Legend />
    </div>
  );
};
