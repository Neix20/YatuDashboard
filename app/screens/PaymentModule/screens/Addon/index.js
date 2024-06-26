import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, ImageBackground, SafeAreaView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcBoxShadow } from "@components";

// #region Custom Hooks
function useSubLs(data = []) {
    const [ls, setLs] = useState(data);

    useEffect(() => {
        let arr = [...data];

        arr = arr.map((obj, index) => {
            const { img } = obj;
            return {
                ...obj,
                img: { uri: img },
                flag: false,
                pos: index
            }
        });

        setLs(_ => arr);
    }, []);

    return [ls, setLs];
}

function useFlagLs(length = 1) {
    const [ls, setLs] = useState([]);

    useEffect(() => {
        let arr = [];
        for (let ind = 0; ind < length; ind += 1) {
            const obj = {
                flag: false,
                pos: ind
            }
            arr.push(obj);
        }
        setLs(_ => arr);
    }, []);

    const toggleItem = (item) => {
        const { pos } = item;

        let arr = [...ls];

        for (let ind = 0; ind < arr.length; ind += 1) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;

        setLs(_ => arr);
    }

    return [ls, toggleItem];
}
// #endregion

// #region Components
function PaymentHeaderItem(props) {

    const { flag = false, onPress = () => { } } = props;
    const { title, price, description } = props;

    // const clr = flag ? "#F01421" : "#98A0A8";
    const clr = "#F01421";

    return (
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <VStack p={1} borderRadius={8} borderWidth={2} borderColor={clr} space={2}>
                <View alignItems={"flex-end"}>
                    <View style={{ height: 5, width: 5 }}>
                        {/* {
                            (flag) ? <FontAwesome name={"check-circle"} size={18} color={clr} /> : <></>
                        } */}
                    </View>
                </View>
                <View alignItems={"flex-start"}>
                    <View py={1} px={2}
                        borderRadius={4}
                        bgColor={"rgba(255, 0, 0, 0.3)"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 14,
                            color: "#F01421",
                        }}>{title}</Text>
                    </View>
                </View>
                <HStack px={1} flexWrap={"wrap"} alignItems={"flex-start"} space={1}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 16
                    }}>{price}</Text>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 12
                    }}>RM</Text>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 12,
                        color: "#98A0A8"
                    }}>/mo.</Text>
                </HStack>
                <View px={1}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 12,
                        color: "#F01421"
                    }}>{description}</Text>
                </View>
            </VStack>
        </TouchableOpacity>
    )
}

function PaymentHeader(props) {

    // const [flagLs, toggleFlag] = useFlagLs(3);

    // if (flagLs.length <= 0) {
    //     return <></>
    // }

    const desc = {
        title: "Get More Value with Add-Ons!",
        description: "Transform your gadget into a powerhouse with our carefully crafted modules!",
        caption: "Get the latest technology at your fingertips!"
    }

    const { title, description, caption } = desc;

    return (
        <HStack alignItems={"center"} justifyContent={"space-between"}
            width={"90%"} style={{ paddingHorizontal: 2 }}>


            <VStack flex={1}>
                {/* Title */}
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18,
                    color: "#000"
                }}>{title}</Text>

                {/* Description */}
                <Text>{description}</Text>

                {/* Caption */}
                <Text style={{ fontStyle: "italic", fontSize: 16, textAlign: "center" }}>{caption}</Text>
            </VStack>

            <Image
                source={Images.paymentII}
                resizeMode={"cover"}
                style={{ width: 100, height: 100 }} />

        </HStack>
    )

    return (
        <VStack space={2} width={"90%"}
            style={{ paddingHorizontal: 2 }}>

            {/* Title */}
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 16,
            }}>Payment Plans</Text>

            <View width={"100%"} style={{ height: 100 }}>
                <PaymentHeaderItem flag={flagLs[2].flag} onPress={() => toggleFlag(flagLs[2])} title={"Free"} price={(69.99).toFixed(2)} description={`RM ${(69.99).toFixed(2)} billed annually`} />
            </View>

            {/* <HStack space={2}>
                <PaymentHeaderItem flag={flagLs[0].flag} onPress={() => toggleFlag(flagLs[0])} title={"Free"} price={`0${(0).toFixed(2)}`} description={`RM ${(0).toFixed(2)} billed annually`} />
                <PaymentHeaderItem flag={flagLs[1].flag} onPress={() => toggleFlag(flagLs[1])} title={"Standard"} price={(29.99).toFixed(2)} description={`RM ${(29.99).toFixed(2)} billed annually`} />
                <PaymentHeaderItem flag={flagLs[2].flag} onPress={() => toggleFlag(flagLs[2])} title={"Premium"} price={(69.99).toFixed(2)} description={`RM ${(69.99).toFixed(2)} billed annually`} />
            </HStack> */}

        </VStack>
    )
}

