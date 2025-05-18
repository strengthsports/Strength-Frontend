import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from "react-native";
import ImageViewer from 'react-native-image-zoom-viewer';
import { ThemedText } from "~/components/ThemedText";
import img from "@/assets/images/teams/Vector 64.png";
import TextScallingFalse from "../CentralText";
import Pending from "../SvgIcons/teams/Pending";

type TeamCardProps = {
  teamName: string;
  sportCategory: string;
  captain: string;
  viceCapt: string;
  location: string;
  teamLogo: string;
  sportLogo: string;
  showJoinButton?: boolean;
  onJoinPress?: () => void;
  joining?: boolean;
  requestSent?: boolean; 
};

const TeamCard: React.FC<TeamCardProps> = ({
  teamName,
  sportCategory,
  captain,
  viceCapt,
  location,
  teamLogo,
  sportLogo,
  showJoinButton = false,
  onJoinPress,
  joining = false,
  requestSent = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const images = [{
    url: teamLogo || '',
    props: {
      // Optional props for the image
    }
  }];

  return (
    <View className="rounded-lg w-full mb-3 p-3 pt-[-8]">
      {/* Zoomable Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ImageViewer
            imageUrls={images}
            enableSwipeDown={true}
            onSwipeDown={() => setModalVisible(false)}
            swipeDownThreshold={50}
            enablePreload={true}
            renderHeader={() => (
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
            renderIndicator={() => null}
            backgroundColor="rgba(0,0,0,0.9)"
            enableImageZoom={true}
            doubleClickInterval={300}
            saveToLocalByLongPress={false}
          />
        </View>
      </Modal>

      {/* Team Card Content */}
      <View className="flex flex-row py-4 w-64 max-w-84">
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image 
            source={{ uri: teamLogo || "" }} 
            className="w-32 h-32 mt-1 border-2 border-[#181818] rounded-[8px] ml-8" 
            resizeMode="cover"
          />
        </TouchableOpacity>
        
        <View className="flex flex-row items-center pl-10">
          <Image source={img} className="mr-3 ml-[-6px] h-[120px] fill-red-500" />
          <View className="flex flex-col pl-4">
            <Text className="text-white font-bold items-center text-5xl">
              {(teamName).toUpperCase()}
            </Text>
            
            {/* Join Team Button */}
            {showJoinButton && (
              <TouchableOpacity
                className={`mt-3 py-2 px-4 rounded-lg items-center justify-center ${
                  joining || requestSent
                    ? "bg-black border-[0.5px] border-[#6F6F6F]"
                    : "bg-black border-[0.5px] border-[#6F6F6F]"
                }`}
                onPress={onJoinPress}
                disabled={joining || requestSent}
              >
                {joining || requestSent ? (
                  <View className="flex-row items-center">
                    <Pending />
                    <TextScallingFalse className="text-white ml-2 text-lg font-bold">Pending</TextScallingFalse>
                  </View>
                ) : (
                  <TextScallingFalse className="text-white text-lg font-bold">Join Team</TextScallingFalse>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      {/* Team Details Section */}
      <View>
        {/* Sport Category */}
        <View className="flex flex-row items-center h-12 bg-[#191919] TextScallingFalse-white px-1 mt-1 rounded-t-[10px]">
          <View className="flex-1">
            <TextScallingFalse className="text-left ml-4 text-white font-bold text-2xl w-[200px]">
              SPORT CATEGORY
            </TextScallingFalse>
          </View>
          <View className="flex-1 justify-center items-center">
            <View className="w-[14px] border-t-2 border-white"></View>
          </View>
          <View className="flex-1 flex-row items-center justify-center">
            <Image
              source={{ uri: sportLogo || 'https://via.placeholder.com/150' }}
              className="h-6 w-6 mr-6"
            />
            <TextScallingFalse className="text-white ml-[-14px] text-right text-2xl">
              {sportCategory}
            </TextScallingFalse>
          </View>
        </View>

        {/* Captain */}
        <View className="flex flex-row items-start justify-between py-3 bg-[#191919] text-white  px-1 mt-1">
          <View className="flex-1 flex-row items-center">
            <TextScallingFalse className="text-left ml-4 text-white font-bold text-2xl w-[160px]">
              CAPTAIN
            </TextScallingFalse>
            <View className="w-[14px] border-t-2 border-white"></View>
          </View>
           <View className="flex-1">
            <View className="ml-5">
              <TextScallingFalse className="text-white text-right mr-4   text-3xl">
              {captain}
            </TextScallingFalse>
             </View>
          </View>
        </View>

        {/* Vice Captain */}
        <View className="flex flex-row items-start justify-between py-3 bg-[#191919] text-white px-1 mt-1">
          <View className="flex-1 flex-row items-center">
            <TextScallingFalse className="text-left ml-4 text-white font-bold text-2xl w-[160px]">
              VICE CAPTAIN
            </TextScallingFalse>
              <View className="w-[14px] border-t-2 border-white"></View>
          </View>
         <View className="flex-1">
            <View className="ml-5">
              <TextScallingFalse className="text-white text-right mr-4   text-3xl">
              {viceCapt}
            </TextScallingFalse>
             </View>
          </View>
        </View>

        {/* Location */}
        <View className="flex flex-row items-start justify-between  py-3 bg-[#191919] text-white px-1 mt-1 rounded-b-[10px]">
          <View className="flex-1 flex-row items-center">
            <TextScallingFalse className="text-left ml-4 text-white font-bold text-2xl w-[160px]">
              LOCATION
            </TextScallingFalse>
             <View className="w-[14px]   border-t-2 border-white"></View>
          </View>
          <View className="flex-1">
            <View className="ml-5">
              <TextScallingFalse className="text-white text-right mr-4   text-3xl">
             {location}
            </TextScallingFalse>
             </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TeamCard;