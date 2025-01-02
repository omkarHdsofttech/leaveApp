import React, { useEffect, useState } from 'react';
import { TextField, Button,Snackbar,InputAdornment, Grid, Box, FormControl, InputLabel, Select, MenuItem , IconButton,Input} from '@mui/material';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const AddEmployee = () => {
  const [step, setStep] = useState(1); // Step tracking
  const [balance, setBalance] = useState(false);
  const[profielPicture,setProfilePicture]=useState("Profile Picture")
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    
    U_email: '',
    gender: 'M',
    U_phone: '',
    f_name: '',
    l_name: '',
    // m_name: '',
    U_DOB: '',
    age: '',

    // Step 2: Other Information
    U_desig: '',
    U_password: '',
    Activeyn: 'Y',
    teamLeader: 'N',
    DOJ: '',
    U_maritalstatus: 'Unmarried', // Default to 'Unmarried'
    nationality: '',
    phyhandicap: 'N',
    State: '',
    City: '',
    Pincode: '',
    address: '',
    profilePicture: '',

  });
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep(2);
  };
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      U_password: value,
    }));
  };
  const handleBack = () => {
    setStep(1);
  };

 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file.name); // Set only the file name for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: reader.result, // Store Base64 string in state for submission
        }));
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if any field is empty
    for (const [key, value] of Object.entries(formData)) {
      if (value === '' || value === null || value === undefined) {
        alert('Please fill out all required fields.');
        return;
      }
    }
  
    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.U_password)) {
      alert(
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character.'
      );
      return;
    }
 
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(formData.Pincode)) {
      alert('Please enter valid pincode.');
      return;
    }
  
    // Validate Mobile number (should only contain numbers and ideally 10 digits)
    const phoneRegex = /^[0-9]{10}$/;  // Modify this if needed for different countries
    if (!phoneRegex.test(formData.U_phone)) {
      alert('Please enter validmobile number.');
      return;
    }
  // Validate Email for specific domain
