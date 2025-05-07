import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";
import { AntDesign, Octicons, Entypo } from "@expo/vector-icons";
import TextScallingFalse from "~/components/CentralText";
import PageThemeView from "~/components/PageThemeView";
import TextInputSection from "~/components/TextInputSection";
import logo from "@/assets/images/logo2.png";

type ConfirmCloseAccountViewProps = {
    onCancel: () => void;
    onSuccess: () => void;
}

const ConfirmCloseAccountView: React.FC<ConfirmCloseAccountViewProps> = ({ onCancel, onSuccess }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleDone = () => {
    // handle email/password confirmation logic here
    console.log("Email:", email, "Password:", password);
    setModalVisible(false); // close modal on success
  };

  return (
      <PageThemeView>
             <View style={{ padding: 25, width: "100%" }}>
               <TouchableOpacity onPress={onCancel}>
                 <Entypo name="cross" size={24} color="white" />
               </TouchableOpacity>
             </View>
             <View
               style={{
                 width: "100%",
                 justifyContent: "center",
                 alignItems: "center",
                 padding: 20,
               }}
             >
               <View style={{ justifyContent: "center", alignItems: "center" }}>
                 <Image style={{ width: 50, height: 50 }} source={logo} />
                 <TextScallingFalse
                   style={{ color: "white", fontSize: 13, fontWeight: "500" }}
                 >
                   Strength
                 </TextScallingFalse>
               </View>
             </View>
             <View style={{ width: "100%", padding: 30 }}>
               <TextScallingFalse
                 style={{
                   color: "white",
                   fontSize: 27,
                   fontWeight: "500",
                   width: 230,
                   lineHeight: 35,
                 }}
               >
                 Confirm your Email & password
               </TextScallingFalse>
             </View>
             <View
               style={{
                 width: "100%",
                 justifyContent: "center",
                 alignItems: "center",
                 gap: 20,
               }}
             >
               <View>
                 <TextScallingFalse style={styles.PasswordTextHeading}>
                   Email
                 </TextScallingFalse>
                 <TextInputSection
                   placeholder="Enter your email"
                   placeholderTextColor={"grey"}
                   value={email}
                   onChangeText={setEmail}
                 />
               </View>
               <View>
                 <TextScallingFalse style={styles.PasswordTextHeading}>
                   Password
                 </TextScallingFalse>
                 <TextInputSection
                   placeholder="Enter your email"
                   placeholderTextColor={"grey"}
                   secureTextEntry={!showPassword}
                   value={password}
                   onChangeText={setPassword}
                 />
                 <TouchableOpacity
                   style={{
                     alignSelf: "flex-end",
                     paddingTop: 10,
                     paddingLeft: 5,
                   }}
                   activeOpacity={0.5}
                   onPress={toggleShowPassword}
                 >
                   <TextScallingFalse
                     style={{ color: "#12956B", fontSize: 13, fontWeight: "400" }}
                   >
                     {showPassword ? "Hide Password" : "Show Password"}
                   </TextScallingFalse>
                 </TouchableOpacity>
               </View>
               <View style={{ paddingVertical: 30 }}>
                 <TouchableOpacity
                   activeOpacity={0.7}
                   style={styles.AccountCloseButtons}
                 >
                   <TextScallingFalse
                     style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
                   >
                     Done
                   </TextScallingFalse>
                 </TouchableOpacity>
               </View>
             </View>
           </PageThemeView>
  );
};

export default ConfirmCloseAccountView;

const styles = StyleSheet.create({
    AccountCloseButtons: {
      width: 220,
      paddingVertical: 10,
      backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
    },
    PasswordTextHeading: {
        color: "white",
        fontSize: 14,
      },
  });
