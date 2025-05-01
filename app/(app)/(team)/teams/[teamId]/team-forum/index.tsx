import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, FlatList, Image, TextInput, ActivityIndicator, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Divider, IconButton } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import PageThemeView from "~/components/PageThemeView";
import TextScallingFalse from "~/components/CentralText";
import { AppDispatch, RootState } from "@/reduxStore";
import { fetchTeamDetails } from "~/reduxStore/slices/team/teamSlice";
import { fetchTeamMessages, sendMessage } from "~/reduxStore/slices/team/teamForumSlice";
import { LinearGradient } from "expo-linear-gradient";
import BackIcon from "~/components/SvgIcons/Common_Icons/BackIcon";

// Type definitions
type TeamRole = 'Admin' | 'Captain' | 'ViceCaptain' | 'member';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string | { url: string };
}

interface TeamMember {
  user: User;
  role: string;
  position?: string;
}

interface TeamAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: { url: string };
}

interface Team {
  _id: string;
  name: string;
  logo?: { url: string };
  admin: TeamAdmin[];
  members: TeamMember[];
}

interface Message {
  _id: string;
  userId: string;
  userName: string;
  userProfilePic?: string;
  text: string;
  timestamp: string;
  isSystemMessage?: boolean;
}

const ROLES_HIERARCHY = {
  'Admin': 3,
  'Captain': 2,
  'ViceCaptain': 1,
  'member': 0
};

