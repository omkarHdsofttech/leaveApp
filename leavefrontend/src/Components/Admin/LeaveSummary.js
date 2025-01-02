import React, { useEffect, useState } from "react";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  CircularProgress,
  Tooltip,
  Alert,
  Grid,
  Modal,
  Paper,
  Box,
  Backdrop,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { faL } from "@fortawesome/free-solid-svg-icons";

import { ModalDialog } from "@mui/joy";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  generalHeaders: {
    backgroundColor: "#1a237e",
    border: "1px solid black",
    color: "white",
    textAlign: "center",
    borderTop: "1px solid black",
    fontWeight: "bold",
  },
  specialHeader: {
    backgroundColor: "#1a237e",
    borderRight: "1px solid black",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
  },

  pinkText: {
    color: "red",
  },
  tableBody: {
    backgroundColor: "#f5f5f5",
    "& tr:nth-of-type(even)": {
      backgroundColor: "#e0e0e0",
    },
  },
  allottedTakens: {
    borderRight: "1px solid black",
    backgroundColor: "#1a237e",
    textAlign: "center",
    color: "white",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    fontWeight: "bold",
  },
  borderRightColumn: {
    borderRight: "1px solid black",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: "20px",
  },
  datePickerContainer: {
    padding: "20px",
  },
  allottedTaken: {
    border: "1px solid black",
    textAlign: "center",
  },

  stickyHeader: {
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  generalHeader: {
    border: "1px solid black",
    textAlign: "center",
  },
}));

