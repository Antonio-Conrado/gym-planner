"use client";
import { defaultColors } from "@/lib/colors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  data: { name: string; count: number; percentage: number }[];
  title: string;
  itemLabelSingular?: string;
  itemLabelPlural?: string;
  description: string;
  money?: boolean;
  colors?: string[];
};

export default function PieChartComponent({
  data,
  title,
  itemLabelSingular,
  itemLabelPlural,
  description,
  money,
  colors = defaultColors,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <ResponsiveContainer width="30%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
            {data.map((item, index) => (
              <div key={item.name} className="space-y-2 ">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm">{item.percentage.toFixed(2)}%</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="text-sm text-gray-600">
                    {money ? (
                      <>C$ {item.count}</>
                    ) : (
                      <>
                        {item.count}{" "}
                        {item.count === 1 ? itemLabelSingular : itemLabelPlural}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
