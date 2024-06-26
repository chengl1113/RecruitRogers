import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'
import NavBar from './components/Navbar'
import LinkInput from './components/LinkInput'
import JobTable from './components/JobsTable'

function App() {
  const [jobs, setJobs] = useState([]);

  const handleLinkSubmit = (link) => {
    // Fetch job details using the link (mock data here for demonstration)
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
  )
}

export default App