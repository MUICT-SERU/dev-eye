import { useEffect, useState } from 'react';
import { Card, List, ListItem, Title } from '@tremor/react';

export default function RepoDetails({authors={}, metaData}) {
  const [isOpen, setIsOpen] = useState(true);
  const contributors = Object.keys(authors)?.length

  const cities = [
    {
      label: 'Repository Name',
      rating: metaData?.repoName || '--'
    },
    {
      label: 'Analysis Start Date',
      rating: metaData?.created_date || '--'
    },
    {
      label: 'Analysis End Date',
      rating: metaData?.updated_date || '--'
    },
    {
      label: 'Number of Commits',
      rating: metaData?.numberOfCommits || '--'
    },
    {
      label: 'Number of Contributors',
      rating: contributors,
    },
]


  return (
      <Card className='row-span-2'>


        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">DEV-EYE: </p>
      <p className="text-3xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Analytic Report</p>
        <div className='mt-4'>
 



        <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Repository Details</h3>
            <List className="">
                {cities?.map((item) => (
                <ListItem key={item.label}>
                    <span>{item.label}</span>
                    <span>{item.rating}</span>
                </ListItem>
                ))}
            </List>

            
        </div>
      
        
      </Card>
  )
  
}