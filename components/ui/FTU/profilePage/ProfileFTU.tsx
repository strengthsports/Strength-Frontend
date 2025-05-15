import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootState } from "~/reduxStore";
import ProfilePhotoFTU from "~/components/SvgIcons/profilePage/ProfilePhotoFTU";
import HeadlineFTU from "~/components/SvgIcons/profilePage/HeadlineFTU";
import AboutFTU from "~/components/SvgIcons/profilePage/AboutFTU";
import { router } from "expo-router";
import TextScallingFalse from "~/components/CentralText";
import { Feather } from "@expo/vector-icons";

const ProfileFTU = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.profile.user);
  const loading = useSelector((state: RootState) => state.profile.loading);

  if (loading || !user) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const showProfileFTU = !user?.profilePic;
  const showHeadlineFTU = !user?.headline;
  const showAboutFTU = !user?.about;

  if (!showProfileFTU && !showHeadlineFTU && !showAboutFTU) {
    return null;
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TextScallingFalse style={styles.headerText}>
          SUGGESTED
        </TextScallingFalse>
      </View>

      <View style={styles.privateRow}>
        <Feather name="eye" size={12} color="#888" />
        <TextScallingFalse style={styles.privateText}>
          Private to you
        </TextScallingFalse>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {showProfileFTU && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(app)/(profile)/edit-profile")}
            style={styles.section}
          >
            <ProfilePhotoFTU />
            <View style={styles.textContainer}>
              <TextScallingFalse style={styles.title}>
                Add a profile photo to help others recognize you!
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
        )}

        {showHeadlineFTU && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(app)/(profile)/edit-profile")}
            style={styles.section}
          >
            <HeadlineFTU />
            <View style={styles.textContainer}>
              <TextScallingFalse style={styles.title}>
                Add a headline to let others know what drives you!
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
        )}

        {showAboutFTU && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push("/(app)/(profile)/edit-overview?about=true")
            }
            style={styles.section}
          >
            <AboutFTU />
            <View style={styles.textContainer}>
              <TextScallingFalse style={styles.title}>
                Add about to let the sports world know who you are.
              </TextScallingFalse>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#121212",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 5,
    width: "auto",
    borderColor: "#333",
    borderStyle: "dashed",
    borderWidth: 0.5,
  },
  container: {
    paddingHorizontal: 8,
  },
  loader: {
    marginTop: 20,
  },
  header: {
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  headerText: {
    color: "#8A8A8A",
    fontSize: 14,
    fontWeight: "bold",
  },
  privateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 10,
    gap: 5,
  },
  privateText: {
    color: "#cacaca",
    fontSize: 11,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#313131",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 15,
    // marginLeft: 15,
    width: 260,
    elevation: 2,
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: "300",
    color: "#c0c0c0",
    // lineHeight: ,
  },
});

export default ProfileFTU;
