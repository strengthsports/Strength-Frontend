import moment from "moment";

// Convert current date to required formats
export const dateFormatter = (date: Date, type: string) => {
  let formattedDate;
  switch (type) {
    case "text":
      formattedDate = moment(date).format("MMM YYYY"); // e.g., April 2025
      break;

    case "date":
      formattedDate = moment(date).format("DD-MM-YYYY"); // e.g., 08-04-2025
      break;

    default:
      formattedDate = moment(date).format("MMMM YYYY");
      break;
  }
  return formattedDate;
};
