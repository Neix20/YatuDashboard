import React, { useEffect } from "react";

import { Text, BackHandler } from "react-native";
import { View, VStack } from "native-base";

import { BcTabNavigator, BcAdFullModal } from "@components";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useIsFocused, useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle } from "@hooks";
import { Utility } from "@utility";

function TabIconFontAwesome(props) {
    const { icon, title, color, focused, Btn } = props;

    const styles = {
        activeDot: {
            width: 5, height: 5, borderRadius: 5, backgroundColor: Utility.colorOpacity(color, 0.5)
        },
        inActiveDot: {
            width: 5, height: 5
        },
        textStyle: {
            color: color,
            fontSize: 10,
            fontFamily: "Roboto-Bold",
        }
    }

    return (
        <VStack flex={1} space={.5} alignItems={"center"} justifyContent={"center"}>
            <Btn name={icon} color={color} size={20} />
            <Text style={styles.textStyle}>{title}</Text>
            {
                (focused) ? (
                    <View style={styles.activeDot} />
                ) : (
                    <View style={styles.inActiveDot} />
                )
            }
        </VStack>
    )
}

// Screens
import Dashboard from "@screensLite/Dashboard";
import Device from "@screensLite/Device";
import Profile from "@screensLite/Profile";
import ProfileWorkspace from "@screensLite/ProfileWorkspace";
import Viewer from "@screensLite/Viewer";

let TabScreens = {};

TabScreens = {
    ...TabScreens,
    Dashboard: {
        component: Dashboard,
        title: "Dashboard",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                Btn={FontAwesome}
                icon={"area-chart"}
                title={"Dashboard"}
                {...props} />
        )
    },
    Device: {
        component: Device,
        title: "Device",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                Btn={FontAwesome}
                icon={"plug"}
                title={"Device"}
                {...props} />
        )
    },
    // Viewer: {
    //     component: Viewer,
    //     title: "Viewer",
    //     tabBarIcon: (props) => (
    //         <TabIconFontAwesome
    //             Btn={FontAwesome}
    //             icon={"eye"}
    //             title={"Viewer"}
    //             {...props} />
    //     )
    // },
    ProfileWorkspace: {
        component: ProfileWorkspace,
        title: "ProfileWorkspace",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                Btn={Ionicons}
                icon={"settings-sharp"}
                title={"Profile Selection"}
                {...props} />
        )
    },
    Profile: {
        component: Profile,
        title: "Profile",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                Btn={FontAwesome}
                icon={"user"}
                title={"Profile"}
                {...props} />
        )
    }
};

function Index(props) {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [adModal, setAdModal, toggleAdModal] = useToggle(false);

    // #region UseEffect
    useEffect(() => {
        // Disable Back Button
        const backAction = () => {
            if (!isFocused) {
                return false;
            }
            
            console.log("Hello World");
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isFocused]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            toggleAdModal();
        }, 3000)
        return () => clearTimeout(timeout);
    }, []);
    // #endregion

    const defaultScreen = "Dashboard";
    // const defaultScreen = "Profile";

    return (
        <>
            <BcAdFullModal showModal={adModal} setShowModal={setAdModal} ParamKey={"Yatu_Lite_AdUrl"} />
            <BcTabNavigator
                screens={TabScreens}
                defaultScreen={defaultScreen}
            />
        </>
    )
}

export default Index;