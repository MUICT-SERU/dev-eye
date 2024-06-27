"use client";

import { useEffect, useState } from 'react';
import { Line, Bar, BarChart} from 'react-chartjs-2';
import "chart.js/auto";

export default function Home() {
  const [chartData, setData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const items = [
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.pdf',
    '.gif',
    'dist',
    'build',
    'package-lock.json',
    'yarn.lock',
  ];

  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setSelectedItems(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };
  // useEffect(() => {
  //     fetch(`http://localhost:3000/api/data`)
  //     .then(res => res.json())
  //     .then(res => {
  //       console.log(res)
  //       setData({
  //         labels: Object.keys(res),
  //         datasets: [
  //           {
  //             label: 'Current',
  //             data: Object.values(res).map(item => item.current ? item.current.length : 0),
  //             backgroundColor: 'rgba(75,192,192,0.6)',
  //           },
  //           {
  //             label: 'Future',
  //             data: Object.values(res).map(item => item.future ? item.future.length : 0),
  //             backgroundColor: 'rgba(153,102,255,0.6)',
  //           },
  //         ],
  //       })
  //     }
  //       )
  // }, [])


  // TODO:
  // STACKED BAR CHART (Tf + f_tf)
  
  const handleSubmit = async() => {
    fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selectedItems), 
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data)
  }
    
    )
  .catch((error) => {
    console.error('Error:', error);
  });
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Truck Factor',
      },
    },
    scales: {
      x: {  // Define the x-axis
        type: 'category',
        beginAtZero: true,
      },
      y: {  // Define the y-axis
        beginAtZero: true,
        ticks: {
          // Include a callback function that returns null for decimal values
          callback: function(value) {
            if (value % 1 === 0) {
              return value;
            }
          }
        }
      },
    },
  };

  

  return (

    <div className='flex flex-col gap-4 p-40 h-svh'>

      <div>
{/* {chartData &&
  <Line options={options} data={chartData} />
} */}

        
      {chartData &&
          <Bar
          className='w-full h-full'
            data={chartData}
          options={{
            
            plugins: {
              legend: {
                display: true,
                position: 'right',
              },
            },
            scales: {
              x: {  // Define the x-axis
                type: 'category',
                beginAtZero: true,
                stacked: true,
              },
              y: {  // Define the y-axis
                beginAtZero: true,
                stacked: true,
                ticks: {
                  // Include a callback function that returns null for decimal values
                  callback: function(value) {
                    if (value % 1 === 0) {
                      return value;
                    }
                  }
                }
              },
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  const currentData = context.parsed.y;
                  label += currentData;
                  return label;
                },
                afterBody: function(context) {
                  const dataIndex = context[0].dataIndex;
                  console.log(dataIndex, "dataIndex")
                  const currentContent = chartData.datasets[0].data[dataIndex];
                  return 'Content: ' + currentContent;
                }
              }
            },
          }}
          
          />
        }
      </div>

      {/* <div>
      <form className='grid grid-cols-7'>
      {items.map((item, index) => (
        <div key={index} className="mb-3">
          <label>
            <input
              type="checkbox"
              value={item}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            {item}
          </label>
        </div>
      ))}
    </form>
      <button onClick={handleSubmit} type="button" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
        Submit
      </button>
      </div> */}
    </div>
  )
}


// const test = {
//   grouped: {
//     "2024-Jan-Jun": [
//       {
//         hash: "b1f4bf0a1841a1cc4b10e323168a56637079eb59",
//         date: "2024-01-10T21:53:56+07:00",
//         author: "khazifire",
//         email: "73513866+khazifire@users.noreply.github.com",
//         file: "bin/index.js",
//         insertions: 41,
//         deletions: 8,
//       },
//       {
//         hash: "b1f4bf0a1841a1cc4b10e323168a56637079eb59",
//         date: "2024-01-10T21:53:56+07:00",
//         author: "khazifire",
//         email: "73513866+khazifire@users.noreply.github.com",
//         file: "bin/lib/index.js",
//         insertions: 452,
//         deletions: 0,
//       },
//       {
//         hash: "b1f4bf0a1841a1cc4b10e323168a56637079eb59",
//         date: "2024-01-10T21:53:56+07:00",
//         author: "khazifire",
//         email: "73513866+khazifire@users.noreply.github.com",
//         file: "bin/public/index.html",
//         insertions: 5,
//         deletions: 30,
//       },
//       {
//         hash: "b1f4bf0a1841a1cc4b10e323168a56637079eb59",
//         date: "2024-01-10T21:53:56+07:00",
//         author: "khazifire",
//         email: "73513866+khazifire@users.noreply.github.com",
//         file: "package.json",
//         insertions: 7,
//         deletions: 1,
//       },
//       {
//         hash: "4a23193054faa641c63a49e323b69290d3d59291",
//         date: "2024-01-15T22:28:54+07:00",
//         author: "khazifire",
//         email: "73513866+khazifire@users.noreply.github.com",
//         file: "bin/lib/index.js",
//         insertions: 489,
//         deletions: 0,
//       },
//     ],
//   },
//   overall: [
//     {
//       hash: "b1f4bf0a1841a1cc4b10e323168a56637079eb59",
//       date: "2024-01-10T21:53:56+07:00",
//       author: "khazifire",
//       email: "73513866+khazifire@users.noreply.github.com",
//       file: "bin/index.js",
//       insertions: 41,
//       deletions: 8,
//     },
//     {
//       hash: "b1f4bf0a1841a1cc4b10e323168a56637079eb59",
//       date: "2024-01-10T21:53:56+07:00",
//       author: "khazifire",
//       email: "73513866+khazifire@users.noreply.github.com",
//       file: "bin/lib/index.js",
//       insertions: 452,
//       deletions: 0,
//     },
//     {
//       hash: "b1f4bf0a1841a1cc4b10e323168a56637079eb59",
//       date: "2024-01-10T21:53:56+07:00",
//       author: "khazifire",
//       email: "73513866+khazifire@users.noreply.github.com",
//       file: "bin/public/index.html",
//       insertions: 5,
//       deletions: 30,
//     },
//     {
//       hash: "b1f4bf0a1841a1cc4b10e323168a56637079eb59",
//       date: "2024-01-10T21:53:56+07:00",
//       author: "khazifire",
//       email: "73513866+khazifire@users.noreply.github.com",
//       file: "package.json",
//       insertions: 7,
//       deletions: 1,
//     },
//     {
//       hash: "4a23193054faa641c63a49e323b69290d3d59291",
//       date: "2024-01-15T22:28:54+07:00",
//       author: "khazifire",
//       email: "73513866+khazifire@users.noreply.github.com",
//       file: "bin/lib/index.js",
//       insertions: 489,
//       deletions: 0,
//     },
//   ],
// };

