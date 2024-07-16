import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from "react";
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons CSS
import EditJobModal from './EditJobModal';

const JobTable = forwardRef((props, ref) => {
    const [jobs, setJobs] = useState([]);
    const modalRef = useRef();

    const fetchJobs = async () => {
        try {
            const response = await axios.get("http://54.221.28.111:3000/api/jobs");
            setJobs(response.data);
        } catch {
            console.error("Error fetching jobs");
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    useImperativeHandle(ref, () => ({
        fetchJobs
    }));

    const handleEditClick = (job) => {
        modalRef.current.openModal(job);
    };

    const handleJobUpdate = (updatedJob) => {
        setJobs((prevJobs) =>
            prevJobs.map((job) =>
                job.id === updatedJob.id ? updatedJob : job
            )
        );
    };

    return (
        <div className="container mt-5">
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th scope='col'>#</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Company</th>
                        <th scope="col">Location</th>
                        <th scope="col">Pay</th>
                        <th scope="col">Link</th>
                        <th scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.sort((a, b) => b.id - a.id).map((job, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{job.job_title}</td>
                            <td>{job.company_name}</td>
                            <td>{job.location}</td>
                            <td>{job.pay_range}</td>
                            <td>
                                <a href={job.url} target="_blank" rel="noopener noreferrer">
                                    View Listing
                                </a>
                            </td>
                            <td className="d-flex justify-content-center align-items-center">
                                <button onClick={() => handleEditClick(job)}>
                                    <i className="bi bi-pen"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <EditJobModal ref={modalRef} onJobUpdate={handleJobUpdate} />
        </div>
    );
});

export default JobTable;
