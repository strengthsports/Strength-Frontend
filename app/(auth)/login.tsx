import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView} from "react-native";
// import { useRouter } from "expo-router";
import { Image } from 'expo-image';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import "../../global.css"; 
import TextScallingFalse from "@/components/CentralText";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import logo from "@/assets/images/logo2.png"
import banner from "@/assets/images/banner-gif.gif"
import google from "@/assets/images/google.png"
import PageThemeView from "@/components/PageThemeView";
import Toast, { ToastConfig } from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();






  const handleLogin = async () => {
    // Email Validation
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Email is missing',
        visibilityTime: 1500,
        autoHide: true,
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Email is invalid',
        visibilityTime: 1500,
        autoHide: true,
      });
      return;
    }
  
    // Password Validation
    if (!password) {
      Toast.show({
        type: 'error',
        text2: 'Password is missing',
        visibilityTime: 1300,
        autoHide: true,
      });
      return;
    }
    if (password.length < 6) { // Example condition for invalid password
      Toast.show({
        type: 'error',
        text2: 'Password is invalid',
        visibilityTime: 1300,
        autoHide: true,
      });
      return;
    }
  
    try {
      // Attempt login
      await login(email, password);
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
      router.push('/(app)/(tabs)');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: err instanceof Error ? err.message : 'An unknown error occurred.',
      });
      console.error(err);
    }
  };





  const toastConfig: ToastConfig = {
    error: ({ text1, text2 }) => (
      <>
        {
          text1 ?
        <View style={{ backgroundColor: '#181818', padding: 10, borderRadius: 8, width: 200, justifyContent:'center', alignItems:'center'}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
        <MaterialCommunityIcons name="window-close" size={20} style={{marginTop: 1.5, marginLeft: -7}} color="red" />
        <Text style={{ color: 'white', fontSize: 15, fontWeight:'400', marginLeft: '6%'}}>{text1}</Text>
        </View>
        </View>
        :
        <View style={{ backgroundColor: '#181818', padding: 10, borderRadius: 8, width: 250, justifyContent:'center', alignItems:'center'}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
        <MaterialCommunityIcons name="window-close" size={20} style={{marginTop: 1.5, marginLeft: -4}} color="red" />
        <Text style={{ color: 'white', fontSize: 15, fontWeight:'400', marginLeft: '6%'}}>{text2}</Text>
        </View>
        </View>
        }
      </>
    ),
  };
  





const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState)
  };

  return (
    <PageThemeView>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{flexDirection:'row', marginLeft: 22, marginTop: 55}}>
        <Image style={{width: 45, height: 45,}} source={logo}></Image>
      <Text style={{color:'white', fontSize: 26, fontWeight:'500', marginLeft: 7, marginTop: 3}}>Strength</Text>
      </View>
 
      <View style={{width: '100%', height: '31%', marginTop: 20}}>
        <Image source={banner} style={{width: '100%', height: '100%',}} />
      </View>

      <View style={{ width: 290, marginTop: 10, marginLeft: 30}}>
      <TextScallingFalse style={{color:'white', fontSize: 35, fontWeight:'500'}}>Step Into the World of Sports</TextScallingFalse>
      </View>

      <View style={{marginTop: 15, width: '100%', alignItems:'center'}}>
        <View>
        <TextScallingFalse style={{color:'white', fontSize: 13, fontWeight:'400'}}>Email or username</TextScallingFalse>
      <TextInputSection
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // Optional: Ensure proper keyboard type
        autoCapitalize="none" />

      <TextScallingFalse style={{color:'white', fontSize: 13, fontWeight:'400', marginTop: 10}}>Password</TextScallingFalse>
      <TextInputSection
        placeholder="Password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        customStyle={{paddingEnd: 55,}}
        // secureTextEntry
      />



      {/* {inputError ? <Text style={{ color: "red", marginBottom: 10, textAlign: "center",}}>{inputError}</Text> : null}
      {error ? <Text style={{ color: "red", marginBottom: 10, textAlign: "center",}}>{error}</Text> : null} */}
      {/* {status && (
        <Text style={status === 200 ? styles.success : styles.error}>
          {status === 200 ? `` : `Error: ${msgBackend}`}
        </Text>
      )} */}
      {/* <Button  title="Login" onPress={handleLogin} /> */}
      {/* <Text className='text-red-600 text-2xl' >NativeWind Check</Text> */}
    {/* </SafeAreaView> */}
      


      <TouchableOpacity activeOpacity={0.5} onPress={toggleShowPassword} style={{position:'absolute', top: 112, left: 288}}>
        <TextScallingFalse style={{color:'#12956B', fontSize: 13, fontWeight: '400'}}>{showPassword ? 'Hide' : 'Show'}</TextScallingFalse>
        </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.5} style={{marginTop: 9}}>
        <TextScallingFalse style={{color:'#12956B', fontSize: 13.5, fontWeight:'400'}}>Forgot password?</TextScallingFalse>
        </TouchableOpacity>
      </View>
      </View>

      <View style={{marginTop: 27, width: '100%', alignItems:'center'}}>
      <SignupButton  onPress={handleLogin}>
          <TextScallingFalse style={{color:'white', fontSize: 14.5, fontWeight:'500'}}>Sign in</TextScallingFalse>
          </SignupButton>

          <TouchableOpacity  onPress={() => router.push("/option")} activeOpacity={0.5} style={{width: 335, height: 42, borderColor: 'white', borderWidth: 1, justifyContent:'center', alignItems:'center', marginTop: 10, borderRadius: 40}}>
          <TextScallingFalse style={{color:'white', fontSize: 14.5, fontWeight:'500'}}>New to Strength? Join now</TextScallingFalse>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} style={{width: 335, height: 40, justifyContent:'center', alignItems:'center', marginTop: 3, borderRadius: 40, flexDirection: 'row'}}>
          <TextScallingFalse style={{color:'white', fontSize: 14.5, fontWeight:'500'}}>or continue with</TextScallingFalse>
          <Image source={google} style={{width: 12, height: 12, marginLeft: 10, marginTop: 3.5}} />
          </TouchableOpacity>
      </View>
      <Toast config={toastConfig} />
      </ScrollView>
    </PageThemeView>
  );
}
