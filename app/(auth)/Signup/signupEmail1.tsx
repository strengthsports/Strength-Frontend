import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Linking} from 'react-native'
import React, { useState } from "react";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import Logo from "@/components/logo";
import { useRouter } from "expo-router";
import TextInputSection from "@/components/TextInputSection";
import DateTimePicker from "@react-native-community/datetimepicker";
import SignupButton from "@/components/SignupButton";
import TextScallingFalse from "@/components/CentralText";
import PageThemeView from "@/components/PageThemeView";



const signupEmail1 = () => {
  const router = useRouter();
  const [openModal14, setOpenModal14] = React.useState(false);

  //for email input section
    const [email, setEmail] = useState<string>(""); // Explicitly type as string


    //for date of birth
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [dateofBirth, setDateOfBirth] = useState('');

    const handleDateChange = (selectedDate) => {
      setDateOfBirth(selectedDate);
      setIsDatePickerVisible(false);
     };


    //Gender option
    const [maleSelected, setMaleSelected] = useState(false);
    const [femaleSelected, setFemaleSelected] = useState(false);
    const [gender, setGender] = useState('');
    const handleMalePress = () => {
      setMaleSelected(!maleSelected);
      setFemaleSelected(false);
      setGender('Male');
    };
  
    const handleFemalePress = () => {
      setFemaleSelected(!femaleSelected);
      setMaleSelected(false);
      setGender('Female');
    };

    const handleEmail = () => {
      router.push({
        pathname: "/Signup/signupEnterOtp2",
      });
    };

  return (
    <PageThemeView>
       <View style={{ width:'100%', alignItems:'center', marginTop: 60, flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 15}}>
      <TouchableOpacity onPress={() => router.push("/option")} activeOpacity={0.5}>
      <MaterialIcons name="keyboard-backspace" size={30} color="white" />
      </TouchableOpacity>
      <Logo/>
      <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.5}>
      <AntDesign name="close" size={25} color="white" />
      </TouchableOpacity>
      </View>

  
     <View style={{justifyContent:'space-between', alignItems:'center'}}>
      
      <View style={{padding: 40, width: '100%',}}>
        <TextScallingFalse style={{color:'white', fontSize: 28, fontWeight:'500',}}>Create your account</TextScallingFalse>
      </View>

     
     <View style={{ gap : 18}}>
      <View style={{flexDirection:'row', gap: 10}}>
        <View style={{ width: 162,}}>
          <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'500'}}>First Name</TextScallingFalse> 
          <TextInput style={{width: '100%', height: 40, borderRadius: 5, fontSize: 16, color:'white', borderColor:'white', borderWidth: 1, paddingHorizontal: 10}} />
        </View>
        <View style={{width: 162,}}>
        <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'500'}}>Last Name</TextScallingFalse> 
          <TextInput style={{width: '100%', height: 40, borderRadius: 5, fontSize: 16, color:'white', borderColor:'white', borderWidth: 1, paddingHorizontal: 10}} />
        </View>
      </View>

      <View>
      <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'500'}}>Email or phone number</TextScallingFalse>
      <TextInputSection
       value={email}
       onChangeText={setEmail}
       keyboardType="email-address" // Optional: Ensure proper keyboard type
       autoCapitalize="none"  />
      </View>

      <View>
      <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'500'}}>Date of birth</TextScallingFalse>
      <TouchableOpacity  activeOpacity={0.5}
       onPress={() => setIsDatePickerVisible(!isDatePickerVisible)} 
       style={{  maxWidth: 335,
        minWidth: 335,
        height: 44,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5.5,
        marginTop: 4,
        paddingLeft: 10,}}><TextScallingFalse style={{color:'white', fontSize: 16, fontWeight:'400'}}></TextScallingFalse>
        <TouchableOpacity onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}
         activeOpacity={0.5} style={{marginTop: -14, marginLeft: 288}}>
        <AntDesign name="calendar" size={25} color="white" />
        </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View>
        <View style={{flexDirection:'row'}}>
          <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'500'}}>Gender</TextScallingFalse>  
        </View>
        <View style={{ flexDirection:'row'}}>
           <TouchableOpacity onPress={handleFemalePress} activeOpacity={0.5} style={{width: 162, height: 42, borderRadius: 5, borderColor:'white', borderWidth: 1, alignItems:'center', flexDirection:'row'}}>
           <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'400', marginLeft: 30}}>Female</TextScallingFalse>
           <View style={{width: 15, height: 15, borderWidth: 1, borderRadius: 10, borderColor:'white', marginLeft: 35, marginTop: 1.5, backgroundColor: femaleSelected ? '#12956B' : 'black',}}/>
           </TouchableOpacity>

           <TouchableOpacity onPress={handleMalePress} activeOpacity={0.5} style={{width: 162, height: 42, borderRadius: 5, borderColor:'white', borderWidth: 1, alignItems:'center', flexDirection:'row', marginLeft: 10}}>
           <TextScallingFalse style={{color:'white', fontSize: 14, fontWeight:'400', marginLeft: 35}}>Male</TextScallingFalse>
           <View style={{width: 15, height: 15, borderWidth: 1, borderRadius: 10, borderColor:'white', marginLeft: 45, marginTop: 1.5, backgroundColor: maleSelected ? '#12956B' : 'black',}}/>
           </TouchableOpacity>
        </View>
      </View>
      </View>


      <View style={{gap : 15, marginTop: 30}}>
      <View style={{width: 330, justifyContent:'center', alignItems:'center',}}>
      <TextScallingFalse style={{fontSize: 11, color: 'white',}} allowFontScaling={false}>By clicking Agree & Join you agree to the Strength.</TextScallingFalse>
      <TouchableOpacity activeOpacity={0.5}  onPress={() => setOpenModal14(true)}>
      <TextScallingFalse style={{fontSize: 11, color: '#12956B',}} allowFontScaling={false}>User Agreement, Privacy Policy, Cookies Policy.</TextScallingFalse>
      </TouchableOpacity>
      </View>


      <View style={{marginTop: 25}}>
      <SignupButton onPress={handleEmail}>
       <TextScallingFalse style={{color:'white', fontSize: 14.5, fontWeight:'500'}}>Agree & join</TextScallingFalse>
      </SignupButton>
      </View>
      <View style={{justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
        <TextScallingFalse style={{color:'white', fontSize: 14}}>Already on Strength?</TextScallingFalse>
        <TouchableOpacity onPress={() => router.push('./[modal]')} activeOpacity={0.5}><TextScallingFalse style={{color:'#12956B'}}>  Sign in</TextScallingFalse></TouchableOpacity>
      </View>
      </View>
      </View>





      <View style={{zIndex: 100,}}>
      {isDatePickerVisible && (
  <View style={{ position:'absolute', top: -378, left: 3}}>
    <DateTimePicker
      value={new Date()} // Set an initial value for the date picker
      mode="date" // Set the picker mode to 'date'
      display="spinner" // Default display style
      onChange={(event, selectedDate) => {
        if (selectedDate) {
          handleDateChange(selectedDate.toISOString().split('T')[0]); // Pass only the date part
        }
        setIsDatePickerVisible(false); // Close the date picker
      }}
      themeVariant="dark"
    />
  </View>
)}










<Modal visible={openModal14} animationType="slide" onRequestClose={() => setOpenModal14(false)} transparent={true}>

<TouchableOpacity style={{flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',}} activeOpacity={1} onPress={() => setOpenModal14(false)}>
  <View style={{ width: '100%',  alignItems: 'center', position:'absolute', bottom:0}}>
    <View style={{ width: '100%', height: 220, backgroundColor: '#1D1D1D', borderRadius: '7%',}}>

  
  <View style={{marginTop: 25, width: '100%', alignItems:'center', justifyContent:'center'}}>
    <Text style={{color: 'white', fontSize: 15,  fontWeight: '300'}}>Agreements & Policy</Text>
    <View style={{height: 0.2, width: 180, backgroundColor:'grey', marginTop: 6.5}}></View>
  </View>
 

<View style={{marginLeft: 25, width: 360, marginTop: 15}}>
<TouchableOpacity onPress={() => Linking.openURL('https://strength-sports.webflow.io/resources/instructions')} activeOpacity={0.5} style={{flexDirection:'row', marginTop: 10, alignItems:'center'}}>
<View style={{backgroundColor:'#12956B', width: 10, height: 10, borderRadius: 10, marginTop: 1}}></View>
<Text style={{color: 'white', fontSize: 14, fontWeight: '400', marginLeft: 20}}>User Agreement</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => Linking.openURL('https://www.strength.net.in/?privacy')} activeOpacity={0.5} style={{flexDirection:'row', marginTop: 15, alignItems:'center'}}>
<View style={{backgroundColor:'#12956B', width: 10, height: 10, borderRadius: 10, marginTop: 1}}></View>
<Text style={{color: 'white', fontSize: 14, fontWeight: '400', marginLeft: 20}}>Privacy Policy</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => Linking.openURL('https://www.strength.net.in/?term')} activeOpacity={0.5} style={{flexDirection:'row', marginTop: 15, alignItems:'center'}}>
<View style={{backgroundColor:'#12956B', width: 10, height: 10, borderRadius: 10, marginTop: 1}}></View>
<Text style={{color: 'white', fontSize: 14, fontWeight: '400', marginLeft: 20}}>Cookies Policy</Text>
</TouchableOpacity>
</View>
    



    </View>
  </View>
  </TouchableOpacity>

</Modal>






</View>
    </PageThemeView>
  )
}

export default signupEmail1

const styles = StyleSheet.create({})