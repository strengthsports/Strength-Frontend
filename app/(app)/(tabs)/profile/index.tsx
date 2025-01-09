import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Dimensions} from 'react-native'
import React, { useState } from 'react';
import SportsButtonsTabs from '@/components/SportsButtonsTabs';
import TextScallingFalse from "@/components/CentralText";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import PostSmallCard from '@/components/Cards/PostSmallCard';



const data = {
currentteamcricket: [
  {
    id: 1,
    cteamname: 'Pro Trackers',
    cteamaddress: 'Queensland, Australia',
    cteamposition: 'Sprit-Lead',
    cteamjoinedon: '2/4/20',
    cteamlogo: 'https://th.bing.com/th/id/R.8e89771a422f8151c53146eb2b950755?rik=x2SbdtUqdN4MrA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-PSo_4af_Y4M%2fU1fY4UHfHOI%2fAAAAAAAANfw%2fMHW_GKUCYLE%2fs1600%2fchelsea-fc-logo-wallpapers%2b02.jpg&ehk=KVIwGdoGS9heIpR7oXnPO0o1K6GL5PhcyN9ugrRzpqA%3d&risl=&pid=ImgRaw&r=0',

  },
],
}





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








const Overview = () => {

  const { width: screenWidth2 } = Dimensions.get('window');
  const scaleFactor = screenWidth2 / 410;


  const [isExpanded, setIsExpanded] = useState(false); // State to toggle between full and truncated text

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
    



  return (
    <View style={{flex: 1}}>
    <SportsButtonsTabs />

     {/* cycling Overview */}
    <View style={styles.OuterView}>
      <View style={styles.DetailsContainer}>
        <View style={{flexDirection:'row', gap: '2%'}}>
        <View style={{ width: '33.8%'}}>
        <TextScallingFalse style={styles.HeadingText}>RIDING STATE</TextScallingFalse>
        <TextScallingFalse style={styles.DetailText}>Time Trialist</TextScallingFalse>
        </View>

        <View style={{ width: '33.8%'}}>
        <TextScallingFalse style={styles.HeadingText}>TERRAIN</TextScallingFalse>
        <TextScallingFalse style={styles.DetailText}>Mixed Terrain</TextScallingFalse>
        </View>

        <View style={{width: '28.2%'}}>
        <TextScallingFalse style={styles.HeadingText}>TEAM ROLE</TextScallingFalse>
        <TextScallingFalse style={styles.DetailText}>Sprit Lead-Out</TextScallingFalse>
        </View>
        </View>

        <View style={{ width: '56.4%', paddingTop: '3%'}}>
        <TextScallingFalse style={styles.HeadingText}>STATUS</TextScallingFalse>
        <TextScallingFalse style={styles.DetailText}>UCI World Tour Competitor</TextScallingFalse>
        </View>
      </View>
    </View>



    <View style={styles.OuterView}>
      <View style={styles.DetailsContainer}>
      <View style={{flexDirection:'row',gap: '45%'}}>
      <TextScallingFalse style={styles.HeadingText}>CURRENT TEAMS</TextScallingFalse>
      <TextScallingFalse style={styles.HeadingText}>QUICK INFO</TextScallingFalse>
      </View>
      <View style={{ paddingTop: '5%', flexDirection:'row'}}>
      <Image source={{ uri: data.currentteamcricket[0].cteamlogo }} style={{width: 45, height: 45, borderRadius: 100}} />
      <View style={{width: '45%', paddingLeft: '3.5%'}}>
      <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.76), fontWeight:'bold'}}>Pro Tracker</TextScallingFalse>
      <TextScallingFalse style={{color:'grey', fontSize: responsiveFontSize(1.41), fontWeight:'300'}}>Brisbane, Queensland, Australia</TextScallingFalse>
      </View>
      <View style={{paddingLeft: '7.5%'}}>
        <View>
        <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.41), fontWeight:'500'}}>Position: <TextScallingFalse style={{color:'white', fontWeight:'200'}}> Lead-Sprit</TextScallingFalse></TextScallingFalse>
        </View>
        <View style={{ paddingTop: '4.5%'}}>
        <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.29), fontWeight:'400'}}>Joined on: <TextScallingFalse style={{color:'grey', fontWeight:'300'}}> 28/07/2024</TextScallingFalse></TextScallingFalse>
        </View>
      </View>
      </View>
      </View>
    </View>



    <View style={styles.OuterView}>
      <View style={styles.DetailsContainer}>
        <View style={{padding: 2}}>
        <TextScallingFalse style={{color:'grey', fontSize: responsiveFontSize(2.23), fontWeight:'bold'}}>About</TextScallingFalse>
        <TextScallingFalse style={{fontSize: responsiveFontSize(1.52), color: 'white', fontWeight: '300', paddingTop: '3%', lineHeight: 17.5}} numberOfLines={isExpanded ? undefined : 3}>A relentless competitor on two wheels, excelling in riding speciality, high-altitude climbs or explosive sprints Dominating preferred terrain can be mountanious stages  idjid didhid dhi d</TextScallingFalse>
        <TouchableOpacity onPress={handleToggle}>
            <TextScallingFalse style={styles.seeMore}>
              {isExpanded ? 'see less' : 'see more'}
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
        </View>
    </View>



    <View style={{paddingTop: '3%', alignItems:'center'}}>
    <View style={{ borderWidth: 0.3, width: '97.56%', height: 582*scaleFactor, borderRadius: 20, borderLeftColor: '#494949', borderBottomColor:'#494949', borderTopColor:'#494949'}}>
      <View style={{width: '100%',height: '8.5%', justifyContent:'flex-end', paddingHorizontal: 22,}}>
      <TextScallingFalse style={{color:'grey', fontSize: responsiveFontSize(2.23), fontWeight:'bold'}}>RECENT POSTS</TextScallingFalse>
      </View>
      <ScrollView horizontal style={{paddingStart: 20}}>
        <View style={{flexDirection:'row', gap: 20}}>
        {posts.map((post:any) => (
        <PostSmallCard key={post.id} post={post} />
      ))}
        <View style={{width: 10}} />
        </View>
      </ScrollView>
      <View style={{width: '100%', height: '15%', justifyContent:'center', alignItems:'center'}}>
      <View style={{height: 0.5, width: '90%', backgroundColor:'grey'}} />
      <TouchableOpacity activeOpacity={0.3} style={{paddingTop: '3.5%'}}>
        <TextScallingFalse style={{color:'#12956B', fontSize: 13, fontWeight:'400'}}>See all posts..</TextScallingFalse>
      </TouchableOpacity>
      </View>
    </View>
    </View>


    <View style={{height: 30, width: '100%', backgroundColor:'transparent'}} />
    

  </View>
  )
}

export default Overview

const styles = StyleSheet.create({
  DetailsContainer:{
    backgroundColor:'#121212',
    width: '96%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
  },
  OuterView: {
    width: '100%',
    alignItems:'center',
    paddingTop: '2.7%',
  },
  HeadingText: {
    fontSize: responsiveFontSize(1.41),
    color:'white',
    fontWeight:'bold'
  },
  DetailText: {
    fontSize: responsiveFontSize(1.52),
    color: 'white',
    fontWeight: '300',
    paddingTop: 2
  },
  seeMore: {
    color: 'grey',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '300',
  },
})