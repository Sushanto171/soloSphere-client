/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import { compareAsc, format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import useAuth from "./../hooks/useAuth";

const JobDetails = () => {
  const { data: job } = useLoaderData();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const { axiosInstance, data: message } = useAxios();
  const navigate = useNavigate();

  const formHandle = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target).entries();
    const data = {};
    for (const [key, value] of formData) {
      data[key] = value;
    }
    // data inject for bids object
    data.delivery_date = format(new Date(startDate), "P");
    data.status = "Pending";
    data.job_id = job._id;

    // validate
    const deadline = compareAsc(new Date(job.deadline), new Date(startDate));
    if (deadline === 1) return toast.error("The deadline has passed!");
    if (parseInt(job.min_price) > parseInt(data.price))
      return toast.error(`The price must be at least ${job.min_price}.`);
    if (job.email === data.employer_email)
      return toast.error("You cannot place a bid on your own job");

    await axiosInstance("post", "/bids", data);
    if (message?.message === "Employer already attend this bid") {
      return toast.error(message?.message);
    } else if (message?.message === "bid request success") {
      toast.success(message?.message);
      navigate("/my-bids");
    }
  };
  if (job)
    return (
      <div className="flex flex-col md:flex-row justify-around gap-5  items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto ">
        {/* Job Details */}
        <div className="flex-1  px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-light text-gray-800 ">
              Deadline: {format(new Date(job?.deadline), "P")}
            </span>
            <span className="px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full ">
              {job.category}
            </span>
          </div>

          <div>
            <h1 className="mt-2 text-3xl font-semibold text-gray-800 ">
              {job.job_title}
            </h1>

            <p className="mt-2 text-lg text-gray-600 ">{job.description}</p>
            <p className="mt-6 text-sm font-bold text-gray-600 ">
              Buyer Details:
            </p>
            <div className="flex items-center gap-5">
              <div>
                <p className="mt-2 text-sm  text-gray-600 ">
                  Name: {job?.name}
                </p>
                <p className="mt-2 text-sm  text-gray-600 ">
                  Email: {job?.email}
                </p>
              </div>
              <div className="rounded-full object-cover overflow-hidden w-14 h-14">
                <img referrerPolicy="none" src={job?.photo} alt="" />
              </div>
            </div>
            <p className="mt-6 text-lg font-bold text-gray-600 ">
              Range: ${job.min_price} - ${job.max_price}
            </p>
          </div>
        </div>
        {/* Place A Bid Form */}
        <section className="p-6 w-full  bg-white rounded-md shadow-md flex-1 md:min-h-[350px]">
          <h2 className="text-lg font-semibold text-gray-700 capitalize ">
            Place A Bid
          </h2>

          <form onSubmit={formHandle}>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label className="text-gray-700 " htmlFor="price">
                  Price
                </label>
                <input
                  id="price"
                  type="text"
                  name="price"
                  required
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
                />
              </div>

              <div>
                <label className="text-gray-700 " htmlFor="emailAddress">
                  Email Address
                </label>
                <input
                  readOnly
                  id="emailAddress"
                  type="email"
                  name="employer_email"
                  defaultValue={user?.email}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
                />
              </div>

              <div>
                <label className="text-gray-700 " htmlFor="comment">
                  Comment
                </label>
                <input
                  id="comment"
                  name="comment"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="text-gray-700">Deadline</label>

                {/* Date Picker Input Field */}
                <DatePicker
                  className="border p-2 rounded-md"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              >
                Place Bid
              </button>
            </div>
          </form>
        </section>
      </div>
    );
};

export default JobDetails;
