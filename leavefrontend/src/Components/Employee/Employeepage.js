// // import React, { useEffect, useState } from "react";
// // import Esidebar from "./Esidebar";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import LeaveBalance from "../commonforms.js/LeaveBalance";
// // import { isAuthenticated } from "../../utils/utils";

// // export default function Employeepage() {
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   const [utid, setuTid] = useState();
// //   const [userData, setUserData] = useState(null);

// //   useEffect(() => {
// //     authenticatHandler();
// //   }, [navigate]);
// //   const authenticatHandler = async () => {
// //     const token = await isAuthenticated();
// //     const userDetails = JSON.parse(await localStorage.getItem("userDetails"));

// //     setUserData(userDetails);
// //     await setuTid(token);
// //     if (token == null) {
// //       navigate("/");
// //     }
// //   };

// //   return (
// //     <>
// //       {userData?.U_id ? (
// //         <Esidebar
// //           U_id={utid}
// //           DOJ={userData.DOJ}
// //           U_name={userData.U_name}
// //           U_desig={userData.U_desig}
// //           gender={userData.gender}
// //           email={userData.email}
// //           designame={userData.designame}
// //         />
// //       ) : (
// //         <div>Loading...</div>
// //       )}
// //     </>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import Esidebar from "./Esidebar";
// import { useLocation, useNavigate } from "react-router-dom";
// import LeaveBalance from "../commonforms.js/LeaveBalance";

// export default function Employeepage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { U_id, DOJ, U_name, U_desig, gender, email, designame } =
//     location.state || {};
//   const [utid, setuTid] = useState();
//   const [userData, setUserData] = useState({
//     U_id: '',
//     DOJ: '',
//     U_name: '',
//     U_desig: '',
//     gender: '',
//     email: '',
//     designame: ''
//   });

//   useEffect(() => {
//     const userToken = localStorage.getItem("userToken");
   
//     if (!userToken) {
     
//       navigate("/");
//       return;
//     } 
//     const storedUserData = JSON.parse(localStorage.getItem("navigateState"));
//     if (!storedUserData || !storedUserData.U_id) {
//       navigate("/");
//       return;
//     }

//     setUserData(storedUserData);
//   }, [navigate]);

  
//   // useEffect(() => {
//   //   const handleStorageChange = (e) => {
//   //     if (e.key === 'isLoggedIn' && e.newValue === 'false') {
//   //       navigate('/login');
//   //     }
//   //   };

//   //   window.addEventListener('storage', handleStorageChange);

//   //   // Cleanup
//   //   return () => {
//   //     window.removeEventListener('storage', handleStorageChange);
//   //   };
//   // }, [navigate]);

  


//   if (!U_id) {
//     return <div>Loading...</div>;
//   }

//   //console.log("Employee page data:", { U_id, DOJ, U_name, U_desig, gender, email, designame });
//   return (
//     <>
//      <Esidebar
//         U_id={userData.U_id}
//         DOJ={userData.DOJ}
//         U_name={userData.U_name}
//         U_desig={userData.U_desig}
//         gender={userData.gender}
//         email={userData.email}
//         designame={userData.designame}
//       />
//       {/* {U_id && //console.log("employee page", U_id, DOJ, U_desig, gender)} */}
//     </>
//   );
// }


// import React, { useEffect, useState } from "react";
// import Esidebar from "./Esidebar";
// import { useNavigate } from "react-router-dom";

// export default function Employeepage() {
  
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState({
//     U_id: '',
//     DOJ: '',
//     U_name: '',
//     U_desig: '',
//     gender: '',
//     email: '',
//     designame: ''
//   });
//   const storedUserData = JSON.parse(localStorage.getItem("navigateState"));
//   const userToken = localStorage.getItem("userToken");

//   useEffect(() => {

//     // If no token, redirect to home page
//     if (!userToken) {
//       navigate("/");
//       return;
//     }

//     // Get stored user data from localStorage

//     // If no user data or U_id is missing, redirect to home page
//     if (!storedUserData || !storedUserData.U_id) {
//       navigate("/");
//       return;
//     }

//     // Set user data to state
//     setUserData(storedUserData);
    

//   }, [navigate,userToken,userData,setUserData]);

//   // Show a loading state while userData is being set
//   if (!userData.U_id) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <Esidebar
//         U_id={userData.U_id}
//         DOJ={userData.DOJ}
//         U_name={userData.U_name}
//         U_desig={userData.U_desig}
//         gender={userData.gender}
//         email={userData.email}
//         designame={userData.designame}
//         backgroundColor={"#1a237e"}

//       />
//     </>
//   );
// }



import React, { useEffect, useState } from "react";
import Esidebar from "./Esidebar";
import { useNavigate } from "react-router-dom";

export default function Employeepage() {
  
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    U_id: '',
    DOJ: '',
    U_name: '',
    U_desig: '',
    gender: '',
    email: '',
    designame: ''
  });
  const storedUserData = JSON.parse(localStorage.getItem("navigateState"));


  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      navigate("/");
      return;
    }

    const storedUserData = JSON.parse(localStorage.getItem('navigateState'));
    if (!storedUserData || !storedUserData.U_id) {
      navigate("/");
      return;
    }

    setUserData(storedUserData);
  }, [navigate]);


  // Show a loading state while userData is being set
  if (!userData.U_id) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Esidebar
        U_id={userData.U_id}
        DOJ={userData.DOJ}
        U_name={userData.U_name}
        U_desig={userData.U_desig}
        gender={userData.gender}
        email={userData.email}
        designame={userData.designame}
        backgroundColor={"#1a237e"}

      />
    </>
  );
}
