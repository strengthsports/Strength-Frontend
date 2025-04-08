import { View, Text, TouchableOpacity, Image, TextInput, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import PageThemeView from "~/components/PageThemeView";
import Icon from "react-native-vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { Divider, ActivityIndicator, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { fetchTeamDetails } from "~/reduxStore/slices/team/teamSlice";
import TextScallingFalse from "~/components/CentralText";

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { team, loading } = useSelector((state: RootState) => state.team);

  const [teamLogo, setTeamLogo] = useState("");
  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [established, setEstablished] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    dispatch(fetchTeamDetails("your-team-id"));
  }, [dispatch]);

  useEffect(() => {
    if (team) {
      setTeamName(team.name || "");
      setSport(team.sport?.name || "");
      setLocation(
        team.address ? `${team.address.city}, ${team.address.state}, ${team.address.country}` : ""
      );
      setEstablished(team.establishedOn ? new Date(team.establishedOn).toLocaleDateString() : "");
      setTeamDescription(team.description || "");
      setTeamLogo(team.logo?.url || "");
      setMembers(team.members || []);
    }
  }, [team]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setTeamLogo(result.assets[0].uri);
      setIsEdited(true);
    }
  };

  const renderMember = ({ item }) => (
    <View className="flex-row items-center p-4">
      <Avatar.Image size={50} source={{ uri: item.user.profilePic || "https://via.placeholder.com/50" }} />
      <View className="ml-4">
        <Text className="text-white text-lg font-medium">
          {item.user.firstName} {item.user.lastName}
        </Text>
        <Text className="text-gray-400 text-sm">{item.role}</Text>
      </View>
    </View>
  );

  return (
    <PageThemeView>
      {loading ? (
        <ActivityIndicator animating={true} color="white" size="large" />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.user._id}
          renderItem={renderMember}
          ListHeaderComponent={
            <>
              {/* Header */}
              <View className="flex-row items-center px-4 bg-black h-[60px]">
                <TouchableOpacity onPress={() => router.back()}>
                  <Icon name="arrowleft" size={30} color="white" />
                </TouchableOpacity>
                <TextScallingFalse className="text-white text-5xl font-bold flex-1 text-center">Team Settings</TextScallingFalse>
              </View>

              {/* Logo Section */}
              <View className="items-center mt-6">
                <Image
                  source={{ uri: teamLogo || "https://via.placeholder.com/100" }}
                  className="w-28 h-28 rounded-lg"
                />
                <TouchableOpacity
                  onPress={pickImage}
                  className="flex-row items-center mt-3 py-2 px-4 bg-gray-700 rounded-lg"
                >
                  <Icon name="edit" size={20} color="white" />
                  <Text className="text-white ml-2 text-lg">Edit Picture</Text>
                </TouchableOpacity>
              </View>

              {/* Input Fields */}
              <View className="px-6 mt-6">
                {["Team Name", "Sport", "Location", "Established On"].map((label, index) => (
                  <View key={index}>
                    <View className="flex-row items-center justify-between py-3">
                      <Text className="text-white text-xl font-semibold w-1/3">{label}</Text>
                      <TextInput
                        className="text-gray-300 text-xl px-4 py-2 w-2/3"
                        value={
                          label === "Team Name"
                            ? teamName
                            : label === "Sport"
                            ? sport
                            : label === "Location"
                            ? location
                            : established
                        }
                        onChangeText={(text) => {
                          if (label === "Team Name") setTeamName(text);
                          if (label === "Sport") setSport(text);
                          if (label === "Location") setLocation(text);
                          if (label === "Established On") setEstablished(text);
                          setIsEdited(true);
                        }}
                      />
                    </View>
                    <Divider className="bg-gray-600 my-2" />
                  </View>
                ))}

                {/* Description */}
                <View className="flex-row items-center justify-between py-3">
                  <Text className="text-white text-xl font-semibold w-1/3">Team Description</Text>
                  <TouchableOpacity
                    className="flex-row items-center px-4 py-2 rounded-lg"
                    onPress={() =>
                      router.push({
                        pathname: "/teams/[teamId]/settings/EditDescription",
                        params: { description: teamDescription },
                      })
                    }
                  >
                    <Icon name="right" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <Divider className="bg-gray-600 my-2" />
              </View>

              {/* Members Title */}
              <Text className="text-white text-lg font-bold ml-6 mt-6">Members [{members.length}]</Text>
            </>
          }
          ItemSeparatorComponent={() => <Divider className="bg-gray-600" />}
        />
      )}
    </PageThemeView>
  );
};

export default Settings;
