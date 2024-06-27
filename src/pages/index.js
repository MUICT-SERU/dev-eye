import BarChartComponent from "../components/barChart";
import BarChartFutureCurrent  from "../components/barChart-tf-ft";
import ContributorFunnel  from "../components/contributors";
import RepoDetails from "../components/repoDetails";
import Settings from "../components/settings";
import TopAuthors  from "../components/topAurthors";
import { useEffect, useState } from 'react';

const mainPage = () => {
    const [authors, setAuthors] = useState([]);
    const [tf, setTf] = useState()
    const [topAuthors, setTopAuthors] = useState([])
    const [metaData, setMetaData] = useState([])
    
      useEffect(() => {
      fetch(`http://localhost:3000/api/data`)
      .then(res => res.json())
      .then(res => {
        setAuthors(res.normalized_authors)
        setTf(res.tf_data)
        setTopAuthors(res.top_authors)
        setMetaData(res.meta_data)
       
        // setData({
        //   labels: Object.keys(res),
        //   datasets: [
        //     {
        //       label: 'Current',
        //       data: Object.values(res).map(item => item.current ? item.current.length : 0),
        //       backgroundColor: 'rgba(75,192,192,0.6)',
        //     },
        //     {
        //       label: 'Future',
        //       data: Object.values(res).map(item => item.future ? item.future.length : 0),
        //       backgroundColor: 'rgba(153,102,255,0.6)',
        //     },
        //   ],
        // })
      }
        )
  }, [])
    return ( 
        <div className="fixed grid w-full grid-cols-3 grid-rows-2 gap-4 p-8 h-dvh">
            <div className="flex flex-row col-span-2 row-span-2 gap-2">
                {/* <Settings /> */}
                <RepoDetails authors={authors} metaData={metaData}/>
            </div>
            <div className="grid grid-rows-2 row-span-4 gap-4">
            <TopAuthors topAuthors={topAuthors} authors={authors}/>
            <ContributorFunnel tf={tf}  authors={authors}/>
            </div>

            <div className="grid grid-cols-2 col-span-2 gap-4">
                <BarChartComponent tf={tf}/>
                <BarChartFutureCurrent tf={tf} /> 
              
            </div>
        </div>
     );
}
 
export default mainPage;