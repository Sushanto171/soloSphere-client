import axios from "axios";
import { useState } from "react";
const axiosUrl = axios.create({
  baseURL: "http://localhost:9000",
  withCredentials: true,
});
const useAxios = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosInstance = async (method = "get", endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosUrl[method.toLowerCase()](endpoint, options);
      setData(res.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, axiosInstance };
};

export default useAxios;
