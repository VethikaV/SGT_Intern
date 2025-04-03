import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./CSS/style.css";

const ExcelReader = () => {
  const [excelData, setExcelData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/my-app/public/JobData.xlsx")
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setExcelData(jsonData);
      })
      .catch((error) => console.error("Error loading Excel file:", error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toUpperCase());
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      {/* FontAwesome Icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />

      <header>
        <style>
          {`
          html, body {
            overflow: hidden;
          }
          `}
        </style>
      </header>

      {/* Heading Section */}
      <table border="0" width="70%">
        <tbody>
          <tr>
            <td
              style={{
                fontFamily: "calibri",
                fontSize: "48px",
                color: "#0099cc",
                fontWeight: "normal",
                textAlign: "center",
              }}
            >
              <p>
                <span style={{ backgroundColor: "white" }}>Build Your</span>{" "}
                <span style={{ color: "#336699" }}>career,&nbsp;</span>
                <span style={{ backgroundColor: "white" }}>Empower Your </span>{" "}
                <span style={{ color: "#336699" }}>future</span>
              </p>

              {/* Search Section */}
              <p>
                <input
                  type="text"
                  placeholder="Job title, keyword or company"
                  onChange={handleSearch}
                />{" "}
                <input type="text" placeholder="Location" />
                <button className="dropbtn">Search</button>
              </p>

              {/* Column Headers */}
              <button className="dropbtn">Sl.no</button>
              <button className="dropbtn">Job Title / Position</button>
              <button className="dropbtn">Job Location</button>
              <button className="dropbtn">No.of Years Exp</button>
              <button className="dropbtn">Click for More Details</button>
              <p></p>
              <button className="dropbtn">
                <i className="fa fa-arrow-right">&nbsp; Apply Now</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Job Listings Table */}
      <table border="1" width="70%" id="myTable">
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Job Title</th>
            <th>Location</th>
            <th>Experience</th>
            <th>More Details</th>
          </tr>
        </thead>
        <tbody>
          {excelData.length > 0 ? (
            excelData
              .filter((row) => row["Job Title"]?.toUpperCase().includes(searchTerm))
              .map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row["Job Title"] || "N/A"}</td>
                  <td>{row["Location"] || "N/A"}</td>
                  <td>{row["Experience"] || "N/A"}</td>
                  <td>
                    <button className="dropbtn">View Details</button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Loading Excel data...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelReader;