const emailRegex = /^[a-zA-Z0-9._%+-]+@hdsofttech\.com$/;
if (!emailRegex.test(formData.U_email)) {
  alert('Please enter a valid email.');
  return;
}

    // Validate Age (should be a positive number)
    const age = parseInt(formData.age, 10);
    if (isNaN(age) || age < 10 || age > 100) {
      alert('Please enter valid age.');
      return;
    }
    try {
      // Send data to server
      const response = await axios.post(`${process.env.REACT_APP_APIURL}addEmployee`, formData);
      setFormData({
        U_email: '',
    gender: 'M',
    U_phone: '',
    f_name: '',
    l_name: '',
    // m_name: '',
    U_DOB: '',
    age: '',

    // Step 2: Other Information
    U_desig: '',
    U_password: '',
    Activeyn: 'Y',
    teamLeader: 'N',
    DOJ: '',
    U_maritalstatus: 'Unmarried', // Default to 'Unmarried'
    nationality: '',
    phyhandicap: 'N',
    State: '',
    City: '',
    Pincode: '',
    address: '',
    profilePicture: '',
      });
      setStep(1);
      setProfilePicture('Profile Picture');
      setOpenSnackbar(true)
      setBalance(true)
     
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault(); // Prevent paste in password fields
  };
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    // Fetch designations from the /udesigname API endpoint
    const fetchDesignations = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_APIURL}udesigname`);
        
        if (response.ok) {
          const data = await response.json();
          const udesigname = data.udesigname;
          console.log("Fetched designations:", udesigname); // Log the fetched designations
          setDesignations(udesigname); // Set the designations state
        } else {
          console.error("Failed to fetch designations");
        
        }
      } catch (error) {
        console.error("Error fetching designations:", error);
        
      }
    };

    fetchDesignations();
  }, []); 
  console.log("data",designations)

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <h3>Add Public Holiday</h3>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  name="f_name"
                  value={formData.f_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  name="l_name"
                  value={formData.l_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                    required
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  name="U_phone"
                  value={formData.U_phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  variant="outlined"
                  fullWidth
                  name="U_DOB"
                  value={formData.U_DOB}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  type="number"
                  variant="outlined"
                  fullWidth
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    name="U_maritalstatus"
                    value={formData.U_maritalstatus}
                    onChange={handleChange}
                    label="Marital Status"
                  >
                    <MenuItem value="Unmarried">Unmarried</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  variant="outlined"
                  fullWidth
                  name="City"
                  value={formData.City}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pincode"
                  variant="outlined"
                  fullWidth
                  name="Pincode"
                  value={formData.Pincode}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  variant="outlined"
                  fullWidth
                  name="State"
                  value={formData.State}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nationality"
                  variant="outlined"
                  fullWidth
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Physical Handicap</InputLabel>
                  <Select
                    name="phyhandicap"
                    value={formData.phyhandicap}
                    onChange={handleChange}
                    label="Physical Handicap"
                  >
                    <MenuItem value="Y">Yes</MenuItem>
                    <MenuItem value="N">No</MenuItem>
                  </Select>
                </FormControl>

               
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <Button variant="contained" color="primary" onClick={handleNext} size="large">
                Next
              </Button>
            </Box>
          </div>
        )}

{step === 2 && (
          <div>
            <h3>Employment Information</h3>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee ID"
                  variant="outlined"
                  fullWidth
                  name="U_id"
                  value={formData.U_id}
                  onChange={handleChange}
                  required
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="U_email"
                  value={formData.U_email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
  <InputLabel>Designation</InputLabel>
  <Select
    name="U_desig"
    value={formData.U_desig}
    onChange={handleChange}
    label="Designation"
    required
    MenuProps={{
      PaperProps: {
        style: {
          maxHeight: 200, // Adjust the height to show 4 items
          overflow: 'auto', // Enable scrolling
        },
      },
    }}
  >
    {designations.map((designation) => (
      <MenuItem key={designation.D_id} value={designation.D_id}>
        {designation.Designame}
      </MenuItem>
    ))}
  </Select>
</FormControl>

              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Joining"
                  type="date"
                  variant="outlined"
                  fullWidth
                  name="DOJ"
                  value={formData.DOJ}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <FormControl fullWidth>
                  <InputLabel>Active</InputLabel>
                  <Select
                    name="Activeyn"
                    value={formData.Activeyn}
                    onChange={handleChange}
                    label="Active"
                    required
                  >
                    <MenuItem value="Y">Yes</MenuItem>
                    <MenuItem value="N">No</MenuItem>
                  </Select>
                </FormControl> */}
                <FormControl fullWidth>
  <InputLabel>Team Leader</InputLabel>
  <Select
    name="teamLeader"
    value={formData.teamLeader} // Holds either 'Y' or 'N'
    onChange={handleChange}
    label="Team Leader"
    required
  >
    <MenuItem value="N">No</MenuItem>
    <MenuItem value="Y">Yes</MenuItem>
  </Select>
</FormControl>

              </Grid>
              
              <Grid item xs={12} sm={6}>
<FormControl fullWidth>
<InputLabel>{profielPicture}</InputLabel>
<TextField
      type="text" // Use text input instead of file type to avoid the default file button
      value={profielPicture} // Display only the file name
      InputProps={{
        endAdornment: (
<InputAdornment position="end">
<Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
              Choose File
<input
                type="file"
                hidden
                onChange={handleFileChange} // Handle file selection
              />
</Button>
</InputAdornment>
        ),
      }}
    />
</FormControl>
</Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  name="U_password"
                  value={formData.U_password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  name="U_password"
                  value={formData.U_password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid> */}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <Button variant="contained" color="primary" onClick={handleBack} sx={{ marginRight: 2 }} size="large">
                Back
              </Button>
              <Button variant="contained" color="primary" type="submit" size="large">
                Submit
              </Button>
            </Box>
          </div>
        )}

      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={10000}
        message="Employee added successfully!"
        onClose={handleCloseSnackbar}
        sx={{
          backgroundColor: "green", // Green color for success
          color: "#fff", // White text color
          borderRadius: "4px", // Rounded corners for the Snackbar
          fontWeight: "bold", // Bold font for the message
        }}
      />
    </div>
  );
};
