"use client";

import { defaultColors } from "@/lib/colors";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { YearSelector } from "@/shared/components/dashboard/YearSelector";
import { useState } from "react";
import { MonthSelector } from "@/shared/components/dashboard/MonthSelector";
import { OptionSelector } from "@/shared/components/dashboard/OptionSelector";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/shared/components/ui/spinner";

type Props = {
  title: string;
  description: string;
  years: number[];
  currentYear: number;
  colors?: string[];
};

export default function TimePeriodBarChart({
  title,
  description,
  years,
  currentYear,
  colors = defaultColors,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    "Año"
  );
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    undefined
  );

  const chartData = useQuery({
    queryKey: ["barChartIncome", selectedMonth, selectedOption, selectedYear],
    queryFn: async () => {
      const params = new URLSearchParams({ year: selectedYear });

      if (selectedOption === "Mes") {
        if (selectedMonth !== undefined) {
          params.append("month", selectedMonth);
        }
      } else {
        params.append("totalYear", selectedYear);
      }

      const res = await fetch(
        `/api/admin/dashboard/income?${params.toString()}`
      );
      const response = await res.json();
      return response;
    },
    enabled: !!selectedMonth || !!selectedOption || !!selectedYear,
    staleTime: 300000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row  gap-2">
          <YearSelector
            years={years}
            currentYear={Number(selectedYear)}
            setSelectedYear={setSelectedYear}
          />
          <OptionSelector
            options={["Año", "Mes"]}
            currentOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          {selectedOption === "Mes" && (
            <MonthSelector
              currentMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          )}
        </div>
        <div className="h-96 w-full">
          {chartData.isLoading ? (
            <div className="flex items-center justify-center h-96 w-full">
              <Spinner className="size-10" />
            </div>
          ) : (
            <ResponsiveContainer>
              <ComposedChart
                data={chartData.data}
                margin={{ top: 20, right: 20, bottom: 0, left: 0 }}
              >
                <CartesianGrid stroke="#f5f5f5" vertical={false} />
                <XAxis
                  dataKey={"period"}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("es-ES", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("es-ES").format(Number(value))
                  }
                  labelFormatter={(label) => `Período: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Ingresos"
                  fill={colors[0] || "#413ea0"}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
