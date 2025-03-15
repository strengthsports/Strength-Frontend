import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TouchableHighlight, Image, Dimensions} from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';

import cricket from '@/assets/images/Sports Icons/okcricket.png';
import football from '@/assets/images/Sports Icons/okfootball.png';
import badminton from '@/assets/images/Sports Icons/okbadminton.png';
import hockey from '@/assets/images/Sports Icons/okhockey.png';
import icehockey from '@/assets/images/Sports Icons/okicehockey.png';
import kabaddi from '@/assets/images/Sports Icons/okkabaddi.png';
import basketball from '@/assets/images/Sports Icons/okbasketball.png';
import tenis from '@/assets/images/Sports Icons/oktenis.png';
import cycle from '@/assets/images/Sports Icons/okcycle.png';
import tabletenis from '@/assets/images/Sports Icons/oktabletenis.png';
import vollyball from '@/assets/images/Sports Icons/okvollyball.png';

const SportsButtonsTabs = () => {

    const [activeSubSection, setActiveSubSection] = React.useState<string | null>(null);
    const ActiveSubSection = (sport: string) => {
      setActiveSubSection(sport);
    };
    const userdata = {
        favSports: [ 'Cycling', 'Cricket', 'Basketball'] // Example selected sports
      };
      

      // Get screen width dynamically
     const { width: screenWidth } = Dimensions.get('window');
     const scaleFactor = screenWidth / 410;

  return (
    <View style={{ width: '100%'}}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingStart: 15 * scaleFactor, width: '98.5%', paddingTop: '1%'}}>
      {userdata && userdata.favSports && userdata.favSports.length > 0 ? (
          <View style={{ flexDirection: 'row', gap: 8 * scaleFactor,}}>
            {userdata.favSports.map((sport) => (
              <TouchableHighlight key={sport} onPress={() => ActiveSubSection(sport)}>
                <View
                  style={{
                    backgroundColor: activeSubSection === sport ? '#12956B' : 'black',
                    borderColor: activeSubSection === sport ? '#12956B' : '#404040',
                    borderWidth: 0.3,
                    width: 117 * scaleFactor,
                    height: 37 * scaleFactor,
                    borderRadius: activeSubSection === sport ? 7 : 9,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent:'center',
                    gap: 10 * scaleFactor,
                    overflow: 'hidden',
                  }}>
                  {sport === 'Cricket' && <Image source={cricket} style={{ width: 20* scaleFactor, height: 20* scaleFactor}} />}
                  {sport === 'Football' && <Image source={football} style={{ width: 18 * scaleFactor, height: 18 * scaleFactor}} />}
                  {sport === 'Badminton' && <Image source={badminton} style={{ width: 20 * scaleFactor, height: 20 * scaleFactor}} />}
                  {sport === 'Hockey' && <Image source={hockey} style={{ width: 18, height: 18 * scaleFactor}} />}
                  {sport === 'Icehockey' && <Image source={icehockey} style={{ width: 20, height: 20 * scaleFactor}} />}
                  {sport === 'Kabaddi' && <Image source={kabaddi} style={{ width: 20 * scaleFactor, height: 20 * scaleFactor}} />}
                  {sport === 'Basketball' && <Image source={basketball} style={{ width: 18 * scaleFactor, height: 18 * scaleFactor}} />}
                  {sport === 'Tenis' && <Image source={tenis} style={{ width: 18 * scaleFactor, height: 18 * scaleFactor}} />}
                  {sport === 'Cycling' && <Image source={cycle} style={{ width: 21 * scaleFactor, height: 21 * scaleFactor}} />}
                  {sport === 'Table tenis' && <Image source={tabletenis} style={{ width: 18 * scaleFactor, height: 18 * scaleFactor}} />}
                  {sport === 'Vollyball' && <Image source={vollyball} style={{ width: 18 * scaleFactor, height: 18 * scaleFactor}} />}
                  {sport !== 'Badminton' && (
                    <Text style={{ color: 'white', fontSize: 13 * scaleFactor, fontWeight: '500' }} allowFontScaling={false}>
                      {sport}
                    </Text>
                  )}
                  {sport === 'badminton' && (
                    <Text style={{ color: 'white', fontSize: 13 * scaleFactor, fontWeight: '500' }} allowFontScaling={false}>
                      {sport}
                    </Text>
                  )}
                </View>
              </TouchableHighlight>
            ))}
            <View style={{ paddingRight: 25 * scaleFactor, paddingLeft: 6 * scaleFactor }}>
              <TouchableOpacity
              activeOpacity={0.5}
                style={{
                  borderColor: '#454545',
                  borderWidth: 0.3,
                  width: 36 * scaleFactor,
                  height: 36 * scaleFactor,
                  borderRadius: 7,
                  alignItems: 'center',
                  justifyContent:'center',
                }}>
                <Feather name="plus" size={20 * scaleFactor} color="white"/>
              </TouchableOpacity>
            </View>
          </View>
      ) : (
        ''
      )}
    </ScrollView>
  </View>
  )
}

export default SportsButtonsTabs

const styles = StyleSheet.create({})