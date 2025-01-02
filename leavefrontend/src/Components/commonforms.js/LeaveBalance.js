
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Typography, Modal, Button } from '@material-ui/core';
// import { SessionProvider } from '../sessionContext';
// import { useSession } from '../sessionContext';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import { ModalDialog } from '@mui/joy';
import { useInactivityContext } from '../Context/Inactivity';

const LeaveBalance = () => {
  const { sessionReminder } = useInactivityContext();
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [sessionOutModal, setSessionOutModal] = useState(false);

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
    const userToken = localStorage.getItem("userToken");
    setToken(userToken);
  }, []);

  // useEffect(() => {
  //   if (sessionReminder) {
  //     setSessionOutModal(true);
  //   }
  // }, [sessionReminder]);

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leavebalances`,
          {
            headers: {
              Authorization: `${token}`, // Pass token in the headers
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.leaveBalances)) {
            setLeaveBalances(data.leaveBalances);
          } else {
            throw new Error("Unexpected response format");
          }
        } else {
          throw new Error(
            `Failed to fetch leave summary, status: ${response.status}`
          );
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveBalances();
  }, [token]);

  const shouldRenderRow = (row) => {
    const allottedValues = [
      row.alloted_SL,
      row.alloted_CL,
      row.alloted_PL,
      row.alloted_LWP,
      row.alloted_ML,
      row.alloted_PTL,
    ];
    return allottedValues.some((value) => value > 0);
  };

  const headerStyle = { fontWeight: "bold", color: "#333" };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <Typography variant="body1">Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  

  // const handleOKChanges = () => {
  //   resetTimeout();
  //   setOpenSessionModal(false);
  //   setSessionOutModal(false);
  // }


  return (
    <>
      <TableContainer
        component={Paper}
        style={{
          maxWidth: "90%",
          margin: "auto",
          marginTop: "20px",
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f0f0f0" }}>
              <TableCell style={headerStyle}>Leave Type</TableCell>
              <TableCell style={headerStyle}>Allotted</TableCell>
              <TableCell style={headerStyle}>Taken</TableCell>
              <TableCell style={headerStyle}>Remaining</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveBalances.map((balance, index) => {
              if (shouldRenderRow(balance)) {
                return (
                  <React.Fragment key={index}>
                    {balance.alloted_SL > 0 && (
                      <TableRow>
                        <TableCell>Sick Leave</TableCell>
                        <TableCell>{balance.alloted_SL}</TableCell>
                        <TableCell>{balance.taken_SL}</TableCell>
                        <TableCell>{balance.remaining_SL}</TableCell>
                      </TableRow>
                    )}
                    {balance.alloted_CL > 0 && (
                      <TableRow>
                        <TableCell>Casual Leave</TableCell>
                        <TableCell>{balance.alloted_CL}</TableCell>
                        <TableCell>{balance.taken_CL}</TableCell>
                        <TableCell>{balance.remaining_CL}</TableCell>
                      </TableRow>
                    )}
                    {balance.alloted_PL > 0 && (
                      <TableRow>
                        <TableCell>Privilege Leave</TableCell>
                        <TableCell>{balance.alloted_PL}</TableCell>
                        <TableCell>{balance.taken_PL}</TableCell>
                        <TableCell>{balance.remaining_PL}</TableCell>
                      </TableRow>
                    )}
                    {balance.alloted_LWP > 0 && (
                      <TableRow>
                        <TableCell>Leave Without Pay</TableCell>
                        <TableCell>{balance.alloted_LWP}</TableCell>
                        <TableCell>{balance.taken_LWP}</TableCell>
                        <TableCell>{balance.remaining_LWP}</TableCell>
                      </TableRow>
                    )}
                    {balance.alloted_ML > 0 && (
                      <TableRow>
                        <TableCell>Maternity Leave</TableCell>
                        <TableCell>{balance.alloted_ML}</TableCell>
                        <TableCell>{balance.taken_ML}</TableCell>
                        <TableCell>{balance.remaining_ML}</TableCell>
                      </TableRow>
                    )}
                    {balance.alloted_PTL > 0 && (
                      <TableRow>
                        <TableCell>Paternity Leave</TableCell>
                        <TableCell>{balance.alloted_PTL}</TableCell>
                        <TableCell>{balance.taken_PTL}</TableCell>
                        <TableCell>{balance.remaining_PTL}</TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </TableBody>
        </Table>
      </TableContainer>
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
    </>
  );
};

export default LeaveBalance;