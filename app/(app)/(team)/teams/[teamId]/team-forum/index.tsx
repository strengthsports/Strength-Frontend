import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TextInput, ActivityIndicator, RefreshControl, StyleSheet } from "react-native";
import { Avatar, Divider, IconButton } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";
import { AppDispatch, RootState } from "@/reduxStore";
import { fetchTeamDetails } from "~/reduxStore/slices/team/teamSlice";
import { fetchTeamMessages, sendMessage } from "~/reduxStore/slices/team/teamForumSlice";

const TeamForum: React.FC = () => {
  const [newMessage, setNewMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { teamId } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state selectorsx
  const { team, loading: teamLoading } = useSelector((state: RootState) => state.team);
  const { messages, loading: forumLoading, error: forumError } = useSelector(
    (state: RootState) => state.teamForum
  );
  const { user } = useSelector((state: RootState) => state.profile);

  // Sort messages by timestamp (newest at bottom)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Fetch data on initial load
  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamDetails(teamId as string));
      loadMessages();
    }
  }, [teamId]);

  const loadMessages = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchTeamMessages(teamId as string)).unwrap();
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && teamId && team && user) {
      try {
        await dispatch(
          sendMessage({
            text: newMessage.trim(),
            teamId: teamId as string,
            teamName: team.name,
          })
        ).unwrap();
        setNewMessage("");
        // Refresh messages after sending
        loadMessages();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderMessageItem = ({ item }: { item: any }) => {
    const isCurrentUser = item.userId === user?._id;
    const role = item.userId === "67ae358857b3ad8c0a943102" ? "[C]" : "[VC]"; 

    return (
      <View style={styles.messageContainer}>
        {/* Avatar on left side */}
        <View style={styles.avatarContainer}>
          {item.userProfilePic ? (
            <Image source={{ uri: item.userProfilePic }} style={styles.avatar} />
          ) : (
            <Avatar.Text 
              size={36} 
              label={item.userName.split(' ').map(n => n[0]).join('')} 
              style={styles.avatar} 
            />
          )}
        </View>

        {/* Message bubble on right side */}
        <View style={styles.messageBubble}>
          {/* Name and time in same row */}
          <View style={styles.messageHeader}>
            <Text style={styles.senderName}>{item.userName} {role}</Text>
            <Text style={styles.messageTime}>
              {formatDate(item.timestamp)}, {formatTime(item.timestamp)}
            </Text>
          </View>
          
          {/* Message text */}
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  if (teamLoading) {
    return (
      <PageThemeView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </PageThemeView>
    );
  }

  return (
    <PageThemeView style={styles.container}>
    {/* Header Section */}
    <View style={styles.header}>
      <IconButton 
        icon="arrow-left" 
        color="white" 
        size={24} 
        onPress={() => router.back()} 
      />
      <View style={styles.headerContent}>
        {team?.logo ? (
          <Image source={{ uri: team.logo.url }} style={styles.teamLogo} />
        ) : (
          <Avatar.Text 
            size={40} 
            label={team?.name?.[0] || "T"} 
            style={styles.teamLogoPlaceholder} 
          />
        )}
        <TextScallingFalse style={styles.teamName}>
          {team?.name || "Team Chat"}
        </TextScallingFalse>
      </View>
      <IconButton icon="dots-vertical" color="white" size={24} />
    </View>
    <Divider style={styles.divider} />

    {/* Chat Messages */}
    {forumLoading && !refreshing ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    ) : forumError ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {forumError}</Text>
      </View>
    ) : (
      <FlatList
        data={sortedMessages}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadMessages}
            colors={["#ffffff"]}
            tintColor="#ffffff"
          />
        }
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>Welcome To Forum</Text>
            <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
          </View>
        }
        inverted={false}
        showsVerticalScrollIndicator={false}
      />
    )}

    {/* Message Input Box */}
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Type a message..."
        placeholderTextColor="#999"
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        onSubmitEditing={handleSendMessage}
        editable={!forumLoading}
        multiline
      />
      <IconButton 
        icon="send" 
        color={newMessage.trim() ? "#0084ff" : "#666"} 
        size={24} 
        onPress={handleSendMessage} 
        disabled={!newMessage.trim() || forumLoading}
        style={styles.sendButton}
      />
    </View>
  </PageThemeView>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    // backgroundColor: '#1e2d3b',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 60,
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  teamLogoPlaceholder: {
    backgroundColor: '#3a4a5a',
    marginRight: 10,
  },
  teamName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  divider: {
    backgroundColor: '#2a3a4a',
    height: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3a4a5a',
  },
  messageBubble: {
    flex: 1,
    backgroundColor: '#272727',
    borderRadius: 12,
    padding: 12,
    maxWidth: '70%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  senderName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageTime: {
    color: '#aaa',
    fontSize: 12,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  userName: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
    marginHorizontal: 4,
  },
  currentUserTime: {
    color: '#aaa',
  },
  otherUserTime: {
    color: '#999',
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    color: '#aaa',
    fontSize: 12,
    backgroundColor: '#2a3a4a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 50,
    margin: 8,
    paddingHorizontal: 12,
    paddingVertical: 1,
  },
  input: {
    flex: 1,
    color: 'white',
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 4,
  },
});

export default TeamForum;