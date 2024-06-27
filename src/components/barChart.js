// 'use client';
import { BarChart, Card, Divider, Switch } from '@tremor/react';
import { useState } from 'react';

const data = [
  {
    date: 'Jan 23',
    '2024': 2,
    '2023': 1,
  },
  {
    date: 'Feb 23',
    '2024': 4,
    '2023': 2,
  },
  {
    date: 'Mar 23',
    '2024': 3,
    '2023': 2,
  },
  {
    date: 'Apr 23',
    '2024': 5,
    '2023': 5,
  },
  {
    date: 'May 23',
    '2024': 2,
    '2023': 2,
  },
  {
    date: 'Jun 23',
    '2024': 4,
    '2023': 4,
  },
  {
    date: 'Jul 23',
    '2024': 3,
    '2023': 3,
  },
  {
    date: 'Aug 23',
    '2024': 2,
    '2023': 1,
  },
  {
    date: 'Sep 23',
    '2024': 4,
    '2023': 2,
  },
  {
    date: 'Oct 23',
    '2024': 1,
    '2023': 1,
  },
  {
    date: 'Nov 23',
    '2024': 2,
    '2023': 3,
  },
  {
    date: 'Dec 23',
    '2024': 3,
    '2023': 2,
  },
];

function valueFormatter(number) {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    notation: 'compact',
    compactDisplay: 'short',
    // style: 'currency',
    // currency: 'USD',
  });

  return formatter.format(number);
}

export default function BarChartComponent({tf}) {
  const [showComparison, setShowComparison] = useState(false);

  const chartData=[
    {
      name: '2024',
      '2024':  5,
    },
  ]
  return (
    <>
      <Card className="">
        <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Bus Factor
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          The chart bellow shows the evolution of bus factor over the past 2 years
        </p>
        is this showing
        <BarChart
          data={chartData}
          index="date"
          minValue={0}
          allowDecimals={false}
          categories={
            showComparison ? ['2023', '2024'] : ['2024']
          }
          colors={showComparison ? ['cyan', 'blue'] : ['blue']}
          valueFormatter={valueFormatter}
          yAxisWidth={45}
          className="mt-6 --hidden h-60 sm:block"
        />
        <BarChart
          data={chartData}
          index="date"
          minValue={0}
          allowDecimals={false}
          categories={
            showComparison ? ['2023', '2024'] : ['2024']
          }
          colors={showComparison ? ['cyan', 'blue'] : ['blue']}
          valueFormatter={valueFormatter}
          showYAxis={false}
          className="h-56 mt-4 sm:h---idden"
        />
        <Divider />
        <div className="flex items-center mb-2 space-x-3">
          <Switch
            id="comparison"
            onChange={() => setShowComparison(!showComparison)}
          />
          <label
            htmlFor="comparison"
            className="text-tremor-default text-tremor-content dark:text-dark-tremor-content"
          >
            Show same period 2023
          </label>
        </div>
      </Card>
    </>
  );
}