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
import Alert from "@mui/material/Alert";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import TableContainer from "@mui/material/TableContainer";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import { AlertTitle } from "@mui/material";
import Base64 from "base-64";
import { Buffer } from "buffer";
import DraftSidebar from "./DraftSidebar";
// import { useSession } from "../sessionContext";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";

function EditDrafts() {
  const location = useLocation();
  const { state } = location;
  const {
    U_id,
    leaveappln_id,
    LeaveType,
    leaveappln_reason,
    teamleaderid,
    teamLeaderNames,
    StartDate,
    EndDate,
    FullDay,
    emplyEmail,
    MorningHalf,
    AfternoonHalf,
    teamleaderEmail,
    U_name,
    HalfDay,
  } = state;

  const [leaveType, setLeaveType] = useState(LeaveType);

  const [teamLeader, setTeamLeader] = useState(teamleaderid);

  const [startDate, setStartDate] = useState(
    StartDate ? dayjs(StartDate) : null
  );

  const [endDate, setEndDate] = useState(dayjs(EndDate));
  const [errorMessage, setErrorMessage] = useState("");
  const [teamLeaderSelected, setTeamLeaderSelected] = useState(false);
  const [leavetypeSelected, setLeaveTypeSelected] = useState(false);
  const [teamLeaderError, setTeamLeaderError] = useState(false);
  const [reason, setReason] = useState(leaveappln_reason);
  const [selectedDates, setSelectedDates] = useState([
    FullDay,
    MorningHalf,
    AfternoonHalf,
  ]);
  const [layout, setLayout] = useState(undefined);
  const [scroll, setScroll] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [dayTypes, setDayTypes] = useState({});
  const [mahalf, setMahalf] = useState({});
  const [fullDayLeaves, setFullDayLeaves] = useState([FullDay]);
  const [halfDayLeaves, setHalfDayLeaves] = useState([HalfDay]);
  const [morningHalfLeaves, setMorningHalfLeaves] = useState([MorningHalf]);
  const [afternoonHalfLeaves, setAfternoonHalfLeaves] = useState([
    AfternoonHalf,
  ]);

  const [leaveDetails, setLeaveDetails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamLeaderName, setTeamLeaderName] = useState([]);
  const [leavetypeName, setleavetypeName] = useState([]);
  const [teamLeaderId, setTeamLeaderId] = useState(teamleaderid);
  const [leavetypeId, setLeavetypeId] = useState("");
  const [tid, setTid] = useState("");
  const [llid, setllid] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeamLeaderId, setSelectedTeamLeaderId] = useState("");
  const [teamail, setTeamMail] = useState("");
  const [selctedteamemail, setSelectedteammail] = useState(teamleaderEmail);
  const [teamId, setTeamId] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = useState(null);
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
  const [defaultis, setDefaultdayis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fulldayCheckbox, setFullDayCheckbox] = useState(false);
  const [halfdayCheckbox, setHalfDayCheckbox] = useState(false);
  const [MhalfCheckbox, setMHalfDayCheckbox] = useState(false);
  const [AhalfdayCheckbox, setAHalfDayCheckbox] = useState(false);
  const [sessionOutModal, setSessionOutModal] = useState(false);

  // const { sessionReminder, setOpenSessionModal, //resetTimeout } = useSession();
  const navigate = useNavigate();

 

 
  const handleOKChanges = () => {
    //resetTimeout();
    
    setSessionOutModal(false);
  }

  
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


  // useEffect(() => {
  //   if (sessionReminder) {
  //     setSessionOutModal(true);
  //   }
  // }, [sessionReminder]);

  // const handleOKChanges = () => {
  //   //resetTimeout();
  //   setOpenSessionModal(false);
  //   setSessionOutModal(false);
  // };

  useEffect(() => {
    const fetchhierarchyDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}hierarchy`
        );
        if (response.ok) {
          const data = await response.json();
          // Filter out only the entries where user_id matches U_id
          const hierarchyDetails = data.hierarchyDetails
            .filter((item) => item.user_id === U_id)
            .map((item) => ({
              user_id: item.user_id,
              teamid: item.teamleader_id,
            }));

          const temaid = hierarchyDetails.map((item) => item.teamid);
          setTeamId(temaid);
        } else {
        }
      } catch (error) {}
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

  const [userid, setuserid] = useState();
  useEffect(() => {
    setuserid(U_id);
  }, [U_id]);

  const [filteredData, setFilteredData] = useState([]);
  const [usergender, setUserGender] = useState();

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
  useEffect(() => {
    if (teamLeader) {
      const selectedTeamLeader = teamLeaderName.find(
        (leader) => leader.name === teamLeader
      );
      if (selectedTeamLeader) {
        setTid(selectedTeamLeader.id);
      }
    }
  }, [teamLeader, teamLeaderName]);

  useEffect(() => {
    if (leaveType) {
      const selectedLeaveType = leavetypeName.find(
        (leaveTypee) => leaveTypee.lname === leaveType
      );
      if (selectedLeaveType) {
        setllid(selectedLeaveType.lid);
      }
    }
  }, [leaveType, leavetypeName]);

  const handleLeaveTypeChange = (event) => {
    //resetTimeout();
    const selectedleavetypename = event.target.value;
    setLeaveType(selectedleavetypename);
    setLeaveTypeSelected(true);
    const selctedleavetype = leavetypeName.find(
      (leavetypess) => leavetypess.lname == selectedleavetypename
    );
    if (selctedleavetype) {
      setLeavetypeId(selctedleavetype.lid);
    }

    if (errorMessage !== "") {
      setErrorMessage("");
    }
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
    setTeamLeaderError(false);
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
    //resetTimeout();
    if (!teamLeaderSelected) {
      setTeamLeaderError(true);
    } else {
      setStartDate(date);

      setTeamLeaderError(false);
    }
  };

  const handleEndDateChange = (date) => {
    //resetTimeout();
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
    //resetTimeout();
    // navigate(-1)
    setIsLoading(true);
    setIsSubmitting(true);
    // window.location.reload();
    setAction("submit");
    setOpen(true);
    const currentDate = format(new Date(), "dd-MM-yyyy"); // Format current date
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });

    if (!leaveType) {
      setErrorMessage("Leave Type is required");
      setOpen(false);
      setIsLoading(false);
      setIsSubmitting(false);

      return;
    }
    if (!teamLeader) {
      setErrorMessage("Team Leader is required");
      setOpen(false);
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage("Please select both start date and end date");
      setOpen(false);
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }
    if (!reason || reason.length < 4) {
      setErrorMessage("Please enter reason with at least 4 characters");
      setOpen(false);
      setIsLoading(false);
      setIsSubmitting(false);
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
    if (updatedFullDayLeaves.length === 0) {
    }

    const formatFullDayLeaves = (dates) => {
      if (dates && dates.length > 0) {
        return dates.map((date) => moment(date).format("DD-MM-YYYY"));
      } else {
        return FullDay;
      }
    };

    const formatHalfDayLeaves = (dates) => {
      if (dates && dates.length > 0) {
        return dates.map((date) => moment(date).format("DD-MM-YYYY"));
      } else {
        return HalfDay;
      }
    };
    const formatMorningHalfLeaves = (dates) => {
      if (dates && dates.length > 0) {
        return dates.map((date) => moment(date).format("DD-MM-YYYY"));
      } else {
        return MorningHalf;
      }
    };

    const formatAfternoonHalfLeaves = (dates) => {
      if (dates && dates.length > 0) {
        return dates.map((date) => moment(date).format("DD-MM-YYYY"));
      } else {
        return AfternoonHalf;
      }
    };

    setFullDayLeaves(formatFullDayLeaves(updatedFullDayLeaves));
    setHalfDayLeaves(formatHalfDayLeaves(updatedHalfDayLeaves));
    setMorningHalfLeaves(formatMorningHalfLeaves(updatedMorningHalfLeaves));
    setAfternoonHalfLeaves(
      formatAfternoonHalfLeaves(updatedAfternoonHalfLeaves)
    );

    const leaveData = {
      leaveappln_id,
      leaveType,
      teamLeader: teamLeaderId,
      reason,
      fullDayLeaves: formatFullDayLeaves(updatedFullDayLeaves),
      halfDayLeaves: formatHalfDayLeaves(updatedHalfDayLeaves),
      morningHalfLeaves: formatMorningHalfLeaves(updatedMorningHalfLeaves),
      afternoonHalfLeaves: formatAfternoonHalfLeaves(
        updatedAfternoonHalfLeaves
      ),
      currentTime,
      currentDate,
      U_id,
      totalLeaveDays,
      U_name,
      teamleaderEmail: selctedteamemail,
      llid: llid,
      activeyn: "X",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      serialNumbers,
      fileExtensions,
      docId,
      docName,
    };

    const numberOfFullDayLeaves = leaveData.fullDayLeaves.length;

    const numberOfMorningHalfLeaves = leaveData.morningHalfLeaves.length / 2;

    const numberOfAfternoonHalfLeaves =
      leaveData.afternoonHalfLeaves.length / 2;

    const totalleavedataday =
      numberOfFullDayLeaves +
      numberOfMorningHalfLeaves +
      numberOfAfternoonHalfLeaves;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}updateLeaveApplication/${leaveappln_id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            LeaveType: llid,
            StartDate: startDate,
            EndDate: endDate,
            leaveappln_reason: reason,
            teamleaderid: teamLeader,
            teamleaderEmail: selctedteamemail,
            FullDay: leaveData.fullDayLeaves,
            HalfDay: leaveData.halfDayLeaves,
            MorningHalf: leaveData.morningHalfLeaves,
            AfternoonHalf: leaveData.afternoonHalfLeaves,
            totalLeaveDays: totalleavedataday,
            U_name: U_name,
            emplyEmail: emplyEmail,
            DOJ: currentDate,
            activeyn: "Y",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // navigate(-1, { state: leaveData });
      if (!response.ok) {
        const errorMessage = await response.json();
        const remainingLeaves = errorMessage.remainingLeaves;
        setErrorMessage(`No Enough Balance`);
        setIsLoading(false);
        setIsSubmitting(false);
        return;
      }

      setErrorMessage("");
      setLeaveType("");
      setTeamLeader("");
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
      setErrorMessage("Failed to update leave application.");
      setIsSubmitting(false);
      setIsLoading(false);
    }
    window.location.reload();
    navigate(-1, { state: leaveData });
  };
  useEffect(() => {
    const fetchLeaveApplnDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}editdraftteamleader`
        );
        if (response.ok) {
          const data = await response.json();
          const teamleaderDetails = data.teamleaderDetails.map((item) => ({
            name: item.Name,
            id: item.TL_id,
          }));

          setTeamLeaderName(teamleaderDetails);
        } else {
        }
      } catch (error) {}
    };

    fetchLeaveApplnDetails();
  }, []);

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

  const handleDraft = async () => {
    //resetTimeout();
    setIsLoading(true);

    setIsSubmitting(true);
    // window.location.reload();
    setAction("draft");
    setOpen(true);
    const currentDate = format(new Date(), "dd-MM-yyyy"); // Format current date
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Validation checks
    if (!leaveType) {
      setErrorMessage("Leave Type is required");
      setIsLoading(false);
      setOpen(false);
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
    if (updatedFullDayLeaves.length === 0) {
    }

    const formatFullDayLeaves = (dates) => {
      if (dates && dates.length > 0) {
        return dates.map((date) => moment(date).format("DD-MM-YYYY"));
      } else {
        return FullDay;
      }
    };

    const formatHalfDayLeaves = (dates) => {
      if (dates && dates.length > 0) {
        return dates.map((date) => moment(date).format("DD-MM-YYYY"));
      } else {
        return HalfDay;
      }
    };
    const formatMorningHalfLeaves = (dates) => {
      if (dates && dates.length > 0) {
        return dates.map((date) => moment(date).format("DD-MM-YYYY"));
      } else {
        return MorningHalf;
      }
    };

    const formatAfternoonHalfLeaves = (dates) => {
      if (dates && dates.length > 0) {
        return dates.map((date) => moment(date).format("DD-MM-YYYY"));
      } else {
        return AfternoonHalf;
      }
    };

    setFullDayLeaves(formatFullDayLeaves(updatedFullDayLeaves));
    setHalfDayLeaves(formatHalfDayLeaves(updatedHalfDayLeaves));
    setMorningHalfLeaves(formatMorningHalfLeaves(updatedMorningHalfLeaves));
    setAfternoonHalfLeaves(
      formatAfternoonHalfLeaves(updatedAfternoonHalfLeaves)
    );

    const formattedStartDate = moment(startDate).format("DD-MM-YYYY");
    const formattedEndDate = moment(endDate).format("DD-MM-YYYY");

    const leaveDraft = {
      leaveappln_id,
      leaveType,
      teamLeader: teamLeaderId,
      reason,
      fullDayLeaves: formatFullDayLeaves(updatedFullDayLeaves),
      halfDayLeaves: formatHalfDayLeaves(updatedHalfDayLeaves),
      morningHalfLeaves: formatMorningHalfLeaves(updatedMorningHalfLeaves),
      afternoonHalfLeaves: formatAfternoonHalfLeaves(
        updatedAfternoonHalfLeaves
      ),
      currentTime,
      currentDate,
      U_id,
      teamleaderEmail: selctedteamemail,
      llid: llid,
      totalLeaveDays,
      U_name,
      activeyn: "X",
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      serialNumbers,
      fileExtensions,
      docId,
      docName,
    };

    const numberOfFullDayLeaves = leaveDraft.fullDayLeaves.length;

    const numberOfMorningHalfLeaves = leaveDraft.morningHalfLeaves.length / 2;

    const numberOfAfternoonHalfLeaves =
      leaveDraft.afternoonHalfLeaves.length / 2;

    const totalleavedataday =
      numberOfFullDayLeaves +
      numberOfMorningHalfLeaves +
      numberOfAfternoonHalfLeaves;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}updateLeaveApplication/${leaveappln_id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            LeaveType: llid,
            StartDate: startDate,
            EndDate: endDate,
            leaveappln_reason: reason,
            teamleaderid: teamLeader,
            teamleaderEmail: selctedteamemail,
            FullDay: leaveDraft.fullDayLeaves,
            HalfDay: leaveDraft.halfDayLeaves,
            MorningHalf: leaveDraft.morningHalfLeaves,
            AfternoonHalf: leaveDraft.afternoonHalfLeaves,
            totalLeaveDays: totalleavedataday,
            DOJ: currentDate,
            activeyn: "X",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setOpen(false);
        const errorMessage = await response.json(); // Get error message from response body
        const remainingLeaves = errorMessage.remainingLeaves;
        setErrorMessage(`No Enough Balance`);
        setIsSubmitting(false);
        return;
      }

      setErrorMessage("");
      setLeaveType("");
      setTeamLeader("");
      setStartDate(null);
      setEndDate(null);
      setReason("");
      setFullDayLeaves([]);
      setHalfDayLeaves([]);
      setMorningHalfLeaves([]);
      setAfternoonHalfLeaves([]);

      setIsLoading(false);
      setIsSubmitting(false);
      window.location.reload();
      navigate(-1, { state: leaveDraft });
    } catch (error) {
      setIsLoading(false);

      setErrorMessage("Failed to update leave application.");
      setIsSubmitting(false);
    }
  };

  const handleDayTypeChange = (date, value) => {
    //resetTimeout();
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
    //resetTimeout();
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
    //resetTimeout();
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

    if (leaveType === "Privilege Leave" && startDate <= sevenDaysAhead) {
      setErrorMessage(
        "Privilege  Leave applications must be made at least 7 days in advance."
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

  const reasonStyle = {
    marginTop: "2rem",
    marginLeft: "4vh",
    marginRight: "4vh",
  };
  const paperStyle = {
    height: "75vh",
    width: "100%",
    maxWidth: "110vh",
    margin: "57.3px auto auto auto",
  };

  const handleClick = () => {
    //resetTimeout();
    setOpen(true);
  };

  const handleReasonChange = (e) => {
    //resetTimeout();
    setReason(e.target.value);
    
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

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const handleFileChange = (event) => {
    //resetTimeout();
    const files = event.target.files;
    const allowedExtensions = ["jpg", "png", "jpeg", "pdf", "docx"];
    const maxSize = 5 * 1024 * 1024;
    let isValid = true;

    const filesArray = Array.from(files);

    filesArray.forEach((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        isValid = false;

        setExtensionWarning(true);
      } else if (file.size > maxSize) {
        isValid = false;

        setSizeWarning(true);
      } else {
        setExtensionWarning(false);
        setSizeWarning(false);
      }
    });

    if (isValid) {
      setSelectedFiles(filesArray);

      const fileNames = filesArray.map((file) => file.name).join(", ");
      setFileName(fileNames);
      setErrorMessage("");
    }
  };

  const handleUpload = () => {
    //resetTimeout();
    const uploadedFiles = selectedFiles.map((file, index) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileBytes = new Uint8Array(event.target.result);
          const base64String = Base64.encode(fileBytes);

          resolve({
            name: file.name,
            base64Data: base64String,
            binaryData: event.target.result,
            extension: file.name.split(".").pop().toLowerCase(),
            serialNumber: index + 1,
          });
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsArrayBuffer(file);
      });
    });

    Promise.all(uploadedFiles)
      .then((files) => {
        setUploadedDocuments((prevDocuments) => [...prevDocuments, ...files]);

        const base64Data = files.map((file) => file.base64Data);
        setBase64DataArray((prevArray) => [...prevArray, ...base64Data]);

        const extensions = files.map((file) => file.extension);
        setFileExtensions((prevExtensions) => [
          ...prevExtensions,
          ...extensions,
        ]);

        const serials = files.map((file) => file.serialNumber);
        setSerialNumbers((prevSerials) => [...prevSerials, ...serials]);

        setSelectedFiles([]);
        setFileName("");
      })

      .catch((error) => {});
  };

  function decodeBase64(base64String) {
    return atob(base64String);
  }

  function base64ToUint8Array(base64String) {
    const binaryString = decodeBase64(base64String);
    const len = binaryString.length;
    const uint8Array = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array;
  }

  const decodedDataArray = base64DataArray.map(base64ToUint8Array);

  const handleRemoveDocument = (index) => {
    //resetTimeout();
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
    <div style={{ filter: sessionOutModal ? "blur(5px)" : "none" }}>
      <DraftSidebar />
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
              : "Your leave application has been saved as draft."}
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
                  {LeaveType && (
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
                  )}
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
                        format="DD-MM-YYYY"
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
                        label="End"
                        value={endDate}
                        format="DD-MM-YYYY"
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
              />
            </Stack>

            {/* {openBrowser && (
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
            )} */}
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
                    onClick={handleDraft}
                    style={{
                      width: "60%",
                      marginTop: "2rem",
                      marginLeft: "-17%",
                      backgroundColor: "#1a237e",
                    }}
                    disabled={isLoading}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    style={{
                      width: "65%",
                      marginTop: "2rem",
                      marginRight: "-45%",
                      backgroundColor: "#1a237e",
                    }}
                    disabled={isLoading}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
                    {moment(date).format("DD-MM-YYYY")}
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
        </Modal> */}
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

export default EditDrafts;
