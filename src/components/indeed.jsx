import React, { useState, useEffect } from "react";
import { getIndeedData, keywordData, GetKeywords } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSync, faDownload, faPlus, faClose } from "@fortawesome/free-solid-svg-icons";
import { writeFile, utils } from "xlsx"; // For Excel download
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { createObjectCsvWriter } from "csv-writer"; // For CSV download

const Indeed = () => {
    const [indeed_data, setIndeed_Data] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [dateFilter, setDateFilter] = useState("all");
    const [keywordFilter, setKeywordFilter] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState([]); // State for selected keywords
    const [showKeywordModal, setShowKeywordModal] = useState(false); // State for controlling the keyword modal
    const [keywordInput, setKeywordInput] = useState(""); // State for keyword input


    // Function to open the modal with job details
    const openModal = (job) => {
        setSelectedJob(job);
    };

    // Function to close the modal
    const closeModal = () => {
        setSelectedJob(null);
    };

    // Function to refresh the data
    const refreshData = async () => {
        let response = await getIndeedData();
        setIndeed_Data(response);
    };

    // Filter jobs based on the date posted and keywords
    const filterJobs = (jobs) => {
        const currentDate = new Date();
        let filteredJobs = jobs;

        // Filter by date
        switch (dateFilter) {
            case "7":
                filteredJobs = filteredJobs.filter((job) => {
                    const jobDate = new Date(job.date_posted);
                    const diffTime = currentDate - jobDate;
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);
                    return diffDays <= 7;
                });
                break;
            case "30":
                filteredJobs = filteredJobs.filter((job) => {
                    const jobDate = new Date(job.date_posted);
                    const diffTime = currentDate - jobDate;
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);
                    return diffDays <= 30;
                });
                break;
            default:
                break;
        }

        // Filter by keywords
        if (keywordFilter) {
            filteredJobs = filteredJobs.filter((job) =>
                job.title.toLowerCase().includes(keywordFilter.toLowerCase()) ||
                job.company.toLowerCase().includes(keywordFilter.toLowerCase()) ||
                job.keywords?.toLowerCase().includes(keywordFilter.toLowerCase())
            );
        }

        return filteredJobs;
    };

    // Apply filters to the data
    const filteredData = filterJobs(indeed_data);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Total Pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);


    const downloadExcel = () => {
        if (!filteredData || filteredData.length === 0) {
            alert("No data available for download.");
            return;
        }

        // Define the structure of the Excel file with the additional columns
        const formattedData = filteredData.map(row => ({
            "Job Title": row.title,
            "Company": row.company,
            "Company Website": row.company_url_direct || "Not Provided",
            "Company employees": row.company_num_employees || "Not Provided",
            "Company Revenue": row.company_revenue || "Not Provided",
            "Job Type": row.job_type || "Not Provided",
            "Interval": row.interval || "Not Provided",
            "Remote Job": row.is_remote ? "Yes" : "No",
            "Job URL": row.job_url,
            "Job Actual URL": row.job_url_direct,
            "Location": row.location,
            "Currency": row.currency,
            "Salary": row.min_amount && row.max_amount
                ? `$${row.min_amount} - $${row.max_amount} ${row.currency || "USD"}`
                : "Not Provided",
            "Date Posted": new Date(row.date_posted).toLocaleDateString(),
            "Company Description": row.company_description,  // New column for Company Description
            "Keywords": row.keywords,  // New column for Keywords
        }));

        // Convert JSON data to an Excel sheet
        const worksheet = utils.json_to_sheet(formattedData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Jobs");

        // Trigger file download
        writeFile(workbook, "filtered_jobs.xlsx");
        alert("Excel file downloaded successfully!");
    };

    // Function to add a keyword
    const addKeyword = () => {
        const trimmedKeyword = keywordInput.trim();
        if (trimmedKeyword) {
            if (selectedKeywords.includes(trimmedKeyword)) {
                // Show toast if keyword already exists
                toast.error((`Keyword already exist`), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                // Add keyword if it's not already in the list
                setSelectedKeywords([...selectedKeywords, trimmedKeyword]);
                const updatedKeywords = [...selectedKeywords, trimmedKeyword].join('|');
                keywordData(updatedKeywords);
                setKeywordInput("");
            }
        }
    };


    // Function to render keywords as capsules
    const renderKeywords = () => {
        const sortedKeywords = [...selectedKeywords].sort();

        return sortedKeywords.map((keyword, index) => (
            <div
                key={index}
                className="inline-flex items-center px-3 py-1 m-1 bg-[#517028] text-white rounded-full text-sm"
            >
                {keyword}
                <button
                    onClick={() => removeKeyword(index)}
                    className="ml-2 text-white hover:text-gray-200"
                >
                    <FontAwesomeIcon icon={faClose} />
                </button>

            </div>
        ));
    };
    // Function to remove a keyword
    const removeKeyword = (index) => {
        const updatedKeywords = selectedKeywords.filter((_, i) => i !== index);
        setSelectedKeywords(updatedKeywords);
    };

    useEffect(() => {
        const getdata = async () => {
            let response = await getIndeedData();
            setIndeed_Data(response);
        };
        const getKeywords = async () => {
            let responseData = await GetKeywords();
            // setSelectedKeywords(resposeData.keywords.split('|'));
            console.log('keywords from db', responseData[0].key_words);
            const keywordsArray = responseData[0].key_words.split('|');
            console.log('Keywords as array:', keywordsArray);
            setSelectedKeywords(keywordsArray);
        }
        getdata();
        getKeywords();
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-end pb-10">
            {/* Filter and Refresh Container */}
            <div className="mb-4 flex items-center space-x-4">
                {/* Date Filter Dropdown */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="dateFilter" className="text-sm">Filter by Date: </label>
                    <select
                        id="dateFilter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-2 py-1 border border-[#517028] rounded-lg text-sm"
                    >
                        <option value="all">All</option>
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                    </select>
                </div>

                {/* Keyword Search Input */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="keywordFilter" className="text-sm">Search Keywords:</label>
                    <input
                        id="keywordFilter"
                        type="text"
                        value={keywordFilter}
                        onChange={(e) => setKeywordFilter(e.target.value)}
                        placeholder="Enter keywords"
                        className="px-2 py-1 border border-[#517028] rounded-lg text-sm"
                    />
                </div>

                {/* Refresh Button */}
                <button
                    onClick={refreshData}
                    className="px-2 py-1 bg-[#517028] text-white rounded-lg hover:bg-[#415a20]"
                >
                    <FontAwesomeIcon icon={faSync} />
                </button>

                <button
                    onClick={downloadExcel}
                    className="px-2 py-1 bg-[#517028] text-white rounded-lg hover:bg-[#415a20]"
                >
                    <FontAwesomeIcon icon={faDownload} /> Excel
                </button>
                <button
                    onClick={() => setShowKeywordModal(true)}
                    className="px-2 py-1 bg-[#517028] text-white rounded-lg hover:bg-[#415a20]"
                >
                    <FontAwesomeIcon icon={faEdit} /> Keywords
                </button>
            </div>

            {/* Table Container */}
            <div className="w-full px-5 h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            {/* Headers */}
                            <th className="sticky top-0 py-2 text-white bg-[#517028] rounded-tl-lg min-w-[80px] z-10">Job Title</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028] min-w-[80px] z-10">Company</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028] min-w-[80px] z-10">Location</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028] min-w-[80px] z-10">Salary</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028] min-w-[80px] z-10">Date Posted</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028] min-w-[80px] z-10">Key Word</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028] rounded-tr-lg min-w-[80px] z-10">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((job, index) => (
                            <React.Fragment key={job.id || index}>
                                <tr className="text-black bg-white even:bg-gray-100 ">
                                    {/* Job Title */}
                                    <td className="px-9 py-2 font-medium truncate" title={job.title}>
                                        {job.title}
                                    </td>

                                    {/* Company */}
                                    <td className="px-8 py-2 truncate" title={job.company}>
                                        {job.company}
                                    </td>

                                    {/* Location */}
                                    <td className="px-8 py-2 truncate" title={job.location}>
                                        {job.location}
                                    </td>

                                    {/* Salary */}
                                    <td className="px-8 py-2 truncate">
                                        {job.min_amount && job.max_amount
                                            ? `$${job.min_amount} - $${job.max_amount} ${job.currency || "USD"}`
                                            : "Not Provided"}
                                    </td>

                                    {/* Date Posted */}
                                    <td className="px-8 py-2 truncate">
                                        {new Date(job.date_posted).toLocaleDateString()}
                                    </td>

                                    {/* Keywords */}
                                    <td className="px-8 py-2 truncate">
                                        {job.keywords}
                                    </td>

                                    {/* Actions (Eye Button) */}
                                    <td className="px-9">
                                        <button
                                            onClick={() => openModal(job)}
                                            className="text-[#415a20] hover:text-[#517028]"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="7" className="border-b border-[#517028]"></td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-[#517028] text-white rounded hover:bg-[#415a20] disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-4 py-2 mx-1 ${currentPage === page ? "bg-[#415a20]" : "bg-[#517028]"
                            } text-white rounded hover:bg-[#415a20]`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-[#517028] text-white rounded hover:bg-[#415a20] disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

            {/* Modal for Detailed Job Information */}
            {selectedJob && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
                        <h2 className="text-xl font-bold mb-4">{selectedJob.title}</h2>
                        <div className="space-y-2">
                            <p><strong>Company:</strong> {selectedJob.company}</p>
                            <p><strong>Company Website:</strong> {selectedJob.company_url_direct || "Not Provided"}</p>
                            <p><strong>Company employees:</strong> {selectedJob.company_num_employees || "Not Provided"}</p>
                            <p><strong>Location:</strong> {selectedJob.location}</p>
                            <p><strong>Salary:</strong> {selectedJob.min_amount && selectedJob.max_amount
                                ? `$${selectedJob.min_amount} - $${selectedJob.max_amount} ${selectedJob.currency || "USD"}`
                                : "Not Provided"}</p>
                            <p><strong>Company Revenue:</strong> {selectedJob.company_revenue || "Not Provided"}</p>
                            <p><strong>Job Type:</strong> {selectedJob.job_type || "Not Provided"}</p>
                            <p><strong>Interval:</strong> {selectedJob.interval || "Not Provided"}</p>
                            <p><strong>Remote Job:</strong> {selectedJob.is_remote ? "Yes" : "No"}</p>
                            <p><strong>Job URL:</strong>{" "}
                                <a
                                    href={selectedJob.job_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#415a20] hover:underline"
                                >
                                    View Job <FontAwesomeIcon icon={faExternalLinkAlt} />
                                </a>
                            </p>
                            <p><strong>Job Actual URL:</strong>{" "}
                                <a
                                    href={selectedJob.job_url_direct}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#415a20] hover:underline"
                                >
                                    View Job <FontAwesomeIcon icon={faExternalLinkAlt} />
                                </a>
                            </p>
                        </div>
                        <button
                            onClick={closeModal}
                            className="mt-4 px-4 py-2 bg-[#517028] text-white rounded hover:bg-[#415a20]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* Modal for Viewing and Editing Keywords */}
            {showKeywordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl relative">
                        {/* Close button moved to the top-right corner */}
                        <button
                            onClick={() => setShowKeywordModal(false)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl"
                        >
                            <FontAwesomeIcon icon={faClose} />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">Add Keywords</h2>
                        <div className="mb-4">{renderKeywords()}</div>
                        <div className="flex items-center space-x-2 mb-4">
                            <input
                                type="text"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                className="w-3/4 px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter keyword"
                            />
                            <button
                                onClick={addKeyword}
                                className="bg-[#517028] text-white p-2 rounded-lg hover:bg-[#415a20] flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <ToastContainer /> {/* Toast container to display toasts */}
        </div>
    );
};

export default Indeed;