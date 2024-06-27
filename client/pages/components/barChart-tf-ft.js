import { BarChart, Card } from '@tremor/react';
import { useState } from 'react';

const chartdata = [
  {
    name: '2021',
    'Current Bus Factor': 2,
    'Potential Bus Factor ': 1,
  },
  {
    name: '2022',
    'Current Bus Factor': 3,
    'Potential Bus Factor ': 0,
  },
  {
    name: '2023',
    'Current Bus Factor': 3,
    'Potential Bus Factor ': 2,
  },
  {
    name: '2024',
    'Current Bus Factor': 2,
    'Potential Bus Factor ': 1,
  },
];

const dataFormatter = (number) =>
  Intl.NumberFormat('us').format(number).toString();

export default function BarChartFutureCurrent({tf}) {
  const [value, setValue] = useState(null);
  
  const potentialBusFactor = tf?.future_tf.length;
  const currentBusFactor = tf?.truckFactor.length;

  const chartData=[
    {
      name: '2024',
      tf_list:tf?.truckFactor,
      future_tf: tf?.future_tf,
      'Current Bus Factor': currentBusFactor,
      'Potential Bus Factor ': potentialBusFactor,
    },
  ]

  
  return (
    <Card className=''>
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Current & Potential Bus Factor 
      </h3>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          The chart bellow shows the current and the Potential (future bus factor)
        </p>

        <div className='flex flex-row items-center'>
        <BarChart
          className="mt-6"
          data={chartData}
          index="name"
          minValue={0}
          allowDecimals={false}
          categories={[
            'Current Bus Factor',
            'Potential Bus Factor ',
          ]}
          colors={['blue', 'amber', 'amber', 'rose', 'indigo', 'emerald']}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
          onValueChange={(v) => setValue(v)}
          stack={true}

        />
      {value &&<CodeBlock
          source={value}
          chartData={chartData}
          variant="empty"
          className="mt-8"
        /> }
          
        </div>
    </Card>
  );
}


const CodeBlock = ({source}) => {
  console.log(source?.tf_list)
 
  return ( 
    <div className='flex flex-col gap-2 min-w-[7rem]'>
    <div className='text-xs'>
      <p className='font-semibold text-blue-500'>Current TF: </p>
      {source?.tf_list?.map((item, index) => (
      <span>{index+1}. {item}</span>
      ))}
      
    </div>
    <div className='text-xs'>
      <p className='font-semibold text-amber-500'>Future TF: </p>
      {source?.future_tf?.map((item, index) => (
      <span>{index+1}. {item}</span>
      ))}
      
    </div>
    </div>
   );
}
 
