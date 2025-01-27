import moment from "moment";

// Convert current date to "Month name Year" format
export const dateFormatter = (date: Date, type: string) => {
  let formattedDate;
  switch (type) {
    case "text":
      formattedDate = moment(date).format("MMMM YYYY");
      break;

    case "date":
      formattedDate = moment(date).format("l");
      break;

    default:
      formattedDate = moment(date).format("MMMM YYYY");
      break;
  }
  return formattedDate;
};
