import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg, clsConst } from "@config";

import { useDevDistChart, useChartSimple, useBarChartSimple } from "@hooks";
import { fetchGetDeviceDistribution } from "@api";

import { DevDistriData, ChartSimpleData, BarChartSimpleData } from "./data";

// #region Components
function DebugI(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Hooks
    const devDistChartHook = useDevDistChart();
    const [devDistChart, setDevDistChart, devDistChartLegend] = devDistChartHook;

    const chartSimpleHook = useChartSimple();
    const [smChart, setSmChart, sm1, sm2, sm3] = chartSimpleHook;

    const barChartSimpleHook = useBarChartSimple();
    const [bsmChart, setBsmChart, bsm1, bsm2, bsm3] = barChartSimpleHook;
    // #endregion

    useEffect(() => {
        if (isFocused) {
            setDevDistChart(DevDistriData);
            setSmChart(ChartSimpleData);
            setBsmChart(BarChartSimpleData);
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>
                        <View alignItems={"center"}>
                            <Text>This is Yatu Pro Page</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}
// #endregion

import { BcSvgIcon, BcQrCameraBtn } from "@components";
import { useModalToast, useTimer } from "@hooks";

function DebugII(props) {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [qrCode, setQrCode] = useState("");

    const [mToast, showMsg] = useModalToast();

    const onScanQr = (value) => {
        showMsg(value);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <BcQrCameraBtn cusToast={mToast} onScanQr={onScanQr} />
            </View>
        </SafeAreaView>
    )
}

import { LogLevel, OneSignal } from 'react-native-onesignal';

// Add OneSignal within your App's root component
function Index() {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [timer, setTimer] = useTimer(60);
    const [timer2, setTimer2] = useTimer(15);

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
        },
        timer: {
            color: "#F00"
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}
                contentContainerStyle={{ flexGrow: 1 }}>
                <VStack flexGrow={1} space={3}
                    alignItems={"center"}
                    justifyContent={"center"}>
                    <Text>This is to test Download Progress</Text>
                    <Text style={style.title}>Time Left: <Text style={style.timer}>{timer}</Text> seconds</Text>
                    <Text style={style.title}>Time Left: <Text style={style.timer}>{timer2}</Text> seconds</Text>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    )

}

export default Index;