const LeaveSummary = () => {
  const classes = useStyles();
  const [leaveSummaryDetails, setLeaveSummaryDetails] = useState([]);
  const [leaveBalanceDetails, setLeaveBalanceDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [replaceLT, setReplaceLT] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const [warning, setWarning] = useState(false);
  const [filteredUserIds, setFilteredUserIds] = useState([]);
  const [dataWarning, setDataWarning] = useState(false);
  const [dateswarning, setDatesWarning] = useState(false);
  const [enableEnddate, setEnableEnddate] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  

  const navigate = useNavigate();
 


  useEffect(() => {
    const fetchLeaveSummaryDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leavesummaryuser`
        );
        if (response.ok) {
          const data = await response.json();
          setLeaveSummaryDetails(data.leavesummaryuserDetails);
        } else {
          console.error("Failed to fetch leave summary details");
        }
      } catch (error) {
        console.error("Error fetching leave summary details:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveSummaryDetails();
  }, []);

  useEffect(() => {
    const fetchLeaveBalanceDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leavesummarybalance`
        );
        if (response.ok) {
          const data = await response.json();
          setLeaveBalanceDetails(data.leavesummarybalanceDetails);
        } else {
          console.error("Failed to fetch leave balance details");
        }
      } catch (error) {
        console.error("Error fetching leave balance details:", error);
      }
    };

    fetchLeaveBalanceDetails();
  }, []);

  useEffect(() => {
    const fetchFilterSummaryDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leavesummaryfilter`
        );
        if (response.ok) {
          const data = await response.json();
          const leaveApplicationsSummary = data.leaveApplicationssummary;

          const approvedLeaveEntries = leaveApplicationsSummary.filter(
            (leave) => leave.status === "Approved"
          );

          const filteredUserIds = [];
          if (startDate && endDate) {
            const filteredEntries = approvedLeaveEntries.filter((leave) => {
              const start = moment(leave.StartDate);
              const end = moment(leave.EndDate);
              return (
                start.isBetween(startDate, endDate, undefined, "[]") ||
                end.isBetween(startDate, endDate, undefined, "[]")
              );
            });

            filteredEntries.forEach((leave) => {
              const { user_id, totalLeaveDays, LeaveType } = leave;
              console.log(
                `User ID: ${user_id}, Leave Type: ${LeaveType}, Total Leave Days: ${totalLeaveDays}`
              );

              setReplaceLT(filteredEntries);

              if (!filteredUserIds.includes(user_id)) {
                filteredUserIds.push(user_id);
              }
            });

            setFilteredUserIds(filteredUserIds);
          } else {
            console.log("Please select both a start date and an end date.");
          }
        } else {
          console.error("Failed to fetch leave summary details");
          setHasError(true);
        }
      } catch (error) {
        console.error("Error fetching leave summary details:", error);
        setHasError(true);
      }
    };

    fetchFilterSummaryDetails();
  }, [startDate, endDate]);
  const handleReset = () => {
    
    // Reset the filtered details to an empty array
    setDatesWarning(false);
    setEnableEnddate(false);
    setWarning(false);
    setDataWarning(false);
    setFilteredDetails([]);
    setErrorMsg(false);
    // Reset the date pickers
    setStartDate(null);
    setEndDate(null);
  };

  const handleStartDateChange = (date) => {
    
    setStartDate(date);
    setEnableEnddate(true);
    if (startDate) {
      setDatesWarning(true);
    } else {
      setDatesWarning(false);
    }
    if (endDate && date) {
      setErrorMsg(false);
    }
  };

  const handleEndDateChange = (date) => {
    
    setEndDate(date);
    console.log("details", filteredDetails);
    if (endDate) {
      setDatesWarning(true);
    } else {
      setDatesWarning(false);
    }
    if (startDate && date) {
      setErrorMsg(false);
      setWarning(false);
    }
  };

  const combinedLeaveDetails = leaveSummaryDetails.map((summary) => {
    const balance = leaveBalanceDetails.find((b) => b.user_id === summary.U_id);

    let totalTaken = 0;

    if (balance) {
      totalTaken += balance.taken_SL || 0;
      totalTaken += balance.taken_CL || 0;
      totalTaken += balance.taken_PL || 0;
      totalTaken += balance.taken_PTL || 0;
      totalTaken += balance.taken_ML || 0;
      totalTaken += balance.taken_LWP || 0;
    }

    return {
      ...summary,
      DOJ: moment(summary.DOJ).format("DD-MM-YYYY"),
      sickLeaveAllotted: balance?.alloted_SL || 0,
      sickLeaveTaken: balance?.taken_SL || 0,
      casualLeaveAllotted: balance?.alloted_CL || 0,
      casualLeaveTaken: balance?.taken_CL || 0,
      privilegeLeaveAllotted: balance?.alloted_PL || 0,
      privilegeLeaveTaken: balance?.taken_PL || 0,
      maternityLeaveAllotted:
        balance?.alloted_ML === 0 ? "N/A" : balance?.alloted_ML,
      maternityLeaveTaken:
        balance?.alloted_ML === 0 ? "N/A" : balance?.taken_ML,
      paternityLeaveAllotted: !balance?.alloted_PTL
        ? "N/A"
        : balance?.alloted_PTL,
      paternityLeaveTaken:
        balance?.alloted_PTL === 0 ? "N/A" : balance?.taken_PTL,
      leaveWithoutPayTaken: balance?.taken_LWP,
      totalTaken,
    };
  });
  {
    console.log("combined deta", combinedLeaveDetails);
  }
  const parseValue = (value) =>
    isNaN(parseFloat(value)) ? 0 : parseFloat(value);

  const handleProceed = () => {
    
    if (!startDate || !endDate) {
      setDatesWarning(true);
      console.log("No dates selected");
      setDataWarning(false);
      setErrorMsg(true);
      setWarning(true);
      return;
    } else {
      setDataWarning(false);
    }
    if (startDate && endDate) {
      const filtered = combinedLeaveDetails.filter((detail) =>
        filteredUserIds.includes(detail.U_id)
      );
      setDataWarning(false);
      console.log("dates", startDate, endDate);

      const updatedFiltered = filtered.map((detail) => {
        const matchingLT = replaceLT.filter((lt) => lt.user_id === detail.U_id);

        // Initialize leave balances to zero
        detail.sickLeaveTaken = 0;
        detail.casualLeaveTaken = 0;
        detail.privilegeLeaveTaken = 0;
        detail.maternityLeaveTaken = 0;
        detail.paternityLeaveTaken = 0;
        detail.leaveWithoutPayTaken = 0;

        matchingLT.forEach((lt) => {
          switch (lt.LeaveType) {
            case "SL":
              detail.sickLeaveTaken = lt.totalLeaveDays;
              break;
            case "CL":
              detail.casualLeaveTaken = lt.totalLeaveDays;
              break;
            case "PL":
              detail.privilegeLeaveTaken = lt.totalLeaveDays;
              break;
            case "ML":
              detail.maternityLeaveTaken = lt.totalLeaveDays;
              break;
            case "PTL":
              detail.paternityLeaveTaken = lt.totalLeaveDays;
              break;
            case "LWP":
              detail.leaveWithoutPayTaken = lt.totalLeaveDays;
              break;
            default:
              break;
          }
        });
        console.log("filtered", filtered);
        const totalTaken =
          parseValue(detail.sickLeaveTaken) +
          parseValue(detail.casualLeaveTaken) +
          parseValue(detail.privilegeLeaveTaken) +
          parseValue(detail.maternityLeaveTaken) +
          parseValue(detail.paternityLeaveTaken) +
          parseValue(detail.leaveWithoutPayTaken);

        return { ...detail, totalTaken };
      });

      setFilteredDetails(updatedFiltered);
      setWarning(false);
      if (filtered.length === 0) {
        console.log("filtered details", filteredDetails);
        setWarning(true);
        console.log("No data avilable");
        setDataWarning(true);
      } else {
        console.log("data avilale  ");
      }
    } else {
      console.log("data available");
      console.log("filtered details", filteredDetails);
      setDataWarning(false);

      setErrorMsg(true);
      setWarning(true);
      // console.log('Please select both a start date and an end date.');
    }
  };

  const datePickerOrientation = isSmallScreen ? "portrait" : "landscape";

  return (
    // <div style={{ filter: sessionOutModal ? "blur(5px)" : "none" }}>
    <div >
      <Grid container spacing={2} justifyContent="center" marginLeft={"10px"}>
        <Grid item xs={12} sm={6} md={3} ml={4}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              inputFormat="DD-MM-YYYY"
              renderInput={(params) => (
                <TextField {...params} variant="outlined" fullWidth />
              )}
              orientation={datePickerOrientation}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="End Date"
              value={endDate}
              minDate={startDate}
              onChange={handleEndDateChange}
              inputFormat="DD-MM-YYYY"
              renderInput={(params) => (
                <TextField {...params} variant="outlined" fullWidth />
              )}
              disabled={!enableEnddate}
              orientation={datePickerOrientation}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6} md={3} display="flex" alignItems="center">
          <Button variant="contained" color="primary" onClick={handleProceed}>
            Proceed
          </Button>
          <Button
            style={{ marginTop: "-1px", marginLeft: "20px" }}
            variant="contained"
            color="primary"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Grid>
      </Grid>

      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : hasError ? (
        <div className={classes.error}>
          Failed to load leave summary details.
        </div>
      ) : (
        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          {dateswarning && (
            <Alert
              severity="warning"
              style={{
                marginTop: "5px",
                marginBottom: "42px",
                width: "383px",
                marginLeft: "365px",
              }}
            >
              Please select both a start date and an end date.
            </Alert>
          )}
          {warning && dataWarning && (
            <Alert
              style={{
                marginLeft: "459px",
                width: "297px",
                marginBottom: "12px",
                marginTop: "22px",
              }}
              severity="warning"
            >
              No Data Available.
            </Alert>
          )}

          {!dataWarning && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                    style={{ width: "5%" }}
                  >
                    Employee ID
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Employee Name
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                    style={{ width: "8%" }}
                  >
                    DOJ
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Sick Leave (Allotted)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Sick Leave (Taken)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Casual Leave (Allotted)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Casual Leave (Taken)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Privilege Leave (Allotted)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Privilege Leave (Taken)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Maternity Leave (Allotted)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Maternity Leave (Taken)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Paternity Leave (Allotted)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Paternity Leave (Taken)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Leave Without Pay (Taken)
                  </TableCell>
                  <TableCell
                    className={`${classes.generalHeaders} ${classes.stickyHeader}`}
                  >
                    Total Leave Taken
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {console.log("filtereddetails", filteredDetails)}
                {/* {startDate && endDate */}
                {filteredDetails.length > 0
                  ? filteredDetails
                      .slice() // Create a copy to avoid mutating the original array
                      .sort((a, b) => (a.U_id > b.U_id ? 1 : -1))
                      .map((detail, index) => (
                        <TableRow key={index}>
                          {console.log(
                            "details",
                            detail.U_id,
                            detail.U_name,
                            detail.DOJ,
                            detail.sickLeaveTaken,
                            detail.casualLeaveTaken,
                            detail.privilegeLeaveTaken
                          )}
                          <TableCell className={classes.generalHeader}>
                            {detail.U_id}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            {detail.U_name}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            {detail.DOJ}
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.sickLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Sick Leave Taken: ${detail.sickLeaveTaken}`}
                            >
                              <span>{detail.sickLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.casualLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Casual Leave Taken: ${detail.casualLeaveTaken}`}
                            >
                              <span>{detail.casualLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.privilegeLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Privilege Leave Taken: ${detail.privilegeLeaveTaken}`}
                            >
                              <span>{detail.privilegeLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.maternityLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Maternity Leave Taken: ${detail.maternityLeaveTaken}`}
                            >
                              <span>{detail.maternityLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.paternityLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Paternity Leave Taken: ${detail.paternityLeaveTaken}`}
                            >
                              <span>{detail.paternityLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Leave Without Pay Taken: ${detail.leaveWithoutPayTaken}`}
                            >
                              <span>{detail.leaveWithoutPayTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Total Leave Taken: ${detail.totalTaken}`}
                            >
                              <span>{detail.totalTaken}</span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                  : combinedLeaveDetails
                      .slice() // Create a copy to avoid mutating the original array
                      .sort((a, b) => (a.U_id > b.U_id ? 1 : -1))
                      .map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell className={classes.generalHeader}>
                            {detail.U_id}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            {detail.U_name}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            {detail.DOJ}
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.sickLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Sick Leave Taken: ${detail.sickLeaveTaken}`}
                            >
                              <span>{detail.sickLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.casualLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Casual Leave Taken: ${detail.casualLeaveTaken}`}
                            >
                              <span>{detail.casualLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.privilegeLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Privilege Leave Taken: ${detail.privilegeLeaveTaken}`}
                            >
                              <span>{detail.privilegeLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.maternityLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Maternity Leave Taken: ${detail.maternityLeaveTaken}`}
                            >
                              <span>{detail.maternityLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.allottedTaken}>
                            {detail.paternityLeaveAllotted}
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Paternity Leave Taken: ${detail.paternityLeaveTaken}`}
                            >
                              <span>{detail.paternityLeaveTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Leave Without Pay Taken: ${detail.leaveWithoutPayTaken}`}
                            >
                              <span>{detail.leaveWithoutPayTaken}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className={classes.generalHeader}>
                            <Tooltip
                              title={`Total Leave Taken: ${detail.totalTaken}`}
                            >
                              <span>{detail.totalTaken}</span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* {sessionOutModal && (
        <Modal open={sessionOutModal} onClose={() => setSessionOutModal(false)}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Paper style={{ padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Your session will expire in 1 minute. Please save your work.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "20px",
                  marginLeft: "20%",
                }}
                style={{ marginTop: "8%" }}
              >
                <Button
                  style={{ marginLeft: "-20%" }}
                  variant="contained"
                  color="primary"
                  onClick={handleOKChanges}
                >
                  OK
                </Button>
              </Box>
            </Paper>
          </Box>
        </Modal>
      )} */}
    </div>
  );
};

export default LeaveSummary;
