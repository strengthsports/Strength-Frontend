import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "~/components/ThemedText";
import AddMembersModal from "../../addMembersModal";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import EditDescription from "./editDescription";
import LocationModal from "../../components/locationModal";

interface PotentialMember {
  id: string;
  name: string;
  role: string;
  image: string;
  selected?: boolean;
}
const EditTeam = () => {
  const [imageUri, setImageUri] = useState("https://picsum.photos/200/200");
  const [teamName, setTeamName] = useState("Team Name");
  const [sport, setSport] = useState("Cricket");
  const [location, setLocation] = useState("India");
  const [description, setDescription] = useState("Description");
  const [established, setEstablished] = useState("Established Date");
  const router = useRouter();

  const [captain, setCaptain] = useState("Captain Name");
  const [captainDescription, setCaptainDescription] = useState(
    "Captain Description",
  );
  const [captainImage, setCaptainImage] = useState(
    "https://picsum.photos/200/200",
  );
  const [viceCaptain, setViceCaptain] = useState("Vice Captain Name");
  const [viceCaptainDescription, setViceCaptainDescription] = useState(
    "Vice Captain Description",
  );
  const [viceCaptainImage, setViceCaptainImage] = useState(
    "https://picsum.photos/200/200",
  );
  const [admin, setAdmin] = useState("Admin Name");
  const [adminDescription, setAdminDescription] = useState("Admin Description");
  const [adminImage, setAdminImage] = useState("https://picsum.photos/200/200");

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCaptainModal, setShowCaptainModal] = useState(false);
  const [showViceCaptainModal, setShowViceCaptainModal] = useState(false);
  const [isTeamNameEditing, setTeamNameEditing] = useState(false); // state for editing mode
  const [isDescriptionEditing, setDescriptionEditing] = useState(false); // state for editing mode
  const [establishedDate, setEstablishedDate] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showEditDescription, setShowEditDescription] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || establishedDate;
    setEstablishedDate(currentDate);
  };

  <DateTimePicker
    value={establishedDate}
    mode="date"
    display="default"
    onChange={onDateChange}
  />;

  const handleTeamNameEditClick = () => {
    setTeamNameEditing(!isTeamNameEditing); // Toggle between edit and display mode
  };

  // const handleDescriptionEditClick = () => {
  //   setDescriptionEditing(!isDescriptionEditing); // Toggle between edit and display mode
  // };
  const handleTeamNameChange = (text: string) => {
    setTeamName(text); // Update state with the new team name
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(description); // Update description as the user types
  };

  const removeImage = () => {
    setImageUri(""); // Remove the current image
  };

  const uploadImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Set the selected image URI
    }
  };

  const handleSave = () => {
    // Save the changes to the database
    console.log("Team Name:", teamName);
    console.log("Sport:", sport);
    console.log("Location:", location);
    console.log("Description:", description);
    console.log("Captain:", captain);
    console.log("Vice Captain:", viceCaptain);
    console.log("Admin:", admin);
    console.log("Captain Description:", captainDescription);
    console.log("Vice Captain Description:", viceCaptainDescription);
    console.log("Admin Description:", adminDescription);
  };

  const dummyMembers: PotentialMember[] = [
    {
      id: "1",
      name: "Prathik Jha",
      role: "Cricketer | Ranji Trophy Player",
      image: "https://picsum.photos/id/1/100/100",
      selected: false,
    },
    {
      id: "2",
      name: "Rohan Deb Nath",
      role: "Cricketer | Right-Hand Batsman",
      image: "https://picsum.photos/id/2/100/100",
      selected: false,
    },
    {
      id: "3",
      name: "Aditi Mehra",
      role: "Cricketer | Left-Hand Batsman",
      image: "https://picsum.photos/id/3/100/100",
      selected: false,
    },
    {
      id: "4",
      name: "Arjun Kapoor",
      role: "All-Rounder | State Team Player",
      image: "https://picsum.photos/id/4/100/100",
      selected: false,
    },
    {
      id: "5",
      name: "Sneha Roy",
      role: "Cricketer | Wicket-Keeper",
      image: "https://picsum.photos/id/5/100/100",
      selected: false,
    },
    {
      id: "6",
      name: "Rajesh Kumar",
      role: "Bowler | Swing Specialist",
      image: "https://picsum.photos/id/6/100/100",
      selected: false,
    },
    {
      id: "7",
      name: "Priya Singh",
      role: "All-Rounder | District Team Player",
      image: "https://picsum.photos/id/7/100/100",
      selected: false,
    },
    {
      id: "8",
      name: "Vikram Joshi",
      role: "Cricketer | Opening Batsman",
      image: "https://picsum.photos/id/8/100/100",
      selected: false,
    },
    {
      id: "9",
      name: "Tanya Sharma",
      role: "Cricketer | Spin Bowler",
      image: "https://picsum.photos/id/9/100/100",
      selected: false,
    },
    {
      id: "10",
      name: "Karan Patel",
      role: "Bowler | Fast Bowling Specialist",
      image: "https://picsum.photos/id/10/100/100",
      selected: false,
    },
  ];
  useEffect(() => {
    console.log("showEditDescription changed:", showEditDescription);
  }, [showEditDescription]);

  const handleSetAdmin = (selectedMembers: any) => {
    console.log("Admin selected: ", selectedMembers);
    setAdmin(selectedMembers[0].name);
    setAdminImage(selectedMembers[0].image);
    setAdminDescription(selectedMembers[0].role);
    setShowAdminModal(false);
  };
  const handleSaveLocation = (data: any) => {
    const country = data.country;
    if (country) {
      console.log("Country:", country);
      setLocation(country);
    }
  };
  const handleSetCaptain = (selectedMembers: any) => {
    console.log("Captain selected: ", selectedMembers);
    setCaptain(selectedMembers[0].name);
    setCaptainImage(selectedMembers[0].image);
    setCaptainDescription(selectedMembers[0].role);
    setShowCaptainModal(false);
  };

  const handleSetViceCaptain = (selectedMembers: any) => {
    console.log("Vice Captain selected: ", selectedMembers);
    setViceCaptain(selectedMembers[0].name);
    setViceCaptainImage(selectedMembers[0].image);
    setViceCaptainDescription(selectedMembers[0].role);
    setShowViceCaptainModal(false);
  };
  const handleInvite = (selectedMembers: any) => {
    console.log("Selected members: ", selectedMembers);
  };

  return (
    <View className="flex-1 p-4 bg-black">
      {/* Header */}
      <View className="flex flex-row h-10 px-2 justify-between w-full">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-4xl">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold text-4xl">Edit Team</Text>
        <TouchableOpacity onPress={() => handleSave()}>
          <Text className="text-white  text-4xl">Save</Text>
        </TouchableOpacity>
      </View>

      {/* Editable Image Box */}
      <View className="flex flex-col items-center">
        <View className="h-56 w-56 border border-[#303030] rounded-lg mt-8 items-center justify-center relative">
          {imageUri ? (
            <>
              {/* Remove Icon */}
              <TouchableOpacity
                onPress={removeImage}
                style={{ position: "absolute", top: 8, right: 8 }}
              >
                <Icon name="cross" size={24} color="white" />
              </TouchableOpacity>

              {/* Image */}
              <Image
                source={{ uri: imageUri }}
                className="w-40 h-40 rounded-lg"
              />
            </>
          ) : (
            <TouchableOpacity
              onPress={uploadImage}
              className="items-center justify-center"
            >
              {/* Upload Icon */}
              <Icon name="upload" size={48} color="#303030" />
              <ThemedText>Upload Image</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView>
        {/* Team Name Change Input */}
        <View className="border-b border-t border-[#202020] mt-8">
          <View className="flex flex-row items-center justify-between p-4">
            <Text className="text-white font-bold w-1/3">Team Name*</Text>

            {/* Conditionally render TextInput if editing, else display teamName */}
            {isTeamNameEditing ? (
              <TextInput
                value={teamName}
                onChangeText={(text) => handleTeamNameChange(text)}
                className="text-white w-2/3 border border-[#303030] p-4 rounded-lg"
                autoFocus
              />
            ) : (
              <Text className="text-white w-2/3">{teamName}</Text>
            )}

            {/* Change icon based on editing state */}
            <Icon
              name={isTeamNameEditing ? "check" : "edit"} // "check" when editing, "edit" when not
              size={20}
              color="white"
              style={
                isTeamNameEditing
                  ? { position: "absolute", right: 16, paddingHorizontal: 12 }
                  : { position: "absolute", right: 8 }
              }
              onPress={handleTeamNameEditClick}
            />
          </View>
          <View className="flex flex-row items-center justify-between p-4 border-t border-[#202020]">
            <Text className="text-white font-bold w-1/3">Sport*</Text>
            <Text className="text-white w-2/3">{sport}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowLocationModal(true)}>
            <View className="flex flex-row items-center justify-between p-4 border-t border-[#202020]">
              <Text className="text-white font-bold w-1/3">Location*</Text>
              <Text className="text-white w-2/3">{location}</Text>
              <Icon
                name="location"
                size={20}
                color="white"
                style={{ position: "absolute", right: 8 }}
              />
            </View>
          </TouchableOpacity>
          {/*Established On*/}
          {/* Established On */}
          <View className="flex flex-row items-center justify-between p-4 border-t border-[#202020]">
            <Text className="text-white font-bold w-1/3">Established On*</Text>
            <View className="w-2/3">
              <Text className="text-white ml-4">{established}</Text>
              <TouchableOpacity
                onPress={() => setShowDateTimePicker(true)}
                style={{ position: "absolute", right: 8 }}
              >
                <Icon name="calendar" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* DateTimePicker Modal */}
          {showDateTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="spinner"
              themeVariant="dark"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                const currentDate = selectedDate || new Date();

                // Format the selected date
                let formattedDate = `${
                  currentDate.getMonth() + 1
                }/${currentDate.getFullYear()}`;

                // Set the formatted date and close the picker
                setEstablished(formattedDate); // Update established with formatted date
                setShowDateTimePicker(false); // Close the picker
              }}
            />
          )}

          {/*Admin, Captain, Vice Captain, Description*/}
          <View className="flex flex-row items-center p-4 border-t border-[#202020]">
            <Text className="text-white font-bold w-1/3 flex items-center">
              {/* Left-aligned, vertically centered */}
              Admin
            </Text>
            <View className="flex flex-row items-center w-2/3">
              <Image
                source={{ uri: adminImage }}
                className="w-14 h-14 rounded-full"
              />
              <View className="flex flex-col ml-4 flex-1">
                <Text className="text-white font-bold">{admin}</Text>
                <Text className="text-gray-400">{adminDescription}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAdminModal(true)}
                className="ml-4"
              >
                <Icon name="chevron-thin-down" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-row items-center p-4 border-t border-[#202020]">
            <Text className="text-white font-bold w-1/3 flex items-center">
              {/* Left-aligned and vertically centered */}
              Captain
            </Text>
            <View className="flex flex-row items-center w-2/3">
              <Image
                source={{ uri: captainImage }}
                className="w-14 h-14 rounded-full"
              />
              <View className="flex flex-col ml-4 flex-1">
                <Text className="text-white font-bold">{captain}</Text>
                <Text className="text-gray-400">{captainDescription}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCaptainModal(true)}
                className="ml-4"
              >
                <Icon name="chevron-thin-down" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-row items-center p-4 border-t border-[#202020]">
            <Text className="text-white font-bold w-1/3 flex items-center justify-center">
              {/* Left-aligned, vertically centered */}
              Vice Captain
            </Text>
            <View className="flex flex-row items-center w-2/3">
              <Image
                source={{ uri: viceCaptainImage }}
                className="w-14 h-14 rounded-full"
              />
              <View className="flex flex-col ml-4 flex-1">
                <Text className="text-white font-bold">{viceCaptain}</Text>
                <Text className="text-gray-400">{viceCaptainDescription}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowViceCaptainModal(true)}
                className="ml-4"
              >
                <Icon name="chevron-thin-down" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-row items-center p-4 border-t border-[#202020]">
            <Text className="text-white font-bold w-1/3 flex items-center">
              Description
            </Text>

            {/* Conditionally render TextInput if editing, else display description */}
            <View className="relative w-2/3 flex">
              {isDescriptionEditing ? (
                <TextInput
                  value={description}
                  onChangeText={handleDescriptionChange}
                  className="text-white w-full border border-[#303030] px-8 rounded-lg"
                  autoFocus
                />
              ) : (
                <Text className="text-white w-full">{description}</Text>
              )}

              {/* Change icon based on editing state */}
              <TouchableOpacity
                onPress={() => setShowEditDescription(true)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 px-2"
              >
                <Icon name="chevron-thin-right" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Modals */}
        <AddMembersModal
          onInvite={handleSetAdmin}
          visible={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          buttonName="Set Admin"
          multiselect={false}
          player={dummyMembers}
        />
        <AddMembersModal
          onInvite={handleSetCaptain}
          visible={showCaptainModal}
          onClose={() => setShowCaptainModal(false)}
          buttonName="Set Captain"
          multiselect={false}
          player={dummyMembers}
        />
        <AddMembersModal
          onInvite={handleSetViceCaptain}
          visible={showViceCaptainModal}
          onClose={() => setShowViceCaptainModal(false)}
          buttonName="Set Vice Captain"
          multiselect={false}
          player={dummyMembers}
        />
        <EditDescription
          isVisible={showEditDescription}
          onClose={() => setShowEditDescription(false)}
          onSave={(newDesc: any) => {
            setDescription(newDesc);
            setShowEditDescription(false);
          }}
          initialDescription={description}
        />
        <LocationModal
          visible={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onSave={handleSaveLocation}
        />
      </ScrollView>
    </View>
  );
};

export default EditTeam;
