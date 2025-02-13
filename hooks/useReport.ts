import { useCallback } from "react";
import {
  useReportUserMutation,
  useUndoReportUserMutation,
} from "~/reduxStore/api/profile/profileApi.report";
import { ReportUser } from "~/types/user";

export const useReport = () => {
  // Get the mutation functions from RTK Query
  const [reportUserMutation] = useReportUserMutation();
  const [undoReportUserMutation] = useUndoReportUserMutation();

  // Function to report a user
  const reportUser = useCallback(
    async (reportData: ReportUser) => {
      try {
        // Call the mutation and wait for its result
        await reportUserMutation(reportData).unwrap();
      } catch (error) {
        console.error("Failed to report", error);
      }
    },
    [reportUserMutation]
  );

  // Function to undo a report
  const undoReportUser = useCallback(
    async (reportData: Partial<ReportUser>) => {
      try {
        // Call the mutation to undo reporting and wait for its result
        await undoReportUserMutation(reportData).unwrap();
      } catch (error) {
        console.error("Failed to undo report:", error);
      }
    },
    [undoReportUserMutation]
  );

  return { reportUser, undoReportUser };
};
