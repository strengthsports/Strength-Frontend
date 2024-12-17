import { StyleSheet, Text, View, TouchableOpacity, TextInput,} from 'react-native'
import React, { useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Logo from "@/components/logo";
import { useRouter } from "expo-router";
import TextInputSection from "@/components/TextInputSection";
import DateTimePicker from "@react-native-community/datetimepicker";
import SignupButton from "@/components/SignupButton";



const signupEmail1 = () => {
  const router = useRouter();

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
    <View style={{backgroundColor:'black', height: '100%', width: '100%',}}>
       <View style={{ width:'100%', alignItems:'center', marginTop: 60, flexDirection:'row'}}>
      <TouchableOpacity onPress={() => router.push("/option")} activeOpacity={0.5} style={{marginLeft: 15, marginTop: -15}}>
      <MaterialIcons name="keyboard-backspace" size={30} color="white" />
      </TouchableOpacity>
      <Logo />
      <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.5} style={{marginLeft: 130, marginTop: -15}}>
      <AntDesign name="close" size={25} color="white" />
      </TouchableOpacity>
      </View>

      <View style={{marginLeft: 40, marginTop: 30}}>
        <Text style={{color:'white', fontSize: 28, fontWeight:'400'}}>Create your account</Text>
      </View>

     <View style={{justifyContent:'center', alignItems:'center'}}>
      <View style={{width: '100%', marginTop: 40}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{color:'white', fontSize: 14, marginLeft: 40, fontWeight:'500'}}>First Name</Text> 
          <Text style={{color:'white', fontSize: 14, marginLeft: 94, fontWeight:'500'}}>Last Name</Text> 
        </View>
        <View style={{ marginLeft: 38, marginTop: 4, flexDirection:'row'}}>
          <TextInput style={{width: 162, height: 40, borderRadius: 5, fontSize: 16, color:'white', borderColor:'white', borderWidth: 1}} />
          <TextInput style={{width: 162, height: 40, borderRadius: 5, fontSize: 16, color:'white', borderColor:'white', borderWidth: 1, marginLeft: 10}} />
        </View>
      </View>

      <View style={{ marginTop: 20}}>
      <Text style={{color:'white', fontSize: 14, fontWeight:'500'}}>Email or phone numbder</Text>
      <TextInputSection
       placeholder="Email"
       value={email}
       onChangeText={setEmail}
       keyboardType="email-address" // Optional: Ensure proper keyboard type
       autoCapitalize="none"  />
      </View>

      <View style={{ marginTop: 20}}>
      <Text style={{color:'white', fontSize: 14, fontWeight:'500'}}>Date of birth</Text>
      <TouchableOpacity  activeOpacity={0.5}
       onPress={() => setIsDatePickerVisible(!isDatePickerVisible)} 
       style={{  maxWidth: 335,
        minWidth: 335,
        height: 44,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5.5,
        marginTop: 4,
        paddingLeft: 10,}}><Text style={{color:'white', fontSize: 16, fontWeight:'400'}}></Text>
        <TouchableOpacity onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}
         activeOpacity={0.5} style={{marginTop: -15.5, marginLeft: 288}}>
        <AntDesign name="calendar" size={25} color="white" />
        </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View style={{width: '100%', marginTop: 20}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{color:'white', fontSize: 14, marginLeft: 40, fontWeight:'500'}}>Gender</Text>  
        </View>
        <View style={{ marginLeft: 38, marginTop: 4, flexDirection:'row'}}>
           <TouchableOpacity onPress={handleFemalePress} activeOpacity={0.5} style={{width: 162, height: 42, borderRadius: 5, borderColor:'white', borderWidth: 1, alignItems:'center', flexDirection:'row'}}>
           <Text style={{color:'white', fontSize: 14, fontWeight:'400', marginLeft: 30}}>Female</Text>
           <View style={{width: 15, height: 15, borderWidth: 1, borderRadius: 10, borderColor:'white', marginLeft: 35, marginTop: 1.5, backgroundColor: femaleSelected ? '#12956B' : 'black',}}/>
           </TouchableOpacity>

           <TouchableOpacity onPress={handleMalePress} activeOpacity={0.5} style={{width: 162, height: 42, borderRadius: 5, borderColor:'white', borderWidth: 1, alignItems:'center', flexDirection:'row', marginLeft: 10}}>
           <Text style={{color:'white', fontSize: 14, fontWeight:'400', marginLeft: 35}}>Male</Text>
           <View style={{width: 15, height: 15, borderWidth: 1, borderRadius: 10, borderColor:'white', marginLeft: 45, marginTop: 1.5, backgroundColor: maleSelected ? '#12956B' : 'black',}}/>
           </TouchableOpacity>
        </View>
      </View>

      <View style={{marginTop: 50}}>
      <SignupButton onPress={handleEmail}>
       <Text style={{color:'white', fontSize: 14.5, fontWeight:'500'}}>Continue</Text>
      </SignupButton>
      </View>
      <View style={{marginTop: 15, justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
        <Text style={{color:'white', fontSize: 14}}>Already on Strength?</Text>
        <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.5}><Text style={{color:'#12956B'}}>  Sign in</Text></TouchableOpacity>
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

</View>
    </View>
  )
}

export default signupEmail1

const styles = StyleSheet.create({})