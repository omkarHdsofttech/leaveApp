//added comment
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Grid,
  Paper,
  Button,
  TextField,
  Typography,
  Link,
  Modal,
} from "@material-ui/core";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import hdsoft from "../Images/HDSOFT.png";
// import { SessionProvider,useSession } from "../sessionContext";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { designationCheck } from "../../utils/utils";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [openResetModal, setOpenResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmailError, setResetEmailError] = useState(false);
  const [showInvalidEmail, setShowInvalidEmail] = useState(false);
  const [resetError, setResetError] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpErrorExpire, setOtpErrorExpire] = useState(false);
  const [passwordsMatchError, setPasswordsMatchError] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const [newpassworderror, setNewPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openOtpField, setOpenOtpField] = useState(false);
  // const TIMEOUT = 10 * 60 * 1000;
  // const WARNING_TIME = 1 * 60 * 1000;
  // const [timeoutId, setTimeoutId] = useState(null);
  // const [warningId, setWarningId] = useState(null);
  // const [sessionReminder, setSessionReminder] = useState(false);
  // const [openSessionModal, setOpenSessionModal] = useState(false);
  // const { resetTimeout } = useSession();
  const [loading, setLoading] = useState(false);

  

  // const handleCloseSessionModal = () => {
  //   setOpenSessionModal(false);
  //   resetTimeout(); // Reset timeout when modal is closed
  // };

  const navigate = useNavigate();

  const formContainerStyle = { textAlign: "center" };

  const handleForgotPassword = () => {
    setOpenResetModal(true);
  };

  const handleOtpValidation = (e) => {
    const value = e.target.value;
    setOtp(value);
    if (value.length !== 6) {
      setOtpError(true);
    } else {
      setOtpError(false);
    }
  };

  const handleCloseResetModal = () => {
    setOpenResetModal(false);
    setShowOtpField(false);
    setOtp("");
    setEmail("");
    setResetEmailError(false);
    setResetError("");
    setShowInvalidEmail(false);
    setShowNewPasswordFields(false);
    setOtpError(false);
    setOtpErrorExpire(false);
    setPasswordsMatchError(false);
    setNewPasswordError(false);
  };

  const handleGetOtp = async () => {
    if (email.length === 0) {
      setResetEmailError(true);
      setResetError("Please enter an email.");
      return;
    }

    if (!validateEmail(email)) {
      setResetEmailError(true);
      setResetError("Invalid email format.");
      return;
    }

    setResetEmailError(false);
    setResetError("");
    setShowOtpField(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}resetPassword`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === "User Not Exists") {
        setResetError("User does not exist");
        setShowInvalidEmail(true);
        setShowOtpField(false);
      } else if (data.status === "User Exists") {
        setShowInvalidEmail(false);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setOtpError(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}validateOtp`,
        {
          method: "POST",
          body: JSON.stringify({ email, otp }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === "OTP Matched") {
        //console.log("OTP is valid");
        setShowOtpField(false);
        setShowNewPasswordFields(true);
      } else if (data.status === "Invalid OTP") {
        //console.log("Invalid OTP");
        setOtpError(true); // Set OTP error state
      } else if (data.status === "OTP Expired") {
        //console.log("OTP Expired");
        setOtpErrorExpire(true); // Set OTP expiration error state
      }
    } catch (error) {
      //console.error("Error validating OTP:", error);
    }
  };

  const handleResendOtp = async () => {
    setShowInvalidEmail(false);
    setResetEmailError(false);
    setOtpErrorExpire(false);
    setOtp("");
    setOtpError(false);
    setResetError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}resetPassword`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === "User Not Exists") {
        setResetError("User does not exists");
        setShowInvalidEmail(true);
      } else if (data.status === "User Exists") {
        //console.log("Email verified");
        setShowAlert(false);
      }
    } catch (error) {
      //console.error("Error resending OTP:", error);
    }
  };

  const handleChangePassword = async () => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (newPassword !== confirmPassword) {
      setPasswordsMatchError(true);
      return;
    } else {
      setPasswordsMatchError(false);
    }

    // Check if the new password is at least 6 characters long
    if (!passwordRegex.test(newPassword)) {
      setNewPasswordError(true);
      return;
    } else {
      setNewPasswordError(false);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_APIURL}changePassword`,
        {
          method: "POST",
          body: JSON.stringify({ email, newPassword }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === "Password Changed") {
        //console.log("Password successfully changed");
        window.location.reload();
        handleCloseResetModal();
      } else {
        //console.log("Error changing password");
      }
    } catch (error) {
      //console.error("Error changing password:", error);
    }
  };

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_APIURL}udesigname`
        );
        if (response.ok) {
          const data = await response.json();
          setDesignations(data.udesigname);
        } else {
          //console.error("Failed to fetch designations");
        }
      } catch (error) {
        //console.error("Error fetching designations:", error);
      }
    };

    fetchDesignations();
  }, []);
    
  
  // useEffect (()=>{
  //   const isLoggedIn = localStorage.getItem('isLoggedIn');
  //   console.log('isLoggedIn value from localStorage:', isLoggedIn);
  //   if (isLoggedIn === 'true') {
  //     // alert("user already logged in");
  //     navigate("/employee")
  //   } if(!isLoggedIn) {
  //     // alert("there's no logged-in value in local storage");
  //     navigate("/")
  //   }
  // },[])
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const navigateState = JSON.parse(localStorage.getItem("navigateState"));
  
    console.log('isLoggedIn value from localStorage:', isLoggedIn);
    if (isLoggedIn === 'true' && navigateState) {
      const { U_desig } = navigateState;
  
      if (["D003", "D002", "D012", "D008", "D007"].includes(U_desig)) {
        navigate("/teamleader", { state: navigateState });
      } else if (["D001", "D016", "D005", "D006", "D009", "D013","D014"].includes(U_desig)) {
        navigate("/employee", { state: navigateState });
      } else if (U_desig === "D011") {
        navigate("/admin", { state: navigateState });
      } else {
        navigate("/founder", { state: navigateState });
      }
    } else {
      navigate("/");
    }
  }, [navigate]);
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  
  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError(true);
      return;
    }
    setLoading(true);
    const response = await fetch(`${process.env.REACT_APP_APIURL}login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
   setLoading(false);
    if (response.status === 200) {
      const userData = await response.json();
      const { U_desig, U_id, DOJ, U_name, TL_id, Designation, gender } = userData;
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem("userToken", U_id);
  
      
      const matchingDesignation = designations.find(
        (designation) => designation.D_id === U_desig
      );
  
      let designame = null;
      if (matchingDesignation) {
        designame = matchingDesignation.Designame;
      }
      const navigateState = {
        U_id,
        email,
        DOJ,
        U_name,
        username: U_name,
        TL_id,
        U_desig,
        gender,
        designame,
      };

      localStorage.setItem("navigateState", JSON.stringify(navigateState));
  window.location.reload();
      // designationCheck(U_desig,navigateState,navigate)
      // if (
      //   U_desig === "D003" ||
      //   U_desig === "D002" ||
      //   U_desig === "D012" ||
      //   U_desig === "D008" ||
      //   U_desig === "D007"
      // ) {
      //   navigate("/teamleader", { state: navigateState });
      // } else if (
      //   U_desig === "D001" ||
      //   U_desig === "D016" ||
      //   U_desig === "D005" ||
      //   U_desig === "D006" ||
      //   U_desig === "D009" ||
      //   U_desig === "D013" ||
      //   U_desig === "D014"
      // ) {
      //   navigate("/employee", { state: navigateState });
      // } else if (U_desig === "D011") {
      //   navigate("/admin", { state: navigateState });
      // } else {
      //   navigate("/founder", { state: navigateState });
      // }
    } else {
      setShowAlert(true);
    }
  };
  

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => password.length >= 6;

  const paperStyle = {
    padding: 20,
    width: "90%",
    maxWidth: 360,
    margin: "100px auto",
    height: "auto",
  };

  const avatarStyle = {
    backgroundColor: "blue",
    margin: 26,
    marginBottom: 50,
    height: 80,
    width: 80,
  };

  const inputStyle = {
    width: "100%",
    marginBottom: 20,
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    // <SessionProvider>
    <Grid container justifyContent="center">
      <Paper elevation={13} style={paperStyle}>
        <img
          src={hdsoft}
          alt="Company Logo"
          height="43px"
          style={{ marginLeft: "130px" }}
        />
        <Grid
          container
          justifyContent="center"
          style={{ marginBottom: "-45px" }}
        >
          <Avatar style={avatarStyle}>
            <AccountCircleIcon style={{ fontSize: "40px" }} />
          </Avatar>
        </Grid>
        <Grid container style={formContainerStyle}>
          <TextField
            id="email-input"
            label="Email"
            variant="standard"
            style={inputStyle}
            onChange={handleEmailChange}
            onKeyPress={handleKeyPress}
            error={emailError}
          />
          {emailError && (
            <Typography
              style={{ color: "red", fontSize: "0.8rem", marginLeft: 15 }}
            >
              Invalid email format
            </Typography>
          )}
          {/* <TextField
            id="password-input"
            label="Password"
            variant="standard"
            type="password"
            style={inputStyle}
            onChange={handlePasswordChange}
            onKeyPress={handleKeyPress} 
            error={passwordError}
          />
           <RemoveRedEyeIcon style={{ position: 'relative', left: '-30px', top: '-30px', cursor: 'pointer' }} />
        </Grid> */}

          <TextField
            id="password-input"
            label="Password"
            variant="standard"
            type={showPassword ? "text" : "password"}
            style={inputStyle}
            onChange={handlePasswordChange}
            error={passwordError}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: null,
            }}
          />
          <div>
            {showPassword ? (
              <VisibilityOffIcon
                onClick={handleTogglePasswordVisibility}
                style={{
                  position: "relative",
                  left: "334px",
                  top: "-45px",
                  cursor: "pointer",
                }}
              />
            ) : (
              <RemoveRedEyeIcon
                onClick={handleTogglePasswordVisibility}
                style={{
                  position: "relative",
                  left: "334px",
                  top: "-46.5px",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        </Grid>
        <Typography style={{ textAlign: "", marginBottom: 20 }}>
          <Link href="#" underline="hover" onClick={handleForgotPassword}>
            {"Forgot Password?"}
          </Link>
        </Typography>
        <Grid container justifyContent="center">
          <Button
            variant="contained"
            style={{
              backgroundColor: "#1a237e",
              width: "80%",
              maxWidth: 300,
              color: "white",
              margin: "20px auto",
            }}
            onClick={handleLogin}
  disabled={loading} 
          >
         {loading ? "Loading..." : "Log In"}
          </Button>
        </Grid>
        {showAlert && (
          <Typography style={{ color: "red", textAlign: "center" }}>
            Invalid credentials. Please try again.
          </Typography>
        )}
      </Paper>

      <Modal
        open={openResetModal}
        // onClose={handleCloseResetModal}
        aria-labelledby="reset-password-modal"
        aria-describedby="reset-password-modal-description"
        className={openResetModal ? "blur-background" : ""}
      >
        <Paper
          elevation={3}
          style={{ padding: 20, width: 350, margin: "12rem 35.5rem 37rem" }}
        >
          <Typography variant="h6" style={{ marginBottom: 10 }}>
            Forgot Password?
            <CloseIcon
              style={{ marginLeft: "157px", cursor: "pointer" }}
              onClick={handleCloseResetModal}
            />
          </Typography>

          {!showOtpField && !showNewPasswordFields && (
            <>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={resetEmailError}
                helperText={resetEmailError ? resetError : ""}
                style={{ marginBottom: 10 }}
              />
              {showInvalidEmail && <Alert severity="error">{resetError}</Alert>}
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "1rem", marginLeft: "6rem" }}
                onClick={handleGetOtp}
              >
                Get OTP
              </Button>
            </>
          )}
          {showOtpField && !showNewPasswordFields && (
            <>
              <TextField
                label="Enter OTP"
                variant="outlined"
                fullWidth
                value={otp}
                onChange={handleOtpValidation}
                style={{ marginTop: 20 }}
              />
              {otpError && (
                <Alert severity="error" style={{ marginTop: "0.5rem" }}>
                  Invalid OTP
                </Alert>
              )}
              {otpErrorExpire && (
                <Alert severity="error" style={{ marginTop: "0.5rem" }}>
                  OTP Expired
                </Alert>
              )}
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: 10, marginLeft: "6rem" }}
                onClick={handleOtpSubmit}
              >
                Submit OTP
              </Button>
              <Typography
                variant="body2"
                style={{ marginTop: 10, cursor: "pointer", color: "#1a237e" }}
                onClick={handleResendOtp}
              >
                Resend OTP
              </Typography>
            </>
          )}
          {showNewPasswordFields && (
            <>
              <TextField
                label="New Password"
                variant="outlined"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginTop: 20 }}
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ marginTop: 20 }}
              />
              {passwordsMatchError && (
                <Alert severity="error" style={{ marginTop: "0.5rem" }}>
                  Passwords do not match
                </Alert>
              )}
              {newpassworderror && (
                <Alert severity="error" style={{ marginTop: "0.5rem" }}>
                  Password should be at least 8 characters long and must have at
                  least one digit, one special character, one lowercase letter,
                  and one uppercase letter.
                </Alert>
              )}
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: 10, marginLeft: "6rem" }}
                onClick={handleChangePassword}
              >
                Save Password
              </Button>
            </>
          )}
        </Paper>
      </Modal>
    </Grid> 
    // </SessionProvider>
  );
}
