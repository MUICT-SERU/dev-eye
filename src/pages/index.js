import BarChartComponent from "../components/barChart";
import BarChartFutureCurrent from "../components/barChart-tf-ft";
import ContributorFunnel from "../components/contributors";
import RepoDetails from "../components/repoDetails";
import TopAuthors from "../components/topAurthors";
import { useEffect, useState } from "react";

const mainPage = () => {
  const [authors, setAuthors] = useState([]);
  const [tf, setTf] = useState();
  const [topAuthors, setTopAuthors] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/data`)
      .then((res) => res.json())
      .then((res) => {
        setAuthors(res.normalized_authors);
        setTf(res.tf_data);
        setYears(Object.keys(res.tf_data));
        setTopAuthors(res.top_authors);
        setMetaData(res.meta_data);
      });
  }, []);

  return (
    <div className="fixed  h-dvh  w-full ">
      <div className="grid grid-cols-3 grid-rows-2 gap-2 p-4">
        <RepoDetails authors={authors} metaData={metaData} year={years[years?.length - 1]} />
        <ContributorFunnel tf={tf} authors={authors} year={years[years?.length - 1]} />

        <TopAuthors topAuthors={topAuthors} authors={authors} year={years[years?.length - 1]} />

        <div className="col-span-2 row-span-1 grid grid-cols-2 gap-2">
          <BarChartComponent tf={tf} years={years} />
          <BarChartFutureCurrent tf={tf} years={years} />
        </div>
      </div>
    </div>
  );
};

export default mainPage;
