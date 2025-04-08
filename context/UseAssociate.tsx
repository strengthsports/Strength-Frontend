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
  selectedMembers: string[];
  toggleMemberSelection: (memberId: string) => void;
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
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const openModal = (member: Member) => {
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

  const setSelectMode = (state: boolean) => {
    console.log("Called");
    setSelectModeEnabled(state);
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
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
