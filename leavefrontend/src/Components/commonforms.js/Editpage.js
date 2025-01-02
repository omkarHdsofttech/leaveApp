import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Textarea from "@mui/joy/Textarea";
import Stack from "@mui/joy/Stack";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import FormLabel from "@mui/joy/FormLabel";
import Switch from "@mui/joy/Switch";
import Modal from "@mui/joy/Modal";
import ModalDialog, { ModalDialogProps } from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import { format } from "date-fns";
import { Radio, FormControlLabel, RadioGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

function Editpage({
  U_id,
  DOJ,
  U_name,
  leaveType,
  startDateProp,
  endDateProp,
  reasonprop,
  teamleaderNameprop,
  email,
}) {
  const [defaultleavetype, setDefaultLeaveType] = useState(leaveType);

  useEffect(() => {
    if (leaveType) {
      setSelectedLeaveType(leaveType);
    }
  }, [leaveType]);

  useEffect(() => {
    if (reasonprop) {
      setReason(leaveType);
    }
  }, [reasonprop]);

  useEffect(() => {
    if (teamleaderNameprop) {
      setTeamleaderNamme(teamleaderNameprop);
    }
  }, [teamleaderNameprop]);
  useEffect(() => {
    if (startDateProp) {
    }
  }, [startDateProp]);

  const [teamLeader, setTeamLeader] = useState("");
  const [startDate, setStartDate] = useState(dayjs(startDateProp));

  const [endDate, setEndDate] = useState(dayjs(endDateProp));
  const [errorMessage, setErrorMessage] = useState("");
  const [teamLeaderSelected, setTeamLeaderSelected] = useState(false);
  const [teamLeaderError, setTeamLeaderError] = useState(false);
  const [reason, setReason] = useState(reasonprop);
  const [selectedDates, setSelectedDates] = useState([]);
  const [layout, setLayout] = useState(undefined);
  const [scroll, setScroll] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [dayTypes, setDayTypes] = useState({});
  const [mahalf, setMahalf] = useState({});
  const [fullDayLeaves, setFullDayLeaves] = useState([]);
  const [halfDayLeaves, setHalfDayLeaves] = useState([]);
  const [morningHalfLeaves, setMorningHalfLeaves] = useState([]);
  const [afternoonHalfLeaves, setAfternoonHalfLeaves] = useState([]);
  const navigate = useNavigate();
  const [leaveDetails, setLeaveDetails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(leaveType);
  const [teamleaderNamme, setTeamleaderNamme] = useState(teamleaderNameprop);

  useEffect(() => {}, [U_id]);

  useEffect(() => {
    if (U_id) {
      axios
        .get(`http://localhost:8001/leaveapprove?U_id=${U_id}`)
        .then((response) => {
          const approvedEntries = response.data.leaveDetailss.filter(
            (entry) => entry.status === "Approved"
          );

          setLeaveDetails(approvedEntries);

          const fullDayEntries = approvedEntries.map((entry) => entry.FullDay);
          const halfDayEntries = approvedEntries.map((entry) => entry.HalfDay);
        })
        .catch((error) => {});
    }
  }, [U_id]);

  const handleLeaveTypeChange = (event) => {
    setSelectedLeaveType(event.target.value);
    setErrorMessage("");
  };

  const handleTeamLeaderChange = (event) => {
    setTeamLeader(event.target.value);
    setTeamLeaderSelected(true);

    if (errorMessage !== "") {
      setErrorMessage("");
    }
    setTeamLeaderError(false);
  };

  const handleStartDateChange = (date) => {
    if (!teamLeaderSelected) {
      setTeamLeaderError(true);
    } else {
      setStartDate(date);

      setTeamLeaderError(false);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    const datesArray = [];
    const currentDate = new Date(startDate);
    const endDateValue = new Date(date);

    while (currentDate <= endDateValue) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        datesArray.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setSelectedDates(datesArray);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    window.location.reload();
    const currentDate = format(new Date(), "dd-MM-yyyy"); // Format current date
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });

    if (!leaveType) {
      setErrorMessage("Leave Type is required");
      return;
    }
    if (!teamLeader) {
      setErrorMessage("Team Leader is required");
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage("Please select both start date and end date");
      return;
    }
    if (!reason || reason.length < 4) {
      setErrorMessage("Please enter reason with at least 4 characters");
      return;
    }

    let totalLeaveDays = 0;

    selectedDates.forEach((date) => {
      if (dayTypes[date] === "full") {
        totalLeaveDays += 1;
      } else if (dayTypes[date] === "half") {
        totalLeaveDays += 0.5;
      }
    });

    const updatedFullDayLeaves = selectedDates.filter(
      (date) => dayTypes[date] === "full"
    );
    const updatedHalfDayLeaves = selectedDates.filter(
      (date) => dayTypes[date] === "half"
    );
    const updatedMorningHalfLeaves = updatedHalfDayLeaves.filter(
      (date) => mahalf[date] === "Morning"
    );
    const updatedAfternoonHalfLeaves = updatedHalfDayLeaves.filter(
      (date) => mahalf[date] === "Afternoon"
    );

    setFullDayLeaves(updatedFullDayLeaves);
    setHalfDayLeaves(updatedHalfDayLeaves);
    setMorningHalfLeaves(updatedMorningHalfLeaves);
    setAfternoonHalfLeaves(updatedAfternoonHalfLeaves);

    const leaveData = {
      leaveType,
      teamLeader,
      reason,
      fullDayLeaves: updatedFullDayLeaves.map((date) =>
        format(new Date(date), "dd-MM-yyyy")
      ),
      halfDayLeaves: updatedHalfDayLeaves.map((date) =>
        format(new Date(date), "dd-MM-yyyy")
      ),
      morningHalfLeaves: updatedMorningHalfLeaves.map((date) =>
        format(new Date(date), "dd-MM-yyyy")
      ),
      afternoonHalfLeaves: updatedAfternoonHalfLeaves.map((date) =>
        format(new Date(date), "dd-MM-yyyy")
      ),
      currentTime,
      currentDate,
      U_id,
      email,
      totalLeaveDays,
      U_name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      const response = await fetch("http://localhost:8001/userdata", {
        method: "POST",
        body: JSON.stringify(leaveData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        const remainingLeaves = errorMessage.remainingLeaves;
        setErrorMessage(`No Enough Balance`);
        return;
      }

      const responseData = await response.json();

      navigate("/summary", { state: { storedData: responseData } });

      setIsSubmitting(false);
    } catch (error) {
      setErrorMessage("Failed to save leave application.");
    }
  };

  const handleDayTypeChange = (date, value) => {
    setDayTypes((prevState) => ({
      ...prevState,
      [date]: value,
    }));
    if (value === "full") {
      setFullDayLeaves((prevLeaves) => [...prevLeaves, date]);

      setHalfDayLeaves((prevLeaves) => prevLeaves.filter((d) => d !== date));

      setMorningHalfLeaves((prevLeaves) =>
        prevLeaves.filter((d) => d !== date)
      );
      setAfternoonHalfLeaves((prevLeaves) =>
        prevLeaves.filter((d) => d !== date)
      );
    } else if (value === "half") {
      setHalfDayLeaves((prevLeaves) => [...prevLeaves, date]);
    }
  };

  const handlehalfDayTypeChange = (date, value) => {
    setMahalf((prevState) => ({
      ...prevState,
      [date]: value,
    }));
    if (value === "Morning") {
      setMorningHalfLeaves((prevLeaves) => [...prevLeaves, date]);

      setFullDayLeaves((prevLeaves) => prevLeaves.filter((d) => d !== date));

      setAfternoonHalfLeaves((prevLeaves) =>
        prevLeaves.filter((d) => d !== date)
      );
    } else if (value === "Afternoon") {
      setAfternoonHalfLeaves((prevLeaves) => [...prevLeaves, date]);

      setFullDayLeaves((prevLeaves) => prevLeaves.filter((d) => d !== date));

      setMorningHalfLeaves((prevLeaves) =>
        prevLeaves.filter((d) => d !== date)
      );
    }
  };

  const handleModalSubmit = () => {
    const isDayTypesSelected = selectedDates.every((date) => dayTypes[date]);

    if (!isDayTypesSelected) {
      setErrorMessage("Please select full-day or half-day for all dates.");
      return;
    }

    const isHalfDayValid = selectedDates.every((date) => {
      if (dayTypes[date] === "half") {
        return mahalf[date] === "Morning" || mahalf[date] === "Afternoon";
      }
      return true;
    });

    if (!isHalfDayValid) {
      setErrorMessage(
        "Please select morning or afternoon for all half-day dates."
      );
      return;
    }

    let totalLeaveDays = 0;
    selectedDates.forEach((date) => {
      if (dayTypes[date] === "full") {
        totalLeaveDays += 1;
      } else if (dayTypes[date] === "half") {
        totalLeaveDays += 0.5;
      }
    });

    setModalOpen(false);

    setErrorMessage("");
  };

  const reasonStyle = {
    marginTop: "2rem",
    marginLeft: "4vh",
    marginRight: "4vh",
  };
  const paperStyle = {
    height: "75vh",
    width: "100%",
    maxWidth: "110vh",
    margin: "auto auto auto auto",
  };

  return (
    <>
      <Box sx={{ width: "95%", marginTop: 2 }}>
        <Paper
          elevation={3}
          sx={{ padding: 2, width: "calc(100% - 100px)" }}
          style={paperStyle}
        >
          <Grid style={{ marginTop: "5vh" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <FormControl sx={{ width: "31%", marginLeft: "4vh" }}>
                  <InputLabel id="leave-type-label">Leave Type</InputLabel>
                  {selectedLeaveType && (
                    <Select
                      labelId="leave-type-label"
                      id="leave-type"
                      value={selectedLeaveType}
                      label="Leave Type"
                      onChange={handleLeaveTypeChange}
                      variant="standard"
                      defaultValue={selectedLeaveType}
                    >
                      <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                      <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                      <MenuItem value="Privilege Leave">
                        Privilege Leave
                      </MenuItem>
                      <MenuItem value="Leave Without Pay">
                        Leave Without Pay
                      </MenuItem>
                      <MenuItem value="Paternity Leave">
                        Paternity Leave
                      </MenuItem>
                      <MenuItem value="Maternity Leave">
                        Maternity Leave
                      </MenuItem>
                    </Select>
                  )}
                </FormControl>
                <Box sx={{ width: "2%" }}></Box>
                <FormControl sx={{ width: "31%", marginRight: "5vh" }}>
                  <InputLabel id="team-leader-label">Team Leader</InputLabel>
                  {teamleaderNamme && (
                    <Select
                      labelId="team-leader-label"
                      id="team-leader"
                      value={teamleaderNamme}
                      label="Team Leader"
                      onChange={handleTeamLeaderChange}
                      error={teamLeaderError}
                      variant="standard"
                      defaultValue={teamleaderNamme}
                    >
                      <MenuItem value="John Smith">John Smith</MenuItem>
                      <MenuItem value="Emily Johnson">Emily Johnson</MenuItem>
                      <MenuItem value="David Miller">David Miller</MenuItem>
                      <MenuItem value="Sarah Brown">Sarah Brown</MenuItem>
                      <MenuItem value="Michael Davis">Michael Davis</MenuItem>
                      <MenuItem value="Michael Davis">Alex Parker</MenuItem>
                    </Select>
                  )}
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 2,
                }}
              >
                <Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid style={{ marginLeft: "4vh", marginTop: "5vh" }}>
                      <DatePicker
                        label="Start date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        textField={(props) => <TextField {...props} />}
                        error={teamLeaderError}
                      />
                    </Grid>
                  </LocalizationProvider>
                </Grid>
                <Box sx={{ width: "5%" }}></Box>
                <Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid style={{ marginRight: "4.4vh", marginTop: "5vh" }}>
                      <DatePicker
                        label="End date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        minDate={startDate}
                        textField={(props) => <TextField {...props} />}
                      />
                    </Grid>
                  </LocalizationProvider>
                </Grid>
              </Box>
            </Box>
            <Stack spacing={20}>
              <Textarea
                minRows={3}
                placeholder="Enter reason here…"
                variant="soft"
                style={reasonStyle}
                value={reasonprop}
                onChange={(e) => setReason(e.target.value)}
                sx={{
                  borderBottom: "2px solid",
                  borderColor: "neutral.outlinedBorder",
                  borderRadius: 0,
                  "&:hover": {
                    borderColor: "neutral.outlinedHoverBorder",
                  },
                  "&::before": {
                    border: "1px solid var(--Textarea-focusedHighlight)",
                    transform: "scaleX(0)",
                    left: 0,
                    right: 0,
                    bottom: "-2px",
                    top: "unset",
                    transition: "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
                    borderRadius: 0,
                  },
                  "&:focus-within::before": {
                    transform: "scaleX(1)",
                  },
                }}
              />
            </Stack>
            {errorMessage && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, textAlign: "center", marginTop: "5vh" }}
              >
                {errorMessage}
              </Typography>
            )}
            <Grid container justifyContent="center" sx={{ mt: 4 }}>
              <Grid item xs={12} sm={6} md={4} lg={3} sx={{ mb: 4 }}>
                <Box sx={{ position: "sticky", bottom: "20px" }}></Box>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalDialog layout={"center"}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <DialogTitle>Selected Dates</DialogTitle>
            <Typography variant="body1">M - Morning | A - Afternoon</Typography>
          </Box>

          <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
            <List>
              {selectedDates.map((date, index) => (
                <ListItem
                  key={index}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography sx={{ flex: 1 }}>
                    {format(date, "dd-MMM-yyyy")}
                  </Typography>
                  <RadioGroup
                    aria-label="day-type"
                    name="day-type"
                    value={dayTypes[date]}
                    onChange={(e) => handleDayTypeChange(date, e.target.value)}
                    sx={{
                      display: "fixed",
                      flexDirection: "row",
                      marginLeft: "50px",
                    }}
                  >
                    <FormControlLabel
                      value="full"
                      control={<Radio />}
                      label="Full Day"
                    />
                    <FormControlLabel
                      value="half"
                      control={<Radio />}
                      label="Half Day"
                    />
                  </RadioGroup>

                  {dayTypes[date] === "half" && (
                    <RadioGroup
                      aria-label="halfday-type"
                      name="halfday-type"
                      value={mahalf[date]}
                      onChange={(e) =>
                        handlehalfDayTypeChange(date, e.target.value)
                      }
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      <FormControlLabel
                        value="Morning"
                        control={<Radio />}
                        label="M Half"
                      />
                      <FormControlLabel
                        value="Afternoon"
                        control={<Radio />}
                        label="A Half"
                      />
                    </RadioGroup>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default Editpage;
