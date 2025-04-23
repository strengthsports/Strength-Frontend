import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

interface DrawerProps {
  style?: object;
}

const Drawer: React.FC<DrawerProps> = ({ style }) => {
  return (
    <View style={[styles.drawerContainer, style]}>
      <TouchableOpacity>
        <Icon name="arrowleft" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="bars" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    
    backgroundColor: "black", // You can adjust this for a background color if needed
  },
});

export default Drawer;
