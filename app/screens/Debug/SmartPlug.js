import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";

import { Images, Svg } from "@config";
import { SmartPlugIIData, DashboardSmartPlugData } from "@config";

import { BcApacheBarChart } from "@components";

import { useOrientation } from "@hooks";

import { DateTime } from "luxon";

// #region Hooks
function useBarChart() {

    const [chart, setChart] = useState([]);
    const [chartData, setChartData] = useState({});

    const [chartLegend, setChartLegend] = useState([])

    useEffect(() => {
        if (chart.length > 1) {

            const obj = { ...chart[0] };
            delete obj["Device_Id"];

            let ts = chart.map(x => x["Timestamp"]);

            const label = ts.map(x => DateTime.fromISO(x).toFormat("MM-dd"));

            delete obj["Timestamp"];

            const keys = Object.keys(obj);
            setChartLegend(keys);

            let min_val = Number.MAX_VALUE;
            let max_val = Number.MIN_VALUE;

            let dataset = [];

            for (const key of keys) {
                let val = chart.map(x => x[key]);
                val = val.map(x => +x);

                if (val.length == 0) continue;

                min_val = Math.min(...val, min_val);
                max_val = Math.max(...val, max_val);

                let obj = {
                    name: key,
                    data: val
                }

                dataset.push(obj);
            }

            let dict = {
                label,
                dataset,
                min: min_val,
                max: max_val
            };

            setChartData(dict);
        }
    }, [chart]);

    return [chart, setChart, chartData, setChartData, chartLegend];
}
// #endregion

// #region Components
function LandingHeaderTxt(props) {
    const { Title = "", Value = "" } = props;
    return (
        <VStack alignItems={"center"}>
            <Text style={{
                fontSize: 18,
                color: "#b2d9c8"
            }}>{Value}</Text>
            <Text style={{
                fontSize: 14,
                color: "#b2d9c8"
            }}>{Title}</Text>
        </VStack>
    )
}

function LandingInfo(props) {
    const { Title = "", Value = "", width = 400 } = props;
    return (
        <View
            alignItems={"center"}
            justifyContent={"center"}
            borderWidth={2}
            borderColor={"#b2d9c8"}
            borderRadius={width * 0.4}
            style={{
                width: width * 0.8,
                height: width * 0.8
            }}>

            <View
                borderWidth={2}
                borderStyle={"dashed"}
                borderColor={"#b2d9c8"}
                borderRadius={width * 0.38}
                style={{
                    position: "absolute",
                    width: width * 0.76,
                    height: width * 0.76
                }}>

            </View>

            <View>
                <Text style={{
                    fontSize: 64,
                    fontFamily: "Roboto-Bold",
                    color: "#b2d9c8"
                }}>{Value}</Text>
            </View>

            {/* Bottom Tab */}
            <View
                bgColor={"#392c44"}
                alignItems={"center"}
                // justifyContent={"center"}
                style={{
                    position: "absolute",
                    bottom: -10,
                    width: width * 0.5,
                    height: 60
                }}>
                <Text style={{
                    fontSize: 16,
                    fontFamily: "Roboto-Medium",
                    color: "#b2d9c8"
                }}>{Title}</Text>
            </View>
        </View>
    )
}

function Header(props) {
    const { children } = props;

    const navigation = useNavigation();
    const goBack = () => {
        navigation.goBack();
    }

    return (
        <View pb={2} justifyContent={"flex-end"}
            style={{ height: 60 }}>
            <HStack px={3}
                alignItems={"center"} justifyContent={"space-between"}>
                <TouchableOpacity onPress={goBack}>
                    <View alignItems={"center"} justifyContent={"center"}
                        style={{ width: 40, height: 40 }}>
                        <FontAwesome5 name={"arrow-left"} color={"#FFF"} size={20} />
                    </View>
                </TouchableOpacity>

                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 20,
                    color: "#FFF",
                }}>{children}</Text>

                <View style={{ width: 40, height: 40 }}></View>
            </HStack>
        </View>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { Current, Power, Voltage, KWh } = SmartPlugIIData;

    const color = ["#392c44", "#b2d9c8"];

    const orientHook = useOrientation();
    const [width, height] = orientHook.slice(0, 2);

    const [chart, setChart, chartData, setChartData, chartLegend] = useBarChart();

    useEffect(() => {
        if (isFocused) {
            setChart(DashboardSmartPlugData);
        }
    }, [isFocused]);

    const barChartHook = [chart, setChart, "", null, chartData, setChartData, chartLegend, null, null];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }} bgColor={"#392c44"}>

                {/* Header */}
                <Header>Smart Plug</Header>

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <VStack flexGrow={1} space={3}>
                        <View alignItems={"center"}>
                            <LandingInfo Title={"Total (KWh)"} Value={KWh} width={width} />
                        </View>

                        <View alignItems={"center"}>
                            <HStack width={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                                <LandingHeaderTxt Title={"Current(mA)"} Value={Current} />
                                <LandingHeaderTxt Title={"Power(W)"} Value={Power} />
                                <LandingHeaderTxt Title={"Voltage(V)"} Value={Voltage} />
                                <LandingHeaderTxt Title={"Total(KWh)"} Value={KWh} />
                            </HStack>
                        </View>

                        <View alignItems={"center"} bgColor={"#FFF"} py={3}>
                            <BcApacheBarChart hook={barChartHook} height={240} />
                        </View>
                    </VStack>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;