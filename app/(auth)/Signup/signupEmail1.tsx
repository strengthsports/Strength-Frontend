import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Linking} from 'react-native'
import React, { useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Logo from "@/components/logo";
import { useRouter } from "expo-router";
import TextInputSection from "@/components/TextInputSection";
import DateTimePicker from "@react-native-community/datetimepicker";
import SignupButton from "@/components/SignupButton";
import Text1 from "@/components/Text";



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
      //your function for handling details
    }
    



  return (
    <View style={{width: '100%', height: '100%', backgroundColor:'black'}}>
       <View style={{ width:'100%', alignItems:'center', marginTop: 60, flexDirection:'row'}}>
      <TouchableOpacity onPress={() => router.push("/option")} activeOpacity={0.5} style={{marginLeft: 15, marginTop: -15}}>
      <MaterialIcons name="keyboard-backspace" size={30} color="white" />
      </TouchableOpacity>
      <Logo />
      <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.5} style={{marginLeft: 130, marginTop: -15}}>
      <AntDesign name="close" size={25} color="white" />
      </TouchableOpacity>
      </View>

      <View style={{marginLeft: 40, marginTop: 40}}>
        <Text1 style={{color:'white', fontSize: 28, fontWeight:'400'}}>Create your account</Text1>
      </View>

     <View style={{justifyContent:'center', alignItems:'center'}}>
      <View style={{width: '100%', marginTop: 40}}>
        <View style={{flexDirection:'row'}}>
          <Text1 style={{color:'white', fontSize: 14, marginLeft: 40, fontWeight:'500'}}>First Name</Text1> 
          <Text1 style={{color:'white', fontSize: 14, marginLeft: 94, fontWeight:'500'}}>Last Name</Text1> 
        </View>
        <View style={{ marginLeft: 38, marginTop: 4, flexDirection:'row'}}>
          <TextInput style={{minWidth: 162, maxWidth: 162, height: 40, borderRadius: 5, fontSize: 16, color:'white', borderColor:'white', borderWidth: 1, paddingStart: 10, paddingEnd: 10, paddingBottom: 8,}} />
          <TextInput style={{minWidth: 162, maxWidth: 162, height: 40, borderRadius: 5, fontSize: 16, color:'white', borderColor:'white', borderWidth: 1, paddingStart: 10, paddingEnd: 10, marginLeft: 10,  paddingBottom: 8,}} />
        </View>
      </View>

      <View style={{ marginTop: 20}}>
      <Text1 style={{color:'white', fontSize: 14, fontWeight:'500'}}>Email or phone number</Text1>
      <TextInputSection
       placeholder="Email"
       value={email}
       onChangeText={setEmail}
       keyboardType="email-address" // Optional: Ensure proper keyboard type
       autoCapitalize="none"  />
      </View>

      <View style={{ marginTop: 20}}>
      <Text1 style={{color:'white', fontSize: 14, fontWeight:'500'}}>Date of birth</Text1>
      <TouchableOpacity  activeOpacity={0.5}
       onPress={() => setIsDatePickerVisible(!isDatePickerVisible)} 
       style={{  maxWidth: 335,
        minWidth: 335,
        height: 44,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5.5,
        marginTop: 4,
        paddingLeft: 10,}}><Text1 style={{color:'white', fontSize: 16, fontWeight:'400'}}></Text1>
        <TouchableOpacity onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}
         activeOpacity={0.5} style={{marginTop: -14, marginLeft: 288}}>
        <AntDesign name="calendar" size={25} color="white" />
        </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View style={{width: '100%', marginTop: 20}}>
        <View style={{flexDirection:'row'}}>
          <Text1 style={{color:'white', fontSize: 14, marginLeft: 40, fontWeight:'500'}}>Gender</Text1>  
        </View>
        <View style={{ marginLeft: 38, marginTop: 4, flexDirection:'row'}}>
           <TouchableOpacity onPress={handleFemalePress} activeOpacity={0.5} style={{width: 162, height: 42, borderRadius: 5, borderColor:'white', borderWidth: 1, alignItems:'center', flexDirection:'row'}}>
           <Text1 style={{color:'white', fontSize: 14, fontWeight:'400', marginLeft: 30}}>Female</Text1>
           <View style={{width: 15, height: 15, borderWidth: 1, borderRadius: 10, borderColor:'white', marginLeft: 35, marginTop: 1.5, backgroundColor: femaleSelected ? '#12956B' : 'black',}}/>
           </TouchableOpacity>

           <TouchableOpacity onPress={handleMalePress} activeOpacity={0.5} style={{width: 162, height: 42, borderRadius: 5, borderColor:'white', borderWidth: 1, alignItems:'center', flexDirection:'row', marginLeft: 10}}>
           <Text1 style={{color:'white', fontSize: 14, fontWeight:'400', marginLeft: 35}}>Male</Text1>
           <View style={{width: 15, height: 15, borderWidth: 1, borderRadius: 10, borderColor:'white', marginLeft: 45, marginTop: 1.5, backgroundColor: maleSelected ? '#12956B' : 'black',}}/>
           </TouchableOpacity>
        </View>
      </View>


      <View style={{width: 330, marginTop: 40, justifyContent:'center', alignItems:'center'}}>
      <Text1 style={{fontSize: 11, color: 'white',}} allowFontScaling={false}>By clicking Agree & Join you agree to the Strength.</Text1>
      <TouchableOpacity activeOpacity={0.5} onPress={() => setOpenModal14(true)}>
      <Text1 style={{fontSize: 11, color: '#12956B',}} allowFontScaling={false}>User Agreement, Privacy Policy, Cookies Policy.</Text1>
      </TouchableOpacity>
      </View>


      <View style={{marginTop: 20}}>
      <SignupButton onPress={() => router.push("/Signup/signupEnterOtp2")}>
       <Text1 style={{color:'white', fontSize: 14.5, fontWeight:'500'}}>Agree & join</Text1>
      </SignupButton>
      </View>
      <View style={{marginTop: 15, justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
        <Text1 style={{color:'white', fontSize: 14}}>Already on Strength?</Text1>
        <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.5}><Text1 style={{color:'#12956B'}}>  Sign in</Text1></TouchableOpacity>
      </View>
      </View>





      <View style={{zIndex: 100,}}>
      {isDatePickerVisible && (
  <View style={{ marginTop: 12, position: 'absolute', top: -65, left: -10 }}>
    <DateTimePicker
      value={new Date()} // Set an initial value for the date picker
      mode="date" // Set the picker mode to 'date'
      display="default" // Default display style
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


<TouchableOpacity style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',}} activeOpacity={1} onPress={() => setOpenModal14(false)}>
  <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center',}}>
    <View style={{ width: 410, height: 220, backgroundColor: '#1D1D1D', borderRadius: 25,}}>



  
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
    </View>
  )
}

export default signupEmail1

const styles = StyleSheet.create({})