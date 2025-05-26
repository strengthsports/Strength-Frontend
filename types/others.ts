export interface PicModalType {
  status: Boolean | any;
  message: string;
}

export interface PicData {
  type: string;
  data: FormData;
}

export type Notification = {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic: string | null;
    type: string;
  };
  receiver: {
    _id: string;
    type: string;
  };
  target: {
    _id: string;
    assets: Object[] | any;
    caption: string;
    type: string;
  };
  type: string;
  isNotificationRead: boolean;
  [key: string]: any;
};

export type Target = {
  targetId: string;
  targetType: string;
};

export type InviteMember = {
  receiverIds: string[];
  roleInPage: string;
};

export type NotificationType =
  | "Like"
  | "Comment"
  | "Follow"
  | "TeamInvitation"
  | "TeamPromotion"
  | "JoinTeamRequest"
  | "Report"
  | "Tag"
  | "Reply"
  | "TeamInvitationAccepted";
