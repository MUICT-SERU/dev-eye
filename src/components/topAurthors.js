import { BarList, Card } from '@tremor/react';
import { DonutChart, Legend } from '@tremor/react';


const TopAuthors = ({topAuthors=[],authors={}}) => {
  const color = ['cyan', 'amber', 'blue', 'green', 'red', 'purple', 'orange', 'pink', 'brown', 'yellow'];
 
  const top10 = topAuthors?.slice(0,10);
  const chartData = top10?.map((author) => {
    if(author){
    return {
      name: author,
      value: authors[author]?.length
    }
    }
  }
  )


  return  (
  
  <Card>
    <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Top Contributors 
      </h3>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          The chart bellow shows the top contributors based on code authorship
        </p>
    {/* <BarList data={datahero} className="mt-4" /> */}
    <div className="grid w-full grid-cols-2 space-x-6 mt-7">
        <DonutChart
          data={chartData}
          category="value"
          index="name"
          variant="pie"
          // valueFormatter={valueFormatter}
          colors={color}
          className="w"
          // onValueChange={(v) => console.log(v)}
        />

        
        <Legend
          categories={top10}
          colors={color}
          className="max-w-xs"
          // onClick={(v) => console.log(v)}
        />

        </div>

    

    {/* <p className='mt-2'>DONE: change chart to pie chart</p>
    <p className=''>will add later: lines of code, changes, etc can add more details</p>
    <p className=''>TODO: how spread around are the TF (identify risky areas)</p>
     */}

  </Card>
)};

export default TopAuthors;