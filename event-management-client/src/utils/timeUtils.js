import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const TIMEZONES = [
  { label: "Eastern Time (ET)", value: "America/New_York" },
  { label: "Central Time (CT)", value: "America/Chicago" },
  { label: "Mountain Time (MT)", value: "America/Denver" },
  { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
  { label: "India Standard Time (IST)", value: "Asia/Kolkata" },
  { label: "Coordinated Universal Time (UTC)", value: "UTC" },
  { label: "Greenwich Mean Time (GMT)", value: "Europe/London" },
  { label: "Central European Time (CET)", value: "Europe/Berlin" },
  { label: "Japan Standard Time (JST)", value: "Asia/Tokyo" },
  { label: "Australia Eastern Time (AET)", value: "Australia/Sydney" },
  { label: "Dubai Standard Time - (DST)", value: "Asia/Dubai" },
  { label: "Singapore Standard Time - (SST)", value: "Asia/Singapore" },
  { label: "Brazil Time - (BT)", value: "America/Sao_Paulo" },
];

export const displayTimeInUserTz = (utcTime, userTimezone) => {
  if (!utcTime || !userTimezone) return "";
  return dayjs.utc(utcTime).tz(userTimezone).format("MMM D, YYYY [at] h:mm A");
};

export const convertLocalToUTC = (dateString, timeString, eventTimezone) => {
  const combinedString = `${dateString} ${timeString}`;
  const dayjsObj = dayjs.tz(combinedString, "YYYY-MM-DD HH:mm", eventTimezone);
  return dayjsObj.utc().toDate();
};

export const convertUTCToLocalForm = (utcTime, targetTimezone) => {
  if (!utcTime || !targetTimezone) return { date: "", time: "" };

  const dayjsObj = dayjs.utc(utcTime).tz(targetTimezone);

  return {
    date: dayjsObj.format("YYYY-MM-DD"),
    time: dayjsObj.format("HH:mm"),
  };
};
