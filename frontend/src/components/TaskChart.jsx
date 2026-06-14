import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function TaskChart({ tasks }) {

  const data = [
    { name: "Pending", value: tasks.filter(t => t.status === "pending").length },
    { name: "Progress", value: tasks.filter(t => t.status === "progress").length },
    { name: "Completed", value: tasks.filter(t => t.status === "completed").length },
  ];

  const COLORS = ["#facc15", "#60a5fa", "#4ade80"];

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="font-bold mb-3">📊 Task Analytics</h2>

      <PieChart width={300} height={250}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={80}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}