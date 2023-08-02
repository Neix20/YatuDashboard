import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView, PanResponder } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcSvgChart } from "@components";

import { iRData } from "@config";

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [chart, setChart] = useState([]);
    const [label, setLabel] = useState([]);

    const data = iRData["DCH-AHUX"]

    useEffect(() => {
        if (isFocused) {
            let val = data.slice(0, 100);
            val = val.map(obj => obj["Absolute_Humidity"]);

            setChart(val);

            val = data.slice(0, 100);
            val = val.map(obj => obj["Timestamp"]);
            val = val.map(obj => obj.replace(" ", "T"));
            val = val.map(obj => Utility.formatDt(obj, "hh:mm"));

            setLabel(val)
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
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>
                        <BcSvgChart
                            key={label.length}
                            data={chart} labels={label} />
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;