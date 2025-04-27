// contexts/UserInfoContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Member } from "~/types/user";

type AssociateContextType = {
  selectedMember: Member | null;
  isModalOpen: boolean;
  openModal: (member: Member) => void;
  closeModal: () => void;
  isInviteModalOpen: boolean;
  openInviteModal: () => void;
  closeInviteModal: () => void;
  isSelectModeEnabled?: boolean;
  setSelectMode: (state: boolean) => void;
  selectedMembers: MemberSelectionType[];
  toggleMemberSelection: ({
    memberId,
    memberUsername,
  }: MemberSelectionType) => void;
};

type MemberSelectionType = {
  memberId: string;
  memberUsername: string;
};

const AssociateContext = createContext<AssociateContextType>({
  selectedMember: null,
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  isInviteModalOpen: false,
  openInviteModal: () => {},
  closeInviteModal: () => {},
  isSelectModeEnabled: false,
  setSelectMode: () => {},
  selectedMembers: [],
  toggleMemberSelection: () => {},
});

export const AssociateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isSelectModeEnabled, setSelectModeEnabled] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<MemberSelectionType[]>(
    []
  );

  const openModal = (member: Member) => {
    console.log("member modal")
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  const clearSelectedMembers = () => {
    setSelectedMembers([]);
  };

  const setSelectMode = (state: boolean) => {
    setSelectModeEnabled(state);
    if (!state) clearSelectedMembers();
  };

  const toggleMemberSelection = ({
    memberId,
    memberUsername,
  }: MemberSelectionType) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.memberId === memberId)
        ? prev.filter((m) => m.memberId !== memberId)
        : [...prev, { memberId, memberUsername }]
    );
  };

  return (
    <AssociateContext.Provider
      value={{
        selectedMember,
        isModalOpen,
        openModal,
        closeModal,
        isInviteModalOpen,
        openInviteModal,
        closeInviteModal,
        isSelectModeEnabled,
        setSelectMode,
        toggleMemberSelection,
        selectedMembers,
      }}
    >
      {children}
    </AssociateContext.Provider>
  );
};

export const useAssociate = () => useContext(AssociateContext);
