import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import { reportPost as handleReportPost } from "~/reduxStore/slices/post/postActions";
import {
  useReportUserMutation,
  useUndoReportUserMutation,
} from "~/reduxStore/api/profile/profileApi.report";
import { updateAllFeedPostsReportStatus } from "~/reduxStore/slices/post/postsSlice";
import { ReportPost } from "~/types/post";
import { ReportUser } from "~/types/user";

export const useReport = () => {
  const dispatch = useDispatch<AppDispatch>();
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

  // Function to report a post
  const reportPost = useCallback(
    async (reportData: ReportPost) => {
      try {
        dispatch(
          updateAllFeedPostsReportStatus({
            postId: reportData.targetId,
            isReported: true,
          })
        );
        // Call the mutation and wait for its result
        handleReportPost(reportData);
      } catch (error) {
        dispatch(
          updateAllFeedPostsReportStatus({
            postId: reportData.targetId,
            isReported: false,
          })
        );
        console.error("Failed to report", error);
      }
    },
    [reportUserMutation]
  );

  return { reportUser, undoReportUser, reportPost };
};
