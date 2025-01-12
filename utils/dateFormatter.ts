import moment from "moment";

// Convert current date to "Month name Year" format
export const dateFormatter = (date: Date) => {
  const formattedDate = moment(date).format("MMMM YYYY");
  return formattedDate; // Example output: "January 2025"
};
