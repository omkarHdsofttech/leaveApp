
import React, { useEffect, useState } from 'react';

import ManagerSidebar from './ManagerSidebar'
import { useNavigate } from "react-router-dom";

export default function Manager() {
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
      <ManagerSidebar
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
