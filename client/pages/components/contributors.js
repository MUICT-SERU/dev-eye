
import { DonutChart, Card,Legend } from '@tremor/react';
import { useState } from 'react';




export default function ContributorFunnel({authors={}, tf}) {
  const [value, setValue] = useState(null);

  const contributors = Object.keys(authors)?.length;
  const potentialBusFactor = tf?.future_tf.length || 0;
  const currentBusFactor = tf?.truckFactor.length || 0;
  
  const chartData = [
    { name: 'Contributors', value: contributors - potentialBusFactor - currentBusFactor},
    { name: 'Potential Bus Factor', value: potentialBusFactor },
    {name: 'Current Bus Factor',value: currentBusFactor},
  ];

  return (
    <Card>
        <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Overall Contributors
      </h3>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
         The chart bellow shows the overall contributors 
        </p>
    
        <div className="flex items-center justify-center space-x-6 mt-7">
        <DonutChart
          data={chartData}
          category="value"
          index="name"
          variant="pie"
          // valueFormatter={valueFormatter}
          colors={['cyan', 'amber', 'blue']}
          className="w"
          onValueChange={(v) => setValue({name:v?.name,value:v?.value})}
        />
        <Legend
          categories={['Contributors', 'Potential Bus Factor', 'Current Bus Factor']}
          colors={['cyan', 'amber', 'blue']}
          className="max-w-xs"
        />

        <div>
        {/* {JSON.stringify(value, null, 2)} */}
        </div>
      </div>
    </Card>
  );
}