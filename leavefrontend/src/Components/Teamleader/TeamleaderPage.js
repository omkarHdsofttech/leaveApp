
// import React, { useEffect, useState } from 'react';
// import Tsidebar from './Tsidebar'
// import { useLocation,useNavigate  } from "react-router-dom";

// export default function Employeepage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { U_id, email ,DOJ,U_name ,TL_id,U_desig,gender,designame,username} = location.state || {}; 
//   const[utid,setuTid]=useState()
//   useEffect(() => {
//     const userToken = localStorage.getItem('userToken');
// setuTid(userToken)
//     if (!userToken) {
//       //console.error("No token found in local storage.");
//       navigate("/");
//       return;
//     } else {
//       //console.log("Token from local storage:", userToken);
//     }

//     if (!U_id) {
//       //console.error("No state received from navigation.");
//       navigate("/");
//       return;
//     }
//   }, [U_id, navigate]);

//   if (!U_id) {
//     return <div>Loading...</div>;
//   }
//   //console.log("Udesigin teamleadre page",U_desig)
//   return (
//     <>
//       <Tsidebar U_id={utid} email={email} DOJ={DOJ}U_name={U_name} TL_id={TL_id} U_desig={U_desig} gender={gender} designame={designame} username={username}/>
//       {/* {U_id && //console.log("employee page", U_id,DOJ,TL_id,U_desig,gender,designame)} */}
      
//     </>
//   );
// }




import React, { useEffect, useState } from 'react';
import Tsidebar from './Tsidebar';
import { useNavigate } from "react-router-dom";

export default function Employeepage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    U_id: '',
    email: '',
    DOJ: '',
    U_name: '',
    TL_id: '',
    U_desig: '',
    gender: '',
    designame: '',
    username: ''
  });

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

  if (!userData.U_id) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Tsidebar
        U_id={userData.U_id}
        email={userData.email}
        DOJ={userData.DOJ}
        U_name={userData.U_name}
        TL_id={userData.TL_id}
        U_desig={userData.U_desig}
        gender={userData.gender}
        designame={userData.designame}
        username={userData.username}
        backgroundColor={"#1a237e"}
      />
    </>
  );
}
