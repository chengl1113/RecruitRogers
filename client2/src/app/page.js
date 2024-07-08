"use client";
import './App.module.css';
import { useEffect, useState, useRef } from 'react';
import NavBar from './components/Navbar';
import LinkInput from './components/LinkInput';
import JobTable from './components/JobsTable';
import axios from 'axios';


function App() {

  const jobTableRef = useRef(null);

  const handleLinkSubmit = async (link) => {
    try {
      await axios.post("http://localhost:3000/api/scrape", {"url": link})
      if (jobTableRef.current) {
        jobTableRef.current.fetchJobs();
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <NavBar />
      <LinkInput onSubmit={handleLinkSubmit} />
      <JobTable ref={jobTableRef} />
    </>
  );
}

export default App;