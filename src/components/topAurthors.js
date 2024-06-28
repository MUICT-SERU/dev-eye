import { BarList, Card } from "@tremor/react";
import { DonutChart, Legend } from "@tremor/react";

const TopAuthors = ({ topAuthors = [], authors = {}, year }) => {
  const color = ["cyan", "amber", "blue", "green", "red", "purple", "orange", "pink", "brown", "yellow"];

  console.log(year);

  const top10 = topAuthors?.[year]?.slice(0, 10) || [];
  console.log(top10);
  const chartData = top10?.map((author) => {
    if (author) {
      return {
        name: author,
        value: authors[year][author]?.length,
      };
    }
  });

  return (
    <div className="border p-4">
      <h3 className="text-lg font-medium text-tremor-content-strong ">Top Contributors</h3>
      <p className="text-tremor-default text-tremor-content ">The chart below shows the top contributors based on code authorship</p>
      {/* <BarList data={datahero} className="mt-4" /> */}
      <div className="flex flex-col items-center justify-center">
        <DonutChart
          style={{ width: "200px", height: "200px", marginTop: "20px" }}
          data={chartData}
          category="value"
          index="name"
          variant="pie"
          // valueFormatter={valueFormatter}
          colors={color}
          // onValueChange={(v) => console.log(v)}
        />

        <Legend
          categories={top10}
          colors={color}
          className="mt-4 flex justify-center"
          // onClick={(v) => console.log(v)}
        />
      </div>
    </div>
  );
};

export default TopAuthors;
