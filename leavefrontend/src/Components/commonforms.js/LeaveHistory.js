
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useSession } from '../sessionContext';
import { useInactivityContext } from "../Context/Inactivity";

const LeaveHistory = ({ U_id }) => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveDetails, setLeaveDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [sessionOutModal, setSessionOutModal] = useState(false);

  const { sessionReminder } = useInactivityContext();

  useEffect(() => {
    if (U_id) {
      axios
        .get(`${process.env.REACT_APP_APIURL}leavehistory?U_id=${U_id}`)
        .then((response) => {
          setLeaveApplications(response.data.leaveApplications);
          setLeaveDetails(response.data.leaveDetails);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [U_id]);

  const handleOKChanges = () => {
    //resetTimeout();
    
    setSessionOutModal(false);
  }

  useEffect(() => {
    const fetchRemark = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_APIURL}historyremark`);
        if (response.ok) {
          const data = await response.json();
        }
      } catch (error) {}
    };

    fetchRemark();
  }, []);

  useEffect(() => {
    if (sessionReminder) {
      setSessionOutModal(true);
      console.log("1 minute is left before inactivity timeout.");
    }
  }, [sessionReminder]);

  const handleFilterChange = (event) => {
    //resetTimeout();
    setStatusFilter(event.target.value);
  };

  const formatDate = (dateString) => {
    const parts = dateString.split("/");
    const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1;
    const year = formattedDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getFullLeaveType = (shortType) => {
    switch (shortType) {
      case "LWP":
        return "Leave Without Pay";
      case "SL":
        return "Sick Leave";
      case "CL":
        return "Casual Leave";
      case "PL":
        return "Privilege Leave";
      case "PTL":
        return "Paternity Leave";
      case "ML":
        return "Maternity Leave";
      default:
        return shortType;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const filteredLeaveDetails = statusFilter
    ? leaveDetails.filter((application) => application.status === statusFilter)
    : leaveDetails;

  return (
    <>
      <div style={{ marginBottom: "2%" , filter: sessionOutModal ? 'blur(5px)' : 'none'}}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl style={{ width: "16%", marginRight: "1%" }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={statusFilter}
              label="Status"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Approved and forwarded">Approved and forwarded</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      <div style={{ width: "100%" }}>
        {filteredLeaveDetails.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="#f5f5f5"
          >
            <Typography variant="h6" align="center" color="textSecondary">
              No History Available
            </Typography>
          </Box>
        ) : (
          filteredLeaveDetails
            .slice()
            .reverse()
            .map((application) => (
              <Accordion
                key={application.leaveappln_id}
                style={{ marginBottom: "20px", width: "100%" }}
                defaultExpanded={true}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  style={{
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                  }}
                >
                  <Typography style={{ marginTop: "1vh" }}>
                    {getFullLeaveType(application.LeaveType)}
                  </Typography>
                  <Typography
                    style={{
                      marginLeft: "auto",
                      backgroundColor:
                        application.status === "Approved"
                          ? "#C8E6C9"
                          : application.status === "Rejected"
                          ? "#FF8A80"
                          : "#FFB74D",
                      padding: "9px",
                      borderRadius: "6px",
                      border:
                        application.status === "Approved"
                          ? "1px solid #4CAF50"
                          : application.status === "Rejected"
                          ? "1px solid #FF5252"
                          : "1px solid #FF9800",
                    }}
                  >
                    {application.status}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: "column" }}>
                  <Typography variant="body1" style={{ marginBottom: "8px" }}>
                    Date of Application: {application.leaveappln_date}
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: "8px" }}>
                    Reason: {application.leaveappln_reason}
                  </Typography>

                  {application.FullDay && application.FullDay.length > 0 && (
                    <Typography variant="body1" style={{ marginBottom: "8px" }}>
                      Full Day: {application.FullDay.join(", ")}
                    </Typography>
                  )}
                  {application.MorningHalf && application.MorningHalf.length > 0 && (
                    <Typography variant="body1" style={{ marginBottom: "8px" }}>
                      Morning Half: {application.MorningHalf.join(", ")}
                    </Typography>
                  )}
                  {application.AfternoonHalf && application.AfternoonHalf.length > 0 && (
                    <Typography variant="body1" style={{ marginBottom: "8px" }}>
                      Afternoon Half: {application.AfternoonHalf.join(", ")}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
        )}
      </div>
      {sessionOutModal && (
        <Modal open={sessionOutModal} onClose={() => setSessionOutModal(false)}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Paper style={{ padding: '20px',  textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Your session will expire in 1 minute. Please save your work.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleOKChanges}>
                  OK
                </Button>
              </Box>
            </Paper>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default LeaveHistory;
