import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip"; 
import { Paper, Box } from "@material-ui/core";
import { useInactivityContext } from "../Context/Inactivity";
import { Modal,Button} from "@material-ui/core";

import Backdrop from '@mui/material/Backdrop';
import { ModalDialog } from '@mui/joy';
export default function Drafts({ U_id, U_name }) {
  const [leaveDetails, setLeaveDetails] = useState([]);

  const [sessionOutModal, setSessionOutModal] = useState(false);
  const { sessionReminder } = useInactivityContext();

  // const { sessionReminder, setOpenSessionModal, //resetTimeout } = useSession();
  const navigate = useNavigate();

  const handleOKChanges = () => {
    //resetTimeout();
    
    setSessionOutModal(false);
  }
  useEffect(() => {
    if (sessionReminder) {
      setSessionOutModal(true);
      console.log("1 minute is left before inactivity timeout.");
    }
  }, [sessionReminder]);




  useEffect(() => {
    if (U_id) {
      axios
        .get(`${process.env.REACT_APP_APIURL}leavehistory?U_id=${U_id}`)
        .then((response) => {
          const drafts = response.data.leaveDetails.filter(
            (application) => application.activeyn === "X"
          );
          setLeaveDetails(drafts);
        })
        .catch((error) => {});
    }
  }, [U_id]);

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

  const handleEditClick = (
    event,
    leaveappln_id,
    shortType,
    leaveappln_reason,
    totalLeaveDays,
    teamleaderid,
    StartDate,
    EndDate,
    FullDay,
    MorningHalf,
    AfternoonHalf,
    teamleaderEmail,
    HalfDay,
    U_name,
    emplyEmail
  ) => {
    const fullType = getFullLeaveType(shortType);

    const additionalData = {
      U_id,
      leaveappln_id,
      LeaveType: fullType,
      leaveappln_reason,
      totalLeaveDays,
      teamleaderid,
      StartDate,
      EndDate,
      FullDay,
      MorningHalf,
      AfternoonHalf,
      teamleaderEmail,
      HalfDay,
      U_name,
      emplyEmail,
    };

    navigate(`/editdrafts`, { state: additionalData });
  };

  const draftStatus = "Draft Saved";
  // const handleOKChanges = () => {
  //   //resetTimeout();
  //   setOpenSessionModal(false);
  //   setSessionOutModal(false);
  // }

  return (
    <>
    <div style={{ width: "100%", overflowX: "hidden" , filter: sessionOutModal ? 'blur(5px)' : 'none' }}>
      {leaveDetails.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          bgcolor="#f5f5f5"
        >
          <Typography variant="h6" align="center" color="textSecondary">
            No Draft Saved Application Available
          </Typography>
        </Box>
      ) : (
        leaveDetails.map((application) => (
          <Accordion
            key={application.leaveappln_id}
            style={{ marginBottom: "20px", width: "100%" }}
            defaultExpanded={true}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${application.leaveappln_id}-content`}
              id={`panel-${application.leaveappln_id}-header`}
              style={{ backgroundColor: "#f0f0f0", borderRadius: "4px" }}
            >
              <Typography style={{ flex: 1 }}>
                {getFullLeaveType(application.LeaveType)}
              </Typography>
              <Typography
                style={{
                  backgroundColor: "#FFB74D",
                  padding: "9px",
                  borderRadius: "6px",
                  border: "1px solid #FF9800",
                }}
              >
                {draftStatus}
              </Typography>
              <div style={{ marginLeft: "auto", marginRight: "10px" }}>
                <IconButton
                  aria-label="edit"
                  onClick={(event) =>
                    handleEditClick(
                      event,
                      application.leaveappln_id,
                      application.LeaveType,
                      application.leaveappln_reason,
                      application.totalLeaveDays,
                      application.teamleaderid,
                      application.StartDate,
                      application.EndDate,
                      application.FullDay,
                      application.MorningHalf,
                      application.AfternoonHalf,
                      application.teamleaderEmail,
                      application.HalfDay,
                      application.U_name,
                      application.emplyEmail
                    )
                  }
                >
                   <Tooltip  title="Edit Application" >
                  <EditIcon /> </Tooltip>
                </IconButton>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Date of Application: {application.leaveappln_date}
              </Typography>
              <Typography variant="body1">
                Reason: {application.leaveappln_reason}
              </Typography>
              {application.FullDay && application.FullDay.length > 0 && (
                <Typography variant="body1">
                  Full Day: {application.FullDay.join(", ")}
                </Typography>
              )}
              {application.MorningHalf &&
                application.MorningHalf.length > 0 && (
                  <Typography variant="body1">
                    Morning Half: {application.MorningHalf.join(", ")}
                  </Typography>
                )}
              {application.AfternoonHalf &&
                application.AfternoonHalf.length > 0 && (
                  <Typography variant="body1">
                    Afternoon Half: {application.AfternoonHalf.join(", ")}
                  </Typography>
                )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
      
    </div>
    {sessionOutModal && (
        <Modal
          open={sessionOutModal}
          onClose={() => setSessionOutModal(false)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          style={{marginTop:'10%'}}
        >
          <Paper
            style={{ padding: '20px',marginLeft:'28%',width:"41%",marginTop:"10%"}}
          >
            <Typography variant="h6" gutterBottom>
              Your session will expire in 1 minute. Please save your work.
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
            >
              <Button style={{marginLeft:"45%",marginTop:'2%'}} variant="contained" color="primary" onClick={handleOKChanges}>
                OK
              </Button>
            </Box>
          </Paper>
        </Modal>
      )}
    </>
  );
}
