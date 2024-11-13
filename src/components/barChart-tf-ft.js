import { BarChart, Card } from "@tremor/react";
import { useState } from "react";

const dataFormatter = (number) => Intl.NumberFormat("us").format(number).toString();

export default function BarChartFutureCurrent({ tf, years }) {
  const [value, setValue] = useState(null);

  const chartData = Object.keys(tf || {})
    // ?.reverse()
    ?.map((year) => {
      return {
        date: year,
        // tf_list: tf?.[year]?.truckFactor,
        future_tf: tf?.[year]?.future_tf,
        // "Current Bus Factor": tf?.[year]?.truckFactor.length,
        [year]: tf?.[year]?.future_tf.length,
      };
    });

  return (
    <div className="border p-4">
      <h3 className="dark:text-dark-tremor-content-strong text-lg font-medium text-tremor-content-strong">Potential Bus Factor</h3>
      <p className="dark:text-dark-tremor-content text-tremor-default text-tremor-content">
        Evolution of the Potential bus factor over the past {chartData?.length} years
      </p>

      <div className="flex flex-row items-center">
        <BarChart
          className="mt-6"
          data={chartData}
          index="date"
          minValue={0}
          allowDecimals={false}
          categories={years}
          colors={["amber"]}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
          onValueChange={(v) => setValue(v)}
          stack={true}
        />
        {value && <CodeBlock source={value} chartData={chartData} variant="empty" className="mt-8" />}
      </div>
    </div>
  );
}

const CodeBlock = ({ source }) => {
  return (
    <div className="flex min-w-[7rem] flex-col gap-2">
      <div className="text-xs">
        <p className="font-semibold text-amber-500">Future TF: </p>
        {source?.future_tf?.map((item, index) => (
          <span key={"ft" + index}>
            {index + 1}. {item}
          </span>
        ))}
      </div>
    </div>
  );
};
