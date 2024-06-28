import { DonutChart, Card, Legend } from "@tremor/react";
import { useState } from "react";

export default function ContributorFunnel({ authors = {}, tf, year }) {
  const [value, setValue] = useState(null);

  const contributors = Object.keys(authors?.[year] || {})?.length || 0;
  const potentialBusFactor = tf?.[year]?.future_tf.length || 0;
  const currentBusFactor = tf?.[year]?.truckFactor.length || 0;

  const chartData = [
    { name: "Contributors", value: contributors - potentialBusFactor - currentBusFactor },
    { name: "Potential Bus Factor", value: potentialBusFactor },
    { name: "Current Bus Factor", value: currentBusFactor },
  ];

  return (
    <div className="border p-4">
      <h3 className="text-lg font-medium text-tremor-content-strong ">Overall Contributors</h3>
      <p className="dark:text-dark-tremor-content text-tremor-default text-tremor-content">The chart below shows the overall contributors</p>

      <div className="flex items-center justify-center space-x-6">
        <DonutChart
          data={chartData}
          category="value"
          index="name"
          variant="pie"
          colors={["cyan", "amber", "blue"]}
          className="w"
          style={{ marginTop: "20px" }}
          onValueChange={(v) => setValue({ name: v?.name, value: v?.value })}
        />
        <Legend categories={["Contributors", "Potential Bus Factor", "Current Bus Factor"]} colors={["cyan", "amber", "blue"]} className="max-w-xs" />

        <div>{/* {JSON.stringify(value, null, 2)} */}</div>
      </div>
    </div>
  );
}
