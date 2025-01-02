

import React, { useState, useEffect } from "react";
import { Grid,Checkbox } from "@material-ui/core";
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
import Modal from "@mui/joy/Modal";
import ModalDialog, { ModalDialogProps } from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import { format, formatDate } from "date-fns";
import { Radio, FormControlLabel, RadioGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import moment from "moment";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";

import TableContainer from "@mui/material/TableContainer";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import { AlertTitle } from "@mui/material";
import Base64, { encode } from "base-64";
import { Buffer } from "buffer";
import CircularProgress from "@mui/material/CircularProgress";
import { useInactivityContext } from '../Context/Inactivity' 

function Applyforleave({ U_id, DOJ, U_name, U_desig, gender, email }) {
  const [leaveType, setLeaveType] = useState("");
  const { resetTimer,sessionReminder } = useInactivityContext();

  useEffect(() => {
    setLeaveType(leaveType);
  }, [leaveType]);
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamLeader, setTeamLeader] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [teamLeaderSelected, setTeamLeaderSelected] = useState(false);
  const [teamLeaderError, setTeamLeaderError] = useState(false);
  const [reason, setReason] = useState("");
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
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = useState(null);
  const [teamId, setTeamId] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeamLeaderId, setSelectedTeamLeaderId] = useState("");

  const [openBrowser, setopenbrowser] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [documentsuploaded, setDocumnetUploded] = useState([]);
  const [extensionwarning, setExtensionWarning] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);
  const [base64DataArray, setBase64DataArray] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState([]); // State to store serial numbers
  const [fileExtensions, setFileExtensions] = useState([]); // State to store file extensions
  const [runFetchDocMaster, setRunFetchDocMaster] = useState(false);
  const [docId, setDocId] = useState(null);
  const [docName, setDocName] = useState(null);
  const [fulldayCheckbox, setFullDayCheckbox] = useState(false);
  const [halfdayCheckbox, setHalfDayCheckbox] = useState(false);
  const [MhalfCheckbox, setMHalfDayCheckbox] = useState(false);
  const [AhalfdayCheckbox, setAHalfDayCheckbox] = useState(false);
  const [sessionOutModal, setSessionOutModal] = useState(false);

 
  const handleOKChanges = () => {
    //resetTimeout();
    resetTimer();
    setSessionOutModal(false);
  }
  useEffect(() => {
    if (sessionReminder) {
      setSessionOutModal(true);
      console.log("1 minute is left before inactivity timeout.");
    }
  }, [sessionReminder]);


  const handleFulldayChecked = (event) => {
    //resetTimeout();
    const checked = event.target.checked;

    // Update the fulldayCheckbox state
    setFullDayCheckbox(checked);

    // Uncheck halfdayCheckbox if fulldayCheckbox is checked
    if (checked) {
      setHalfDayCheckbox(false);
    }

    // Update dayTypes for all selected dates
    const updatedDayTypes = { ...dayTypes };
    selectedDates.forEach((date) => {
      updatedDayTypes[date] = checked ? "full" : ""; // Set to "full" if checked, otherwise reset to empty
    });
    setDayTypes(updatedDayTypes); // Update the state with the new day types
  };

  const handleHalfdayChecked = (event) => {
    //resetTimeout();
    const checked = event.target.checked;

    // Update the halfdayCheckbox state
    setHalfDayCheckbox(checked);

    // Uncheck fulldayCheckbox if halfdayCheckbox is checked
    if (checked) {
      setFullDayCheckbox(false);
    }

    // Update dayTypes for all selected dates
    const updatedDayTypes = { ...dayTypes };
    selectedDates.forEach((date) => {
      updatedDayTypes[date] = checked ? "half" : ""; // Set to "half" if checked, otherwise reset to empty
    });
    setDayTypes(updatedDayTypes); // Update the state with the new day types
  };

  const handleMHalfdayChecked = (event) => {
    //resetTimeout();
    const checked = event.target.checked;

    setMHalfDayCheckbox(checked);

    if (checked) {
      setAHalfDayCheckbox(false);
    }

    const updatedDayTypes = { ...dayTypes };
    const updatedHalfDayTypes = { ...mahalf };

    selectedDates.forEach((date) => {
      if (halfdayCheckbox) {
        updatedDayTypes[date] = "half";
        updatedHalfDayTypes[date] = checked ? "Morning" : "";
      }
    });

    setDayTypes(updatedDayTypes);
    setMahalf(updatedHalfDayTypes);
  };

  const handleAHalfdayChecked = (event) => {
    //resetTimeout();
    const checked = event.target.checked;

    setAHalfDayCheckbox(checked);
    if (checked) {
      setMHalfDayCheckbox(false);
    }

    const updatedDayTypes = { ...dayTypes };
    const updatedHalfDayTypes = { ...mahalf };

    selectedDates.forEach((date) => {
      if (halfdayCheckbox) {
        updatedDayTypes[date] = "half";
        updatedHalfDayTypes[date] = checked ? "Afternoon" : "";
      }
    });

    setDayTypes(updatedDayTypes);
    setMahalf(updatedHalfDayTypes);
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  };

  useEffect(() => {
    const fetchhierarchyDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}hierarchy`
        );
        if (response.ok) {
          const data = await response.json();

          const hierarchyDetails = data.hierarchyDetails
            .filter((item) => item.user_id === U_id)
            .map((item) => ({
              user_id: item.user_id,
              teamid: item.teamleader_id,
            }));

          const temaid = hierarchyDetails.map((item) => item.teamid);
          setTeamId(temaid);
        } else {
          console.error("Failed to fetch leave application details");
        }
      } catch (error) {
        console.error("Error fetching leave application details:", error);
      }
    };

    fetchhierarchyDetails();
  }, [U_id]);

  useEffect(() => {
    const fetchteamhierarchy = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}teamleaderhierachy`
        );
        if (response.ok) {
          const data = await response.json();
          const teamleaderhierachy = data.teamleaderhierachy.map((item) => ({
            thierarchyid: item.TL_id,
            teamname: item.Name,
            temail: item.Temail,
            tdesig: item.Designation,
          }));

          const filteredTeams = teamleaderhierachy.filter((team) =>
            teamId.includes(team.thierarchyid)
          );

          setFilteredTeams(filteredTeams);

          if (filteredTeams.length > 0) {
            const firstTeamLeader = filteredTeams[0];
            setTeamLeader(firstTeamLeader.thierarchyid);
            setTeamMail(firstTeamLeader.temail);
            setTeamLeaderSelected(true);

            setSelectedTeamLeaderId(firstTeamLeader.thierarchyid);
          }
        } else {
          console.error("Failed to fetch leave application details");
        }
      } catch (error) {
        console.error("Error fetching leave application details:", error);
      }
    };

    fetchteamhierarchy();
  }, [teamId]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [teamail, setTeamMail] = useState("");
  const [userid, setuserid] = useState();
  useEffect(() => {
    setuserid(U_id);
  }, [U_id]);

  const [fulldayAlreadyTaken, setFulldayAlreadyTaken] = useState([]);
  const [morningHalfAlreadyTaken, setMorningHalfAlreadyTaken] = useState([]);
  const [afternoonHalfAlreadyTaken, setAfternoonHalfAlreadyTaken] = useState(
    []
  );
  const [filteredData, setFilteredData] = useState([]);

  const [usergender, setUserGender] = useState();

  useEffect(() => {
    const fetchDuplicatedatesrestriction = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}duplicatedatesrestriction?U_id=${userid}`
        );
        if (response.ok) {
          const data = await response.json();

          setFilteredData(data.duplicatedatesrestriction);

          let fulldayTemp = [];
          let morningHalfTemp = [];
          let afternoonHalfTemp = [];

          data.duplicatedatesrestriction.forEach((entry) => {
            fulldayTemp = fulldayTemp.concat(entry.FullDay);
            morningHalfTemp = morningHalfTemp.concat(entry.MorningHalf);
            afternoonHalfTemp = afternoonHalfTemp.concat(entry.AfternoonHalf);
          });

          const cleanFullday = [
            ...new Set(fulldayTemp.flat().filter((date) => date)),
          ];
          const cleanMorningHalf = [
            ...new Set(morningHalfTemp.flat().filter((date) => date)),
          ];
          const cleanAfternoonHalf = [
            ...new Set(afternoonHalfTemp.flat().filter((date) => date)),
          ];

          setFulldayAlreadyTaken(cleanFullday);
          setMorningHalfAlreadyTaken(cleanMorningHalf);
          setAfternoonHalfAlreadyTaken(cleanAfternoonHalf);
        } else {
          console.error("Failed to fetch duplicate dates restriction data");
        }
      } catch (error) {
        console.error(
          "Error fetching duplicate dates restriction data:",
          error
        );
      }
    };

    if (userid) {
      fetchDuplicatedatesrestriction();
    }
  }, [userid]);

  useEffect(() => {}, [
    fulldayAlreadyTaken,
    morningHalfAlreadyTaken,
    afternoonHalfAlreadyTaken,
  ]);
  const formattedFullDaysTaken = fulldayAlreadyTaken.map((date) =>
    dayjs(date, "DD-MM-YYYY")
  );
  const formattedMorninghalfTaken = morningHalfAlreadyTaken.map((date) =>
    dayjs(date, "DD-MM-YYYY")
  );
  const formattedAfternoonHalfTaken = afternoonHalfAlreadyTaken.map((date) =>
    dayjs(date, "DD-MM-YYYY")
  );

  // const shouldDisableDate = (date) => {
  //   const isWeekend = date.day() === 0 || date.day() === 6;

  //   const isDateTaken = formattedFullDaysTaken.some((takenDate) =>
  //     takenDate.isSame(date, "day")
  //   );
    

  //   return isWeekend || isDateTaken;
  // };
  const shouldDisableDate = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');

    // Disable if the date is a weekend (Saturday = 6, Sunday = 0)
    const isWeekend = date.day() === 0 || date.day() === 6;

    // Check if the date is a public holiday by formatting and comparing dates
    const isPublicHoliday = publicHolidays.some(holiday => {
      // Ensure the holiday date is in the same format (YYYY-MM-DD) before comparing
      const holidayDate = new Date(holiday.date).toISOString().split('T')[0];
      return holidayDate === formattedDate;
    });

    return isWeekend || isPublicHoliday;
  };
  const renderDay = (day, selectedDate, dayInCurrentMonth, dayComponent) => {
    const formattedDay = day.format('YYYY-MM-DD');
    const isPublicHoliday = publicHolidays.some(holiday => {
      const holidayDate = new Date(holiday.date).toISOString().split('T')[0];
      return holidayDate === formattedDay;
    });

    if (isPublicHoliday) {
      // Apply a custom background color for public holidays
      return React.cloneElement(dayComponent, {
        style: {
          ...dayComponent.props.style,
          backgroundColor: '#FFCDD2', // Light red background
          color: '#D32F2F', // Red text color
          fontWeight: 'bold',
          borderRadius: '50%', // Optional: rounded shape for the public holiday
        },
      });
    }

    return dayComponent;
  };

   // Function to count weekdays
   const countWeekdays = (startDate, endDate) => {
    let count = 0;
    let current = dayjs(startDate);
    const end = dayjs(endDate);

    while (current.isBefore(end) || current.isSame(end)) {
      if (current.day() !== 0 && current.day() !== 6) {
        // Not Sunday (0) or Saturday (6)
        count++;
      }
      current = current.add(1, "day");
    }

    return count;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}usermasteleaveapplication`
      );
      if (response.ok) {
        const data = await response.json();

        if (userid) {
          const filteredData = data.usermasterdetail.filter(
            (item) => item.U_id === userid
          );
          setFilteredData(filteredData);

          if (filteredData.length > 0) {
            const gender = filteredData[0].gender;

            setUserGender(gender);
          }
        }
      } else {
      }
    };

    fetchUserData();
  }, [userid]);

  const [documents, setDocuments] = useState([]);

  const handleDocClick = (doc) => {
    const newWindow = window.open();
    newWindow.document.write(
      `<iframe src="${doc.url}" width="100%" height="100%"></iframe>`
    );
  };

  useEffect(() => {
    if (U_id) {
      axios
        .get(`${process.env.REACT_APP_APIURL}leaveapprove?U_id=${U_id}`)
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
    //resetTimeout();
    setLeaveType(event.target.value);
  
    setStartDate(null);
    setEndDate(null);
    setReason("");
    setUploadedDocuments([]);
    setDayTypes({});
    setMahalf({});
    setErrorMessage("");
    setExtensionWarning(false);
    setSizeWarning(false);
    setErrorMessage("");
    setFullDayCheckbox(false);
    setHalfDayCheckbox(false);
    setMHalfDayCheckbox(false);
    setAHalfDayCheckbox(false)
  };

  const handleTeamLeaderChange = (event) => {
    //resetTimeout();
    const selectedTeamLeaderId = event.target.value;
  
    const selectedTeamLeader = filteredTeams.find(
      (team) => team.thierarchyid === selectedTeamLeaderId
    );
    const selectedTeamLeaderEmail = selectedTeamLeader?.temail || "";

    setTeamLeader(selectedTeamLeaderId);
    setTeamMail(selectedTeamLeaderEmail);
    setTeamLeaderSelected(true);

    if (errorMessage !== "") {
      setErrorMessage("");
    }
    setTeamLeaderError(false);
  };

  const handleStartDateChange = (date) => {
    const formattedStartDate = moment(date).format("MMMM Do YYYY, h:mm:ss a");

    setStartDate(date);
    setTeamLeaderError(false);
  };

  const morningHalfDatesPresent = [];
  const afternoonHalfDatesPresent = [];
  const [morninghalfpresentdates, setMornignHalfPresentdates] = useState([]);
  const [afternoonhalfpresentDates, setAfternoonHalfPresentDates] = useState(
    []
  );
  const handleModalClose = () => {
    //resetTimeout();
    setModalOpen(false);
    setStartDate(null);
    setEndDate(null);
    setFullDayCheckbox(false);
    setHalfDayCheckbox(false);
    setMHalfDayCheckbox(false);
    setAHalfDayCheckbox(false);
    setSelectedDates([]); // Reset selected dates
    setDayTypes({}); // Clear day types
    setMahalf({}); // Clear morning/afternoon half types
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (!startDate) {
      setErrorMessage("Please select a start date first.");
      setTeamLeaderError(true);
      return;
    }

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

    datesArray.forEach((selectedDate) => {
      formattedMorninghalfTaken.forEach((morningHalfDate) => {
        if (dayjs(selectedDate).isSame(morningHalfDate, "day")) {
          morningHalfDatesPresent.push(
            dayjs(morningHalfDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        }
      });
    });

    if (morningHalfDatesPresent.length > 0) {
      setMornignHalfPresentdates(morningHalfDatesPresent);
    } else {
    }
    datesArray.forEach((selectedDate) => {
      formattedAfternoonHalfTaken.forEach((afternoonHalfDate) => {
        if (dayjs(selectedDate).isSame(afternoonHalfDate, "day")) {
          afternoonHalfDatesPresent.push(
            dayjs(afternoonHalfDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        }
      });
    });
    if (afternoonHalfDatesPresent.length > 0) {
      setAfternoonHalfPresentDates(afternoonHalfDatesPresent);
    } else {
      console.log(
        "No dates from afternoon half are present in selected dates."
      );
    }
  };

  useEffect(() => {}, [morningHalfDatesPresent]);

  useEffect(() => {
    if (startDate) {
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
    }
  }, [endDate]);

  const handleSubmit = async () => {
    setIsLoading(true);

    setIsSubmitting(true);

    const currentDate = format(new Date(), "dd-MM-yyyy"); // Format current date
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });

    if (!leaveType) {
      setErrorMessage("Leave Type is required");
      setOpen(false);
      setIsLoading(false);
      return;
    }
    if (!teamLeader) {
      setErrorMessage("Team Leader is required");
      setOpen(false);
      setIsLoading(false);
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage("Please select both start date and end date");
      setOpen(false);
      setIsLoading(false);
      return;
    }
    
    const trimmedReason = reason.replace(/\s/g, "");
    if (!reason || trimmedReason.length < 4) {
      setErrorMessage("Please enter reason with at least 4 characters");
      setOpen(false);
      setIsLoading(false);
      return;
    }
    if (trimmedReason.length > 1000) {
      setErrorMessage("Reason should not exceed 1000 characters");
      setOpen(false);
      setIsLoading(false);
      return;
    }else{
      setErrorMessage()
    }
    setIsSubmitting(true);

    setAction("submit");
    setOpen(true);
    let totalLeaveDays = 0;

    selectedDates.forEach((date) => {
      if (dayTypes[date] === "full") {
        // If it's a full-day leave, increment by 1
        totalLeaveDays += 1;
      } else if (dayTypes[date] === "half") {
        // If it's a half-day leave, increment by 0.5
        totalLeaveDays += 0.5;
      }
    });

    // Update the fullDayLeaves, halfDayLeaves, morningHalfLeaves, and afternoonHalfLeaves arrays
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

    const formattedStartDate = moment(startDate).format("DD-MM-YYYY");

    const leaveData = {
      leaveType,
      teamLeader,
      reason,
      fullDayLeaves: updatedFullDayLeaves.map((date) =>
        moment(date).format("DD-MM-YYYY")
      ),
      halfDayLeaves: updatedHalfDayLeaves.map((date) =>
        moment(date).format("DD-MM-YYYY")
      ),
      morningHalfLeaves: updatedMorningHalfLeaves.map((date) =>
        moment(date).format("DD-MM-YYYY")
      ),
      afternoonHalfLeaves: updatedAfternoonHalfLeaves.map((date) =>
        moment(date).format("DD-MM-YYYY")
      ),
      tid: selectedTeamLeaderId,
      currentTime,
      currentDate,
      U_id,
      U_desig,
      emplyemail: email,
      teamLeaderEmail: teamail,
      totalLeaveDays,
      U_name,
      DOJ: currentDate,
      startDate: startDate,
      endDate: endDate,
      serialNumbers,
      fileExtensions,
      docId,
      docName,
      base64DataArray,
      user: "ADMIN",
      host: "127.0.0.1",
      udate: format(new Date(), "dd-MM-yyyy"),
    };

    <Alert severity="success">This is a success Alert.</Alert>;
    try {
      const response = await fetch(`${process.env.REACT_APP_APIURL}userdata`, {
        method: "POST",
        body: JSON.stringify(leaveData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setOpen(false);

        const errorData = await response.json();
        const errorMessage = errorData.message || "An error occurred.";

        if (errorMessage.includes("No Enough Balance")) {
          setErrorMessage("No Enough Balance");
          setIsLoading(false);
          setIsSubmitting(false);
          setOpen(false);
          return;
        } else {
          setErrorMessage();
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      setErrorMessage("");
      setLeaveType("");

      setStartDate(null);
      setEndDate(null);
      setReason("");
      setFullDayLeaves([]);
      setHalfDayLeaves([]);
      setMorningHalfLeaves([]);
      setAfternoonHalfLeaves([]);

      setIsLoading(false);
      setIsSubmitting(false);
    } catch (error) {
      setOpen(false);

      setErrorMessage(error.message || "An error occurred.");

      setIsLoading(false);
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    // Function to fetch public holidays from the backend using the API URL from environment variables
    const fetchPublicHolidays = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_APIURL}publicHolidays`);
        if (!response.ok) {
          throw new Error('Failed to fetch public holidays');
        }
        const holidays = await response.json();

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Filter holidays to only include those from the current year
        const filteredHolidays = holidays.filter(holiday => {
          const holidayYear = new Date(holiday.date).getFullYear();
          return holidayYear === currentYear;
        });

        setPublicHolidays(filteredHolidays); // Set the filtered holidays in state
        console.log("Fetched Public Holidays for Current Year:", filteredHolidays);  // Log the filtered holidays
      } catch (err) {
        setError(err.message);  // Set error state if there's an issue
      } finally {
        setLoading(false);  // Set loading to false after fetch completes
      }
    };

    fetchPublicHolidays();
  }, []);
  console.log("Fetched Public Holidays:", publicHolidays);
  const handleDraft = async () => {
    setIsLoading(true);
    setIsSubmitting(true);

    const currentDate = format(new Date(), "dd-MM-yyyy");
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });

    if (!leaveType) {
      setErrorMessage("Leave Type is required");

      setOpen(false);

      setIsLoading(false);
      return;
    }
    // if (!teamLeader) {
    //   setErrorMessage("Team Leader is required");

    //   setIsLoading(false);
    //   setOpen(false);
    //   return;
    // }
    // if (!startDate || !endDate) {
    //   setErrorMessage("Please select both start date and end date");
    //   setIsLoading(false);
    //   setOpen(false);
    //   return;
    // }
    // if (!reason || reason.length < 4) {
    //   setErrorMessage("Please enter reason with at least 4 characters");
    //   setIsLoading(false);
    //   setOpen(false);
    //   return;
    // }

    setAction("draft");
    setOpen(true);

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

    const formattedStartDate = moment(startDate).format("DD-MM-YYYY");
    const formattedEndDate = moment(endDate).format("DD-MM-YYYY");

    const leaveDraft = {
      leaveType,
      teamLeader,
      tid: selectedTeamLeaderId,
      reason,
      fullDayLeaves: updatedFullDayLeaves.map((date) =>
        moment(date).format("DD-MM-YYYY")
      ),
      halfDayLeaves: updatedHalfDayLeaves.map((date) =>
        moment(date).format("DD-MM-YYYY")
      ),
      morningHalfLeaves: updatedMorningHalfLeaves.map((date) =>
        moment(date).format("DD-MM-YYYY")
      ),
      afternoonHalfLeaves: updatedAfternoonHalfLeaves.map((date) =>
        moment(date).format("DD-MM-YYYY")
      ),
      tid: selectedTeamLeaderId,
      currentTime,
      currentDate,
      U_id,
      U_desig,
      emplyemail: email,
      teamLeaderEmail: teamail,
      totalLeaveDays,
      U_name,
      activeyn: "X",
      user: "ADMIN",
      host: "127.0.0.1",
      udate: format(new Date(), "dd-MM-yyyy"),
      DOJ: currentDate,
      startDate: startDate,
      endDate: endDate,
      serialNumbers,
      fileExtensions,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_APIURL}userdata`, {
        method: "POST",
        body: JSON.stringify(leaveDraft),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      setErrorMessage("");
      setLeaveType("");

      setStartDate(null);
      setEndDate(null);
      setReason("");
      setFullDayLeaves([]);
      setHalfDayLeaves([]);
      setMorningHalfLeaves([]);
      setAfternoonHalfLeaves([]);
      setIsLoading(false);
      setOpen(true);

      setIsSubmitting(false);
    } catch (error) {
      setIsLoading(false);
      setOpen(false);

      setErrorMessage("No Enough Balance");
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

    if (leaveType === "Casual Leave" && totalLeaveDays > 2) {
      setErrorMessage(
        "You can only apply for up to 2 days of Casual Leave consecutively."
      );
      setStartDate(null);
      setEndDate(null);
      setOpen(false);
      setIsSubmitting(false);
      return;
    } else {
      setErrorMessage("");

      setIsSubmitting(true);
    }

    const currentDate = new Date();

    const sevenDaysAhead = new Date();
    sevenDaysAhead.setDate(currentDate.getDate() + 7);

    // if (leaveType === "Privilege Leave" && startDate <= sevenDaysAhead) {
    //   setErrorMessage(
    //     "Privilege  Leave applications must be made at least 7 days in advance."
    //   );
    //   setStartDate(null);
    //   setEndDate(null);
    //   setOpen(false);
    //   setIsSubmitting(false);
    //   return;
    // } else {
    //   setErrorMessage("");

    //   setIsSubmitting(true);
    // }

    setModalOpen(false);
    if (leaveType === "Sick Leave" && totalLeaveDays >= 3) {
      setopenbrowser(true);
      setRunFetchDocMaster(true);
    } else {
      setopenbrowser(false);
      setRunFetchDocMaster(false);
    }

    setErrorMessage("");
  };
  const [docname, setdocname] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const getMinDate = () => {
    if (leaveType === "Sick Leave") {
      return dayjs().subtract(30, "day");
    }
    return dayjs();
  };

  useEffect(() => {
    if (runFetchDocMaster) {
      const fetchDocMaster = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_APIURL}docmaster`
          );

          if (response.ok) {
            const data = await response.json();

            const docArray = data.docmasterdetail;

            if (Array.isArray(docArray)) {
              const medicalCertificate = docArray.find(
                (doc) => doc.docname_name === "Medical Certificate"
              );

              if (medicalCertificate) {
                setDocId(medicalCertificate.docname_id);
                setDocName(medicalCertificate.docname_name);
              } else {
              }
            } else {
            }
          } else {
          }
        } catch (error) {}
      };

      fetchDocMaster();
    }
  }, [runFetchDocMaster]);

  const reasonStyle = {
    marginTop: "3rem",
    marginLeft: "4vh",
    marginRight: "4vh",
  };
  const paperStyle = {
    height: "75vh",
    width: "100%",
    maxWidth: "110vh",
    margin: "auto auto auto auto",
  };

  if (leaveType === "SL") {
    const maxdate = startDate + 1;
  }

  const [leavetypeName, setleavetypeName] = useState([]);
  useEffect(() => {
    const fetchLeaveApplnDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}editdraftleavetype`
        );
        if (response.ok) {
          const data = await response.json();
          const leavetypeDetails = data.leavetypeDetails.map((item) => ({
            lname: item.LeaveType_name,
            lid: item.LeaveType_id,
          }));

          setleavetypeName(leavetypeDetails);
        } else {
        }
      } catch (error) {}
    };

    fetchLeaveApplnDetails();
  }, []);
  const handleReasonChange = (e) => {
    //resetTimeout();
    setReason(e.target.value);
   
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const allowedExtensions = ["jpg", "png", "jpeg", "pdf", "docx"];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    const validFiles = [];
    for (const file of files) {
      const extension = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        setExtensionWarning(true);
      } else if (file.size > maxSize) {
        setSizeWarning(true);
      } else {
        validFiles.push(file);
        setExtensionWarning(false);
        setSizeWarning(false);
      }
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      const fileNames = validFiles.map((file) => file.name).join(", ");
      setFileName(fileNames);
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage("Please select a document before uploading.");
      return;
    }

    const uploadFiles = selectedFiles.map(async (file, index) => {
      const base64Data = await fileToBase64(file);
      return {
        name: file.name,
        base64Data,
        extension: file.name.split(".").pop().toLowerCase(),
        serialNumber: index + 1,
      };
    });

    Promise.all(uploadFiles)
      .then((files) => {
        setUploadedDocuments((prev) => [...prev, ...files]);
        setBase64DataArray((prev) => [
          ...prev,
          ...files.map((file) => file.base64Data),
        ]);
        setFileExtensions((prev) => [
          ...prev,
          ...files.map((file) => file.extension),
        ]);
        setSerialNumbers((prev) => [
          ...prev,
          ...files.map((file) => file.serialNumber),
        ]);
        setSelectedFiles([]);
        setFileName("");
      })
      .catch((error) => {
        console.error("Error reading file:", error);
      });
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64String = reader.result.split(",")[1];

        if (base64String.startsWith('"')) {
          base64String = base64String.slice(1);
        }
        if (base64String.endsWith('"')) {
          base64String = base64String.slice(0, -1);
        }
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  const handleRemoveDocument = (index) => {
    const updatedDocuments = [...uploadedDocuments];
    updatedDocuments.splice(index, 1);
    setUploadedDocuments(updatedDocuments);
  };

  const filteredLeaveTypes = leavetypeName.filter((leaveType) => {
    if (usergender === "M" && leaveType.lname === "Maternity Leave") {
      return false;
    }
    if (usergender === "F" && leaveType.lname === "Paternity Leave") {
      return false;
    }
    return true;
  });

  return (
    // <div style={{ filter: sessionOutModal ? "blur(5px)" : "none" }}>
    <div>
      {open && (
        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {action === "submit"
              ? "Your leave application has been successfully submitted."
              : action === "draft"
              ? "Your leave application has been saved as draft."
              : null}
          </Alert>
        </Snackbar>
      )}
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
                  <Select
                    labelId="leave-type-label"
                    id="leave-type"
                    value={leaveType}
                    label="Leave Type"
                    onChange={handleLeaveTypeChange}
                    variant="standard"
                  >
                    {filteredLeaveTypes.map((leaveType, index) => (
                      <MenuItem key={index} value={leaveType.lname}>
                        {leaveType.lname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ width: "2%" }}></Box>
                <FormControl sx={{ width: "31%", marginRight: "5vh" }}>
                  <InputLabel id="team-leader-label">Team Leader</InputLabel>
                  <Select
                    labelId="team-leader-label"
                    id="team-leader"
                    value={teamLeader}
                    label="Team Leader"
                    onChange={handleTeamLeaderChange}
                    error={teamLeaderError}
                    variant="standard"
                  >
                    {filteredTeams.map((team, index) => (
                      <MenuItem key={index} value={team.thierarchyid}>
                        {team.teamname}
                      </MenuItem>
                    ))}
                  </Select>
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
                        label="From"
                        value={startDate}
                        maxDate={endDate}
                        minDate={getMinDate()}
                        disablePast={leaveType !== "Sick Leave"}
                        format="DD-MM-YYYY"
                        onChange={handleStartDateChange}
                        textField={(props) => <TextField {...props} />}
                        error={teamLeaderError}
                        shouldDisableDate={shouldDisableDate}
                        renderDay={renderDay}
                      />
                    </Grid>
                  </LocalizationProvider>
                 
                </Grid>

                <Box sx={{ width: "5%" }}></Box>
                <Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid style={{ marginRight: "4.4vh", marginTop: "5vh" }}>
                      <DatePicker
                        label="To"
                        value={endDate}
                        format="DD-MM-YYYY"
                        onChange={handleEndDateChange}
                        disabled={!startDate}
                        minDate={startDate}
                        textField={(props) => <TextField {...props} />}
                        shouldDisableDate={shouldDisableDate}
                        renderDay={renderDay}
                      />
                    </Grid>
                  </LocalizationProvider>
                </Grid>
              </Box>
            </Box>

            <Stack spacing={20}>
              <Textarea
                minRows={3}
                maxRows={3}
                placeholder="Enter reason here…"
                variant="soft"
                style={reasonStyle}
                value={reason}
                onChange={handleReasonChange}
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
                inputProps={{ maxLength: 1000 }}
              />
            </Stack>

             {openBrowser && (
              <Box
                style={{
                  position: "relative",
                  marginLeft: "3.8%",
                  marginTop: "5%",
                }}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  multiple="multiple"
                />
                <TextField
                  id="filled-basic"
                  label={fileName || "No file chosen"}
                  variant="filled"
                  style={{ width: "70%" }}
                />

                <label
                  htmlFor="file-upload"
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <Button
                    variant="contained"
                    component="span"
                    style={{
                      marginLeft: "596%",
                      marginTop: "9%",
                    }}
                  >
                    Browse
                  </Button>
                </label>

                <Button
                  variant="contained"
                  onClick={handleUpload}
                  style={{ marginLeft: "15%", marginTop: "1.1%" }}
                >
                  Upload
                </Button>
              </Box>
            )} 

            {extensionwarning && (
              <Alert
                severity="warning"
                style={{ width: "50%", marginLeft: "3.9%", marginTop: "2%" }}
              >
                File must be of type jpg/png/jpeg/pdf/docx .
              </Alert>
            )}
            {sizeWarning && (
              <Alert
                severity="warning"
                style={{ width: "50%", marginLeft: "3.9%", marginTop: "2%" }}
              >
                File must be less then 5MB .
              </Alert>
            )}
            {uploadedDocuments.length > 0 && (
              <TableContainer component={Paper} style={{ marginTop: "10%" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ backgroundColor: "#f0f0f0" }}>
                        Serial No.
                      </TableCell>
                      <TableCell style={{ backgroundColor: "#f0f0f0" }}>
                        Document Name
                      </TableCell>
                      <TableCell style={{ backgroundColor: "#f0f0f0" }}>
                        Remove Document
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadedDocuments.map((document, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{document.name}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleRemoveDocument(index)}>
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )} 
            {errorMessage &&
              errorMessage !==
                "Please select full-day or half-day for all dates" && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  <Alert
                    severity="error"
                    style={{ width: "80%", marginLeft: "10%", marginTop: "5%" }}
                  >
                    {errorMessage}
                  </Alert>
                </Typography>
              )}

            {isLoading && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <Grid container justifyContent="center" sx={{ mt: 4 }}>
              <Grid item xs={12} sm={6} md={4} lg={3} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    style={{
                      width: "60%",
                      marginTop: "2rem",
                      marginLeft: "-17%",
                      backgroundColor: "#1a237e",
                    }}
                    disabled={isLoading}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDraft}
                    style={{
                      width: "65%",
                      marginTop: "2rem",
                      marginRight: "-45%",
                      backgroundColor: "#1a237e",
                    }}
                    disabled={isLoading}
                  >
                    Save Draft
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Modal open={modalOpen}>
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
            {leaveType !== "Maternity Leave" &&
              leaveType !== "Paternity Leave" && (
                <Typography variant="body1">
                  M - Morning | A - Afternoon
                </Typography>
              )}
            <CloseIcon onClick={handleModalClose} />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "25%",
              marginBottom: "-1%",
              ...(halfdayCheckbox ? {} : { marginLeft: "38.5%" }),
              ...(leaveType === "Maternity Leave" ||
              leaveType === "Paternity Leave"
                ? { marginLeft: "50%" } // Custom styles
                : {}),
            }}
          >
            <Checkbox
              checked={fulldayCheckbox}
              onChange={handleFulldayChecked}
            />

            <Typography variant="body1">Full Day</Typography>
            {leaveType !== "Maternity Leave" &&
              leaveType !== "Paternity Leave" && (
                <>
                  <Checkbox
                    checked={halfdayCheckbox}
                    onChange={handleHalfdayChecked}
                  />

                  <Typography variant="body1">Half Day</Typography>
                </>
              )}
          </Box>

          {halfdayCheckbox &&
            leaveType !== "Maternity Leave" &&
            leaveType !== "Paternity Leave" && (
              <div>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "63%",
                    marginTop: "-8.3%",
                  }}
                >
                  <Checkbox
                    checked={MhalfCheckbox}
                    onChange={handleMHalfdayChecked}
                  />

                  <Typography variant="body1">M Half</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "81%",
                    marginTop: "-7.3%",
                  }}
                >
                  <Checkbox
                    checked={AhalfdayCheckbox}
                    onChange={handleAHalfdayChecked}
                  />

                  <Typography variant="body1">A Half</Typography>
                </Box>
              </div>
            )}

          <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
            <List>
              {selectedDates.map((date, index) => (
                <ListItem
                  key={index}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography sx={{ flex: 1 }}>
                    {moment(date).format("DD-MM-YYYY")}
                  </Typography>
                  <RadioGroup
                    aria-label="day-type"
                    name={`day-type-${date}`} // Unique name for each date
                    value={dayTypes[date] || ""} // No default selection, use empty string
                    onChange={(e) => handleDayTypeChange(date, e.target.value)}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "50px",
                    }}
                  >
                    <FormControlLabel
                      value="full"
                      control={<Radio />}
                      label="Full Day"
                    />
                    {leaveType !== "Maternity Leave" &&
                      leaveType !== "Paternity Leave" && (
                        <>
                          <FormControlLabel
                            value="half"
                            control={<Radio />}
                            label="Half Day"
                          />
                        </>
                      )}
                  </RadioGroup>

                  {/* Additional half-day options if selected as half */}
                  {dayTypes[date] === "half" && (
                    <RadioGroup
                      aria-label="halfday-type"
                      name={`halfday-type-${date}`} // Unique name for half-day options
                      value={mahalf[date] || ""} // No default selection
                      onChange={(e) =>
                        handlehalfDayTypeChange(date, e.target.value)
                      }
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      {leaveType !== "Maternity Leave" &&
                        leaveType !== "Paternity Leave" && (
                          <>
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
                          </>
                        )}
                    </RadioGroup>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
          {errorMessage &&
            errorMessage !== "No Enough Balance" &&
            errorMessage !== "Please select both start date and end date" &&
            errorMessage !== "Leave Type is required" &&
            errorMessage !==
              "Please enter reason with at least 4 characters" && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, textAlign: "center" }}
              >
                {errorMessage}
              </Typography>
            )}

          <Button variant="contained" onClick={handleModalSubmit}>
            Submit
          </Button>
        </ModalDialog>
      </Modal>

      {sessionOutModal && (
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
      )}
    </div>
  );
}
export default Applyforleave;

// return (
//   <div>
//     {open && (
//       <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
//         <Alert
//           onClose={handleClose}
//           severity="success"
//           variant="filled"
//           sx={{ width: '100%' }}
//         >
//           {action === 'submit'
//             ? 'Your leave application has been successfully submitted.'
//             : action === 'draft'
//             ? 'Your leave application has been saved as draft.'
//             : null}
//         </Alert>
//       </Snackbar>
//     )}
//     <Box sx={{ width: '95%', marginTop: 2 }}>
//       <Paper elevation={3} sx={{ padding: 2 }}>
//         <Grid container spacing={3} sx={{ marginTop: '5vh' }}>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth>
//               <InputLabel id="leave-type-label">Leave Type</InputLabel>
//               <Select
//                 labelId="leave-type-label"
//                 id="leave-type"
//                 value={leaveType}
//                 label="Leave Type"
//                 onChange={handleLeaveTypeChange}
//                 variant="standard"
//               >
//                 {filteredLeaveTypes.map((leaveType, index) => (
//                   <MenuItem key={index} value={leaveType.lname}>
//                     {leaveType.lname}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth error={teamLeaderError}>
//               <InputLabel id="team-leader-label">Team Leader</InputLabel>
//               <Select
//                 labelId="team-leader-label"
//                 id="team-leader"
//                 value={teamLeader}
//                 label="Team Leader"
//                 onChange={handleTeamLeaderChange}
//                 variant="standard"
//               >
//                 {filteredTeams.map((team, index) => (
//                   <MenuItem key={index} value={team.thierarchyid}>
//                     {team.teamname}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="From"
//                 value={startDate}
//                 maxDate={endDate}
//                 minDate={getMinDate()}
//                 disablePast={leaveType !== 'Sick Leave'}
//                 format="DD-MM-YYYY"
//                 onChange={handleStartDateChange}
//                 renderInput={(params) => (
//                   <TextField {...params} fullWidth error={teamLeaderError} />
//                 )}
//                 shouldDisableDate={shouldDisableDate}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="To"
//                 value={endDate}
//                 format="DD-MM-YYYY"
//                 onChange={handleEndDateChange}
//                 disabled={!startDate}
//                 minDate={startDate}
//                 renderInput={(params) => <TextField {...params} fullWidth />}
//                 shouldDisableDate={shouldDisableDate}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={12}>
//             <Textarea
//               minRows={3}
//               maxRows={3}
//               placeholder="Enter reason here…"
//               variant="soft"
//               value={reason}
//               onChange={handleReasonChange}
//               sx={{
//                 borderBottom: '2px solid',
//                 borderColor: 'neutral.outlinedBorder',
//                 borderRadius: 0,
//                 '&:hover': {
//                   borderColor: 'neutral.outlinedHoverBorder',
//                 },
//                 '&::before': {
//                   border: '1px solid var(--Textarea-focusedHighlight)',
//                   transform: 'scaleX(0)',
//                   left: 0,
//                   right: 0,
//                   bottom: '-2px',
//                   top: 'unset',
//                   transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
//                   borderRadius: 0,
//                 },
//                 '&:focus-within::before': {
//                   transform: 'scaleX(1)',
//                 },
//               }}
//               inputProps={{ maxLength: 1000 }}
//             />
//           </Grid>
//           {/* {openBrowser && (
//             <Grid item xs={12}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <input
//                   type="file"
//                   id="file-upload"
//                   onChange={handleFileChange}
//                   style={{ display: 'none' }}
//                   multiple
//                 />
//                 <TextField
//                   id="filled-basic"
//                   label={fileName || 'No file chosen'}
//                   variant="filled"
//                   fullWidth
//                   readOnly
//                 />
//                 <label htmlFor="file-upload">
//                   <Button variant="contained" component="span">
//                     Browse
//                   </Button>
//                 </label>
//                 <Button variant="contained" onClick={handleUpload}>
//                   Upload
//                 </Button>
//               </Box>
//             </Grid>
//           )}
//           {extensionwarning && (
//             <Grid item xs={12}>
//               <Alert severity="warning">
//                 File must be of type jpg/png/jpeg/pdf/docx.
//               </Alert>
//             </Grid>
//           )}
//           {sizeWarning && (
//             <Grid item xs={12}>
//               <Alert severity="warning">File must be less than 5MB.</Alert>
//             </Grid>
//           )}
//           {uploadedDocuments.length > 0 && (
//             <Grid item xs={12}>
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Serial No.</TableCell>
//                       <TableCell>Document Name</TableCell>
//                       <TableCell>Remove Document</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {uploadedDocuments.map((document, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{document.name}</TableCell>
//                         <TableCell>
//                           <Button onClick={() => handleRemoveDocument(index)}>
//                             <DeleteIcon />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Grid>
//           )} */}
//           {errorMessage &&
//             errorMessage !== 'Please select full-day or half-day for all dates' && (
//               <Grid item xs={12}>
//                 <Alert severity="error">{errorMessage}</Alert>
//               </Grid>
//             )}
//           {isLoading && (
//             <Box
//               sx={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 backgroundColor: 'rgba(255, 255, 255, 0.7)',
//               }}
//             >
//               <CircularProgress />
//             </Box>
//           )}
//           <Grid item xs={12}>
//             <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
//               <Button
//                 variant="contained"
//                 onClick={handleSubmit}
//                 sx={{ width: '60%', backgroundColor: '#1a237e' }}
//                 disabled={isLoading}
//               >
//                 Submit
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleDraft}
//                 sx={{ width: '60%', backgroundColor: '#1a237e' }}
//                 disabled={isLoading}
//               >
//                 Save as Draft
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Box>
//     <Modal open={modalOpen} onClose={handleModalClose}>
//       <ModalDialog
//         aria-labelledby="dialog-title"
//         aria-describedby="dialog-description"
//         sx={{
//           minWidth: '30vw',
//           maxWidth: '70vw',
//         }}
//       >
//         <DialogTitle id="dialog-title" component="h2">
//           <Stack
//             direction="row"
//             alignItems="center"
//             justifyContent="space-between"
//           >
//             <Typography variant="h6" fontWeight="bold">
//               Confirm Leave Details
//             </Typography>
//             <Button
//               variant="outlined"
//               color="error"
//               onClick={handleModalClose}
//             >
//               <CloseIcon />
//             </Button>
//           </Stack>
//         </DialogTitle>
//         <List>
//           {selectedDates.map((date, index) => (
//             <ListItem key={index}>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid item xs={12} sm={4}>
//                   <Typography>{moment(date).format('DD-MM-YYYY')}</Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={8}>
//                   <RadioGroup
//                     row
//                     value={dayTypes[index] || ''}
//                     onChange={(event) => handleDayTypeChange(index, event)}
//                   >
//                     <FormControlLabel
//                       value="full"
//                       control={<Radio />}
//                       label="Full Day"
//                       onChange={handleFulldayChecked}
//                     />
//                     <FormControlLabel
//                       value="half"
//                       control={<Radio />}
//                       label="Half Day"
//                       onChange={handleHalfdayChecked}
//                     />
//                   </RadioGroup>
//                   {dayTypes[index] === 'half' && (
//                     <RadioGroup
//                       row
//                       value={halfdayCheckbox[index] || ''}
//                       onChange={(event) => handlehalfDayTypeChange(index, event)}
//                     >
//                       <FormControlLabel
//                         value="mhalf"
//                         control={<Radio />}
//                         label="First Half"
//                         onChange={handleMHalfdayChecked}
//                       />
//                       <FormControlLabel
//                         value="ahalf"
//                         control={<Radio />}
//                         label="Second Half"
//                         onChange={handleAHalfdayChecked}
//                       />
//                     </RadioGroup>
//                   )}
//                 </Grid>
//               </Grid>
//             </ListItem>
//           ))}
//         </List>
//         {errorMessage === 'Please select full-day or half-day for all dates' && (
//           <Grid item xs={12}>
//             <Alert severity="error">{errorMessage}</Alert>
//           </Grid>
//         )}
//         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
//           <Button variant="contained" onClick={handleModalSubmit}>
//             Confirm
//           </Button>
//           <Button variant="contained" onClick={handleModalClose}>
//             Close
//           </Button>
//         </Box>
//       </ModalDialog>
//     </Modal>
//     <Modal open={sessionOutModal} onClose={handleOKChanges}>
//       <ModalDialog
//         aria-labelledby="session-dialog-title"
//         aria-describedby="session-dialog-description"
//         sx={{
//           minWidth: '30vw',
//           maxWidth: '70vw',
//         }}
//       >
//         <DialogTitle id="session-dialog-title" component="h2">
//           <Typography variant="h6" fontWeight="bold">
//             Session Expired
//           </Typography>
//         </DialogTitle>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             textAlign: 'center',
//           }}
//         >
//           <Typography variant="body1" sx={{ mb: 2 }}>
//             Your session has expired. Please log in again to continue.
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => {
//               setSessionOutModal(false);
//               handleOKChanges();
//             }}
//           >
//             OK
//           </Button>
//         </Box>
//       </ModalDialog>
//     </Modal>
//   </div>
// );
// };

// export default Applyforleave;
