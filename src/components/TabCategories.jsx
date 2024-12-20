/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import useAxios from "../hooks/useAxios";
import JobCard from "./JobCard";

const TabCategories = () => {
  const { data, axiosInstance } = useAxios();
  const [category, setCategory] = useState("Web Development");

  useEffect(() => {
    fetchingHandle(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);
  const fetchingHandle = async (category) => {
    await axiosInstance("get", `/jobs?category=${category}`);
  };

  return (
    <Tabs>
      <div className=" container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl ">
          Browse Jobs By Categories
        </h1>

        <p className="max-w-2xl mx-auto my-6 text-center text-gray-500 ">
          Three categories available for the time being. They are Web
          Development, Graphics Design and Digital Marketing. Browse them by
          clicking on the tabs below.
        </p>
        <div className="flex items-center justify-center">
          <TabList>
            <Tab>
              <button onClick={() => setCategory("Web Development")}>
                Web Development
              </button>
            </Tab>
            <Tab>
              <button onClick={() => setCategory("Graphics Design")}>
                Graphics Design
              </button>
            </Tab>
            <Tab>
              <button onClick={() => setCategory("Digital Marketing")}>
                Digital Marketing
              </button>
            </Tab>
          </TabList>
        </div>
        <TabPanel>
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.data.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </TabPanel>

        <TabPanel>
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.data.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </TabPanel>

        <TabPanel>
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.data.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </TabPanel>
      </div>
    </Tabs>
  );
};

export default TabCategories;
