import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import AlertModal from "~/components/modals/AlertModal";
import { useRouter } from "expo-router";
const RequestSport: React.FC = () => {
  const [sportInput, setSportInput] = useState<string>("");
  const [sportsList, setSportsList] = useState<string[]>([]);
  const [prevInput, setPrevInput] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal state
  const router = useRouter();

  const handleSportInput = (text: string) => {
    if (prevInput.length > text.length && prevInput === "") {
      console.log("Backspace detected! Removing last sport...");
      setSportsList((prev) => prev.slice(0, -1));
    }

    if (text.endsWith(",")) {
      const newSport = text.slice(0, -1).trim();
      if (newSport && !sportsList.includes(newSport)) {
        setSportsList([...sportsList, newSport]);
      }
      setSportInput("");
    } else {
      setSportInput(text);
    }

    setPrevInput(text);
  };

  const handleGoBack = () => {
    router.push("../onboarding/sportsChoice1");
  };

  const removeSport = (sportToRemove: string) => {
    setSportsList(sportsList.filter((sport) => sport !== sportToRemove));
  };

  const handleSendRequest = () => {
    console.log("Sending request for sports:", sportsList);
    router.push("../onboarding/requestSuccessfull");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Back Button */}
      <View style={{ paddingLeft: 16, marginTop: 8 }}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Icon name="arrowleft" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, padding: 16, marginTop: 30 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
          Request a Sport
        </Text>
        <Text style={{ color: "#A5A5A5", fontSize: 12, marginTop: 8 }}>
          We'd love to support more sports. Help us out by letting us know which
          sport we should focus on rolling out.
        </Text>

        <View
          style={{
            marginTop: 40,
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 8,
            minHeight: 150,
            padding: 16,
            flexWrap: "wrap",
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {sportsList.map((sport, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: "#424242",
                  backgroundColor: "transparent",
                }}
              >
                <Text style={{ color: "white", fontSize: 14 }}>{sport}</Text>
                <TouchableOpacity onPress={() => removeSport(sport)}>
                  <Icon
                    name="close"
                    size={16}
                    color="#fff"
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TextInput
            style={{
              color: "white",
              width: "100%",
              marginTop: 8,
              minHeight: 50,
            }}
            placeholder=""
            placeholderTextColor="#888"
            multiline
            value={sportInput}
            onChangeText={handleSportInput}
          />
        </View>

        <Text style={{ color: "#A2A2A2", fontSize: 14, opacity: 0.6 }}>
          Enter a comma after each sport.
        </Text>

        <TouchableOpacity
          style={{
            marginTop: 24,
            backgroundColor: "#12956B",
            borderRadius: 24,
            paddingVertical: 16,
            alignItems: "center",
          }}
          onPress={handleSendRequest}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Send request
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alert Modal for Back Button Confirmation */}
      {
        isModalVisible && (
          <AlertModal
        alertConfig={{
          title: "Discard Request?",
          message:
            "Are you sure you want to go back? Your request data will be lost.",
          discardAction: () => setIsModalVisible(false), // Close modal
          confirmAction: () => handleGoBack(), // Replace with navigation function
          confirmMessage: "Yes, Exit",
          cancelMessage: "Cancel",
        }}
        isVisible={isModalVisible}
      />
        )
      }
    </SafeAreaView>
  );
};

export default RequestSport;
