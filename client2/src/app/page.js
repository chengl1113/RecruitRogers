"use client";
import './App.module.css';
import { useEffect, useState } from 'react';
import NavBar from './components/Navbar';
import LinkInput from './components/LinkInput';
import JobTable from './components/JobsTable';
import axios from 'axios';


function App() {
  const [jobs, setJobs] = useState([]);

  const handleLinkSubmit = async (link) => {
    try {
      const response = await axios.post("http://localhost:3000/api/scrape", {"url": link})
      const data = response.data
      const newJob = {
        title: data.job_title,
        company: data.company_name,
        location: data.location,
        pay: data.pay_range,
        link: data.url
      };
      setJobs(prevJobs => [...prevJobs, newJob]);
    }
    catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <NavBar />
      <LinkInput onSubmit={handleLinkSubmit} />
      <JobTable jobs={jobs} />
    </>
  );
}

export default App;