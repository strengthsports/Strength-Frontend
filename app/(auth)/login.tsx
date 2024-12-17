import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, StatusBar, ScrollView} from "react-native";
import { useRouter } from "expo-router";
import { Image } from 'expo-image';
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/images/logo2.png"
import banner from "@/assets/images/banner-gif.gif"
import google from "@/assets/images/google.png"
import SignupButton from "@/components/SignupButton";
import TextInputSection from "@/components/TextInputSection";
import Text1 from "@/components/Text";

// Define the types for the authentication context
interface AuthContextType {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

// Define the LoginScreen component
export default function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState<string>(""); // Explicitly type as string
  const [password, setPassword] = useState<string>(""); // Explicitly type as string
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setIsLoggedIn } = useAuth() as AuthContextType; // Type assertion for useAuth context


  const handleLogin = (): void => {
    // Implement actual login logic
    // For now, just navigate to home
    setIsLoggedIn(true);
    router.replace("/(app)/(tabs)");
  };


  


  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState); // Toggle password visibility
  };




  return (
    <KeyboardAvoidingView style={{backgroundColor:'black', height:'100%', width:'100%',}}>
      <StatusBar barStyle="light-content" backgroundColor="black"/>


    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{flexDirection:'row', marginLeft: 22, marginTop: 55}}>
        <Image style={{width: 45, height: 45,}} source={logo}></Image>
      <Text1 style={{color:'white', fontSize: 26, fontWeight:'500', marginLeft: 7, marginTop: 3}}>Strength</Text1>
      </View>
 
      <View style={{width: '100%', height: '31%', marginTop: 20}}>
        <Image source={banner} style={{width: '100%', height: '100%',}} />
      </View>

      <View style={{ width: 290, marginTop: 8, marginLeft: 30}}>
      <Text1 style={{color:'white', fontSize: 35, fontWeight:'500'}}>Step Into the World of Sports</Text1>
      </View>

      <View style={{marginTop: 15, width: '100%', alignItems:'center'}}>
        <View>
        <Text1 style={{color:'white', fontSize: 13, fontWeight:'400'}}>Email or username</Text1>
      <TextInputSection
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // Optional: Ensure proper keyboard type
        autoCapitalize="none" />

      <Text1 style={{color:'white', fontSize: 13, fontWeight:'400', marginTop: 10}}>Password</Text1>
      <TextInputSection
        placeholder="Password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        customStyle={{paddingEnd: 55,}}
      />
      <TouchableOpacity activeOpacity={0.5} onPress={toggleShowPassword} style={{position:'absolute', top: 112, left: 288}}>
        <Text1 style={{color:'#12956B', fontSize: 13, fontWeight: '400'}}>{showPassword ? 'Hide' : 'Show'}</Text1>
        </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.5} style={{marginTop: 9}}>
        <Text1 style={{color:'#12956B', fontSize: 13.5, fontWeight:'400'}}>Forgot password?</Text1>
        </TouchableOpacity>
      </View>
      </View>

      <View style={{marginTop: 27, width: '100%', alignItems:'center'}}>
      <SignupButton  onPress={handleLogin}>
          <Text1 style={{color:'white', fontSize: 14.5, fontWeight:'500'}}>Sign in</Text1>
          </SignupButton>

          <TouchableOpacity  onPress={() => router.push("/option")} activeOpacity={0.5} style={{width: 335, height: 42, borderColor: 'white', borderWidth: 1, justifyContent:'center', alignItems:'center', marginTop: 10, borderRadius: 40}}>
          <Text1 style={{color:'white', fontSize: 14.5, fontWeight:'500'}}>New to Strength? Join now</Text1>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} style={{width: 335, height: 40, justifyContent:'center', alignItems:'center', marginTop: 3, borderRadius: 40, flexDirection: 'row'}}>
          <Text1 style={{color:'white', fontSize: 14.5, fontWeight:'500'}}>or continue with</Text1>
          <Image source={google} style={{width: 12, height: 12, marginLeft: 10, marginTop: 3.5}} />
          </TouchableOpacity>
      </View>
      </ScrollView>


   
    </KeyboardAvoidingView>
  );
}
