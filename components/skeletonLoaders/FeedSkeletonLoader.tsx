import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { MotiView } from "moti";
import TextScallingFalse from "../CentralText";
import { Easing } from "react-native-reanimated";

const { width } = Dimensions.get("window"); // Get screen width


const AnimatedShimmer = ({ width = 50, height = 25, duration = 1000 }) => {
  return (
    <MotiView
      from={{ translateX: 0, opacity: 0.1 }}
      animate={{ translateX: 155, opacity: 0.2 }}
      transition={{
        loop: true,
        type: "timing",
        duration,
        repeatReverse: false,
        easing: Easing.linear,
      }}
      style={{
        backgroundColor: "#353535",
        width,
        height,
        borderRadius: 5,
      }}
    />
  );
};

const FeedSkeletonLoader = () => {
  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 10, overflow: "hidden" }}>
    <View style={{ borderWidth: 4, borderColor: "#101010", height: 197, width: 337, borderRadius: 15, overflow: "hidden"}}>

        <View style={{height: 70, width: '100%', flexDirection:'row', justifyContent:'space-between', padding: 20, borderBlockColor: '#121212', borderBottomWidth: 0.9}}>
        <View style={styles.Title}>
        <AnimatedShimmer />
        </View>

        <View style={[styles.Title, {width: '20%'}]}>
        <AnimatedShimmer duration={1400}/>
        </View>
        </View>

        <View style={styles.DetailsContainer}>
        <View style={styles.TeamNames}>
        <AnimatedShimmer height={15} />
        </View>

        <View style={[styles.TeamNames, {width: '20%'}]}>
        <AnimatedShimmer height={15} duration={1400} />
        </View>
        </View>

        <View style={[styles.DetailsContainer,{paddingHorizontal: 19, padding: 0}]}>
        <View style={styles.TeamNames}>
        <AnimatedShimmer height={15} />
        </View>

        <View style={[styles.TeamNames, {width: '20%'}]}>
        <AnimatedShimmer height={15} duration={1400} />
        </View>
        </View>

        <View style={{width:'100%', height:'100%', padding: 20, paddingTop: 25}}>
        <View style={{backgroundColor:'#181818', width: '50%', height: 10, borderRadius: 20}}>
        <AnimatedShimmer height={10} />
        </View>
        </View>

    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  Title : {
    backgroundColor:'#181818', 
    width: '70%', 
    height: 25, 
    borderRadius: 20
  },
  TeamNames:{
    backgroundColor:'#181818',
    width: '70%', 
    height: 15, 
    borderRadius: 20
  },
  DetailsContainer: {
    width:'100%', 
    flexDirection:'row', 
    padding: 20, 
    justifyContent:'space-between'
  }
})

export default FeedSkeletonLoader;
