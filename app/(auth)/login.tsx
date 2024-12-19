import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, StatusBar, ScrollView, Button, ToastAndroid} from "react-native";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import "../../global.css"; 
import Text1 from "@/components/Text";
import TextInputSection from "@/components/TextInputSection";
import SignupButton from "@/components/SignupButton";
import logo from "@/assets/images/logo2.png"
import banner from "@/assets/images/banner-gif.gif"
import google from "@/assets/images/google.png"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxStore";
import { loginUser, resetAuthState } from "@/reduxStore/slices/authSlice";

export default function LoginScreen() {

  const dispatch = useDispatch<AppDispatch>();
  const { error, msgBackend} = useSelector((state: RootState) => state.auth);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setInputError("Both email and password are required.");
      return;
    }

    setInputError("");
    dispatch(resetAuthState());

    try {
      await dispatch(loginUser({ email, password })).unwrap();

      console.log('backend - ',msgBackend )
      ToastAndroid.show(msgBackend || "Login successful!", ToastAndroid.SHORT);
      router.push("/(app)/(tabs)");
    } catch (err) {
      ToastAndroid.show(err as string, ToastAndroid.SHORT);
      console.log('err - ',err )
    }
  };
  
  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     setInputError("Both email and password are required.");
  //     return;
  //   }
  //   setInputError("")

  //   try {
  //     await login(email, password);
  //     router.push('/(app)/(tabs)')
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       console.error("Login failed:", err.message);
  //     } else {
  //       console.error("Login failed:", err);
  //     }
  //   } finally {
  //     if (isLoggedIn) { <Redirect href="/(app)/(tabs)" />}
  //   }
  // };

const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState)
  };

  return (
    <KeyboardAvoidingView style={{backgroundColor:'black', height:'100%', width:'100%',}}>
      <StatusBar barStyle="light-content" backgroundColor="black"/>


    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{flexDirection:'row', marginLeft: 22, marginTop: 55}}>
        <Image style={{width: 45, height: 45,}} source={logo}></Image>
      <Text style={{color:'white', fontSize: 26, fontWeight:'500', marginLeft: 7, marginTop: 3}}>Strength</Text>
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
        // secureTextEntry
      />
      {inputError ? <Text style={{ color: "red", marginBottom: 10, textAlign: "center",}}>{inputError}</Text> : null}
      {error ? <Text style={{ color: "red", marginBottom: 10, textAlign: "center",}}>{error}</Text> : null}
      {/* {status && (
        <Text style={status === 200 ? styles.success : styles.error}>
          {status === 200 ? `` : `Error: ${msgBackend}`}
        </Text>
      )} */}
      {/* <Button  title="Login" onPress={handleLogin} /> */}
      {/* <Text className='text-red-600 text-2xl' >NativeWind Check</Text> */}
    {/* </SafeAreaView> */}
      
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
