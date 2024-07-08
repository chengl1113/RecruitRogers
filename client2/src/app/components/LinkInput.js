import React, { useState } from "react";

const LinkInput = ({ onSubmit }) => {

    const [link, setLink] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting");
        onSubmit(link);
        setLink('');
    }

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="jobLink">Job Listing Link</label>
                    <input
                        type="url"
                        className="form-control"
                        id="jobLink"
                        placeholder="Enter job listing link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default LinkInput;