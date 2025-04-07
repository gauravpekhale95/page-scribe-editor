import { EnvConfig } from "../envConfig";
import { getEmailFromToken } from "./jwtHelper";
const envConfig = new EnvConfig();

export const capitalizeFirstLetter = (string: string): string => {
  return string
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export const getProgressBarColor = (score: number) => {
  return score >= 90 ? "#4CAF50" : score >= 50 ? "#bfed26" : "#F44336";
};

export const formatDateTimeToLocale = (createdOn: string) => {
  // Ensure the input is a valid date string
  if (!createdOn) return '';

  try {
    // Parse the date with UTC parsing to avoid timezone conflicts
    const date = new Date(Date.parse(createdOn));

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', createdOn);
      return '';
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit", 
      minute: "2-digit", 
      timeZone: 'UTC' // Specify UTC to avoid local timezone issues
    };

    return date.toLocaleString([], options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const hasDeveloperAccess = (): boolean => {
  const email = getEmailFromToken();
  if (envConfig.globalVariables.developers.includes(email)) {
    return true;
  } else {
    return false;
  }
};

export const formatDateForApi = (
  date: Date | null,
  startDate: boolean = false,
  endDate: boolean = false
): string | undefined => {
  if (!date) return undefined;
  // Convert the date to UTC midnight before formatting
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const isoString = utcDate.toISOString().split("Z")[0];
  if (startDate) {
    return `${isoString.split("T")[0]}T00:00:00.000Z`;
  }
  if (endDate) {
    return `${isoString.split("T")[0]}T23:59:59.999Z`;
  }
  return isoString;
};

export const formatNameFromEmail = (email: string): string => {
  return email
    .split("@")[0] 
    .split(".") 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ").toString();
};

export const downloadCsvFile = (data: ArrayBuffer, filename: string = 'checklist-export.csv') => {
  if (!data) {
      console.error("No data received for export.");
      return;
  }

  try {
      console.log("Received buffer data:", data);

      // Convert Buffer to a string (assuming CSV content is in the buffer)
      const decodedString = new TextDecoder().decode(new Uint8Array(data));
      console.log("Decoded CSV string:", decodedString);

      // If the data is already in CSV format, just prepare it for download
      const blob = new Blob([decodedString], {
          type: 'text/csv;charset=utf-8;'
      });

      // Create a URL for the Blob and trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      console.log("Download triggered successfully.");
  } catch (error) {
      console.error("Error in downloadCsvFile:", error);
  }
};
