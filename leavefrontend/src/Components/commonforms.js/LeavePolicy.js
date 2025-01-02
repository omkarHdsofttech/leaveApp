import React from "react";
import { Grid ,Modal,Button} from "@material-ui/core";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Backdrop from '@mui/material/Backdrop';
import { ModalDialog } from '@mui/joy';
// import { useSession } from '../sessionContext';
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { useInactivityContext } from "../Context/Inactivity";


function LeaveInstruction({ U_id, DOJ, U_name, U_desig, gender }) {

  const [sessionOutModal, setSessionOutModal] = useState(false);
  const { sessionReminder } = useInactivityContext();
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

  // const { sessionReminder, setOpenSessionModal, resetTimeout } = useSession();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const handleUserActivity = () => {
  //     console.log('User activity detected, resetting timeout.');
  //     resetTimeout();
  //   };
  
  //   window.addEventListener('click', handleUserActivity);
  
  //   return () => {
  //     window.removeEventListener('click', handleUserActivity);
  //   };
  // }, [resetTimeout]);
  

  // useEffect(() => {
  //   if (sessionReminder) {
  //     setSessionOutModal(true);
  //   }
  // }, [sessionReminder]);

  // const handleOKChanges = () => {
  //   resetTimeout();
  //   setOpenSessionModal(false);
  //   setSessionOutModal(false);
  // }

  return (
    <div style={{filter: sessionOutModal ? 'blur(5px)' : 'none'}}>
    <Box sx={{ width: "95%", marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 3, marginLeft: "6rem",marginTop:"-2%" }}>
        <Typography variant="h6" gutterBottom style={{ marginTop: "1rem" }}>
          Casual Leave Instruction:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1" paragraph>
              This type of leave can be applied on or before the commencement of
              the leave.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              This type of leave can be applied for not more than 2 consecutive
              days.
            </Typography>
          </li>
        </ul>

        <Typography variant="h6" gutterBottom style={{ marginTop: "3rem" }}>
          Sick Leave Instruction:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1" paragraph>
              This type of leave can be applied immediately after joining at
              work.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              For this type of leave, a medical certificate must be submitted
              for consecutive leave for more than 3 days.
            </Typography>
          </li>
        </ul>

        <Typography variant="h6" gutterBottom style={{ marginTop: "3rem" }}>
          Privilege Leave Instruction:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1" paragraph>
              This type of leave should be applied before 7 days from the actual
              start of leave.
            </Typography>
          </li>
        </ul>

        <Typography variant="h6" gutterBottom style={{ marginTop: "3rem" }}>
          Maternity Leave Instruction:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1" paragraph>
            In case of miscarriage or medical termination of pregnancy, an associate is entitled to six weeks of paid maternity leave an she can reapply leave.
            </Typography>
          </li>
        </ul>


        <Typography variant="h6" gutterBottom style={{ marginTop: "3rem" }}>
          Maternity / Paternity Leave Instruction:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1" paragraph>
            All male employees can avail of 5 days of paternity leave within a month of his spouse’s delivery for maximum 2 occasions during their tenure with HDSOFT Technologies after submitting certificate issued by a Registered Medical Practitioner indicating date of delivery. 
            </Typography>
          </li>
        </ul>
      </Paper>
    </Box>
    {sessionOutModal && (
        <Modal open={sessionOutModal} onClose={() => setSessionOutModal(false)}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              
            }}
          >
            <Paper style={{ padding: '20px'}}>
              <Typography variant="h6" gutterBottom>
              Your session will expire in 1 minute. Please save your work.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' ,marginLeft:"20%"}}style={{marginTop:"8%"}}>
               
                <Button style={{marginLeft:"-20%"}} variant="contained" color="primary" onClick={handleOKChanges}>
                  OK
                </Button>
              </Box>
            </Paper>
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default LeaveInstruction;