function PaymentBodyItem(props) {
    const { data = {}, onPress = () => { } } = props;
    const { Name, Description, img, flag, pos } = data;

    const borderRadius = 8;

    return (
        <>
            <TouchableOpacity onPress={onPress}>
                <BcBoxShadow style={{ borderRadius, width: "100%" }}>
                    <HStack bgColor={"#FFF"}
                        borderRadius={borderRadius}
                        alignItems={"center"}>
                        <Image
                            source={img}
                            style={{
                                height: 100,
                                width: 100,
                                borderTopLeftRadius: borderRadius,
                                borderBottomLeftRadius: borderRadius,
                            }}
                            alt={Name}
                        />
                        <VStack px={3} flex={1} justifyContent={"center"}
                            space={2} style={{ height: 100 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16,
                            }}>{Name}</Text>
                            <Text>{Description}</Text>
                        </VStack>
                    </HStack>
                </BcBoxShadow>
            </TouchableOpacity>
            <View style={{ height: 10 }} />
        </>
    )
}

function PaymentBody(props) {

    const { hook = [] } = props;
    const [ls, setLs] = hook;

    const renderItem = ({ item, index }) => {

        const { goToFunc = () => { } } = item;

        // const onPress = () => toggleItem(item);
        const onPress = () => goToFunc();
        return (
            <PaymentBodyItem key={index}
                onPress={onPress}
                data={item} />
        )
    }

    return (
        <VStack width={"90%"} flex={1} space={2}>
            <View style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Modules</Text>
            </View>
            <FlatList
                data={ls}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 2 }}
            />
        </VStack>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const GoToStorage = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Term: "MSP_SM"
        });
    }
    const GoToEmail = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Term: "MSP_EM"
        });
    }
    const GoToRealTimeData = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Term: "MSP_RTM",
        });
    }

    const GoToUser = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Term: "MSP_UM",
        });
    }

    const GoToSubscription = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Term: "MSP_SP",
        });
    }

    const data = [
        {
            "Name": "Storage Module",
            "Description": "Storage Fee 1 Year Data Keeping",
            "img": "https://i.imgur.com/dQDxXYa.png",
            goToFunc: GoToStorage,
        },
        {
            "Name": "Subscription Module",
            "Description": "Subscription Module",
            "img": "https://i.imgur.com/nQCj6ea.png",
            goToFunc: GoToSubscription,
        },
        {
            "Name": "Email Module",
            "Description": "Archive Report Using Email",
            "img": "https://i.imgur.com/Cxr2xHH.png",
            goToFunc: GoToEmail,
        },
        {
            "Name": "Real-Time Data Module",
            "Description": "Real-Time Data Module",
            "img": "https://i.imgur.com/Y8RQ5pQ.png",
            goToFunc: GoToRealTimeData,
        },
        {
            "Name": "User Module",
            "Description": "User Module",
            "img": "https://i.imgur.com/q8FTn1s.png",
            goToFunc: GoToUser,
        }
    ];

    const dataHook = useSubLs(data);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#FFF"} style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>Payment Subscription</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <VStack flexGrow={1} space={2} alignItems={"center"}>
                    <PaymentHeader />
                    {/* Body */}
                    <PaymentBody hook={dataHook} />
                </VStack>
            </View>
        </SafeAreaView>
    );
}

export default Index;