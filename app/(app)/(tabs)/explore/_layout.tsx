import type {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    } from '@react-navigation/material-top-tabs';
    import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
    import {
    useTheme,
    type ParamListBase,
    type TabNavigationState,
    } from '@react-navigation/native';
    import { withLayoutContext } from 'expo-router';
import { View } from 'react-native';
    
    const { Navigator } = createMaterialTopTabNavigator();
    
    const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
    >(Navigator);
    
    export default function MaterialTopTabsLayout() {
    const { colors } = useTheme();
    return (
    <>
        <View className="h-12 w-48 m-6 bg-slate-700">

        </View>
      <MaterialTopTabs
        initialRouteName='index'
        screenOptions={{
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: 'grey',
          swipeEnabled:false,
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: 'capitalize',
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.text,
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 'auto', minWidth: 100 },
        }}
      >
        <MaterialTopTabs.Screen
          name='index'
          options={{
            title: 'Blue',
          }}
        />
        <MaterialTopTabs.Screen
          name='red'
          options={{
            title: 'Red',
          }}
        />
        <MaterialTopTabs.Screen
          name='green'
          options={{
            title: 'Green',
          }}
        />

      </MaterialTopTabs>
      
      </>
      );
    }