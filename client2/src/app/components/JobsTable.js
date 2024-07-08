import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import axios from 'axios';

const JobTable = forwardRef((props, ref) => {
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/jobs");
            setJobs(response.data);
        } catch {
            console.error("Error fetching jobs");
        }
    };

    useImperativeHandle(ref, () => ({
        fetchJobs
    }));

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="container mt-5">
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Job Title</th>
                        <th scope="col">Company</th>
                        <th scope="col">Location</th>
                        <th scope="col">Pay</th>
                        <th scope="col">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job, index) => (
                        <tr key={index}>
                            <td>{job.job_title}</td>
                            <td>{job.company_name}</td>
                            <td>{job.location}</td>
                            <td>{job.pay_range}</td>
                            <td>
                                <a href={job.url} target="_blank" rel="noopener noreferrer">
                                    View Listing
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default JobTable;