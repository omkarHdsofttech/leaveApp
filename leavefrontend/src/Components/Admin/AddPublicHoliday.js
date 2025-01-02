import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  Card,
  Typography,
  IconButton,
  Box
} from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledDay = styled("div")(({ theme, selected }) => ({
  borderRadius: "50%",
  backgroundColor: selected ? theme.palette.primary.main : "transparent",
  color: selected ? theme.palette.primary.contrastText : "inherit",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const AddPublicHoliday = () => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [holidayDetails, setHolidayDetails] = useState({ name: "", description: "" });

  const handleDateChange = (newDate) => {
    if (newDate) {
      setCurrentDate(newDate);
      setIsModalOpen(true);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
    setSelectedDates([]);
  };

  const saveHolidayDetails = () => {
    setSelectedDates((prev) => [
      ...prev,
      { date: currentDate, name: holidayDetails.name, description: holidayDetails.description },
    ]);
    setHolidayDetails({ name: "", description: "" });
    setIsModalOpen(false);
  };

  const handleDeleteHoliday = (dateToDelete) => {
    setSelectedDates((prev) => prev.filter((item) => !dayjs(item.date).isSame(dateToDelete, "day")));
  };

  const renderDay = (date, _selectedDates, pickersDayProps) => {
    const isSelected = selectedDates.some((d) => dayjs(d.date).isSame(date, "day"));
    return (
      <StyledDay selected={isSelected}>
        <div {...pickersDayProps}>{pickersDayProps.day}</div>
      </StyledDay>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={4} style={{ padding: "20px" }}>
        {/* Left Section */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>
              Select Year and Holidays
            </Typography>
            <FormControl fullWidth style={{ marginBottom: "20px" }}>
              <InputLabel>Select Year</InputLabel>
              <Select value={selectedYear} onChange={handleYearChange} label="Select Year">
                {[...Array(10)].map((_, index) => {
                  const year = dayjs().year() - 5 + index;
                  return (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              onChange={handleDateChange}
              value={null}
              renderDay={(day, _value, props) => renderDay(day, selectedDates, props)}
              minDate={dayjs(`${selectedYear}-01-01`)}
              maxDate={dayjs(`${selectedYear}-12-31`)}
              sx={{ marginBottom: 2 }}
            />
          </Card>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>
              Selected Holidays
            </Typography>
            {selectedDates.length > 0 ? (
              <List>
                {selectedDates.map((item, index) => (
                  <ListItem key={index} style={{ marginBottom: "10px" }}>
                    <ListItemText
                      primary={`${dayjs(item.date).format("DD-MM-YYYY")} - ${item.name}`}
                      secondary={item.description}
                    />
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteHoliday(item.date)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No holidays selected yet.
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
              onClick={saveHolidayDetails}
            >
              Save Holidays
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Modal for Adding Details */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Holiday Details</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Holiday Name"
            value={holidayDetails.name}
            onChange={(e) => setHolidayDetails({ ...holidayDetails, name: e.target.value })}
            style={{ marginBottom: "20px" }}
          />
          <TextField
            fullWidth
            label="Description"
            value={holidayDetails.description}
            onChange={(e) => setHolidayDetails({ ...holidayDetails, description: e.target.value })}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={saveHolidayDetails}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddPublicHoliday;
