import { StyleSheet, View, Image, Dimensions, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import TextScallingFalse from '../CentralText'
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';




interface Post {
  profilepic: string;
  firstName: string;
  lastName: string;
  headline: string;
  caption: string;
  image: string;
}

const PostSmallCard = ({ post }: { post: Post }) => {

     const { width: screenWidth2 } = Dimensions.get('window');
        const scaleFactor = screenWidth2 / 410;


          const [isExpanded, setIsExpanded] = useState(false); // State to toggle between full and truncated text
        
          const handleToggle = () => {
            setIsExpanded(!isExpanded);
          };


  return (
      <View style={{width: 301*scaleFactor}}>

       <View style={{width: '100%', flexDirection:'row', gap:'3%', position:'relative', top: '6%', zIndex: 100}}>
        <View style={{paddingLeft: '8%'}}>
        <View style={{height: 10}} />
         <Image source={{uri: post.profilepic}} style={{width: 50*scaleFactor, height: 50*scaleFactor, borderRadius:100, backgroundColor:'white'}} />
         </View>
         <View style={{ width: '60%'}}>
         <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.64), fontWeight:'500'}}>{post.firstName} {post.lastName}</TextScallingFalse>
         <View style={{ position:'relative', top:-2*scaleFactor, width: '100%',}}>
         <TextScallingFalse numberOfLines={1} style={{color:'white', fontSize: responsiveFontSize(1.19), fontWeight:'200'}}>{post.headline}</TextScallingFalse>
         </View>
         <TextScallingFalse style={{color:'grey', fontSize: responsiveFontSize(1.05), fontWeight:'200', paddingTop: 5*scaleFactor }}>51 days ago</TextScallingFalse>
         </View>
        </View>

        <View style={{ alignItems:'flex-end'}}>
        <View style={{width: '94%', backgroundColor:'#151515', padding: 10, justifyContent:'center', alignItems:'center', borderTopLeftRadius: 70, borderTopRightRadius: 15}}>
            <View style={{ width: '80.98%', paddingLeft: '1%', paddingTop: '10%'}}>
            <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.29), fontWeight:'400'}}  numberOfLines={isExpanded ? undefined : 2}>{post.caption}</TextScallingFalse>
            <TouchableOpacity onPress={handleToggle}>
            <TextScallingFalse style={styles.seeMore}>
              {isExpanded ? 'see less' : 'see more'}
            </TextScallingFalse>
          </TouchableOpacity>
            </View>
        </View>
        </View>

        <Image source={{uri: post.image}} style={{width: '100%', height: 210 * scaleFactor, backgroundColor:'white', borderTopLeftRadius: 22, borderBottomLeftRadius: 22}} />

        <View style={{ width: '100%', alignItems:'flex-end'}}>
            <View style={{backgroundColor:'#151515', height: 30*scaleFactor, width:'94%', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: 12}}>
            <TouchableOpacity activeOpacity={0.7} style={{flexDirection:'row'}}>
            <AntDesign name="like1" size={14 * scaleFactor} color="#FFC436" />
            <TextScallingFalse style={{fontSize: responsiveFontSize(1.41), color:'white', fontWeight:'300', paddingLeft: '2%'}}>14 Likes</TextScallingFalse>
            </TouchableOpacity>
            
            <View style={{ width: '15%'}}></View>

            <TouchableOpacity activeOpacity={0.7}>
            <TextScallingFalse style={{color:'white', fontSize: responsiveFontSize(1.41), fontWeight:'300'}}>1 Comments</TextScallingFalse>
            </TouchableOpacity>
            </View>
            <View style={{width: '94%', justifyContent:'center', alignItems:'center'}}>
            <View style={{backgroundColor:'#505050', height: 0.5, width: '85%'}}></View>
            </View>
            <View style={{width: '94%', gap: '4%', backgroundColor:'#151515', height: 57*scaleFactor, borderBottomLeftRadius: 75, borderBottomRightRadius: 50, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <View style={{width: '5%',}} />
                <TouchableOpacity activeOpacity={0.5} style={styles.ButtonsContainer}>
                <AntDesign name="like1" size={16*scaleFactor} color="#FFC436" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={styles.ButtonsContainer}>
                <Feather name="message-square" size={16*scaleFactor} color="white" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={styles.ButtonsContainer}>
                <FontAwesome5  name="location-arrow" size={12*scaleFactor} color="white" />
                </TouchableOpacity>
            </View>
            </View>

      </View>
  )
}

export default PostSmallCard

const styles = StyleSheet.create({
    ButtonsContainer:{
        backgroundColor:'black',
        padding: 7,
        borderRadius: 15,
        width: '17%',
        justifyContent:'center',
        alignItems:'center',
    },
    seeMore: {
        color: 'grey',
        fontSize: responsiveFontSize(1.29),
        fontWeight: '400',
      },
})