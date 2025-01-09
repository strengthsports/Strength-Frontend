import React, { Component, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ScrollView } from 'react-native'
import PageThemeView from '~/components/PageThemeView';
import PostButton from '~/components/PostButton';
import nocover from '@/assets/images/cover.jpg'
import nopic from '@/assets/images/pro.jpg'
import flag from '@/assets/images/IN.png'
import TextScallingFalse from "@/components/CentralText";
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import ProfileTabsNavigator from '~/components/ProfileTabsNavigator';




const profile = () =>{

  const { width: screenWidth } = Dimensions.get('window'); // Get the screen width
  const containerWidth = 340; // Original container width
  const dotPercentageSize = 11 / containerWidth; // Dot size as a percentage of container width
  
  const responsiveDotSize = screenWidth * dotPercentageSize;
  const Tab = createMaterialTopTabNavigator();

  const { width: screenWidth2 } = Dimensions.get('window');
  const scaleFactor = screenWidth2 / 410;





  const posts = [
    {
      id: 1,
      firstName: 'Sebastian',
      lastName: 'Cilb',
      profilepic: 'https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8',
      headline: 'Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness',
      caption: 'Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues',
      image: 'https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2Fec810ca3-96d1-4101-981e-296240d60437.jpg?alt=media&token=da6e81af-e2d0-49c0-8ef0-fe923f837a07',
      likes: ["harshal_123", "Miraj_123"],
      comments: [
        {
          id: 1,
          firstName: "harshl",
          lastName: 'mishra',
          description: 'kjaskjdashdkasjndjansjndjan',
          comment: "amazing",
        },
        {
          id: 2,
          firstName: "harshl",
          lastName: 'mishra',
          description: 'kjaskjdashdkasjndjansjndjan',
          comment: "agg laga deya",
        },
      ],
    },
    {
      id: 2,
      firstName: 'Sebastian',
      lastName: 'Cilb',
      profilepic: 'https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F7ec7c81f-dedc-4a0f-8d4e-ddc6544dc96b.jpeg?alt=media&token=141060d7-b533-4e92-bce0-7e317a6ae9d8',
      headline: 'Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precesion, Power, and Calmness',
      caption: 'Another day, another ride. Focus, train,repeat. Pursing Peformance one mile at a time. The journey countinues',
      image: 'https://firebasestorage.googleapis.com/v0/b/strength-55c80.appspot.com/o/uploads%2F409857d8-56c3-465f-9cac-dffddf0575e2.jpeg?alt=media&token=f3aa7516-8dac-4de5-90a5-b057c5d8703c',
      likes: ["harshal_123", "Miraj_123"],
      comments: [
        {
          id: 1,
          firstName: "harshl",
          lastName: 'mishra',
          description: 'kjaskjdashdkasjndjansjndjan',
          comment: "amazing",
        },
        {
          id: 2,
          firstName: "harshl",
          lastName: 'mishra',
          description: 'kjaskjdashdkasjndjansjndjan',
          comment: "agg laga deya",
        },
      ],
    },
  ];







    return (
      <PageThemeView>
         <ScrollView  contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{justifyContent:'space-between', paddingHorizontal: 13, flexDirection:'row', height: 45, alignItems:'center'}}>
          <TextScallingFalse style={{color:'white', fontSize: 19}}>@Sebastian</TextScallingFalse>
          <View style={{flexDirection:'row', gap: 10, marginTop: 2}}>
            <View style={{marginTop: 1.5}}>
            <PostButton/>
            </View>
            <TouchableOpacity activeOpacity={0.5}>
            <MaterialCommunityIcons name="message-reply-text-outline" size={27} color="white"/>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ alignItems:"flex-end", height: 135 * scaleFactor}}>
        <Image source={nocover} style={{width:'100%', height: '100%'}}></Image>
        <View style={{paddingHorizontal: '4.87%', position:'relative', top: '-45%', zIndex: 100, }}>
        <View style={{width: responsiveWidth(31), height: responsiveHeight(15), backgroundColor:'black', borderRadius: 100, justifyContent:'center', alignItems:'center'}}>
        <Image source={nopic} style={{width: responsiveWidth(29.6), height: responsiveHeight(14.40), borderRadius: 100}}></Image>
        </View>
        </View>
        </View>

        <View style={{width: '100%', alignItems:'center', paddingTop: '2%'}}>
        <View style={{width: '95.12%', backgroundColor: '#171717', borderRadius: 33, padding: 25}}>
          <View style={{ position:'relative', top: -9, flexDirection:'row'}}>
            <View style={{ width: '47.1%'}}>
            <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(2.35), fontWeight:'bold'}}>Sebastian Cilb</TextScallingFalse>
            </View>
            <View style={{width: '19.70%'}}>
              <View style={{height: 7,}} />
            <View style={{flexDirection:'row', gap: 3,}}>
            <Image source={flag} style={{width: '23.88%', height: '90%',}}/>
            <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.41), fontWeight:'400'}}>Pakistan</TextScallingFalse>
            </View>
            </View>
          </View>

          <View style={{ width: '67.64%', position:'relative', top: -9}}>
            <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.3), fontWeight:'400'}}>Elite Performance | Specialized in Climbing, Sprinting/Time Trails | Driven By Precision, Power, and Calmness</TextScallingFalse>
          </View>

          <View style={{paddingTop: '3.6%'}}>
          <View style={{position:'relative', left: -3}}>
          <View style={{flexDirection:'row', gap: '3.65%',}}>
          <View style={{flexDirection:'row'}}>
          <Entypo name="dot-single" size={responsiveDotSize} color="white"/>
          <TextScallingFalse style={styles.ProfileKeyPoints}> Age: 25<TextScallingFalse style={{color:'grey'}}>( May 1999 )</TextScallingFalse></TextScallingFalse>
          </View>

          <View style={{flexDirection:'row'}}>
          <Entypo name="dot-single" size={responsiveDotSize} color="white"/>
          <TextScallingFalse style={styles.ProfileKeyPoints}> Height: 123cm</TextScallingFalse>
          </View>

          <View style={{flexDirection:'row'}}>
          <Entypo name="dot-single" size={responsiveDotSize} color="white"/>
          <TextScallingFalse style={styles.ProfileKeyPoints}> Weight: 1200</TextScallingFalse>
          </View>
          </View>

          <View style={{paddingTop: '3%'}}>
          <View style={{flexDirection:'row'}}>
          <Entypo name="dot-single" size={responsiveDotSize} color="white"/>
          <TextScallingFalse style={styles.ProfileKeyPoints}> Teams: <TextScallingFalse style={{color:'grey'}}> Pro Trackers</TextScallingFalse></TextScallingFalse>
          </View>
          </View>
          </View>

          <View style={{paddingHorizontal: 7, gap: 3, paddingTop: '3.5%', position:'relative', bottom:'-10%'}}>
          <View>
            <TextScallingFalse style={{color:'grey', fontSize: responsiveFontSize(1.35), width: '63.25%',}}>Brisbane, Oueensland, India</TextScallingFalse>
          </View>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity activeOpacity={0.5}><TextScallingFalse style={{color:'#12956B', fontSize: responsiveFontSize(1.64)}}>0 Followers</TextScallingFalse></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5}><TextScallingFalse style={{color:'#12956B', fontSize: responsiveFontSize(1.64)}}> - 0 Following</TextScallingFalse></TouchableOpacity>
          </View>
          </View>
          </View>
        </View>
        </View>

        <View style={{width: '100%', justifyContent:'center', flexDirection:'row', gap: 10, paddingTop: '2.5%'}}>
            <TouchableOpacity activeOpacity={0.5} style={{width: '34.14%', borderRadius: 10, backgroundColor:'#12956B', justifyContent:'center', alignItems:'center'}}>
              <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.7), fontWeight:'500'}}>Edit profile</TextScallingFalse>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.5} style={{ width: '34.14%', borderRadius: 10, borderColor:'#12956B', borderWidth: 1,  justifyContent:'center', alignItems:'center'}}>
              <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.7), fontWeight:'400'}}>Edit Overview</TextScallingFalse>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.5} style={{width: responsiveWidth(7.92), height: responsiveHeight(3.82), borderRadius: 100, justifyContent:'center', alignItems:'center', borderWidth: 1, borderColor:'#12956B'}}>
            <MaterialCommunityIcons name="dots-horizontal" size={18} color="white" />
            </TouchableOpacity>
          </View>
          

        <View style={{borderBottomWidth: 0.3, borderBottomColor:'#505050', position:'relative', top: 45, width: '97%', alignSelf:'center'}}></View>

        <ProfileTabsNavigator posts={posts} />
      

          </ScrollView>
      </PageThemeView>
    )
  }

  const styles = StyleSheet.create({
    ProfileKeyPoints: {
      color: 'white',
    fontSize: responsiveFontSize(1.17),
    fontWeight: 'semibold',
    }
  })

export default profile
