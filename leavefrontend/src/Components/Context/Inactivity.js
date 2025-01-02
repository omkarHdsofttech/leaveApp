// import React, { createContext, useContext, useEffect, useState,useRef } from 'react';
// const InactivityContext = createContext();

// const useInactivity = (callback, timeout) => {
//   const timeoutId = useRef(null);
//   const alertTimeoutId = useRef(null);
//   const [sessionReminder, setSessionReminder] = useState(false);

//   const resetTimer = () => {
//     console.log("Timer reset");
//     if (timeoutId.current) {
//       clearTimeout(timeoutId.current);
//     }
//     if (alertTimeoutId.current) {
//       clearTimeout(alertTimeoutId.current);
//     }
//     timeoutId.current = setTimeout(() => {
//       callback();
//       logout();
//     }, timeout);

//     alertTimeoutId.current = setTimeout(() => {
//       setSessionReminder(true);
//       // alert("You have 1 minute remaining before inactivity timeout.");
//     }, timeout - 60000);
//   };
//  const logout = async()=>{
//   await localStorage.removeItem("userToken");
//   await localStorage.removeItem("userDetails");
//    window.location.href= '/sessionreminder';
//  }
//   useEffect(() => {
//     const events = ['mousemove', 'keydown', 'click', 'scroll'];

//     const handleUserActivity = () => {
//       resetTimer();
//     };

//     events.forEach(event => window.addEventListener(event, handleUserActivity));

//     resetTimer();

//     return () => {
//       events.forEach(event => window.removeEventListener(event, handleUserActivity));
//       if (timeoutId.current) {
//         clearTimeout(timeoutId.current);
//       }
//       if (alertTimeoutId.current) {
//         clearTimeout(alertTimeoutId.current);
//       }
//     };
//   }, [timeout, callback]);

//   return { resetTimer, sessionReminder };
// };

// export const InactivityProvider = ({ children, callback, timeout }) => {
//   const resetTimer = useInactivity(callback, timeout);

//   return (
//     <InactivityContext.Provider value={resetTimer}>
//       {children}
//     </InactivityContext.Provider>
//   );
// };

// export const useInactivityContext = () => useContext(InactivityContext);


import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const InactivityContext = createContext();

const useInactivity = (callback, timeout) => {
  const timeoutId = useRef(null);
  const alertTimeoutId = useRef(null);
  const [sessionReminder, setSessionReminder] = useState(false);

  const resetTimer = () => {
    console.log("Timer reset");
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    if (alertTimeoutId.current) {
      clearTimeout(alertTimeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      callback();
      logout();
    }, timeout);

    alertTimeoutId.current = setTimeout(() => {
      setSessionReminder(true);
      // alert("You have 1 minute remaining before inactivity timeout.");
    }, timeout - 60000);
  };

  const logout = async () => {
    await localStorage.removeItem("userToken");
    await localStorage.removeItem("isLoggedIn");
    await localStorage.removeItem("userDetails");
    window.location.href = '/sessionreminder';
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    // const handleUserActivity = () => {
    //   resetTimer();
    // };
    const handleUserActivity = () => {
      resetTimer();
      setSessionReminder(false); // Reset session reminder when user is active
    };

    events.forEach(event => window.addEventListener(event, handleUserActivity));
    resetTimer();
    return () => {
      events.forEach(event => window.removeEventListener(event, handleUserActivity));
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      if (alertTimeoutId.current) {
        clearTimeout(alertTimeoutId.current);
      }
    };
  }, [timeout, callback]);

  return { resetTimer, sessionReminder };
};

export const InactivityProvider = ({ children, callback, timeout }) => {
  const { resetTimer, sessionReminder } = useInactivity(callback, timeout);

  return (
    <InactivityContext.Provider value={{ resetTimer, sessionReminder }}>
      {children}
    </InactivityContext.Provider>
  );
};

export const useInactivityContext = () => useContext(InactivityContext);
