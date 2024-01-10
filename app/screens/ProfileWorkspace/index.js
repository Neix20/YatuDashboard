import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";
import { fetchGetParamApi } from "@api";

import { useToggle } from "@hooks";
import { ProfileWsData as TestData } from "./data";

// #region Custom Hook
function useProfileWs(val = []) {

    const [data, setData] = useState(val);

    const updateLs = (arr = []) => {
        if (arr.length > 0) {

            arr = arr.map((obj, index) => {
                const { Image = "https://i.imgur.com/Du4wGXQ.jpg" } = obj;
                return {
                    ...obj,
                    img: { uri: Image },
                    flag: false,
                    pos: index
                }
            });

            setData(_ => arr);
        }
    }

    const toggleFlag = (pos) => {
        let arr = [...data];

        // Set All Flag as False
        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;

        setData(_ => arr);
    }

    return [data, updateLs, toggleFlag];
}
// #endregion

// #region Components
function EmptyList(props) {

    const style = {
        txt: {
            fontSize: 18,
            color: "#d3d3d3",
            fontFamily: 'Roboto-Medium',
            fontWeight: "700"
        }
    }

    return (
        <View flexGrow={1} bgColor={"#FFF"}
            justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <Ionicons name={"settings-sharp"} color={"#e6e6e6"} size={80} />
                <Text style={style.txt}>No Purchases Yet</Text>
            </VStack>
        </View>
    )
}

function ProfileWsItem(props) {
    const { data = {}, onPress = () => { } } = props;

    const { Name, Description, img, flag = true } = data;
    const { InitialDate = "", ExpiryDate = "" } = data;

    const borderRadius = 8;

    const style = {
        icon: {
            height: 100,
            width: 100,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
        },
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
        },
        date: {
            fontFamily: "Roboto-Bold",
            fontSize: 14
        },
        frontLayer: {
            position: "absolute",
            zIndex: 2,
            top: 5, 
            right: 5 
        }
    };

    const borderColor = flag ? "#39B54A" : "#FFF";

    return (
        <TouchableOpacity onPress={onPress}>
            <BcBoxShadow style={{ borderRadius, width: "100%" }}>
                {/* Front Layer */}
                {flag ? (
                    <View style={style.frontLayer}>
                        <FontAwesome name={"check-circle"} size={24} color={"#39B54A"} />
                    </View>
                ) : (
                    <></>
                )}
                <HStack
                    bgColor={"#FFF"} borderRadius={borderRadius}
                    borderColor={borderColor} borderWidth={2}
                    alignItems={"center"}>
                    <Image source={img} alt={Name} style={style.icon} />
                    <VStack flex={1} px={3} py={2}
                        justifyContent={"space-between"}
                        style={{ height: 100 }}>
                        <VStack space={2}>
                            <Text style={style.title}>{Name}</Text>
                            <Text>{Description}</Text>
                        </VStack>
                        <HStack alignItems={"center"}
                            justifyContent={"space-between"}>
                            <Text style={style.date}>Expiry Date: </Text>
                            <Text style={style.date}>{Utility.formatDt(ExpiryDate, "yyyy-MM-dd")}</Text>
                        </HStack>
                    </VStack>
                </HStack>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

function ProfileWsLs(props) {

    const { data = [], onSelectItem = () => {} } = props;

    if (data.length == 0) {
        return (<EmptyList />);
    }


    const toast = useToast();
    const navigation = useNavigation();

    const renderItem = ({ item, index }) => {
        const onSelect = () => {
            // navigation.navigate("SubscriptionInfo", item);
            onSelectItem(index);
            toast.show({
                description: `Changed Workspace to ${item.Name}`
            })
        }
        return (<ProfileWsItem key={index} data={item} onPress={onSelect} />)
    }

    return (
        <VStack flex={1} py={3} space={2}
            bgColor={"#FFF"} alignItems={"center"}>
            <View width={"90%"} style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Active Profiles</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%" }}
                contentContainerStyle={{ padding: 2 }}
                ItemSeparatorComponent={<View style={{ height: 10 }} />} />
        </VStack>
    );
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [profileWsLs, setProfileWsLs, toggleProfileWsFlag] = useProfileWs();
    const loadingHook = useToggle(false);
    const [loading, setLoading, toggleLoading] = loadingHook;

    useEffect(() => {
        if (isFocused) {
            GetProfileWorkspaceData();
        }
    }, [isFocused]);

    // #region Api
    const GetProfileWorkspaceData = () => {
        setLoading(true);
        fetchGetParamApi({
            param: {
                ParamKey: "Temp_ProfileWorkspaceData"
            },
            onSetLoading: setLoading
        })
        .then(data => {
            const { content = [] } = data;
            setProfileWsLs(content);
        })
        .catch(err => {
            setLoading(false);
            console.error(err);
        })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Device Profiles</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ProfileWsLs 
                        data={profileWsLs}
                        onSelectItem={toggleProfileWsFlag}
                        loadingHook={loadingHook} />

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;