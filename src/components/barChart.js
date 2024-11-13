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
  const [value, setValue] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  console.log(tf?.[years[years.length - 1]]?.truckFactor.length);

  const chartData = Object.keys(tf || {})?.map((year) => {
    return {
      date: year,
      [year]: tf?.[year]?.truckFactor.length,
      tf_list: tf?.[year]?.truckFactor,
      [`${year} future`]: tf?.[year]?.future_tf.length,
    };
  });

  return (
    <>
      <div className="border p-4">
        <h3 className="text-lg font-medium text-tremor-content-strong ">Bus Factor</h3>
        <p className="text-tremor-default text-tremor-content ">Evolution of the bus factor over the past {chartData?.length} years</p>
        <div className="flex flex-row items-center">
          <BarChart
            data={chartData}
            index="date"
            minValue={0}
            allowDecimals={false}
            categories={years}
            colors={["blue"]}
            valueFormatter={valueFormatter}
            yAxisWidth={45}
            stack={true}
            onValueChange={(v) => setValue(v)}
            // className="mt-6 --hidden h-60 sm:block"
          />
          {value && <CodeBlock source={value} chartData={chartData} variant="empty" className="mt-8" />}
        </div>
      </div>
    </>
  );
}

const CodeBlock = ({ source }) => {
  return (
    <div className="flex min-w-[7rem] flex-col gap-2">
      <div className="text-xs">
        <p className="font-semibold text-blue-500">Current TF: </p>
        {source?.tf_list?.map((item, index) => (
          <span key={"item" + item}>
            {index + 1}. {item}
          </span>
        ))}
      </div>
    </div>
  );
};
