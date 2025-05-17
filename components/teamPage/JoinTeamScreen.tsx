import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";

const JoinTeamScreen = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState([
    { id: 1, name: "Team Alpha", members: 12, logo: "https://via.placeholder.com/50" },
    { id: 2, name: "Team Beta", members: 8, logo: "https://via.placeholder.com/50" },
    { id: 3, name: "Team Gamma", members: 15, logo: "https://via.placeholder.com/50" },
    { id: 4, name: "Team Delta", members: 20, logo: "https://via.placeholder.com/50" },
    { id: 5, name: "Team Epsilon", members: 5, logo: "https://via.placeholder.com/50" },
  ]);
  const [filteredTeams, setFilteredTeams] = useState(teams);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter(team =>
        team.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTeams(filtered);
    }
  };

  const handleJoinTeam = (teamId) => {
    // Handle join team logic here
    console.log("Joining team:", teamId);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={10} style={styles.blurBackground}>
          <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
        </BlurView>

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Join a Team</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search teams..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          <FlatList
            data={filteredTeams}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.teamCard}>
                <Image source={{ uri: item.logo }} style={styles.teamLogo} />
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{item.name}</Text>
                  <Text style={styles.teamMembers}>{item.members} members</Text>
                </View>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => handleJoinTeam(item.id)}
                >
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>No teams found</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayTouchable: {
    flex: 1,
  },
  container: {
    backgroundColor: "#1C1D23",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: Dimensions.get("window").height * 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    fontSize: 24,
    color: "white",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#141414",
    borderRadius: 10,
    padding: 15,
    color: "white",
    fontSize: 16,
  },
  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  teamMembers: {
    fontSize: 14,
    color: "gray",
  },
  joinButton: {
    backgroundColor: "#12956B",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noResultsText: {
    color: "gray",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default JoinTeamScreen;