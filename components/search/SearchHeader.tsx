import { TouchableOpacity, View} from "react-native";
import { useRouter } from "expo-router"; // Import router
import SearchIcon from "../SvgIcons/Common_Icons/SearchIcon";
import TextScallingFalse from "../CentralText";

const SearchHeader = () => {
  const router = useRouter(); // Use router for navigation

  return (
    <View className="flex-row my-3 px-5">
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex-row bg-[#1E1E1E] rounded-3xl px-4 py-[10.2px] h-[40px] border-[0.5px] border-[#343434] items-center flex-1"
      onPress={() => router.push("/(app)/searchPage")}
    >
      {/* <Feather name="search" size={22} color="grey" /> */}
      <SearchIcon />
      <TextScallingFalse className="text-3xl pl-3 text-[#808080]">
        Search...
      </TextScallingFalse>
    </TouchableOpacity>
  </View>
  );
};

export default SearchHeader;