const TeamForum: React.FC = () => {
  // State
  const [newMessage, setNewMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  // Hooks
  const router = useRouter();
  const { teamId } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux selectors
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const { team, loading: teamLoading } = useSelector((state: RootState) => state.team);
  const { messages, loading: forumLoading, error: forumError } = useSelector(
    (state: RootState) => state.teamForum
  );
  const { user } = useSelector((state: RootState) => state.profile);

  // Fetch data on initial load
  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamDetails(teamId as string));
      loadMessages();
    }
  }, [teamId, dispatch]);

  const userRole = useMemo<TeamRole | null>(() => {
    if (!team || !user) return null;
    
    const isAdmin = team.admin?.some(admin => admin._id === user._id);
    if (isAdmin) return 'Admin';
    
    const member = team.members?.find(m => m.user?._id === user._id);
    if (!member) return null;
  
    // Return the position if it's one of our defined roles
    if (['Captain', 'ViceCaptain'].includes(member.position || '')) {
      return member.position as TeamRole;
    }
    
    return 'member'; 
  }, [team, user]);

  const canSendMessages = useMemo(() => {
    if (!userRole) return false;
    return ['Admin', 'Captain', 'ViceCaptain'].includes(userRole);
  }, [userRole]);

  // Create welcome message
  const welcomeMessage = useMemo<Message | null>(() => {
    if (!team) return null;
    
    return {
      _id: 'welcome-message',
      userId: 'system',
      userName: 'System',
      text: `👋  Welcome to the ${team.name} forum! This is a space for team communication and updates. ${canSendMessages ? 'As a team leader, you can post messages here.' : 'Only team leaders can post messages here.'}`,
      timestamp: team ? new Date(0).toISOString() : new Date().toISOString(),
      isSystemMessage: true
    };
  }, [team, canSendMessages]);

  // Combined messages with welcome message
  const combinedMessages = useMemo(() => {
    const allMessages = [...(messages || [])];
    if (welcomeMessage) {
      allMessages.unshift(welcomeMessage);
    }
    return allMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [messages, welcomeMessage]);

  // Load team messages
  const loadMessages = useCallback(async () => {
    if (!teamId) return;
    
    try {
      setRefreshing(true);
      await dispatch(fetchTeamMessages(teamId as string)).unwrap();
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setRefreshing(false);
    }
  }, [teamId, dispatch]);

  // Handle sending a new message
  const handleSendMessage = useCallback(async () => {
    if (!canSendMessages || !newMessage.trim() || !teamId || !team || !user) return;
    
    try {
      await dispatch(
        sendMessage({
          text: newMessage.trim(),
          teamId: teamId as string,
          teamName: team.name,
        })
      ).unwrap();
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [canSendMessages, newMessage, teamId, team, user, dispatch]);

  // Format timestamp to time string
  const formatTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Format timestamp to date string
  const formatDate = useCallback((timestamp: string) => {
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
  }, []);

  // Get role badge based on role
  const getRoleBadge = useCallback((role: TeamRole) => {
    switch (role) {
      case 'Admin': 
        return (
          <View style={[styles.badgeContainer, styles.adminBadge]}>
            <TextScallingFalse style={styles.badgeText}>Admin</TextScallingFalse>
          </View>
        );
      case 'Captain': 
        return (
          <View style={[styles.badgeContainer, styles.captainBadge]}>
            <TextScallingFalse style={styles.badgeText}>{"[C]"}</TextScallingFalse>
          </View>
        );
      case 'ViceCaptain': 
        return (
          <View style={[styles.badgeContainer, styles.viceCaptainBadge]}>
            <TextScallingFalse style={styles.badgeText}>{"[VC]"}</TextScallingFalse>
          </View>
        );
      default: 
        return null;
    }
  }, []);

  // Group messages by day
  const groupedMessages = useMemo(() => {
    const groups: {[key: string]: Message[]} = {};
    
    combinedMessages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    return Object.keys(groups).map(date => ({
      date,
      messages: groups[date]
    }));
  }, [combinedMessages]);

  // Render a message item in the list
  const renderMessageItem = useCallback(({ item }: { item: Message }) => {
    // For system messages
    if (item.isSystemMessage) {
      return (
        <View style={styles.systemMessageContainer}>
          <View style={styles.systemMessageWrapper}>
            <TextScallingFalse style={styles.systemMessageText}>{item.text}</TextScallingFalse>
          </View>
        </View>
      );
    }
    
    // Determine user role based on userId
    const getUserRole = (): TeamRole | null => {
      // Check if user is admin
      if (team?.admin?.some(admin => admin._id === item.userId)) {
        return 'Admin';
      }
      
      // Check in team members
      const member = team?.members?.find(m => m.user?._id === item.userId);
      if (!member) return null;
      
      // Return the position if it's one of our defined roles
      if (['Captain', 'ViceCaptain'].includes(member.position || '')) {
        return member.position as TeamRole;
      }
      
      return 'member';
    };
    
    const messageUserRole = getUserRole();
    const roleBadge = messageUserRole ? getRoleBadge(messageUserRole) : null;
    const isCurrentUser = item.userId === user?._id;
    
    return (
      <View style={styles.messageContainer}>
        <View style={styles.avatarContainer}>
          {item.userProfilePic ? (
            <Image 
              source={{ uri: item.userProfilePic }} 
              style={styles.avatar} 
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Avatar.Text 
              size={40} 
              label={item.userName.split(' ').map(n => n[0]).join('')} 
              style={[styles.avatar, isCurrentUser ? styles.currentUserAvatar : null]} 
            />
          )}
        </View>
    
        <View style={styles.messageContentContainer}>
          <View style={styles.messageHeader}>
            <TextScallingFalse style={[
              styles.senderName, 
              isCurrentUser ? styles.currentUserName : null
            ]}>
              {item.userName}
            </TextScallingFalse>
            {roleBadge}
            <TextScallingFalse style={styles.messageTime}>
              {formatTime(item.timestamp)}
            </TextScallingFalse>
          </View>
          
          <View style={[
            styles.messageBubble,
            isCurrentUser && styles.currentUserBubble
          ]}>
            <TextScallingFalse style={styles.messageText}>{item.text}</TextScallingFalse>
          </View>
        </View>
      </View>
    );
  }, [team, user, formatTime, getRoleBadge]);

  // Render day separators
  const renderDateHeader = useCallback(({ date }: { date: string }) => {
    const formattedDate = new Date(date).toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <View style={styles.dateHeaderContainer}>
        <View style={styles.dateHeaderLine} />
        <TextScallingFalse style={styles.dateHeaderText}>{formattedDate}</TextScallingFalse>
        <View style={styles.dateHeaderLine} />
      </View>
    );
  }, []);

  // Render the flat list with grouped messages
  const renderMessagesList = useCallback(() => {
    return (
       <FlatList
        data={groupedMessages}
        keyExtractor={(item) => item.date}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadMessages}
            colors={["#ffffff"]}
            tintColor="#ffffff"
          />
        }
        renderItem={({ item }) => (
          <View>
            {renderDateHeader({ date: item.date })}
            {item.messages.map(message => (
              <View key={message._id}>
                {renderMessageItem({ item: message })}
              </View>
            ))}
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <TextScallingFalse style={styles.emptyText}>
              No messages yet. {canSendMessages ? "Start the conversation!" : "Only team leaders can post messages."}
            </TextScallingFalse>
          </View>
        }
        inverted={false}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [groupedMessages, refreshing, loadMessages, renderDateHeader, renderMessageItem, canSendMessages]);

  // Show loading screen
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
    <PageThemeView>
      {/* Header Section */}
      <View
        
        style={styles.header}
      >
        <TouchableOpacity activeOpacity={0.7} 
        style={{ width: 30, height: 40, justifyContent:'center'}} onPress={() => router.back()}>
        <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          {team?.logo ? (
            <Image 
              source={{ uri: team.logo.url }} 
              style={styles.teamLogo} 
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Avatar.Text 
              size={40} 
              label={team?.name?.[0] || "T"} 
              style={styles.teamLogoPlaceholder} 
            />
          )}
          <View>
            <TextScallingFalse style={styles.teamName}>
              {team?.name || "Team Chat"}
            </TextScallingFalse>
            <TextScallingFalse style={styles.onlineStatus}>
              {team?.members?.length || 0} members • {canSendMessages ? "Team Leader" : "Member"}
            </TextScallingFalse>
          </View>
        </View>
        <IconButton 
          icon="dots-vertical" 
          color="white" 
          size={24} 
          accessibilityLabel="Team info"
        />
      </View>
      <Divider style={styles.divider} />

      {/* Chat Messages */}
      {forumLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <TextScallingFalse style={styles.loadingText}>Loading messages...</TextScallingFalse>
        </View>
      ) : forumError ? (
        <View style={styles.errorContainer}>
          <TextScallingFalse style={styles.errorText}>Error loading messages</TextScallingFalse>
        </View>
      ) : (
        renderMessagesList()
      )}

      {/* Message Input Box - Only shown for authorized users */}
      {canSendMessages ? (
        <View style={styles.inputWrapper}>
          <View
           
            style={styles.inputGradient}
          >
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Write the Message ......"
                placeholderTextColor="#999"
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                onSubmitEditing={handleSendMessage}
                editable={!forumLoading}
                multiline
                accessibilityLabel="Message input"
              />
              <IconButton 
                icon="plus-circle-outline" 
                color="#aaa"
                size={24} 
                style={styles.attachButton}
                accessibilityLabel="Add attachment"
              />
              <IconButton 
                icon="send" 
                color={newMessage.trim() ? "#5865F2" : "#666"} 
                size={24} 
                onPress={handleSendMessage} 
                disabled={!newMessage.trim() || forumLoading}
                style={styles.sendButton}
                accessibilityLabel="Send message"
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <TextScallingFalse style={styles.infoText}>
            Only team leaders (Admin, Captain, Vice-Captain) can post messages
          </TextScallingFalse>
        </View>
      )}
    </PageThemeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badgeContainer: {
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    color: 'green',
    fontSize: 12,
    fontWeight: 'bold',
  },
  adminBadge: {
    // backgroundColor: '#12956B', 
    color:"#12956B",
  },
  captainBadge: {
    // backgroundColor: '#5865F2',
  },
  viceCaptainBadge: {
    // backgroundColor: '#3BA55C', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#ED4245',
    fontSize: 16,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#2C2F33', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 15,
    gap: 10
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  teamLogoPlaceholder: {
    backgroundColor: '#5865F2', 
    marginRight: 10,
  },
  teamName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  onlineStatus: {
    color: '#b9bbbe',
    fontSize: 10,
    marginTop: 1,
  },
  divider: {
    backgroundColor: '#151515',
    height: 1,
  },
  systemMessageContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  systemMessageWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    maxWidth: '80%',
  },
  systemMessageText: {
    color: '#b9bbbe',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3a4a5a',
  },
  currentUserAvatar: {
    backgroundColor: '#5865F2', // Discord blue
  },
  messageContentContainer: {
    opacity:100,
    marginRight:40,
    padding:10,
    paddingHorizontal: 14,
    borderRadius:10,
    backgroundColor:"#181818",
    // flex: 1,
    maxWidth: '80%',
    alignItems: 'flex-start',
    zIndex:3,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  },
  currentUserName: {
    color: 'white', // Discord blue
  },
  messageTime: {
    color: '#72767d',
    fontSize: 11,
    paddingHorizontal: 5,
  },
  messageBubble: {
    borderRadius: 4,
    paddingRight: 12,
    paddingBottom: 3,
  },
  currentUserBubble: {
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#dcddde',
    fontSize: 15,
    lineHeight: 20,
    borderRadius: 60,
  },
  inputWrapper: {
    width: '100%',
    borderRadius: 60,
  },
  inputGradient: {
    // paddingTop: 8,
    // paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212', // Discord input background
    borderRadius: 60,
    margin: 8,
    paddingHorizontal: 16,
    // paddingVertical: 2,
  },
  input: {
    flex: 1,
    color: 'white',
    maxHeight: 120,
    paddingVertical: 10,
    fontSize: 15,
  },
  attachButton: {
    marginLeft: 4,
  },
  sendButton: {
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 200,
  },
  emptyText: {
    color: '#b9bbbe',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  messagesContainer: {
    paddingBottom: 16,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  dateHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#151515',
  },
  dateHeaderText: {
    color: '#b9bbbe',
    fontSize: 13,
    fontWeight: '400',
    marginHorizontal: 12,
    textTransform: 'uppercase',
  }
});

export default TeamForum;