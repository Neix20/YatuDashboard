import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcSvgIcon, BcDisableII, BcFooter } from "@components";
import { useToggle } from "@hooks";
import { fetchRedeemToken } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Custom Hook
function useTokenCode() {
    const [query, setQuery] = useState("");
    const flag = query === "";
    return [query, setQuery, flag];
}
// #endregion

// #region Components
function Search(props) {

    const { queryHook = [] } = props;
    const [query, setQuery, queryFlag] = queryHook;

    const colors = {
        bg: "#EDEEEF",
        default: "#6A7683",
        txt: "#000"
    };

    const style = {
        txtInput: {
            fontSize: 14,
            fontFamily: "Roboto-Medium",
            paddingHorizontal: 16,
            color: colors.txt,
        },
        frontLayer: {
            position: "absolute",
            zIndex: 2,
            top: 0,
            bottom: 0,
            right: 16,
        }
    };

    const display = queryFlag ? "flex" : "none";

    return (
        <View width={"90%"} borderRadius={4}
            justifyContent={"center"}
            bgColor={colors.bg} style={{ height: 48 }}>
            <TextInput
                placeholder={"Token Code 12 Digits"}
                placeholderTextColor={colors.default}
                defaultValue={query}
                onChangeText={setQuery}
                style={style.txtInput}
            />

            {/* Front Layer */}
            <View display={display}
                justifyContent={"center"} style={style.frontLayer}>
                <FontAwesome name={"ticket"} size={20} color={colors.default} />
            </View>
        </View>
    )
}

function RedeemTokenBtn(props) {
    const { flag = true, onPress = () => { } } = props;

    const style = {
        txt: {
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
        }
    }

    const Elem = flag ? BcDisableII : TouchableOpacity;

    return (
        <Elem style={{ width: "80%", height: 60 }} onPress={onPress}>
            <View flex={1}
                backgroundColor={"#6c63ff"} borderRadius={12}
                alignItems={"center"} justifyContent={"center"}>
                <Text style={style.txt}>Redeem Token</Text>
            </View>
        </Elem>
    );
}

function TnC(props) {

    const arr = [
        "The token can only be utilized for the specified services as outlined in its details.",
        "The token is valid until the specified expiration date mentioned in the token details or as communicated by the issuer. Once redeemed, it cannot be refunded.",
        "Expired Tokens will not grant access to the subscribed services.",
        "The issuer reserves the right to refuse access or cancel the subscription if there is a reasonable belief of fraud, misuse, or violation of the terms and conditions.",
        "Any attempt to tamper with, alter, or duplicate the subscription may be considered fraudulent and could lead to legal action.",
    ];

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 24
        },
        description: {
            fontFamily: "Roboto-Medium",
            fontSize: 14
        }
    }

    const renderItem = (item, index) => (
        <Text key={index} style={style.description}>{'\u2B24'} {item}</Text>
    )

    return (
        <View p={3} width={"90%"}
            borderColor={"#000"} borderWidth={2}>

            {/* Title */}
            <View alignItems={"center"}
                justifyContent={"center"}
                style={{ height: 40 }}>
                <Text style={style.title}>Terms & Conditions</Text>
            </View>

            {/* Terms & Conditions */}
            <VStack space={3}>
                {arr.map(renderItem)}
            </VStack>
        </View>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const tokenCodeHook = useTokenCode();
    const [tokenCode, setTokenCode, tokenCodeFlag] = tokenCodeHook;

    const userId = useSelector(Selectors.userIdSelect);

    const RedeemToken = () => {
        setLoading(true);
        fetchRedeemToken({
            param: {
                UserId: userId,
                Token: tokenCode
            },
            onSetLoading: setLoading
        })
            .then(data => {
                const { ResponseCode = "00", ResponseMessage = "" } = data;
                if (ResponseCode === "00") {
                    GoToTokenSuccess();
                } else {
                    toast.show({
                        description: ResponseMessage
                    })
                }
                setTokenCode("");
            })
            .catch(err => {
                setLoading(false);
                console.error(`Error: ${err}`)
            })
    }

    const GoToTokenSuccess = () => {
        navigation.navigate("TokenSuccess", {
            Token: tokenCode
        });
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Redeem Tokens</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack
                            flexGrow={1} bgColor={"#FFF"}
                            pt={3} pb={5} space={5}>

                            {/* SVG Icon */}
                            <View alignItems={"center"}>
                                <BcSvgIcon name={"RedeemTokens"} width={300} height={200} />
                            </View>

                            {/* Text Input */}
                            <View alignItems={"center"}>
                                <Search queryHook={tokenCodeHook} />
                            </View>

                            {/* Terms & Conditions */}
                            <View alignItems={"center"}>
                                <TnC />
                            </View>
                        </VStack>

                    </ScrollView>

                    {/* Redeem Button */}
                    <BcFooter>
                        <RedeemTokenBtn flag={tokenCodeFlag} onPress={RedeemToken} />
                    </BcFooter>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;