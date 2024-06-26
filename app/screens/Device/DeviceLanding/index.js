import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Images } from "@config";

import { BcBoxShadow, BcLoading } from "@components";

import { fetchDeviceInfo } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import ItemPanel from "./ItemPanel";

// #region Components
function Header(props) {

    const { children, onBack = () => { } } = props;
    const { onSelectEdit = () => { } } = props;

    const navigation = useNavigation();

    const toast = useToast();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <View
            p={2}
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
            style={{
                height: 60
            }}>
            {/* Front Layer */}
            <TouchableOpacity
                onPress={GoBack}
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 120,
                    height: 120,
                    position: "absolute",
                    left: -30,
                    top: -19,
                    zIndex: 1,
                }}>
                <FontAwesome5 name={"chevron-left"} size={20} color={"#FFF"} />
            </TouchableOpacity>

            <View style={{
                position: "absolute",
                height: 120,
                left: 45,
                top: -20,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#FFF",
                }}>{children}</Text>
            </View>

            {/* <TouchableOpacity onPress={onSelectEdit}>
                <FontAwesome5 name={"edit"} size={24} color={"#FFF"} />
            </TouchableOpacity> */}
        </View>
    )
}

function DeviceDataPanel(props) {
    const { Title, IsTempHumd = 1, IsSmartPlug = 1, MetaData = {}, Device_Model } = props;

    if (IsSmartPlug == 1) {

        const { Current, Power, Voltage } = MetaData;

        return (
            <VStack space={5} height={"100%"}
                alignItems={"center"} justifyContent={"flex-end"}>
                <View alignItems={"center"}>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: "Roboto-Medium",
                        color: "#FFF"
                    }}>{Title}</Text>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: "Roboto-Medium",
                        color: "#FFF"
                    }}>Model: {Device_Model}</Text>
                </View>
                <HStack width={"90%"}
                    alignItems={"center"} justifyContent={"space-between"}>
                    <VStack alignItems={"center"} flex={1}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: "Roboto-Medium",
                            color: "#FFF",
                            textAlign: "center",
                        }}>Current</Text>
                        <Text style={{
                            fontSize: 28,
                            fontFamily: "Roboto-Bold",
                            color: "#FFF"
                        }}>{(Current / 100).toFixed(2)} A</Text>
                    </VStack>
                    <Divider orientation={"vertical"} style={{ width: 3 }} bgColor={"#FFF"} />
                    <VStack alignItems={"center"} flex={1}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: "Roboto-Medium",
                            color: "#FFF",
                            textAlign: "center",
                        }}>Voltage</Text>
                        <Text style={{
                            fontSize: 28,
                            fontFamily: "Roboto-Bold",
                            color: "#FFF"
                        }}>{(Voltage / 100).toFixed(2)} V</Text>
                    </VStack>
                    <Divider orientation={"vertical"} style={{ width: 3 }} bgColor={"#FFF"} />
                    <VStack alignItems={"center"} flex={1}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: "Roboto-Medium",
                            color: "#FFF",
                            textAlign: "center",
                        }}>Power</Text>
                        <Text style={{
                            fontSize: 28,
                            fontFamily: "Roboto-Bold",
                            color: "#FFF"
                        }}>{(Power / 100).toFixed(2)} W</Text>
                    </VStack>
                </HStack>
            </VStack>
        )
    }

    if (IsTempHumd == 1) {

        const Temperature = MetaData["Temperature (℃)"];
        const RH_Humidity = MetaData["Relative Humidity (%)"];
        const AH_Humidity = MetaData["Absolute Humidity"];

        return (
            <VStack space={5} height={"100%"}
                alignItems={"center"} justifyContent={"flex-end"}>
                <View alignItems={"center"}>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: "Roboto-Medium",
                        color: "#FFF"
                    }}>{Title}</Text>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: "Roboto-Medium",
                        color: "#FFF"
                    }}>Model: {Device_Model}</Text>
                </View>
                <HStack width={"90%"}
                    alignItems={"center"} justifyContent={"space-between"}>
                    <VStack alignItems={"center"} flex={1.2}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: "Roboto-Medium",
                            color: "#FFF",
                            textAlign: "center",
                        }}>Temperature</Text>
                        <Text style={{
                            fontSize: 28,
                            fontFamily: "Roboto-Bold",
                            color: "#FFF"
                        }}>{(Temperature * 1).toFixed(1)} ℃</Text>
                    </VStack>
                    <Divider orientation={"vertical"} style={{ width: 3 }} bgColor={"#FFF"} />
                    <VStack alignItems={"center"} flex={1}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: "Roboto-Medium",
                            color: "#FFF",
                            textAlign: "center",
                        }}>Relative Humidity</Text>
                        <Text style={{
                            fontSize: 28,
                            fontFamily: "Roboto-Bold",
                            color: "#FFF"
                        }}>{RH_Humidity} %</Text>
                    </VStack>
                    <Divider orientation={"vertical"} style={{ width: 3 }} bgColor={"#FFF"} />
                    <VStack alignItems={"center"} flex={1}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: "Roboto-Medium",
                            color: "#FFF",
                            textAlign: "center",
                        }}>Absolute Humidity</Text>
                        <Text style={{
                            fontSize: 28,
                            fontFamily: "Roboto-Bold",
                            color: "#FFF"
                        }}>{AH_Humidity} %</Text>
                    </VStack>
                </HStack>
            </VStack>
        )
    }

    return (
        <VStack space={5} height={"100%"}
            alignItems={"center"} justifyContent={"flex-end"}>
            <View alignItems={"center"}>
                <Text style={{
                    fontSize: 24,
                    fontFamily: "Roboto-Medium",
                    color: "#FFF"
                }}>{Title}</Text>
                <Text style={{
                    fontSize: 18,
                    fontFamily: "Roboto-Medium",
                    color: "#FFF"
                }}>Model: {Device_Model}</Text>
            </View>
        </VStack>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Initital
    const init = {
        svgLs: []
    }
    // #endregion

    const userId = useSelector(Selectors.userIdSelect);

    // #region Props
    const item = props.route.params;
    const { Id: deviceId } = item;
    // #endregion

    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchDeviceInfo({
                param: {
                    UserId: userId,
                    DeviceId: deviceId,
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    setDeviceInfo(data)
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [deviceId]);

    // #region Navigation
    const GoToInfo = () => navigation.navigate("DeviceInfo", deviceInfo);
    const GoToChart = () => navigation.navigate("DeviceChart", deviceInfo);
    const GoToTable = () => navigation.navigate("DeviceTable", deviceInfo);
    const GoToRules = () => navigation.navigate("DeviceRulesInfo", deviceInfo);
    // #endregion

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { ManageDeviceRules = -1} = subUserAccess;

    const { Online_Status = 0 } = deviceInfo;
    const { IsTempHumd = 0, IsSmartPlug = 0, IsAirQuality = 0, IsAirCon = 0, IsSmartCamera = 0 } = deviceInfo;

    let ind = -1;

    if (IsTempHumd != 1) {
        ind = 2;
    } else {
        ind = 3;
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Background */}
                    <View flexGrow={1}>
                        <View flex={.4} backgroundColor={"#000"}>
                            
                        </View>
                    </View>

                    <View position={"absolute"}
                        style={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                        {/* Header */}
                        <Header onSelectEdit={GoToInfo}>Device Information</Header>

                        <View style={{ height: 10 }} />

                        {/* Body */}
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1 }}>
                            <VStack flexGrow={1} alignItems={"center"} space={3}>
                                <View flex={.25}>
                                    <DeviceDataPanel {...deviceInfo} />
                                </View>
                                <VStack
                                    flex={.75} space={5} width={"100%"} alignItems={"center"}>
                                    <ItemPanel Icon={FontAwesome5} name={"power-off"} disabled={true} onPress={() => { }}>
                                        <Text style={{
                                            fontSize: 18,
                                            fontFamily: "Roboto-Medium",
                                        }}>
                                            <Text>Status: </Text>
                                            <Text key={Online_Status} style={{
                                                color: (Online_Status == 1) ? "#0F0" : "#F00"
                                            }}>{Online_Status == 1 ? "Online" : "Offline"}</Text>
                                        </Text>
                                    </ItemPanel>
                                    <ItemPanel Icon={FontAwesome5} name={"info-circle"} onPress={GoToInfo}>Device Info</ItemPanel>
                                    {/* { (ManageDeviceRules == 1) ? <ItemPanel Icon={FontAwesome5} name={"clipboard-list"} onPress={GoToRules}>Device Rules</ItemPanel> : <></>} */}
                                    { (true) ? <ItemPanel Icon={FontAwesome5} name={"clipboard-list"} onPress={GoToRules}>Device Rules</ItemPanel> : <></>}

                                    {/* <ItemPanel Icon={FontAwesome5} name={"bell"} onPress={GoToAlert}>Device Alert</ItemPanel> */}
                                    {
                                        (IsTempHumd == 1) ? (
                                            <>
                                                <ItemPanel Icon={FontAwesome5} name={"chart-area"} onPress={GoToChart}>Data Chart</ItemPanel>
                                                <ItemPanel Icon={FontAwesome5} name={"table"} onPress={GoToTable}>Data Table</ItemPanel>
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </VStack>
                            </VStack>
                        </ScrollView>

                        {/* Footer */}
                        {/* <View style={{ height: 60 }} /> */}
                    </View>
                </View>
            </SafeAreaView>

        </>
    );
}

export default Index;