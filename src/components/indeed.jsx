import React, { useState, useEffect } from "react";
import { getIndeedData, keywordData, GetKeywords, IndeedScraper } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSync, faDownload, faPlus, faClose, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { writeFile, utils } from "xlsx"; // For Excel download
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main styles
import "react-date-range/dist/theme/default.css"; // Theme styles
import { format } from "date-fns";

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
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateRange, setDateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: "selection",
        },
    ]);

    const [showPicker, setShowPicker] = useState(false);


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
        let indeed_data = await IndeedScraper();
        console.log("indeed_data", indeed_data);
        toast.success(`${indeed_data.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        const getData = async () => {
            let response = await getIndeedData();
            setIndeed_Data(response);
        };
        getData();
    };

    const filterJobs = (jobs) => {
        let filteredJobs = jobs;

        // Filter by date range
        if (dateRange[0].startDate && dateRange[0].endDate) {
            filteredJobs = filteredJobs.filter((job) => {
                const jobDate = new Date(job.date_posted);
                return (
                    jobDate >= dateRange[0].startDate &&
                    jobDate <= dateRange[0].endDate
                );
            });
        }

        // Filter by keywords
        if (keywordFilter) {
            filteredJobs = filteredJobs.filter(
                (job) =>
                    // job.title?.toLowerCase().includes(keywordFilter.toLowerCase()) ||
                    // job.company?.toLowerCase().includes(keywordFilter.toLowerCase()) ||
                    (job.keywords && job.keywords.toLowerCase().includes(keywordFilter.toLowerCase()))
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
            // alert("No data available for download.");
            toast.info("No data available for download.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
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
        // alert("Excel file downloaded successfully!");
        toast.info("Excel file downloaded successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };
    // Function to add a keyword
    const addKeyword = () => {
        const trimmedKeyword = keywordInput.trim();
        if (trimmedKeyword) {
            if (selectedKeywords.includes(trimmedKeyword)) {
                // Show toast if keyword already exists
                toast.error("Keyword already exists!", {
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
                const updatedKeywords = [...selectedKeywords, trimmedKeyword];
                setSelectedKeywords(updatedKeywords); // Update state with new keyword
                const keywordsString = updatedKeywords.join("|"); // Join array into a string
                keywordData(keywordsString); // Call your API with the updated keyword string
                setKeywordInput(""); // Clear input field
            }
        }
    };

    // Function to render keywords as capsules
    const renderKeywords = () => {

        return selectedKeywords.map((keyword, index) => (
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
        const keywordsString = updatedKeywords.join("|"); // Re-join the updated list
        keywordData(keywordsString); // Call your API with the updated keyword string
    };

    // Fetch data on component mount
    useEffect(() => {
        const getData = async () => {
            let response = await getIndeedData();
            setIndeed_Data(response);
        };

        const getKeywords = async () => {
            let responseData = await GetKeywords();
            console.log("keywords from db", responseData[0].key_words);
            const keywordsArray = responseData[0].key_words.split("|");
            console.log("Keywords as array:", keywordsArray);
            setSelectedKeywords(keywordsArray);
        };

        getData();
        getKeywords();
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-end pb-10">
            {/* Filter and Refresh Container */}
            <div className="mb-4 flex items-center space-x-4">
                {/* Date Filter Dropdown */}

                <div className="flex flex-col space-y-4 relative z-50">
                    {/* Date Range Picker */}
                    <div className="relative">
                        {/* <label className="block  text-sm font-medium text-gray-700">Date Range</label> */}
                        <button
                            onClick={() => setShowPicker(!showPicker)}
                            className="border border-[#517028] px-3 py-2 rounded-lg w-full bg-white text-left text-gray-400"
                        >
                            {dateRange[0].startDate && dateRange[0].endDate
                                ? `${format(dateRange[0].startDate, "MM/dd/yyyy")} - ${format(dateRange[0].endDate, "MM/dd/yyyy")}`
                                : "Select a date range"}
                        </button>

                        {showPicker && (
                            <div className="absolute -mt-[2px] bg-white p-2 shadow-lg border border-[#517028] rounded-lg z-50">
                                <DateRange
                                    ranges={dateRange}
                                    onChange={(item) => setDateRange([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    rangeColors={["#517028"]}
                                    className="rounded-lg"
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => setShowPicker(false)}
                                        className="px-4 py-2 bg-[#517028] text-white rounded-lg hover:bg-[#415a20]"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Keyword Search Input */}
                <div className="flex items-center space-x-6">
                    {/* <label htmlFor="keywordFilter" className="text-sm">Search Keywords:</label> */}
                    <input
                        id="keywordFilter"
                        type="text"
                        value={keywordFilter}
                        onChange={(e) => setKeywordFilter(e.target.value)}
                        placeholder="Enter keywords to search"
                        className="px-2 py-2.5 border border-[#517028] rounded-lg text-sm font-normal"
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
                            <th className="sticky top-0 py-2 text-white bg-[#517028] rounded-tl-lg  max-w-20 z-10">Job Title</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028]  max-w-20 z-10">Company</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028]  max-w-20 z-10">Location</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028]  max-w-20 z-10">Salary</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028]  max-w-20 z-10">Date Posted</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028]  max-w-20 z-10">Key Word</th>
                            <th className="sticky top-0 py-2 text-white bg-[#517028] rounded-tr-lg  max-w-20 z-10">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((job, index) => (
                            <React.Fragment key={job.id || index}>
                                <tr className="text-black bg-white even:bg-gray-100 ">
                                    {/* Job Title */}
                                    <td className="p-2 font-medium truncate max-w-20 text-center" title={job.title}>
                                        {job.title}
                                    </td>

                                    {/* Company */}
                                    <td className="p-2 truncate max-w-20 text-center" title={job.company}>
                                        {job.company}
                                    </td>

                                    {/* Location */}
                                    <td className="p-2 truncate max-w-20 text-center" title={job.location}>
                                        {job.location}
                                    </td>

                                    {/* Salary */}
                                    <td className="p-2 truncate max-w-20 text-center">
                                        {job.min_amount && job.max_amount
                                            ? `$${job.min_amount} - $${job.max_amount} ${job.currency || "USD"}`
                                            : "Not Provided"}
                                    </td>

                                    {/* Date Posted */}
                                    <td className="p-2 truncate max-w-20 text-center">
                                        {new Date(job.date_posted).toLocaleDateString()}
                                    </td>

                                    {/* Keywords */}
                                    <td className="p-2 truncate max-w-20 text-center">
                                        {job.keywords}
                                    </td>

                                    {/* Actions (Eye Button) */}
                                    <td className=" max-w-20 text-center">
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

                {/* Page numbers with dynamic range */}
                {currentPage > 3 && (
                    <>
                        <button
                            onClick={() => paginate(1)}
                            className="px-4 py-2 mx-1 bg-[#517028] text-white rounded hover:bg-[#415a20]"
                        >
                            1
                        </button>
                        <span className="mx-1">...</span>
                    </>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                        (page) =>
                            page <= currentPage + 2 && page >= currentPage - 2 && page > 0 && page <= totalPages
                    )
                    .map((page) => (
                        <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`px-4 py-2 mx-1 ${currentPage === page ? "bg-[#415a20]" : "bg-[#517028]"} text-white rounded hover:bg-[#415a20]`}
                        >
                            {page}
                        </button>
                    ))}

                {currentPage < totalPages - 2 && (
                    <>
                        <span className="mx-1">...</span>
                        <button
                            onClick={() => paginate(totalPages)}
                            className="px-4 py-2 mx-1 bg-[#517028] text-white rounded hover:bg-[#415a20]"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

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