import React from "react";
import { Modalize } from "react-native-modalize";
import { TouchableOpacity, StyleSheet } from "react-native";
import TextScallingFalse from "~/components/CentralText";

interface InviteModalProps {
  modalRef: React.RefObject<Modalize>;
  roles: string[];
  isAdmin: boolean;
  onInvitePress: (role: string) => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  modalRef,
  roles,
  isAdmin,
  onInvitePress,
}) => {
  if (!isAdmin) return null;

  return (
    <Modalize
    key={Math.random()}
      ref={modalRef}
      adjustToContentHeight
      modalStyle={styles.modal}
      handleStyle={{ backgroundColor: "#888" }}
    >
      <TextScallingFalse style={styles.title}>Invite</TextScallingFalse>
      {roles.map((role) => (
        <TouchableOpacity
          key={role}
          style={styles.roleButton}
          onPress={() => onInvitePress(role)}
        >
          <TextScallingFalse style={styles.roleText}>{role}</TextScallingFalse>
        </TouchableOpacity>
      ))}
    </Modalize>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#1C1D23",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom:10
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "white",
  },
  roleButton: {
    // paddingVertical: 18,
    // paddingBottom:20,
    backgroundColor: "black",
    marginBottom:20,
    // marginVertical: 10,
    padding: 20,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 17,
    color: "#CFCFCF",
  },
});

export default InviteModal;