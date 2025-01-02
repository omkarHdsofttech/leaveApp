import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Editpage from "./Editpage";

export default function SummaryPage() {
  const [summaryDetails, setSummaryDetails] = useState([]);
  const [leaveType, setLeaveType] = useState();
  const [reason, setReason] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [leaderid, setLeaderId] = useState();
  const [teamLeaderDetails, setTeamLeaderDetails] = useState({});
  const location = useLocation();
  const [teamLeaderName, setTeamLeaderName] = useState("");

  const mapLeaveTypeToString = (type) => {
    switch (type) {
      case "SL":
        return "Sick Leave";
      case "CL":
        return "Casual Leave";
      case "PL":
        return "Privilege Leave";
      case "ML":
        return "Maternity Leave";
      case "LWP":
        return "Leave Without Pay";
      case "PTL":
        return "Paternity Leave";
      default:
        return "Unknown";
    }
  };

  

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch(
          "${process.env.REACT_APP_APIURL}summarypage"
        );
        if (response.ok) {
          const data = await response.json();
          setSummaryDetails(data.summaryDetails);

          const filteredSummaryDetails = data.summaryDetails.filter(
            (detail) =>
              detail.leaveappln_id ===
              location?.state?.storedData?.data?.leaveappln_id
          );

          if (filteredSummaryDetails.length > 0) {
            const {
              LeaveType,
              StartDate,
              EndDate,
              leaveappln_reason,
              teamleaderid,
            } = filteredSummaryDetails[0];
            setLeaveType(mapLeaveTypeToString(LeaveType));
            setStartDate(StartDate);
            setEndDate(EndDate);
            setReason(leaveappln_reason);
            setLeaderId(teamleaderid);
          }
        }
      } catch (error) {}
    };

    fetchSummaryData();
  }, [location]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamLeaderResponse = await fetch(
          `${process.env.REACT_APP_APIURL}summaryleader`
        );
        if (teamLeaderResponse.ok) {
          const teamLeaderData = await teamLeaderResponse.json();

          const filteredTeamLeaders = teamLeaderData.teamleader.filter(
            (leader) => leader.TL_id === leaderid
          );

          if (filteredTeamLeaders.length > 0) {
            setTeamLeaderName(filteredTeamLeaders[0].Name);
          }
        } else {
        }
      } catch (error) {}
    };

    fetchData();
  }, [leaderid]);

  return (
    <div>
      <Editpage
        leaveType={leaveType}
        startDateProp={startDate}
        endDateProp={endDate}
        reasonprop={reason}
        teamleaderNameprop={teamLeaderName}
      />
    </div>
  );
}
