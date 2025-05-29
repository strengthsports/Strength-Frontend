import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Nopic from "@/assets/images/nopic.jpg";
import Captain from "../SvgIcons/teams/Captain";
import ViceCaptain from "../SvgIcons/teams/ViceCaptain";

type TeamMemberProps = {
  imageUrl?: string;
  name: string;
  description: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  username?:string;
  isAdmin?: boolean;
  onRemove?: () => void;
};

const TeamMember: React.FC<TeamMemberProps> = ({
  imageUrl,
  name,
  description,
  username,
  isCaptain = false,
  isViceCaptain = false,
  isAdmin = false,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
 {/* Badge */}
     {(isCaptain || isViceCaptain) && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {isCaptain ? <Captain/> : <ViceCaptain/>}
          </Text>
        </View>
      )}


      <View className=" justify-center  ">
      {/* Profile Image */}

     
      <Image
        source={imageUrl ? { uri: imageUrl } : Nopic}
        style={styles.image}
        resizeMode="cover"
      />
     

     


      <View className="">

      {/* Name */}
      <Text
        style={styles.name}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>

      {/* Description */}
      <Text
     style={styles.description}
      numberOfLines={2}      
     ellipsizeMode="tail"   
>
  {"@"}{username}{" | "}{description}
</Text>
     </View>
     </View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "space-between",
    width: 170,
    height: 202,
    borderWidth: 1,
    borderColor: "#272727",
  
    position: "relative",
    // shadowColor: "#000",
    // shadowOpacity: 1,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 4,
  },
  image: {
    height: 92,
    width: 92,
    borderRadius: 100,
    marginHorizontal:20,
    marginVertical:12,
    borderWidth:1,
    borderColor:"#181818",
    // marginTop: 14,
    // justifyContent:"center",
    
  },
  badge: {
    position: "absolute",
    top: 6,
    left: 4,
    backgroundColor: "#00000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    // marginBottom:-10,
    
  },
  description: {
    top:4,
    color: "#717171",
    fontSize: 11,
    textAlign: "center",
  },
  
});

export default TeamMember;
