// component for setting therapist business hours

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Touchable,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import colors from "../../config/colors";
import AuthContext from "../../auth/context";
import Checkbox from "expo-checkbox";
import * as yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function TherapistBusinessHours({ businessHours, setBusinessHours }) {
  const navigation = useNavigation();

  const defaultStartTime = new Date();
  defaultStartTime.setHours(9, 0, 0, 0);
  const defaultEndTime = new Date();
  defaultEndTime.setHours(17, 0, 0, 0);

  let newBusinessHours = businessHours;

  const [errorText, setErrorText] = useState("");
  // default to 9am to 5pm
  // enhanced implementation
  const [monday, setMonday] = useState([]);
  const [tuesday, setTuesday] = useState([]);
  const [wednesday, setWednesday] = useState([]);
  const [thursday, setThursday] = useState([]);
  const [friday, setFriday] = useState([]);
  const [saturday, setSaturday] = useState([]);
  const [sunday, setSunday] = useState([]);
  const { operatingHours, setOperatingHours } = useState(businessHours);

  const timeToHour = (time) => {
    return time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  };

  const updateBusinessHours = (numDayOfWeek) => {
    // console.warn("numDayOfWeek = ", numDayOfWeek);
    newBusinessHours[numDayOfWeek] = [];
    switch (numDayOfWeek) {
      case "0":
        // console.warn("monday = ", monday);
        monday.forEach((timeSlot) => {
          newBusinessHours[numDayOfWeek].push([
            timeToHour(timeSlot[0]),
            timeToHour(timeSlot[1]),
          ]);
        });
        break;
      case "1":
        tuesday.forEach((timeSlot) => {
          newBusinessHours[numDayOfWeek].push([
            timeToHour(timeSlot[0]),
            timeToHour(timeSlot[1]),
          ]);
        });
        break;
      case "2":
        wednesday.forEach((timeSlot) => {
          newBusinessHours[numDayOfWeek].push([
            timeToHour(timeSlot[0]),
            timeToHour(timeSlot[1]),
          ]);
        });
        break;
      case "3":
        thursday.forEach((timeSlot) => {
          newBusinessHours[numDayOfWeek].push([
            timeToHour(timeSlot[0]),
            timeToHour(timeSlot[1]),
          ]);
        });
        break;
      case "4":
        friday.forEach((timeSlot) => {
          newBusinessHours[numDayOfWeek].push([
            timeToHour(timeSlot[0]),
            timeToHour(timeSlot[1]),
          ]);
        });
        break;
      case "5":
        saturday.forEach((timeSlot) => {
          newBusinessHours[numDayOfWeek].push([
            timeToHour(timeSlot[0]),
            timeToHour(timeSlot[1]),
          ]);
        });
        break;
      case "6":
        sunday.forEach((timeSlot) => {
          newBusinessHours[numDayOfWeek].push([
            timeToHour(timeSlot[0]),
            timeToHour(timeSlot[1]),
          ]);
        });
        break;
    }
    setBusinessHours(newBusinessHours);
    // console.warn("businessHours = ", newBusinessHours);
  };

  useEffect(() => {
    updateBusinessHours("0");
  }, [monday]);

  useEffect(() => {
    updateBusinessHours("1");
  }, [tuesday]);

  useEffect(() => {
    updateBusinessHours("2");
  }, [wednesday]);

  useEffect(() => {
    updateBusinessHours("3");
  }, [thursday]);

  useEffect(() => {
    updateBusinessHours("4");
  }, [friday]);

  useEffect(() => {
    updateBusinessHours("5");
  }, [saturday]);

  useEffect(() => {
    updateBusinessHours("6");
  }, [sunday]);

  // const addTimeSlotToBusinessHours = (numDayOfWeek, startTime, endTime) => {
  //   newBusinessHours[numDayOfWeek] += [startTime, endTime];
  // };

  // const modifyTimeSlotInBusinessHours = (
  //   numDayOfWeek,
  //   startTime,
  //   endTime,
  //   index
  // ) => {
  //   newBusinessHours[numDayOfWeek][index] = [startTime, endTime];
  // };

  // const businessHourUpdateController = (
  //   numDayOfWeek,
  //   startHour,
  //   endHour,
  //   index
  // ) => {
  //   if (startHour >= endHour) {
  //     return setErrorText("Start time must be before end time.");
  //   }
  //   if (newBusinessHours[numDayOfWeek].length === 0) {
  //     addTimeSlotToBusinessHours(numDayOfWeek, startHour, endHour);
  //   } else if (index > newBusinssHours[numDayOfWeek].length - 1) {
  //     addTimeSlotToBusinessHours(numDayOfWeek, startHour, endHour);
  //   } else {
  //     modifyTimeSlotInBusinessHours(numDayOfWeek, startHour, endHour, index);
  //   }
  // };

  // // need to link
  // const updateBusinessHours = (dayOfWeek, startOrEnd, time, index) => {
  //   switch (dayOfWeek) {
  //     case "monday":
  //       if (startOrEnd === "start") {
  //         const startHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         const endHour =
  //           mondayEnd.getMinutes() === 30
  //             ? mondayEnd.getHours() + 0.5
  //             : mondayEnd.getHours();
  //         businessHourUpdateController(0, startHour, endHour, index);
  //       } else {
  //         const startHour =
  //           mondayStart.getMinutes() === 30
  //             ? mondayStart.getHours() + 0.5
  //             : mondayStart.getHours();
  //         const endHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         businessHourUpdateController(0, startHour, endHour, index);
  //       }
  //       break;
  //     case "tuesday":
  //       if (startOrEnd === "start") {
  //         const startHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         const endHour =
  //           tuesdayEnd.getMinutes() === 30
  //             ? tuesdayEnd.getHours() + 0.5
  //             : tuesdayEnd.getHours();
  //         businessHourUpdateController(1, startHour, endHour, index);
  //       } else {
  //         const startHour =
  //           tuesdayStart.getMinutes() === 30
  //             ? tuesdayStart.getHours() + 0.5
  //             : tuesdayStart.getHours();
  //         const endHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         businessHourUpdateController(1, startHour, endHour, index);
  //       }
  //       break;
  //     case "wednesday":
  //       if (startOrEnd === "start") {
  //         const startHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         const endHour =
  //           wednesdayEnd.getMinutes() === 30
  //             ? wednesdayEnd.getHours() + 0.5
  //             : wednesdayEnd.getHours();
  //         businessHourUpdateController(2, startHour, endHour, index);
  //       } else {
  //         const startHour =
  //           wednesdayStart.getMinutes() === 30
  //             ? wednesdayStart.getHours() + 0.5
  //             : wednesdayStart.getHours();
  //         const endHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         businessHourUpdateController(2, startHour, endHour, index);
  //       }
  //       break;
  //     case "thursday":
  //       if (startOrEnd === "start") {
  //         const startHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         const endHour =
  //           thursdayEnd.getMinutes() === 30
  //             ? thursdayEnd.getHours() + 0.5
  //             : thursdayEnd.getHours();
  //         businessHourUpdateController(3, startHour, endHour, index);
  //       } else {
  //         const startHour =
  //           thursdayStart.getMinutes() === 30
  //             ? thursdayStart.getHours() + 0.5
  //             : thursdayStart.getHours();
  //         const endHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         businessHourUpdateController(3, startHour, endHour, index);
  //       }
  //       break;
  //     case "friday":
  //       if (startOrEnd === "start") {
  //         const startHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         const endHour =
  //           fridayEnd.getMinutes() === 30
  //             ? fridayEnd.getHours() + 0.5
  //             : fridayEnd.getHours();
  //         businessHourUpdateController(4, startHour, endHour, index);
  //       } else {
  //         const startHour =
  //           fridayStart.getMinutes() === 30
  //             ? fridayStart.getHours() + 0.5
  //             : fridayStart.getHours();
  //         const endHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         businessHourUpdateController(4, startHour, endHour, index);
  //       }
  //       break;
  //     case "saturday":
  //       if (startOrEnd === "start") {
  //         const startHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         const endHour =
  //           saturdayEnd.getMinutes() === 30
  //             ? saturdayEnd.getHours() + 0.5
  //             : saturdayEnd.getHours();
  //         businessHourUpdateController(5, startHour, endHour, index);
  //       } else {
  //         const startHour =
  //           saturdayStart.getMinutes() === 30
  //             ? saturdayStart.getHours() + 0.5
  //             : saturdayStart.getHours();
  //         const endHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         businessHourUpdateController(5, startHour, endHour, index);
  //       }
  //       break;
  //     case "sunday":
  //       if (startOrEnd === "start") {
  //         const startHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         const endHour =
  //           sundayEnd.getMinutes() === 30
  //             ? sundayEnd.getHours() + 0.5
  //             : sundayEnd.getHours();
  //         businessHourUpdateController(6, startHour, endHour, index);
  //       } else {
  //         const startHour =
  //           sundayStart.getMinutes() === 30
  //             ? sundayStart.getHours() + 0.5
  //             : sundayStart.getHours();
  //         const endHour =
  //           time.getMinutes() === 30 ? time.getHours() + 0.5 : time.getHours();
  //         businessHourUpdateController(6, startHour, endHour, index);
  //       }
  //       break;
  //   }
  // };

  // enhanced implementation
  //   const handleDateChange = (event, selectedDate, dayOfWeek) => {
  //     console.warn("event = ", event);
  //     console.warn("selectedDate = ", selectedDate.toLocaleTimeString());
  //     console.warn("dayOfWeek = ", dayOfWeek);

  //     // setMondayStart(selectedDate);

  //     switch (dayOfWeek) {
  //       case "monday":
  //         console.warn("in case monday");
  //         setMondayStart(selectedDate);
  //         break;
  //       case "tuesday":
  //         setTuesdayStart(selectedDate);
  //         break;
  //       case "wednesday":
  //         setWednesdayStart(selectedDate);
  //         break;
  //       case "thursday":
  //         setThursdayStart(selectedDate);
  //         break;
  //       case "friday":
  //         setFridayStart(selectedDate);
  //         break;
  //       case "saturday":
  //         setSaturdayStart(selectedDate);
  //         break;
  //       case "sunday":
  //         setSundayStart(selectedDate);
  //         break;
  //     }

  //     console.warn("mondayStart = ", mondayStart);
  //   };

  const addTimeSlot = (dayOfWeek) => {
    switch (dayOfWeek) {
      case "monday":
        // set minimum start time as 1 hour after previous end time
        let newMondayStartTime = new Date(monday[monday.length - 1][1]);
        newMondayStartTime.setHours(newMondayStartTime.getHours() + 1);
        // set new end time as four hours after new start time but not past midnight
        let newMondayEndTime = new Date(newMondayStartTime);
        newMondayEndTime.setHours(
          newMondayEndTime.getHours() <= 20
            ? newMondayEndTime.getHours() + 4
            : 24
        );
        setMonday([...monday, [newMondayStartTime, newMondayEndTime]]);
        break;
      case "tuesday":
        // set minimum start time as 1 hour after previous end time
        let newTuesdayStartTime = new Date(tuesday[tuesday.length - 1][1]);
        newTuesdayStartTime.setHours(newTuesdayStartTime.getHours() + 1);
        // set new end time as four hours after new start time but not past midnight
        let newTuesdayEndTime = new Date(newTuesdayStartTime);
        newTuesdayEndTime.setHours(
          newTuesdayEndTime.getHours() <= 20
            ? newTuesdayEndTime.getHours() + 4
            : 24
        );
        setTuesday([...tuesday, [newTuesdayStartTime, newTuesdayEndTime]]);
        break;
      case "wednesday":
        // set minimum start time as 1 hour after previous end time
        let newWednesdayStartTime = new Date(
          wednesday[wednesday.length - 1][1]
        );
        newWednesdayStartTime.setHours(newWednesdayStartTime.getHours() + 1);
        // set new end time as four hours after new start time but not past midnight
        let newWednesdayEndTime = new Date(newWednesdayStartTime);
        newWednesdayEndTime.setHours(
          newWednesdayEndTime.getHours() <= 20
            ? newWednesdayEndTime.getHours() + 4
            : 24
        );
        setWednesday([
          ...wednesday,
          [newWednesdayStartTime, newWednesdayEndTime],
        ]);
        break;
      case "thursday":
        // set minimum start time as 1 hour after previous end time
        let newThursdayStartTime = new Date(thursday[thursday.length - 1][1]);
        newThursdayStartTime.setHours(newThursdayStartTime.getHours() + 1);
        // set new end time as four hours after new start time but not past midnight
        let newThursdayEndTime = new Date(newThursdayStartTime);
        newThursdayEndTime.setHours(
          newThursdayEndTime.getHours() <= 20
            ? newThursdayEndTime.getHours() + 4
            : 24
        );
        setThursday([...thursday, [newThursdayStartTime, newThursdayEndTime]]);
        break;
      case "friday":
        // set minimum start time as 1 hour after previous end time
        let newFridayStartTime = new Date(friday[friday.length - 1][1]);
        newFridayStartTime.setHours(newFridayStartTime.getHours() + 1);
        // set new end time as four hours after new start time but not past midnight
        let newFridayEndTime = new Date(newFridayStartTime);
        newFridayEndTime.setHours(
          newFridayEndTime.getHours() <= 20
            ? newFridayEndTime.getHours() + 4
            : 24
        );
        setFriday([...friday, [newFridayStartTime, newFridayEndTime]]);
        break;
      case "saturday":
        // set minimum start time as 1 hour after previous end time
        let newSaturdayStartTime = new Date(saturday[saturday.length - 1][1]);
        newSaturdayStartTime.setHours(newSaturdayStartTime.getHours() + 1);
        // set new end time as four hours after new start time but not past midnight
        let newSaturdayEndTime = new Date(newSaturdayStartTime);
        newSaturdayEndTime.setHours(
          newSaturdayEndTime.getHours() <= 20
            ? newSaturdayEndTime.getHours() + 4
            : 24
        );
        setSaturday([...saturday, [newSaturdayStartTime, newSaturdayEndTime]]);
        break;
      case "sunday":
        // set minimum start time as 1 hour after previous end time
        let newSundayStartTime = new Date(sunday[sunday.length - 1][1]);
        newSundayStartTime.setHours(newSundayStartTime.getHours() + 1);
        // set new end time as four hours after new start time but not past midnight
        let newSundayEndTime = new Date(newSundayStartTime);
        newSundayEndTime.setHours(
          newSundayEndTime.getHours() <= 20
            ? newSundayEndTime.getHours() + 4
            : 24
        );
        setSunday([...sunday, [newSundayStartTime, newSundayEndTime]]);
        break;
    }
  };

  const removeTimeSlot = (dayOfWeek, index) => {
    switch (dayOfWeek) {
      case "monday":
        let mondayCopy = monday.slice(0);
        mondayCopy.splice(index, 1);
        setMonday(mondayCopy);
        break;
      case "tuesday":
        let tuesdayCopy = tuesday.slice(0);
        tuesdayCopy.splice(index, 1);
        setTuesday(tuesdayCopy);
        break;
      case "wednesday":
        let wednesdayCopy = wednesday.slice(0);
        wednesdayCopy.splice(index, 1);
        setWednesday(wednesdayCopy);
        break;
      case "thursday":
        let thursdayCopy = thursday.slice(0);
        thursdayCopy.splice(index, 1);
        setThursday(thursdayCopy);
        break;
      case "friday":
        let fridayCopy = friday.slice(0);
        fridayCopy.splice(index, 1);
        setFriday(fridayCopy);
        break;
      case "saturday":
        let saturdayCopy = saturday.slice(0);
        saturdayCopy.splice(index, 1);
        setSaturday(saturdayCopy);
        break;
      case "sunday":
        let sundayCopy = sunday.slice(0);
        sundayCopy.splice(index, 1);
        setSunday(sundayCopy);
        break;
    }
  };

  const handleCheckbox = (dayOfWeek, value) => {
    switch (dayOfWeek) {
      case "monday":
        if (value === false) {
          // clear monday array
          monday.splice(0, monday.length);
          setMonday([]);
        } else {
          setMonday([[defaultStartTime, defaultEndTime]]);
        }
        break;
      case "tuesday":
        if (value === false) {
          // clear tuesday array
          tuesday.splice(0, tuesday.length);
          setTuesday([]);
        } else {
          setTuesday([[defaultStartTime, defaultEndTime]]);
        }
        break;
      case "wednesday":
        if (value === false) {
          // clear wednesday array
          wednesday.splice(0, wednesday.length);
          setWednesday([]);
        } else {
          setWednesday([[defaultStartTime, defaultEndTime]]);
        }
        break;
      case "thursday":
        if (value === false) {
          // clear thursday array
          thursday.splice(0, thursday.length);
          setThursday([]);
        } else {
          setThursday([[defaultStartTime, defaultEndTime]]);
        }
        break;
      case "friday":
        if (value === false) {
          // clear friday array
          friday.splice(0, friday.length);
          setFriday([]);
        } else {
          setFriday([[defaultStartTime, defaultEndTime]]);
        }
        break;
      case "saturday":
        if (value === false) {
          // clear saturday array
          saturday.splice(0, saturday.length);
          setSaturday([]);
        } else {
          setSaturday([[defaultStartTime, defaultEndTime]]);
        }
        break;
      case "sunday":
        if (value === false) {
          // clear sunday array
          sunday.splice(0, sunday.length);
          setSunday([]);
        } else {
          setSunday([[defaultStartTime, defaultEndTime]]);
        }
        break;
    }
  };

  const handleSubmit = async ({ businessHours }) => {
    try {
      // const result = await therapistApi.setBusinessHours(user.userObj.therapist_id, businessHours);
      // if (!result.ok) {
      //     return setErrorText("Error while updating business hours. Please try again.");
      // }
      // setErrorText("");
      setBusinessHours(businessHours);
    } catch (error) {
      setErrorText("Error while updating business hours. Please try again.");
    }
  };

  const getInitialValues = () => {
    let initialValues = {};
    if (operatingHours) {
      for (let day in operatingHours) {
        initialValues[day] = operatingHours[day].length > 0 ? true : false;
      }
      console.warn("initialValues = ", initialValues);
      return initialValues;
    }
    return {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
    };
  };

  // render a list of checkboxes for each day of the week and within each day, an option to add a time slot
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
          }}
          // validationSchema={businessHoursSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <>
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                Select the days and times you are available. Clients will be
                able to request bookings at these times. You will still be able
                to accept/decline the booking requests.
              </Text>
              <View style={styles.dayContainer}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={props.values["0"]}
                    // onValueChange={(value) => {
                    //   props.setFieldValue("0", value);
                    //   if (value === false) {
                    //     // clear monday array
                    //     monday.splice(0, monday.length);
                    //     setMonday([]);
                    //     updateOuterBusinessHours("0");
                    //     setMonday([[defaultStartTime, defaultEndTime]]);
                    //   } else {
                    //     updateOuterBusinessHours("0");
                    //   }
                    // }}
                    onValueChange={(value) => {
                      props.setFieldValue("0", value);
                      handleCheckbox("monday", value);
                    }}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>Monday</Text>
                </View>
                {props.values["0"] &&
                  monday.map((timeSlot, index) => (
                    <View style={styles.timeSlotContainer} key={index}>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={monday[index][0]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let mondayCopy = monday.slice(0);
                          mondayCopy[index][0] = selectedDate;
                          setMonday(mondayCopy);
                          updateBusinessHours("0");
                        }}
                        style={styles.datePicker}
                      />
                      <Text style={styles.timeSlotText}>to</Text>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={monday[index][1]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let mondayCopy = monday.slice(0);
                          mondayCopy[index][1] = selectedDate;
                          setMonday(mondayCopy);
                          updateBusinessHours("0");
                        }}
                        style={styles.datePicker}
                      />

                      {index !== 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            removeTimeSlot("monday", index);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="delete"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}
                      {index === monday.length - 1 &&
                        new Date(monday[monday.length - 1][1]).getHours() <
                          23 &&
                        new Date(monday[monday.length - 1][1]).getHours() >
                          0 && (
                          <TouchableOpacity
                            onPress={() => {
                              addTimeSlot("monday");
                            }}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  ))}
              </View>
              <View style={styles.dayContainer}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={props.values["1"]}
                    // onValueChange={(value) => props.setFieldValue("1", value)}
                    onValueChange={(value) => {
                      props.setFieldValue("1", value);
                      handleCheckbox("tuesday", value);
                    }}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>Tuesday</Text>
                </View>
                {props.values["1"] &&
                  tuesday.map((timeSlot, index) => (
                    <View style={styles.timeSlotContainer} key={index}>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={tuesday[index][0]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let tuesdayCopy = tuesday.slice(0);
                          tuesdayCopy[index][0] = selectedDate;
                          setTuesday(tuesdayCopy);
                          updateBusinessHours("1");
                        }}
                        style={styles.datePicker}
                      />
                      <Text style={styles.timeSlotText}>to</Text>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={tuesday[index][1]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let tuesdayCopy = tuesday.splice(0);
                          tuesdayCopy[index][1] = selectedDate;
                          setTuesday(tuesdayCopy);
                          updateBusinessHours("1");
                        }}
                        style={styles.datePicker}
                      />
                      {index !== 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            removeTimeSlot("tuesday", index);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="delete"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}

                      {index === tuesday.length - 1 &&
                        new Date(tuesday[tuesday.length - 1][1]).getHours() <
                          23 &&
                        new Date(tuesday[tuesday.length - 1][1]).getHours() >
                          0 && (
                          <TouchableOpacity
                            onPress={() => {
                              addTimeSlot("tuesday");
                            }}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  ))}
              </View>
              <View style={styles.dayContainer}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={props.values["2"]}
                    onValueChange={(value) => {
                      props.setFieldValue("2", value);
                      handleCheckbox("wednesday", value);
                    }}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>Wednesday</Text>
                </View>
                {props.values["2"] &&
                  wednesday.map((timeSlot, index) => (
                    <View style={styles.timeSlotContainer} key={index}>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={wednesday[index][0]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let wednesdayCopy = wednesday.slice(0);
                          wednesdayCopy[index][0] = selectedDate;
                          setWednesday(wednesdayCopy);
                          updateBusinessHours("2");
                        }}
                        style={styles.datePicker}
                      />
                      <Text style={styles.timeSlotText}>to</Text>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={wednesday[index][1]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let wednesdayCopy = wednesday.splice(0);
                          wednesdayCopy[index][1] = selectedDate;
                          setWednesday(wednesdayCopy);
                          updateBusinessHours("2");
                        }}
                        style={styles.datePicker}
                      />
                      {index !== 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            removeTimeSlot("wednesday", index);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="delete"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}
                      {index === wednesday.length - 1 &&
                        new Date(
                          wednesday[wednesday.length - 1][1]
                        ).getHours() < 23 &&
                        new Date(
                          wednesday[wednesday.length - 1][1]
                        ).getHours() > 0 && (
                          <TouchableOpacity
                            onPress={() => {
                              addTimeSlot("wednesday");
                            }}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  ))}
              </View>
              <View style={styles.dayContainer}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={props.values["3"]}
                    onValueChange={(value) => {
                      props.setFieldValue("3", value);
                      handleCheckbox("thursday", value);
                    }}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>Thursday</Text>
                </View>
                {props.values["3"] &&
                  thursday.map((timeSlot, index) => (
                    <View style={styles.timeSlotContainer} key={index}>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={thursday[index][0]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let thursdayCopy = thursday.slice(0);
                          thursdayCopy[index][0] = selectedDate;
                          setThursday(thursdayCopy);
                          updateBusinessHours("3");
                        }}
                        style={styles.datePicker}
                      />
                      <Text style={styles.timeSlotText}>to</Text>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={thursday[index][1]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let thursdayCopy = thursday.splice(0);
                          thursdayCopy[index][1] = selectedDate;
                          setThursday(thursdayCopy);
                          updateBusinessHours("3");
                        }}
                        style={styles.datePicker}
                      />
                      {index !== 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            removeTimeSlot("thursday", index);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="delete"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}
                      {index === thursday.length - 1 &&
                        new Date(thursday[thursday.length - 1][1]).getHours() <
                          23 &&
                        new Date(thursday[thursday.length - 1][1]).getHours() >
                          0 && (
                          <TouchableOpacity
                            onPress={() => {
                              addTimeSlot("thursday");
                            }}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  ))}
              </View>
              <View style={styles.dayContainer}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={props.values["4"]}
                    onValueChange={(value) => {
                      props.setFieldValue("4", value);
                      handleCheckbox("friday", value);
                    }}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>Friday</Text>
                </View>
                {props.values["4"] &&
                  friday.map((timeSlot, index) => (
                    <View style={styles.timeSlotContainer} key={index}>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={friday[index][0]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let fridayCopy = friday.slice(0);
                          fridayCopy[index][0] = selectedDate;
                          setFriday(fridayCopy);
                          updateBusinessHours("4");
                        }}
                        style={styles.datePicker}
                      />
                      <Text style={styles.timeSlotText}>to</Text>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={friday[index][1]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let fridayCopy = friday.splice(0);
                          fridayCopy[index][1] = selectedDate;
                          setFriday(fridayCopy);
                          updateBusinessHours("4");
                        }}
                        style={styles.datePicker}
                      />
                      {index !== 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            removeTimeSlot("friday", index);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="delete"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}

                      {index === friday.length - 1 &&
                        new Date(friday[friday.length - 1][1]).getHours() <
                          23 &&
                        new Date(friday[friday.length - 1][1]).getHours() >
                          0 && (
                          <TouchableOpacity
                            onPress={() => {
                              addTimeSlot("friday");
                            }}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  ))}
              </View>
              <View style={styles.dayContainer}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={props.values["5"]}
                    onValueChange={(value) => {
                      props.setFieldValue("5", value);
                      handleCheckbox("saturday", value);
                    }}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>Saturday</Text>
                </View>
                {props.values["5"] &&
                  saturday.map((timeSlot, index) => (
                    <View style={styles.timeSlotContainer} key={index}>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={saturday[index][0]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let saturdayCopy = saturday.slice(0);
                          saturdayCopy[index][0] = selectedDate;
                          setSaturday(saturdayCopy);
                          updateBusinessHours("5");
                        }}
                        style={styles.datePicker}
                      />
                      <Text style={styles.timeSlotText}>to</Text>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={saturday[index][1]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let saturdayCopy = saturday.splice(0);
                          saturdayCopy[index][1] = selectedDate;
                          setSaturday(saturdayCopy);
                          updateBusinessHours("5");
                        }}
                        style={styles.datePicker}
                      />
                      {index !== 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            removeTimeSlot("saturday", index);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="delete"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}

                      {index === saturday.length - 1 &&
                        new Date(saturday[saturday.length - 1][1]).getHours() <
                          23 &&
                        new Date(saturday[saturday.length - 1][1]).getHours() >
                          0 && (
                          <TouchableOpacity
                            onPress={() => {
                              addTimeSlot("saturday");
                            }}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  ))}
              </View>
              <View style={styles.dayContainer}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={props.values["6"]}
                    onValueChange={(value) => {
                      props.setFieldValue("6", value);
                      handleCheckbox("sunday", value);
                    }}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>Sunday</Text>
                </View>
                {props.values["6"] &&
                  sunday.map((timeSlot, index) => (
                    <View style={styles.timeSlotContainer} key={index}>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={sunday[index][0]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let sundayCopy = sunday.slice(0);
                          sundayCopy[index][0] = selectedDate;
                          setSunday(sundayCopy);
                          updateBusinessHours("6");
                        }}
                        style={styles.datePicker}
                      />
                      <Text style={styles.timeSlotText}>to</Text>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={sunday[index][1]}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          let sundayCopy = sunday.splice(0);
                          sundayCopy[index][1] = selectedDate;
                          setSunday(sundayCopy);
                          updateBusinessHours("6");
                        }}
                        style={styles.datePicker}
                      />
                      {index !== 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            removeTimeSlot("sunday", index);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="delete"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}
                      {index === sunday.length - 1 &&
                        new Date(sunday[sunday.length - 1][1]).getHours() <
                          23 &&
                        new Date(sunday[sunday.length - 1][1]).getHours() >
                          0 && (
                          <TouchableOpacity
                            onPress={() => {
                              addTimeSlot("sunday");
                            }}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  ))}
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
  },
  label: {
    fontSize: 20,
  },
  dayContainer: {
    marginBottom: 20,
    flexDirection: "column",
  },
  timeSlotContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  timeSlotText: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  datePicker: {
    marginRight: 10,
  },
});

export default TherapistBusinessHours;
