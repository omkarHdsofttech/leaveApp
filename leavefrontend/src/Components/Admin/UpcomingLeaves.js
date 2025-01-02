import React, { useState, useEffect } from "react";
import { useInactivityContext } from "../Context/Inactivity";
import { MenuItem, FormControl, InputLabel, Select, Box, Menu,Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FilterListIcon from '@mui/icons-material/FilterList';
export const UpcomingLeaves = () => {
  const [sessionOutModal, setSessionOutModal] = useState(false);
  const [daysFilter, setDaysFilter] = useState("10"); // Default for days filter
  const [viewFilter, setViewFilter] = useState("Upcoming"); // Default for view filter
  const [leaveData, setLeaveData] = useState([]); // State to store leave data from server
  const [leaveDataFilter, setLeaveDataFilter] = useState([]);
  const { sessionReminder } = useInactivityContext();

  // State for Dialog visibility and the currently selected leave data
  const [openDialog, setOpenDialog] = useState(false);
  
  const [selectedName, setSelectedName] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filteredData, setFilteredData] = useState(leaveData);
  const [nameAnchorEl, setNameAnchorEl] = useState(null); // For User Name dropdown
  const [statusAnchorEl, setStatusAnchorEl] = useState(null); // For Status dropdown
  
  const [selectedStatus, setSelectedStatus] = useState(""); // New state for selected status


  // Fetch leave data when the component mounts or when filters change
  const fetchLeaveData = async (view, days) => {
    try {
      const url = `${process.env.REACT_APP_APIURL}upcoming-history?view=${view}&days=${days}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Server Response:", data);
      setLeaveData(data.leaveData); // Store the filtered data in the state
setLeaveDataFilter(data.leaveData)
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    }
  };

  // Call fetchLeaveData on initial render with default filters
  useEffect(() => {
    fetchLeaveData(viewFilter, daysFilter);
  }, []); // Empty array means this effect runs once after the first render

  // Handle filter changes without fetching data
  const handleDaysFilterChange = (event) => {
    setDaysFilter(event.target.value);
  };

  const handleViewFilterChange = (event) => {
    setViewFilter(event.target.value);
  };

  // Apply the filters and fetch data when the user clicks the "Filter" button
  const handleFilterApply = async () => {
    console.log("Filters Applied - View:", viewFilter, "Days:", daysFilter);
    fetchLeaveData(viewFilter, daysFilter);
    
   
  };
  const uniqueUserNames = [...new Set(leaveDataFilter.map(leave => leave.U_name))];
console.log("unique",uniqueUserNames)
const uniqueStatuses = [...new Set(leaveDataFilter.map(leave => leave.status))];

  // Reset the filters to their default values and refetch the data
  const handleResetFilters = () => {
    setViewFilter("Upcoming"); // Reset to default view filter (Upcoming)
    setDaysFilter("10"); // Reset to default days filter (10 days)
    console.log("Filters Reset");
    fetchLeaveData("Upcoming", "10"); // Fetch data with default filters
  };

  // Open Dialog with leave data
  const handleOpenDialog = (leave) => {
    setSelectedLeave(leave);
    setOpenDialog(true);
  };
  const handleNameFilterClick = (event) => {
    setNameAnchorEl(event.currentTarget); // Show the User Name dropdown
    setStatusAnchorEl(null); // Close the Status dropdown
  };
  
  const handleNameSelect = (name) => {
    setSelectedName(name);
    const filtered = leaveDataFilter.filter((leave) => leave.U_name === name);
    setLeaveData(filtered);
    setFilteredData(filtered);
    setNameAnchorEl(null); // Close the dropdown
  };
  
  const handleNameReset = () => {
    setSelectedName(""); // Reset selected name filter
    setLeaveData(leaveDataFilter); // Show all data
    setFilteredData(leaveDataFilter); // Reset the filtered data
    setNameAnchorEl(null); // Close the dropdown
  };
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLeave(null);
  };

  const handleStatusFilterClick = (event) => {
    setStatusAnchorEl(event.currentTarget); // Show the Status dropdown
    setNameAnchorEl(null); // Close the User Name dropdown
  };
  
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    const filtered = leaveData.filter((leave) => leave.status === status);
    setLeaveData(filtered);
    setFilteredData(filtered);
    setStatusAnchorEl(null); // Close the dropdown
  };
  
  const handleStatusReset = () => {
    setSelectedStatus(""); // Reset selected status filter
    setLeaveData(leaveDataFilter); // Show all data
    setFilteredData(leaveDataFilter); // Reset the filtered data
    setStatusAnchorEl(null); // Close the dropdown
  };
  

  // Function to map leave type code to full name
  const getLeaveTypeFullName = (leaveType) => {
    switch (leaveType) {
      case "PL":
        return "Privilege Leave";
      case "SL":
        return "Sick Leave";
      case "CL":
        return "Casual Leave";
      case "LWP":
        return "Leave Without Pay";
      case "PTL":
        return "Paternity Leave";
      default:
        return leaveType; // If no match, return the original leave type code
    }
  };

  const tableData = leaveData.map((leave) => ({
    userName: leave.U_name,
    leaveType: getLeaveTypeFullName(leave.LeaveType), // Use the function here
    reason: leave.leaveappln_reason,
    fullDay: leave.FullDay.join(", "),
    halfDay: leave.HalfDay.join(", ") || "N/A",
    status: leave.status,
    totalLeaveDays: leave.totalLeaveDays,
  }));
 
  return (
    <>
      <div
        style={{
          marginTop: "2%",
          filter: sessionOutModal ? "blur(5px)" : "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* View Filter Dropdown */}
          <FormControl style={{ width: "16%" }}>
            <InputLabel id="view-filter-label">View</InputLabel>
            <Select
              labelId="view-filter-label"
              id="view-filter"
              value={viewFilter}
              label="View"
              onChange={handleViewFilterChange}
            >
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="History">History</MenuItem>
            </Select>
          </FormControl>

          {/* Days Filter Dropdown */}
          <FormControl style={{ width: "16%" }}>
            <InputLabel id="days-filter-label">Days</InputLabel>
            <Select
              labelId="days-filter-label"
              id="days-filter"
              value={daysFilter}
              label="Days"
              onChange={handleDaysFilterChange}
            >
              <MenuItem value="10">10 days</MenuItem>
              <MenuItem value="20">20 days</MenuItem>
              <MenuItem value="30">30 days</MenuItem>
            </Select>
          </FormControl>

          {/* Filter and Reset Buttons */}
          <Button variant="contained" color="primary" onClick={handleFilterApply}>
            Filter
          </Button>
          <Button variant="contained" color="primary" onClick={handleResetFilters}>
            Reset
          </Button>
        </Box>
      </div>

      <div style={{marginTop:"4%"}}>
        
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#1a237e", color: "white" }}>
            <TableCell style={{ color: "white", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>User Name</span>
      <IconButton size="small" style={{ color: "white" }} onClick={handleNameFilterClick}>
        <FilterListIcon />
      </IconButton>
      <Menu
        anchorEl={nameAnchorEl}
        open={Boolean(nameAnchorEl)}
        onClose={() => setNameAnchorEl(null)}
      >
        {uniqueUserNames.map((name) => (
          <MenuItem key={name} onClick={() => handleNameSelect(name)}>
            {name}
          </MenuItem>
        ))}
        <MenuItem onClick={handleNameReset}>Reset</MenuItem>
      </Menu>
    </TableCell>
              <TableCell style={{color:"white"}}>Leave Type</TableCell>
              <TableCell style={{ color: "white", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>Status</span>
      <IconButton size="small" style={{ color: "white" }} onClick={handleStatusFilterClick}>
        <FilterListIcon />
      </IconButton>
      <Menu
        anchorEl={statusAnchorEl}
        open={Boolean(statusAnchorEl)}
        onClose={() => setStatusAnchorEl(null)}
      >
        {uniqueStatuses.map((status) => (
          <MenuItem key={status} onClick={() => handleStatusSelect(status)}>
            {status}
          </MenuItem>
        ))}
        <MenuItem onClick={handleStatusReset}>Reset</MenuItem>
      </Menu>
    </TableCell>

              <TableCell style={{color:"white"}}>Total Leave Days</TableCell>
              <TableCell style={{color:"white"}}>View More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((leave, index) => (
              <TableRow key={index}>
                <TableCell style={{fontSize:"17px"}}>{leave.userName}</TableCell>
                <TableCell style={{fontSize:"17px"}}>{leave.leaveType}</TableCell>
                <TableCell style={{fontSize:"17px"}}>{leave.status}</TableCell>
                <TableCell style={{fontSize:"17px"}}>{leave.totalLeaveDays}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(leave)}>
                    <MoreHorizIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog to show leave details */}
      <Dialog
        open={openDialog}
        // onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        disableBackdropClick
      >
        <DialogTitle style={{fontWeight:"550",fontSize:"25px"}}>Leave Details</DialogTitle>
        <DialogContent sx={{ overflowY: "auto" }}>
          {selectedLeave && (
            <>
              <div style={{ marginBottom: "5px", padding: "10px", lineHeight: "1" }}>
                <strong>Reason:</strong> {selectedLeave.reason}
              </div>
              <div style={{ marginBottom: "5px", padding: "10px", lineHeight: "1" }}>
                <strong>Full Day:</strong> {selectedLeave.fullDay}
              </div>
              <div style={{ marginBottom: "5px", padding: "10px", lineHeight: "1" }}>
                <strong>Half Day:</strong> {selectedLeave.halfDay}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
