"use client"
import JobTable from "../components/JobsTable";

function JobsPage() {
    return (
        <div>
            <h1 className="text-center mt-3">Current Jobs</h1>
            <JobTable/>
        </div>
    );
}

export default JobsPage;