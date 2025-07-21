import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet} from 'react-native';

import LiteracyScreen from './src/screens/LiteracyScreen';
import PronunciationScreen from './src/screens/PronunciationScreen';
import HandwritingScreen from './src/screens/HandwritingScreen';
import ProgressScreen from './src/screens/ProgressScreen';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName: string;

              if (route.name === '识字') {
                iconName = 'text-fields';
              } else if (route.name === '发音') {
                iconName = 'mic';
              } else if (route.name === '手写') {
                iconName = 'edit';
              } else if (route.name === '进度') {
                iconName = 'trending-up';
              } else {
                iconName = 'help';
              }

              return <Icon name={iconName} size={size * 1.5} color={color} />;
            },
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
          })}>
          <Tab.Screen name="识字" component={LiteracyScreen} />
          <Tab.Screen name="发音" component={PronunciationScreen} />
          <Tab.Screen name="手写" component={HandwritingScreen} />
          <Tab.Screen name="进度" component={ProgressScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#2196F3',
    height: 80,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;
