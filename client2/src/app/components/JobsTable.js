import React from "react";

const JobTable = ({ jobs }) => {
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
                            <td>{job.title}</td>
                            <td>{job.company}</td>
                            <td>{job.location}</td>
                            <td>{job.pay}</td>
                            <td>
                                <a href={job.link} target="_blank" rel="noopener noreferrer">
                                    View Listing
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobTable;