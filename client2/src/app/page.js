"use client";
import './App.module.css';
import { useEffect, useState } from 'react';
import NavBar from './components/Navbar';
import LinkInput from './components/LinkInput';
import JobTable from './components/JobsTable';
import Profile from './components/Profile';


function App() {
  const [jobs, setJobs] = useState([]);

  const handleLinkSubmit = (link) => {
    const newJob = {
      title: 'Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      pay: '1,000,000',
      link: link
    };
    setJobs(prevJobs => [...prevJobs, newJob]);
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