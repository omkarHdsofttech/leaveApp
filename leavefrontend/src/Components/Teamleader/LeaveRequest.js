import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Card,
  Modal,
  CardContent,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Paper } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
// import { useSession } from "../sessionContext";
import Backdrop from "@mui/material/Backdrop";
import { ModalDialog } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useInactivityContext } from "../Context/Inactivity";
import MedicalCertificateModal from "./MedicalCertificateModal";
export default function LeaveRequest({
  email,
  U_name,
  TL_id,
  U_id,
  U_desig,
  username,
}) {
  const [teamLeaderData, setTeamLeaderData] = useState([]);
  const [leaveRequestData, setLeaveRequestData] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [documentImage, setDocumentImage] = useState(null);
  const [documentsState, setDocumentsState] = useState({});
  const [forwardOptions, setForwardOptions] = useState([]);
  const [fleaveDetails, setFleavedetails] = useState([]);
  const [forwardEntries, setForwardEntries] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Define filteredData state
  const [matchedLeaveApplications, setMatchedLeaveApplications] = useState([]); // Define matchedLeaveApplications state
  const [status, setStatus] = useState("");
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = useState(null);
  const [submittedAction, setSubmittedAction] = useState("");
  const [actionData, setActionData] = useState({});
  const [balanceDetails, setBalanceDetails] = useState([]);
  const [expandIconClicked, setExpandIconClicked] = useState(false);
  const [insufficientLeaveApplications, setInsufficientLeaveApplications] =
    useState([]);
  const [showforwardto, setShowforwardto] = useState(false);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalLeaveDays, setTotalLeaveDays] = useState("");
  const [submittedApplications, setSubmittedApplications] = useState([]); // S
  const [remarkerror, setRemarkerror] = useState(false);
  const [pendingHighlight, setPendingHighlight] = useState(false);
  const [sessionOutModal, setSessionOutModal] = useState(false);
  const [medicalCertificateModal, setMedicalCertificateModal] = useState(false);
  const { sessionReminder } = useInactivityContext();
  const [matchedLeaveApplnId, setMatchedLeaveApplnId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  // const { sessionReminder, setOpenSessionModal, resetTimeout } = useSession();
  const navigate = useNavigate();

  useEffect(() => {}, [TL_id]);
  const handleOKChanges = () => {
    //resetTimeout();

    setSessionOutModal(false);
  };
  useEffect(() => {
    if (sessionReminder) {
      setSessionOutModal(true);
      console.log("1 minute is left before inactivity timeout.");
    }
  }, [sessionReminder]);

  const [applicationIds, setApplicationIds] = useState([]);
  useEffect(() => {
    const fetchmovemetDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}movementTL`
        );
        if (response.ok) {
          const data = await response.json();
          const movementdetails = data.movementdetails.map((item) => ({
            appl_id: item.leaveappln_id,
            movedid: item.movedto_id,
          }));

          const filteredMovementDetails = movementdetails.filter(
            (item) => item.movedid === TL_id
          );

          const ids = filteredMovementDetails.map((item) => item.appl_id);
          setApplicationIds(ids);
        } else {
        }
      } catch (error) {}
    };

    fetchmovemetDetails();
  }, []);

  const [leaveapplicationIds, setLeaveApplicationIds] = useState([]);
  useEffect(() => {
    const fetchmovemetleaveDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}movementleavedtl`
        );
        if (response.ok) {
          const data = await response.json();
          const movementleavedetails = data.movementleavedetails.map(
            (item) => ({
              lappl_id: item.leaveappln_id,
              leavetype: item.LeaveType,
              lstatus: item.status,
              leavereason: item.leaveappln_reason,
              leaveusername: item.U_name,
              leaveuserid: item.user_id,
              leavedesig: item.user_desig,
              leaveapplndate: item.leaveappln_date,
              leavefullday: item.FullDay,
              leaveMorninghalf: item.MorningHalf,
              leaveAfternoonhalf: item.AfternoonHalf,
              ltoemail: item.emplyEmail,
            })
          );

          const matchingIds = movementleavedetails.filter((item) =>
            applicationIds.includes(item.lappl_id)
          );

          setLeaveApplicationIds(matchingIds);

          matchingIds.forEach((item) => {});
        } else {
        }
      } catch (error) {}
    };

    fetchmovemetleaveDetails();
  }, [applicationIds]);

  useEffect(() => {
    const fetchForwardEntries = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}forwardrequests`
        );
        if (response.ok) {
          const data = await response.json();

          const filteredEntries = data.forwardRequests.filter(
            (entry) => entry.movedto_id === TL_id
          );
          const leaveapplnIds = filteredEntries.map(
            (entry) => entry.leaveappln_id
          );

          setForwardEntries(filteredEntries);
        } else {
        }
      } catch (error) {}
    };

    fetchForwardEntries();
  }, [TL_id]);

  useEffect(() => {
    const fetchLeaveApplnDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leaverequest`
        );
        if (response.ok) {
          const data = await response.json();

          const leaveapplnIds = forwardEntries.map(
            (entry) => entry.leaveappln_id
          );

          const matchedLeaveApplications = data.leaveDetails.filter((app) =>
            leaveapplnIds.includes(app.leaveappln_id)
          );

          setMatchedLeaveApplications(matchedLeaveApplications);
        } else {
        }
      } catch (error) {}
    };

    fetchLeaveApplnDetails();
  }, [forwardEntries]);

  useEffect(() => {
    const fetchLeaveApplnDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leaverequest`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("dta aof", data);
        } else {
        }
      } catch (error) {}
    };

    fetchLeaveApplnDetails();
  }, []);

  const [hrgmmail, setHrGmMail] = useState();

  useEffect(() => {
    const GMHRmail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_APIURL}GMHRmail`);
        if (response.ok) {
          const data = await response.json();
          setHrGmMail(data);
        } else {
        }
      } catch (error) {}
    };
    GMHRmail();
  }, []);

  useEffect(() => {
    const fetchTeamLeaderNames = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}teamleader/names_departments`
        );
        if (response.ok) {
          const data = await response.json();
          setForwardOptions(data.teamLeaders);
        } else {
        }
      } catch (error) {}
    };

    fetchTeamLeaderNames();
  }, []);

  useEffect(() => {
    const fetchTeamLeaderData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}teamleader`
        );
        if (response.ok) {
          const data = await response.json();
          const filteredData = data.teamleaderDetails.filter(
            (leader) => leader.Temail === email
          );
          setTeamLeaderData(filteredData);
        } else {
        }
      } catch (error) {}
    };

    const fetchLeaveRequestData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leaverequest?TL_id=${TL_id}`
        );
        if (response.ok) {
          const data = await response.json();
          setLeaveRequestData(data.leaveDetails);
        } else {
        }
      } catch (error) {}
    };

    fetchTeamLeaderData();
    fetchLeaveRequestData();
  }, [email]);

  useEffect(() => {
    const updatedMatchedData = leaveRequestData.filter((request) =>
      teamLeaderData.some((leader) => leader.TL_id === request.teamleaderid)
    );
    setMatchedData(
      updatedMatchedData.map((request) => ({
        ...request,
        approvalOption: "",
        selectedName: "",
        remark: "",
      }))
    );

    const filteredData = updatedMatchedData.filter(
      (request) => request.teamleaderid === TL_id
    );
    setFilteredData(filteredData);
  }, [TL_id, leaveRequestData, teamLeaderData]);

  useEffect(() => {
    const handleInsufficientLeaveApplications = () => {
      const insufficientApplications = matchedLeaveApplications.filter(
        (request) => fleaveDetails[request.leaveappln_id]
      );
      setInsufficientLeaveApplications(insufficientApplications);
    };

    handleInsufficientLeaveApplications();
  }, [fleaveDetails, matchedLeaveApplications]);

  const [approvedApplications, setApprovedApplications] = useState([]);

  useEffect(() => {}, [approvedApplications]);

  useEffect(() => {}, [insufficientLeaveApplications]);

  const [selectedTeamLeaderId, setSelectedTeamLeaderId] = useState("");

  {
  }
  const [teamLeaderSelected, setTeamLeaderSelected] = useState(false);
  const [teamLeader, setTeamLeader] = useState("");
  const [teamEmail, setTeamEmail] = useState();
  const [teamail, setTeamMail] = useState("");
  const [teamleadername, setTeamLeaderName] = useState("");
  const [tdesig, setTeamDesig] = useState("");
  const handleTeamLeaderChange = (event, name, tname) => {
    //resetTimeout();
    const selectedTeamLeaderId = event.target.value;
    setTeamLeaderName(tname);

    if (event.target.value.length === 0) {
      setIsLoading(false);
      alert("please selct teamleader");
    }
    const selectedTeamLeaderEmail =
      filteredTeams.find((team) => team.thierarchyid === selectedTeamLeaderId)
        ?.temail || "";
    const selectedTeamLeaderDesig =
      filteredTeams.find((team) => team.thierarchyid === selectedTeamLeaderId)
        ?.teamsdesig || "";

    setTeamLeader(selectedTeamLeaderId);
    setTeamMail(selectedTeamLeaderEmail);
    setTeamDesig(selectedTeamLeaderDesig);
    setTeamLeaderSelected(true);

    setSelectedTeamLeaderId(selectedTeamLeaderId);
  };

  const leaveTypeNames = {
    SL: "Sick Leave",
    CL: "Casual Leave",
    PL: "Privilege Leave",
    LWP: "Leave Without Pay ",
    ML: "Maternity Leave",
    PTL: "Paternity Leave",
  };

  const getFullLeaveType = (shortType) => {
    return leaveTypeNames[shortType] || shortType;
  };

  const [selectedaction, setSelctedAction] = useState("");
  const handleApprovalChange = (event, id) => {
    //resetTimeout();
    const { value } = event.target;

    setSelctedAction(value);

    setMatchedData((prevData) => {
      return prevData.map((item) => {
        if (item.leaveappln_id === id) {
          const showForwardTo = value === "approveForward";
          setShowforwardto(showForwardTo);

          return {
            ...item,
            approvalOption: value,
            forwardOptionDisabled: value !== "approveForward",
          };
        }
        return item;
      });
    });
  };

  const [remark, setRemark] = useState("");
  const handleRemarkChange = (event, id) => {
    //resetTimeout();
    const { value } = event.target;
    setRemark(value);

    setMatchedData((prevData) => {
      return prevData.map((item) => {
        if (item.leaveappln_id === id) {
          return { ...item, remark: value };
        }
        return item;
      });
    });
  };
  const [submittedStatus, setSubmittedStatus] = useState(null);
  useEffect(() => {
    const statusFromStorage = localStorage.getItem("submittedStatus");
    if (statusFromStorage) {
      setSubmittedStatus(statusFromStorage);
      localStorage.removeItem("submittedStatus"); // Remove the status from local storage after retrieving it
    }
  }, []);

  useEffect(() => {
    if (submittedStatus) {
    }
  }, [submittedStatus]);
  const [showhistorytable, setShowhistory] = useState(false);
  const [remarker, setRemarker] = useState(false);
  const [leaveid, setLeaveid] = useState();
  const [tableshow, setTableShow] = useState(false);
  const [lastLogData, setLastLogData] = useState(null);
  const [approvalerror, setApprovalerror] = useState(false);
  const [teamerror, setTeamerror] = useState(false);

  const handleSubmit = async (event, id) => {
    //resetTimeout();
    setIsLoading(true);
    event.preventDefault();

    setLeaveid(id);

    const currentItem = matchedData.find((item) => item.leaveappln_id === id);

    if (currentItem) {
      const { approvalOption, remark, selectedName } = currentItem;

      if (!approvalOption) {
        setIsLoading(false);
        alert("Please select an approval action.");

        return;
      }

      if (selectedaction === "reject" && remark.trim().length < 5) {
        setIsLoading(false);
        alert("Please enter a remark with at least 5 characters.");
        return;
      }
      if (selectedaction === "approve" && remark.trim().length < 5) {
        setRemarkerror(true);
        setIsLoading(false);
        alert("Please enter a remark with at least 5 characters.");
        return;
      }

      if (approvalOption === "approveForward" && !teamLeader) {
        setIsLoading(false);
        alert("Please select a team leader.");

        return;
      }
      matchedData.forEach((item) => {
        if (
          item.leaveappln_id === id &&
          item.approvalOption === "approveForward"
        ) {
        }
      });

      let status = "";

      let currentTeamLeaderId = TL_id;
      let teamLeaderDesig = U_desig;

      switch (approvalOption) {
        case "approve":
          status = "Approved";
          setAction("Approved");

          break;

        case "reject":
          status = "Rejected";

          setAction("Rejected");
          break;
        case "approveForward":
          status = "Approved and forwarded";

          setAction("Approved and Forwarded");
          break;
        default:
          status = "";
      }
      if (status === "Approved" || status === "Rejected") {
        const logData = {
          leaveappln_id: id,
          status,
          remark,

          teamleader_id: TL_id,
          teamleader_desig: U_desig,

          activeyn: "Y",
          latestyn: "Y",
        };
        setLastLogData(logData);
      }

      const dataToSend = {
        U_name: currentItem.U_name,
        FullDay: currentItem.FullDay,
        MorningHalf: currentItem.MorningHalf,
        AfternoonHalf: currentItem.AfternoonHalf,
        userleaveType: currentItem.LeaveType,
        userreason: currentItem.leaveappln_reason,
        teamleadermail: teamail,
        status,
        hrgmmail,
        teamleadername,
        fromname: username,
        emplyEmail: currentItem.emplyEmail,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}saveLeaveApplicationData`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        );

        if (response.ok) {
        } else {
        }
      } catch (error) {}

      if (status === "Approved and Forwarded") {
      } else {
      }
      setStatus(status);
      setActionData((prevData) => ({
        ...prevData,
        [id]: status,
      }));

      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}teamleader/email-id?name=${selectedName}`
        );
        if (response.ok) {
          const data = await response.json();
          const { Temail, TL_id, Name } = data;

          const forwardResponse = await fetch(
            `${process.env.REACT_APP_APIURL}forwardrequest`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                leaveappln_id: id,
                movedto_id: TL_id,
                movedto_email: Temail,
                movedto_name: selectedName,
                selected_status: status,
                Remark: remark,
              }),
            }
          );

          if (forwardResponse.ok) {
          } else {
          }
        } else {
        }

        try {
          const response = await fetch(
            `${process.env.REACT_APP_APIURL}leaverequest/${id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: status,
                remark,
              }),
            }
          );

          if (response.ok) {
            setOpen(true);

            window.location.reload();

            localStorage.setItem("submittedStatus", status);
          } else {
          }
        } catch (error) {}
      } catch (error) {}
    } else {
    }
  };

  useEffect(() => {
    const fetchforwardmail = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}forwardmail`
        );
        if (response.ok) {
          const data = await response.json();
        } else {
        }
      } catch (error) {}
    };

    fetchforwardmail();
  }, []);
  const [forwarduserName, setforwardUserName] = useState("");
  const [userforwardEmail, setforwardUserEmail] = useState("");
  const [fullDayforward, setFullDayforward] = useState("");
  const [morningHalfforward, setMorningHalfforward] = useState("");
  const [afternoonHalfforward, setAfternoonHalfforward] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    sendingdataformail(
      forwarduserName,
      userforwardEmail,
      fullDayforward,
      morningHalfforward,
      afternoonHalfforward
    );
  }, [
    forwarduserName,
    userforwardEmail,
    fullDayforward,
    morningHalfforward,
    afternoonHalfforward,
  ]);
  const handleSubmitforward = async (event, id, userIdd) => {
    //resetTimeout();
    setIsLoading(true);
    event.preventDefault();
    if (selectedaction === "reject" && remark.trim().length < 5) {
      setIsLoading(false);
      setRemarkerror(true);
    } else {
      setRemarkerror(false);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}forwardmail`
      );
      if (response.ok) {
        const data = await response.json();
        const filteredData = data.forwardmail.find(
          (entry) => entry.leaveappln_id === id
        );

        if (filteredData) {
          setforwardUserName(filteredData.U_name);
          setforwardUserEmail(filteredData.emplyEmail);
          setFullDayforward(filteredData.FullDay);
          setMorningHalfforward(filteredData.MorningHalf);
          setAfternoonHalfforward(filteredData.AfternoonHalf);
        } else {
        }
      } else {
      }
    } catch (error) {}

    setLeaveid(id);

    const currentDatef = new Date();

    if (!selectedaction) {
      setIsLoading(false);
      alert("Please select an approval action.");
      return;
    }
    if (selectedaction === "reject" && remark.trim().length < 5) {
      setIsLoading(false);
      alert("Please enter a remark with at least 5 characters.");
      return;
    }

    matchedData.forEach((item) => {
      if (item.lappl_id === id && item.approvalOption === "approveForward") {
      }
    });

    let status = "";

    switch (selectedaction) {
      case "approve":
        status = "Approved";

        setAction("Approved");
        break;
      case "reject":
        status = "Rejected";

        setAction("Rejected");
        break;
      default:
        status = "";
    }

    if (status === "reject" && remark.trim().length < 5) {
      setIsLoading(false);
      alert("Please enter a remark with at least 5 characters.");

      return;
    }

    setStatus(status);

    setActionData((prevData) => ({
      ...prevData,
      [id]: status,
    }));

    const isExisting = await checkLeaveIdInMovementTable(id);
    if (isExisting) {
    } else {
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}leaverequest/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
            remark,
          }),
        }
      );

      if (response.ok) {
        setOpen(true);

        window.location.reload();

        localStorage.setItem("submittedStatus", status);
      } else {
      }
    } catch (error) {}
  };
  const sendingdataformail = async (
    userName,
    userEmail,
    fullDay,
    morningHalf,
    afternoonHalf
  ) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}saveLeaveApplicationDataf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName,
            userEmail,
            fullDay,
            morningHalf,
            afternoonHalf,
            status,
            hrgmmail,
          }),
        }
      );

      if (response.ok) {
      } else {
      }
    } catch (error) {}
  };
  const [serial, setSerial] = useState();

  useEffect(() => {}, [serial]);

  const checkLeaveIdInMovementTable = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}leaverequestmovement`
      );
      if (response.ok) {
        const data = await response.json();

        const leaveMovements = data.requestmovement.filter(
          (item) => item.leaveappln_id === id
        );

        const leaveIds = leaveMovements.map((item) => item.movedto_id);

        const leaveApplnSNs = leaveMovements.map((item) => {
          const currentSN = parseInt(item.leaveappln_SN, 10);
          const incrementedSN = currentSN + 1;
          return String(incrementedSN);
        });

        setSerial(leaveApplnSNs);
        return leaveIds.includes(id);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchLeaverequestserial = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leaverequestmovement`
        );
        if (response.ok) {
          const data = await response.json();
        } else {
        }
      } catch (error) {}
    };

    fetchLeaverequestserial();
  }, []);

  useEffect(() => {
    if (leaveid) {
      checkLeaveIdInMovementTable(leaveid);
    }
  }, [leaveid]);

  const [insufficientBalanceApplications, setInsufficientBalanceApplications] =
    useState([]);
  const [userrid, setuserrid] = useState();
  const [exlid, setExlid] = useState();
  const [filteruid, setFilteruid] = useState();

  const handleExpandIconClick = async (event, requestData, idd, lid, uid) => {
    //resetTimeout();
    event.stopPropagation();

    setuserrid(idd);
    setFilteruid(uid);

    setExlid(lid);

    setTotalLeaveDays(requestData.totalLeaveDays);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}check-document/${requestData.leaveappln_id}`
      );
      if (response.ok) {
        const data = await response.json();
        setMatchedLeaveApplnId(data.matched_leaveappln_id);

        // Update state for this specific leaveappln_id
        setDocumentsState((prevState) => ({
          ...prevState,
          [requestData.leaveappln_id]: data.documentData || null,
        }));
      } else if (response.status === 404) {
        setDocumentsState((prevState) => ({
          ...prevState,
          [requestData.leaveappln_id]: null,
        }));
        console.log("No document found for the given leave application ID.");
      }
    } catch (error) {
      console.error("Error fetching document data:", error);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}requestbalance`
      );
      if (response.ok) {
        const data = await response.json();
        const matchingBalanceEntry = data.balanceDetails.find(
          (entry) => entry.user_id === requestData.user_id
        );

        switch (requestData.LeaveType) {
          case "SL":
            if (
              matchingBalanceEntry.remaining_SL < requestData.totalLeaveDays
            ) {
              setInsufficientBalanceApplications((prevApps) => [
                ...prevApps,
                requestData.leaveappln_id,
              ]);
            }
            break;
          case "PL":
            if (
              matchingBalanceEntry.remaining_PL < requestData.totalLeaveDays
            ) {
              setInsufficientBalanceApplications((prevApps) => [
                ...prevApps,
                requestData.leaveappln_id,
              ]);
            }
            break;
          case "CL":
            if (
              matchingBalanceEntry.remaining_CL < requestData.totalLeaveDays
            ) {
              setInsufficientBalanceApplications((prevApps) => [
                ...prevApps,
                requestData.leaveappln_id,
              ]);
            }
            break;
          case "ML":
            if (
              matchingBalanceEntry.remaining_ML < requestData.totalLeaveDays
            ) {
              setInsufficientBalanceApplications((prevApps) => [
                ...prevApps,
                requestData.leaveappln_id,
              ]);
            }
            break;
          case "LWP":
            if (
              matchingBalanceEntry.remaining_LWP < requestData.totalLeaveDays
            ) {
              setInsufficientBalanceApplications((prevApps) => [
                ...prevApps,
                requestData.leaveappln_id,
              ]);
            }
            break;
          default:
        }
      } else {
      }
    } catch (error) {}
  };
  useEffect(() => {}, [exlid]);

  useEffect(() => {}, [userrid]);
  useEffect(() => {}, [insufficientBalanceApplications]);

  useEffect(() => {
    setLeaveApplications(
      matchedLeaveApplications.map((request) => ({
        ...request,
        status: "",
      }))
    );
  }, [matchedLeaveApplications]);
  useEffect(() => {}, [userId, totalLeaveDays]);
  console.log("matched app", matchedLeaveApplications);
  console.log("matched", exlid);
  const handleStatusUpdate = (id, status) => {
    //resetTimeout();
    setLeaveApplications((prevApplications) =>
      prevApplications.map((application) => {
        if (application.leaveappln_id === id) {
          return { ...application, status };
        }
        return application;
      })
    );
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

  const [teamId, setTeamId] = useState([]);

  const [filteredTeams, setFilteredTeams] = useState([]);

  useEffect(() => {
    const fetchhierarchyDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}hierarchys`
        );
        if (response.ok) {
          const data = await response.json();

          const hierarchyDetails = data.hierarchyDetails
            .filter(
              (item) =>
                item.user_id === filteruid && item.teamleader_id !== TL_id
            )
            .map((item) => ({
              user_id: item.user_id,
              teamid: item.teamleader_id,
              teamdesig: item.teamleader_desig,
            }));

          const temaid = hierarchyDetails.map((item) => item.teamid);
          setTeamId(temaid);
        } else {
        }
      } catch (error) {}
    };

    fetchhierarchyDetails();
  }, [filteruid]);

  const [userMasterDetails, setUserMasterDetails] = useState([]);
  const [userrdesig, setuserrdesig] = useState();
  useEffect(() => {
    const fetchHierarchyDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}usermasterrequest`
        );
        if (response.ok) {
          const data = await response.json();
          if (userrid) {
            const filteredData = data.usermasterdetail.filter(
              (item) => item.U_id === userrid
            );
            setUserMasterDetails(filteredData);
          }
        } else {
        }
      } catch (error) {}
    };

    fetchHierarchyDetails();
  }, [userrid]);

  useEffect(() => {
    if (userMasterDetails && userMasterDetails.length > 0) {
      const designation = userMasterDetails[0].U_desig;

      setuserrdesig(designation);
    }
  }, [userMasterDetails]);

  // Handle opening the modal
  const handleMedicalClick = () => {
    setOpenModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchteamhierarchy = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}teamleaderhierachys`
        );
        if (response.ok) {
          const data = await response.json();
          const teamleaderhierachy = data.teamleaderhierachy.map((item) => ({
            thierarchyid: item.TL_id,
            teamname: item.Name,
            temail: item.Temail,
            teamsdesig: item.Designation,
          }));

          const filteredTeams = teamleaderhierachy.filter((team) =>
            teamId.includes(team.thierarchyid)
          );

          setFilteredTeams(filteredTeams);
          filteredTeams.forEach((team) => {});
          filteredTeams.forEach((team) => {});
        } else {
        }
      } catch (error) {}
    };

    fetchteamhierarchy();
  }, [teamId]);

  useEffect(() => {}, [teamLeader]);
  useEffect(() => {}, [teamail]);
  useEffect(() => {}, [tdesig]);

  const [tabledata, setTableData] = useState([]);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const fetchapproveforwarddetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}movementapproveforward`
        );
        if (response.ok) {
          const data = await response.json();

          const filteredData = data.approveforwarddetails.filter(
            (item) => item.leavepapln_id === leaveid
          );

          setTableData(filteredData);
          setSubmit(true);

          const extractedFields = filteredData.map((item) => ({
            movedfrom_id: item.movedfrom_id,
            moved_action: item.moved_action,
            moved_remark: item.moved_remark,
          }));
        } else {
        }
      } catch (error) {}
    };

    fetchapproveforwarddetails();
  }, [leaveid]);

  const filteredMatchedData = matchedData.filter(
    (item) => item.activeyn !== "X"
  );

  const userIds = filteredMatchedData.map((item) => item.user_id);

  useEffect(() => {}, [filteredMatchedData]);

  useEffect(() => {
    if (status === "Approved and forwarded") {
      sendDataToServer();
    }
  }, [leaveid, teamLeader, tdesig, U_id, U_desig, remark, status]);

  useEffect(() => {
    if (
      leaveid &&
      userrid &&
      userrdesig &&
      serial &&
      TL_id &&
      U_desig &&
      status
    ) {
      sendDataToServerf();
    }
  }, [leaveid, userrid, userrdesig, serial, TL_id, U_desig, status, remark]);

  useEffect(() => {
    if (lastLogData) {
      sendToServerAR(lastLogData);
    }
  }, [lastLogData, userrid]);

  const sendDataToServer = async () => {
    if (leaveid && U_desig && status) {
      const currentDate = new Date();
      const applicationdata = {
        leaveid,
        teamLeader,
        tdesig,
        TL_id,

        U_desig,
        remark,
        status,
        Serial_No: 1,
        actionDate: currentDate.toISOString(),
        activeyn: "Y",
        latestyn: "N",
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leaverequestdatad`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(applicationdata),
          }
        );
        if (response.ok) {
        } else {
        }
      } catch (error) {}
    } else {
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendDataToServerf = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (
        leaveid &&
        serial &&
        userrid &&
        userrdesig &&
        TL_id &&
        U_desig &&
        status
      ) {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leaverequestdataf`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              leaveid,
              serial,
              userrid,
              userrdesig,
              TL_id,
              U_desig,
              status,
              remark,
              actionDatef: new Date().toISOString(),
              activeyn: "Y",
              latestyn: "Y",
            }),
          }
        );

        if (response.ok) {
        } else {
        }
      } else {
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendToServerAR = async (data) => {
    if (!data) return;

    const currentDate = new Date();

    const dataWithDate = {
      ...data,
      actionDate: currentDate.toISOString(),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_APIURL}logdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithDate),
      });

      if (response.ok) {
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    const fetchmovement = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}leaverequestmovement`
        );
        if (response.ok) {
          const data = await response.json();
          const requestmovement = data.requestmovement.map((item) => ({
            leaveidds: item.leaveappln_id,
          }));
        } else {
        }
      } catch (error) {}
    };

    fetchmovement();
  }, []);

  const [documents, setDocuments] = useState([]);
  const fetchDocData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_APIURL}docdata`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data); // Assuming data.data is an array of base64 strings
      } else {
        console.error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocData();
  }, []);
  console.log("doc data", documents);
  const [teamLeaders, setTeamLeaders] = useState([]);

  useEffect(() => {
    const fetchTeamLeaders = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}teamleadermaster`
        );
        if (response.ok) {
          const data = await response.json();
          setTeamLeaders(data.namerequest);
        }
      } catch (error) {}
    };

    fetchTeamLeaders();
  }, []);

  const getTeamLeaderNameById = (id) => {
    const teamLeader = teamLeaders.find((leader) => leader.TL_id === id);
    return teamLeader ? teamLeader.Name : id;
  };
  const getActionHistoryTitle = (leaveId) => {
    const hasActions = tabledata.some((item) => item.leaveappln_id === leaveId);
    return hasActions ? "Action History" : "Empty Action History";
  };
  const hasActions = (leaveId) => {
    return tabledata.some((item) => item.leaveappln_id === leaveId);
  };
  // const handleMedicalClick =()=>{
  //   setMedicalCertificateModal(true)
  // }

  useEffect(() => {
    const hasPendingApplications =
      filteredMatchedData.some((request) => request.status === "Pending") ||
      leaveapplicationIds.some(
        (request) => request.lstatus === "Pending" || "Approved and forwarded"
      );

    if (hasPendingApplications) {
      setPendingHighlight(true);
    }
  }, [filteredMatchedData, leaveapplicationIds]);

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Function to filter applications based on statusFilter
  const filterApplications = (applications) => {
    if (statusFilter === "") {
      return applications;
    }
    return applications.filter(
      (application) => application.status === statusFilter
    );
  };
  const [filteredApplications, setFilteredApplications] = useState(filteredMatchedData);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Initialize once when data loads
    if (filteredApplications.length === 0) {
      setFilteredApplications(filteredMatchedData);
    }
  }, [filteredMatchedData]); // Depend only on the data change
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSearchClick = () => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm === "") {
      // Show all if search is empty
      setFilteredApplications(filteredMatchedData);
    } else {
      // Filter based on search term
      const filteredResults = filteredMatchedData.filter((application) =>
        application.U_name.toLowerCase().includes(trimmedTerm.toLowerCase())
      );
      setFilteredApplications(filteredResults);
    }
  };
  
  
    
  return (
    // <div style={{ filter: sessionOutModal ? "blur(5px)" : "none" ,width:"1444px"}}>

    <div
      style={{
        filter: sessionOutModal ? "blur(5px)" : "none",
        width: "100%",
        maxWidth: "1444px",
        margin: "0 auto",
      }}
    >
<Box
  display="flex"
  justifyContent="center"
  // alignItems="center"
  width="20%" // Adjust width as needed
  maxWidth="800px" // Set a max-width for better responsiveness
  marginBottom='20px'
  marginLeft='28px'
>
  <TextField
    variant="outlined"
    placeholder="Search by name"
    value={searchTerm}
    onChange={handleSearchChange}
    fullWidth
    sx={{
      width: "100%",          // Full width of parent Box
      wordBreak: "break-all", // Ensure long words break correctly
      '@media (max-width: 600px)': {
        fontSize: "14px",     // Adjust font size for smaller screens
      },
    }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          {searchTerm && ( // Show clear icon only when there is text
            <IconButton onClick={() => {
              setSearchTerm("");           // Clear the search input
              setFilteredApplications(filteredMatchedData); // Reset filter
            }}>
              <FontAwesomeIcon icon={faTimes} /> {/* Cross icon */}
            </IconButton>
          )}
          <IconButton onClick={handleSearchClick}>
            <FontAwesomeIcon icon={faSearch} />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Box>


      
      {open && (
        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {action === "Approved"
              ? "Application has been approved."
              : action === "Rejected"
              ? "Application has been Rejected."
              : "Application has been appoved and forwarded."}
          </Alert>
        </Snackbar>
      )}

      <div>
      {filteredApplications.length === 0 && leaveapplicationIds.length === 0 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="10vh"
              bgcolor="#f5f5f5"
            >
              <Typography variant="h6" align="center" color="textSecondary">
                No Leave Request Available
              </Typography>
            </Box>
          )}
      </div>

      {filteredApplications
        .slice()
        .reverse()
        .map((request, index) => (
          <Accordion
            key={index}
            style={{ marginBottom: "20px", width: "96%", marginLeft: "4.5vh" }}
          >
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={faAngleRight} />}
              style={{ backgroundColor: "#f0f0f0", paddingRight: "10px" }}
              onClick={(event) =>
                handleExpandIconClick(
                  event,
                  request,
                  request.submittedAction,
                  request.leaveappln_id,
                  request.user_id
                )
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography>{request.U_name}</Typography>

                  {request.status && (
                    <Chip
                      label={request.status}
                      style={{
                        backgroundColor:
                          request.status === "Approved"
                            ? "#6FBF83"
                            : request.status === "Rejected"
                            ? "#E06050"
                            : "#FFB74D",
                        border:
                          request.status === "Approved"
                            ? "1px solid #4CAF50"
                            : request.status === "Rejected"
                            ? "1px solid #FF5252"
                            : "1px solid #FF9800",

                        // marginLeft: "86%",
                        marginTop: "2%",

                        color: "white",
                      }}
                    />
                  )}
                  {actionData[request.leaveappln_id] && (
                    <Chip
                      label={actionData[request.leaveappln_id]}
                      color="primary"
                    />
                  )}
                </Grid>

                {insufficientBalanceApplications.includes(
                  request.leaveappln_id
                ) &&
                  request.status === "Pending" && (
                    <Typography
                      color="error"
                      style={{ marginLeft: "68%", marginTop: "-4%" }}
                    >
                      Can't approve your application due to insufficient
                      balance.
                    </Typography>
                  )}
              </Grid>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: "column" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent
                      style={{ minHeight: "190px", backgroundColor: "#f9f9f9" }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{ marginBottom: "18px" }}
                      >
                        Leave Details
                      </Typography>
                      <Typography style={{ marginBottom: "5.6px" }}>
                        <strong>Type:</strong>{" "}
                        {getFullLeaveType(request.LeaveType)}
                      </Typography>
                      <Typography style={{ marginBottom: "5.6px" }}>
                        <strong>Date of application:</strong>{" "}
                        {getFullLeaveType(request.leaveappln_date)}
                      </Typography>
                      <Typography style={{ marginBottom: "5.6px" }}>
                        <strong>Reason:</strong> {request.leaveappln_reason}
                      </Typography>
                      {request.FullDay && request.FullDay.length > 0 && (
                        <Typography style={{ marginBottom: "5.6px" }}>
                          <strong>Full Day:</strong>{" "}
                          {request.FullDay.join(", ")}
                        </Typography>
                      )}
                      {request.MorningHalf &&
                        request.MorningHalf.length > 0 && (
                          <Typography style={{ marginBottom: "5.6px" }}>
                            <strong>Morning Half:</strong>{" "}
                            {request.MorningHalf.join(", ")}
                          </Typography>
                        )}
                      {request.AfternoonHalf &&
                        request.AfternoonHalf.length > 0 && (
                          <Typography style={{ marginBottom: "5.6px" }}>
                            <strong>Afternoon Half:</strong>{" "}
                            {request.AfternoonHalf.join(", ")}
                          </Typography>
                        )}
                      {fleaveDetails[request.leaveappln_id] && (
                        <Typography style={{ color: "red" }}>
                          {fleaveDetails[request.leaveappln_id]}
                        </Typography>
                      )}

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        {documentsState[request.leaveappln_id] && (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleMedicalClick}
                            >
                              Open Medical Certificate
                            </Button>

                            {/* Use the MedicalCertificateModal component */}
                            <MedicalCertificateModal
                              open={openModal}
                              handleClose={handleCloseModal}
                              imageSrc={documentsState[request.leaveappln_id]}
                            />
                          </>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent
                      style={{ minHeight: "190px", backgroundColor: "#f9f9f9" }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{ marginBottom: "10px" }}
                      >
                        Actions
                      </Typography>
                      <form
                        onSubmit={(event) =>
                          handleSubmit(event, request.leaveappln_id)
                        }
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel id={`approval-option-label-${index}`}>
                                Approval Option
                              </InputLabel>
                              <Select
                                labelId={`approval-option-label-${index}`}
                                value={request.approvalOption}
                                onChange={(event) =>
                                  handleApprovalChange(
                                    event,
                                    request.leaveappln_id
                                  )
                                }
                                disabled={request.status !== "Pending"}
                              >
                                <MenuItem
                                  value="approve"
                                  disabled={insufficientBalanceApplications.includes(
                                    request.leaveappln_id
                                  )}
                                >
                                  Approve
                                </MenuItem>
                                <MenuItem value="reject">Reject</MenuItem>
                                <MenuItem
                                  value="approveForward"
                                  disabled={insufficientBalanceApplications.includes(
                                    request.leaveappln_id
                                  )}
                                >
                                  Approve and Forward
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          {showforwardto && (
                            <Grid item xs={6}>
                              <FormControl fullWidth variant="standard">
                                <InputLabel
                                  id={`forward-option-label-${index}`}
                                >
                                  Forward To
                                </InputLabel>

                                <Select
                                  labelId={`forward-option-label-${index}`}
                                  value={request.forwardOption}
                                  onChange={(event) => {
                                    const selectedTeam = filteredTeams.find(
                                      (team) =>
                                        team.thierarchyid === event.target.value
                                    );
                                    handleTeamLeaderChange(
                                      event,
                                      request.leaveappln_id,
                                      selectedTeam.teamname
                                    );
                                  }}
                                  disabled={request.forwardOptionDisabled}
                                >
                                  {filteredTeams.map((team, index) => (
                                    <MenuItem
                                      key={index}
                                      value={team.thierarchyid}
                                      data-email={team.temail}
                                    >
                                      {team.teamname}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          )}
                          <Grid item xs={12}>
                            <TextField
                              label="Remark"
                              fullWidth
                              value={request.remark}
                              onChange={(event) =>
                                handleRemarkChange(event, request.leaveappln_id)
                              }
                              multiline
                              rows={1.5}
                              variant="standard"
                              disabled={request.status !== "Pending"}
                            />
                          </Grid>
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
                          <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              disabled={
                                request.status !== "Pending" || isLoading
                              }
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>

            {hasActions(request.leaveappln_id) && (
              <AccordionDetails style={{ flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ marginBottom: "18px", marginTop: "24px" }}
                >
                  {getActionHistoryTitle(request.leaveappln_id)}
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{
                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                          }}
                        >
                          Action Date
                        </TableCell>
                        <TableCell
                          style={{
                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                          }}
                        >
                          Action Taken By
                        </TableCell>
                        <TableCell
                          style={{
                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          style={{
                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                          }}
                        >
                          Remark
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tabledata
                        .filter(
                          (item) => item.leaveappln_id === request.leaveappln_id
                        )
                        .map((item, index) => {
                          const formattedDate = moment(
                            item.moved_actiondate
                          ).format("DD-MMM-YYYY");
                          return (
                            <TableRow key={index}>
                              <TableCell>{formattedDate}</TableCell>
                              <TableCell>
                                {getTeamLeaderNameById(item.movedfrom_id)}{" "}
                              </TableCell>

                              <TableCell>{item.moved_action}</TableCell>
                              <TableCell>{item.moved_remark}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            )}
          </Accordion>
        ))}

      <div>
        {leaveapplicationIds.map((request, index) => (
          <Accordion
            key={index}
            style={{ marginBottom: "20px", width: "96%", marginLeft: "4.5vh" }}
          >
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={faAngleRight} />}
              style={{ backgroundColor: "#f0f0f0", paddingRight: "10px" }}
              onClick={(event) =>
                handleExpandIconClick(
                  event,
                  request,
                  request.leaveuserid,
                  request.lappl_id,
                  request.leaveuserid
                )
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography>{request.leaveusername}</Typography>

                  {request.lstatus && (
                    <Chip
                      label={request.lstatus}
                      style={{
                        backgroundColor:
                          request.lstatus === "Approved"
                            ? "#6FBF83"
                            : request.lstatus === "Rejected"
                            ? "#E06050"
                            : "#FFB74D",
                        border:
                          request.lstatus === "Approved"
                            ? "1px solid #4CAF50"
                            : request.lstatus === "Rejected"
                            ? "1px solid #FF5252"
                            : "1px solid #FF9800",
                        marginLeft: "86%",
                        marginTop: "-5%",
                        color: "white",
                      }}
                    />
                  )}
                </Grid>
                {insufficientBalanceApplications.includes(
                  request.leaveappln_id
                ) && (
                  <Typography
                    color="error"
                    style={{ marginLeft: "62%", marginTop: "-4%" }}
                  >
                    Can't approve your application due to insufficient balance.
                  </Typography>
                )}
              </Grid>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: "column" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent
                      style={{ minHeight: "190px", backgroundColor: "#f9f9f9" }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{ marginBottom: "18px" }}
                      >
                        Leave Details
                      </Typography>

                      <Typography style={{ marginBottom: "5.6px" }}>
                        <strong>Type:</strong>

                        {getFullLeaveType(request.leavetype)}
                      </Typography>
                      <Typography style={{ marginBottom: "5.6px" }}>
                        <strong>Reason:</strong> {request.leavereason}
                      </Typography>
                      {request.leavefullday &&
                        request.leavefullday.length > 0 && (
                          <Typography style={{ marginBottom: "5.6px" }}>
                            <strong>Full Day:</strong>{" "}
                            {request.leavefullday.join(", ")}
                          </Typography>
                        )}
                      {request.leaveMorninghalf &&
                        request.leaveMorninghalf.length > 0 && (
                          <Typography style={{ marginBottom: "5.6px" }}>
                            <strong>Morning Half:</strong>{" "}
                            {request.leaveMorninghalf.join(", ")}
                          </Typography>
                        )}
                      {request.leaveAfternoonhalf &&
                        request.leaveAfternoonhalf.length > 0 && (
                          <Typography style={{ marginBottom: "5.6px" }}>
                            <strong>Afternoon Half:</strong>{" "}
                            {request.leaveAfternoonhalf.join(", ")}
                          </Typography>
                        )}
                    </CardContent>
                  </Card>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  ></Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent
                      style={{ minHeight: "190px", backgroundColor: "#f9f9f9" }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{ marginBottom: "10px" }}
                      >
                        Actions
                      </Typography>
                      <form
                        onSubmit={
                          (event) =>
                            handleSubmitforward(event, request.lappl_id) // Update to call handleSubmitforward
                        }
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel id={`approval-option-label-${index}`}>
                                Approval Option
                              </InputLabel>
                              <Select
                                labelId={`approval-option-label-${index}`}
                                value={request.approvalOption}
                                onChange={(event) =>
                                  handleApprovalChange(event, request.lappl_id)
                                }
                                disabled={
                                  request.lstatus !== "Pending" &&
                                  request.lstatus !== "Approved and forwarded"
                                }
                              >
                                <MenuItem
                                  value="approve"
                                  disabled={insufficientBalanceApplications.includes(
                                    request.lappl_id
                                  )}
                                >
                                  Approve
                                </MenuItem>
                                <MenuItem value="reject">Reject</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Remark"
                              fullWidth
                              value={request.remark}
                              onChange={(event) =>
                                handleRemarkChange(event, request.leaveappln_id)
                              }
                              disabled={
                                request.lstatus !== "Pending" &&
                                request.lstatus !== "Approved and forwarded"
                              }
                              multiline
                              rows={1.5}
                              variant="standard"
                            />
                          </Grid>
                          <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              disabled={
                                request.lstatus !== "Pending" &&
                                request.lstatus !== "Approved and forwarded"
                              }
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
            <AccordionDetails style={{ flexDirection: "column" }}>
              {hasActions(request.lappl_id) && (
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ marginBottom: "18px", marginTop: "24px" }}
                >
                  {getActionHistoryTitle(request.lappl_id)}
                </Typography>
              )}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                        }}
                      >
                        Action Date
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                        }}
                      >
                        Action Taken By
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                        }}
                      >
                        Remark
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tabledata
                      .filter((item) => item.leaveappln_id === request.lappl_id)
                      .map((item, index) => {
                        const formattedDate = moment(
                          item.moved_actiondate
                        ).format("DD-MMM-YYYY");
                        return (
                          <TableRow key={index}>
                            <TableCell>{formattedDate}</TableCell>
                            <TableCell>
                              {getTeamLeaderNameById(item.movedfrom_id)}
                            </TableCell>
                            <TableCell>{item.moved_action}</TableCell>
                            <TableCell>{item.moved_remark}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
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

      {medicalCertificateModal && (
        <MedicalCertificateModal
          documentsState={documentsState}
          onClose={() => setMedicalCertificateModal(false)}
        />
      )}
    </div>
  );
}
