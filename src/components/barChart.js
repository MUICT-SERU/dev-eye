// 'use client';
import { BarChart, Card, Divider, Switch } from "@tremor/react";
import { useState } from "react";

const data = [
  {
    date: "Jan 23",
    2024: 2,
    2023: 1,
  },
  {
    date: "Feb 23",
    2024: 4,
    2023: 2,
  },
  {
    date: "Mar 23",
    2024: 3,
    2023: 2,
  },
  {
    date: "Apr 23",
    2024: 5,
    2023: 5,
  },
  {
    date: "May 23",
    2024: 2,
    2023: 2,
  },
  {
    date: "Jun 23",
    2024: 4,
    2023: 4,
  },
  {
    date: "Jul 23",
    2024: 3,
    2023: 3,
  },
  {
    date: "Aug 23",
    2024: 2,
    2023: 1,
  },
  {
    date: "Sep 23",
    2024: 4,
    2023: 2,
  },
  {
    date: "Oct 23",
    2024: 1,
    2023: 1,
  },
  {
    date: "Nov 23",
    2024: 2,
    2023: 3,
  },
  {
    date: "Dec 23",
    2024: 3,
    2023: 2,
  },
];

function valueFormatter(number) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
    // style: 'currency',
    // currency: 'USD',
  });

  return formatter.format(number);
}

export default function BarChartComponent({ tf, years }) {
  const [showComparison, setShowComparison] = useState(false);

  console.log(tf?.[years[years.length - 1]]?.truckFactor.length);

  const chartData = Object.keys(tf || {})
    ?.reverse()
    ?.map((year) => {
      return {
        date: year,
        [year]: tf?.[year]?.truckFactor.length,
        [`${year} future`]: tf?.[year]?.future_tf.length,
      };
    });

  return (
    <>
      <div className="border p-4">
        <h3 className="text-lg font-medium text-tremor-content-strong ">Bus Factor</h3>
        <p className="text-tremor-default text-tremor-content ">The chart below shows the evolution of the bus factor over the past {chartData?.length} years</p>
        <BarChart
          data={chartData}
          index="date"
          minValue={0}
          allowDecimals={false}
          categories={years}
          colors={["cyan", "blue"]}
          valueFormatter={valueFormatter}
          yAxisWidth={45}
          // className="mt-6 --hidden h-60 sm:block"
        />
      </div>
    </>
  );
}
