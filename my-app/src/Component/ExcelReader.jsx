import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import "./CSS/style.css";

const ExcelReader = () => {
  const [excelData, setExcelData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExcelData = async () => {
      try {
        const workbook = new ExcelJS.Workbook();
        const response = await fetch("../../public/JobData.xlsx");
        
        if (!response.ok) {
          throw new Error('Failed to fetch Excel file');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];
        
        const jsonData = [];
        
        // Skip empty rows and process only rows with data
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) { // Skip header row
            const rowData = {
              slNo: row.getCell(1).value,
              postingDate: row.getCell(2).value,
              jobTitle: row.getCell(3).value,
              location: row.getCell(4).value,
              experience: row.getCell(5).value,
              details: row.getCell(6).value
            };
            
            // Only add rows that have at least a job title
            if (rowData.jobTitle) {
              jsonData.push(rowData);
            }
          }
        });

        console.log('Parsed Excel Data:', jsonData); // Debug log
        setExcelData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading Excel file:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExcelData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleLocationSearch = (event) => {
    setLocationSearch(event.target.value.toLowerCase());
  };

  const filteredData = excelData.filter((row) => {
    const matchesTitle = row.jobTitle?.toString().toLowerCase().includes(searchTerm);
    const matchesLocation = row.location?.toString().toLowerCase().includes(locationSearch);
    
    if (!searchTerm && !locationSearch) return true;
    if (!locationSearch) return matchesTitle;
    if (!searchTerm) return matchesLocation;
    return matchesTitle && matchesLocation;
  });

  return (
    <div className="excel-reader-container">
      <div className="content-wrapper">
        {/* Heading Section */}
        <div className="header-section">
          <h1>
            <span>Build Your </span>
            <span className="highlight">career, </span>
            <span>Empower Your </span>
            <span className="highlight">future</span>
          </h1>

          {/* Search Section */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Job title, keyword or company"
              onChange={handleSearch}
              value={searchTerm}
            />
            <input
              type="text"
              placeholder="Location"
              onChange={handleLocationSearch}
              value={locationSearch}
            />
            <button className="dropbtn">Search</button>
          </div>
        </div>

        {/* Job Listings Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Sl.no</th>
              <th>Job Posting Date</th>
              <th>Job Title / Position</th>
              <th>Job Location</th>
              <th>No.of Years Exp</th>
              <th>Click for More Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading Excel data...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6">Error: {error}</td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row.slNo}</td>
                  <td>{row.postingDate}</td>
                  <td>{row.jobTitle}</td>
                  <td>{row.location}</td>
                  <td>{row.experience}</td>
                  <td>
                    <button className="dropbtn">View Details</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No matching results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelReader;
