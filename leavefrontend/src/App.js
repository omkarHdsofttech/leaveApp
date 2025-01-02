// import React, { useEffect } from "react";
// import LoginForm from "./Components/Login/LoginForm";
// import Employeepage from "./Components/Employee/Employeepage";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import LeaveBalance from "./Components/commonforms.js/LeaveBalance";
// import SummaryPage from "./Components/commonforms.js/SummaryPage";
// import TeamleaderPage from "./Components/Teamleader/TeamleaderPage";

// import Drafts from "./Components/commonforms.js/Drafts";
// import EditDrafts from "../src/Components/commonforms.js/EditDrafts";
// import LeaveSummary from "./Components/Admin/LeaveSummary";
// import Adminpage from "./Components/Admin/Adminpage";
// import Founder from "./Components/Founder/Founder";
// import { AppProvider } from "./Components/Teamleader/AppContext";
// import ReminderSession from "./Components/reminderSession";
// import { useSession } from "./Components/sessionContext";
// export default function App() {

//   const { sessionReminder, setOpenSessionModal, resetTimeout } = useSession();

//   useEffect(()=>{

//   })
  
//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/" element={<LoginForm />} />
//           <Route path="/employee" element={<Employeepage />} />
//           <Route path="/teamleader" element={<TeamleaderPage />} />
//           <Route path="/admin" element={<Adminpage />} />
//           <Route path="/leave-balance" element={<LeaveBalance />} />
//           <Route path="/drafts" element={<Drafts />} />
//           <Route path="/founder" element={<Founder />} />
//           <Route path="/summary" element={<SummaryPage />} />
//           <Route path="/editdrafts" element={<EditDrafts />} />
//           <Route path="/LeaveSummary" element={<LeaveSummary />} />
//           <Route path="/sessionreminder" element={< ReminderSession/>} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }



import React from "react";
import LoginForm from "./Components/Login/LoginForm";
import Employeepage from "./Components/Employee/Employeepage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import LeaveBalance from "./Components/commonforms.js/LeaveBalance";
import SummaryPage from "./Components/commonforms.js/SummaryPage";
import TeamleaderPage from "./Components/Teamleader/TeamleaderPage";
import ReminderSession from "./Components/reminderSession";

import Drafts from "./Components/commonforms.js/Drafts";
import EditDrafts from "../src/Components/commonforms.js/EditDrafts";
import LeaveSummary from "./Components/Admin/LeaveSummary";
import Adminpage from "./Components/Admin/Adminpage";
import Founder from "./Components/Founder/Founder";
import { AppProvider } from "./Components/Teamleader/AppContext";
import { InactivityProvider } from "./Components/Context/Inactivity";
import ProtectedRoute from "./ProtectedRotes";

const handleInactivity = () => {
 console.log(
  'don'
 )
 localStorage.removeItem("userToken");
 localStorage.removeItem("userDetails");
 localStorage.removeItem("navigateState");
 localStorage.removeItem("isLoggedIn");
  window.location.href = "/";
};
const InactivityWrapper = ({ children }) => {
  const location = useLocation();

  // Define the paths where inactivity tracking should be applied
  const pathsWithInactivity = ['/employee', '/leave-balance','/teamleader','/admin','/drafts','/founder','/summary','/editdrafts','/LeaveSummary'];

  if (pathsWithInactivity.includes(location.pathname)) {
    return (
      <InactivityProvider callback={handleInactivity} timeout={10 * 60 * 1000}>
        {children}
      </InactivityProvider>
    );
  }

  return children;
};
export default function App() {
  return (
    <Router>
      <InactivityWrapper>
        <Routes>
          <Route path="/" element={<LoginForm />} />       
          {/* <Route path="/employee" element={<Employeepage />} /> */}
          <Route
          path="/employee"
          element={
            <ProtectedRoute
              component={Employeepage}
              allowedRoles={['D001', 'D016', 'D005', 'D006', 'D009', 'D013', 'D014']}
            />
          }
        />
          {/* <Route path="/teamleader" element={<TeamleaderPage />} /> */}
          <Route
          path="/teamleader"
          element={
            <ProtectedRoute
              component={TeamleaderPage}
              allowedRoles={['D003', 'D002', 'D012', 'D008', 'D007']}
            />
          }
        />
          {/* <Route path="/admin" element={<Adminpage />} /> */}
          <Route
          path="/admin"
          element={<ProtectedRoute component={Adminpage} allowedRoles={['D011']} />}
        />
          <Route path="/leave-balance" element={<LeaveBalance />} />
          <Route path="/drafts" element={<Drafts />} />
          {/* <Route path="/founder" element={<Founder />} /> */}
          <Route
          path="/founder"
          element={<ProtectedRoute component={Founder} allowedRoles={['D010']} />}
        />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/editdrafts" element={<EditDrafts />} />
          <Route path="/LeaveSummary" element={<LeaveSummary />} />  
          <Route path="/sessionreminder" element={< ReminderSession/>} />   
        </Routes>
      </InactivityWrapper>
    </Router>
  );
}