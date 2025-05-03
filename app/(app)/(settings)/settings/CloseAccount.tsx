// CloseAccount.tsx
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";

const CloseAccount = () => {
  const navigation = useNavigation();

  return (
    <PageThemeView>
      <View style={styles.TopBarView}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <TextScallingFalse
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "300",
            borderBottomWidth: 0.3,
            borderBottomColor: "#707070",
            height: 37,
          }}
        >
          Close account
        </TextScallingFalse>
        <View style={{ width: 29, height: 8 }} />
      </View>

      <View style={{ paddingVertical: 30, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Image
            style={{
              backgroundColor: "orange",
              borderRadius: 100,
              width: 40,
              height: 40,
            }}
          />
          <View>
            <TextScallingFalse style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
              First Last Name
            </TextScallingFalse>
            <TextScallingFalse style={{ color: "white", fontSize: 9, fontWeight: "300" }}>
              User Headline
            </TextScallingFalse>
          </View>
        </View>

        <View style={{ paddingVertical: 40, gap: 5 }}>
          <TextScallingFalse style={styles.CloseAccountHeadersText}>
            We’re sad to see you go
          </TextScallingFalse>
          <TextScallingFalse style={styles.CloseAccountDesText}>
            You're about to close your Strength account. Once closed, your public profile will no
            longer be visible on the Strength app.
          </TextScallingFalse>
        </View>

        <View style={{ gap: 5 }}>
          <TextScallingFalse style={styles.CloseAccountHeadersText}>
            What you Should Know
          </TextScallingFalse>

          <View style={{ flexDirection: "row", gap: 10, paddingTop: 10 }}>
            <Octicons name="dot-fill" size={12} color="grey" />
            <TextScallingFalse style={styles.CloseAccountDesText}>
              Some of your account information may still be visible to users you've interacted with,
              such as in their follower or following lists.
            </TextScallingFalse>
          </View>

          <View style={{ flexDirection: "row", gap: 10, paddingTop: 5 }}>
            <Octicons name="dot-fill" size={12} color="grey" />
            <TextScallingFalse style={styles.CloseAccountDesText}>
              If you only want to change your @username or date of birth, there's no need to close
              your account—you can update those details in your settings.
            </TextScallingFalse>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: 75,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.AccountCloseButtons}
            onPress={() => {
              // replace this with whatever navigation or logic your openModal4 handled
              navigation.navigate("FinalCloseAccount");
            }}
          >
            <TextScallingFalse style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
              Next
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>
    </PageThemeView>
  );
};

export default CloseAccount;

const styles = StyleSheet.create({
    TopBarView: {
      paddingTop: 40,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    CloseAccountHeadersText: {
      fontSize: 18,
      fontWeight: "500",
      color: "white",
    },
    CloseAccountDesText: {
      fontSize: 13,
      fontWeight: "300",
      color: "#ccc",
      lineHeight: 18,
    },
    AccountCloseButtons: {
      backgroundColor: "red",
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 25,
    },
  });
