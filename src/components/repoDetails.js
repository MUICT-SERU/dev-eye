import { useEffect, useState } from "react";
import { Card, List, ListItem, Title } from "@tremor/react";

export default function RepoDetails({ authors = {}, metaData, year }) {
  const contributors = Object.keys(authors?.[year] || [])?.length;

  console.log(metaData?.created_date);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  console.log(formatDate(metaData?.created_date));

  const cities = [
    {
      label: "Repository Name",
      rating: metaData?.repoName || "--",
    },
    {
      label: "Analysis Start - End Date",
      rating: `${formatDate(metaData?.created_date)} - ${formatDate(metaData?.updated_date)}` || "--",
    },
    // {
    //   label: 'Analysis End Date',
    //   rating: formatDate(metaData?.updated_date) || '--'
    // },
    {
      label: "Number of Commits",
      rating: metaData?.numberOfCommits || "--",
    },
    {
      label: "Number of Contributors",
      rating: contributors,
    },
  ];

  return (
    <div className="col-span-2 border p-4">
      <p className="text-4xl font-semibold text-blue-500 ">DEV-EYE: Analytic Report</p>

      <h3 className="mt-4 font-medium text-tremor-content-strong">Repository Details</h3>
      <List className="">
        {cities?.map((item) => (
          <ListItem key={item.label}>
            <span>{item.label}</span>
            <span>{item.rating}</span>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
