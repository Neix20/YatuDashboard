import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { BcHeaderWithAdd, BcLoading, BcSvgIcon, BcTooltip } from "@components";
import { useToggle, usePayDict } from "@hooks";

import { fetchSubscriptionProPlan } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { Body, EmptyList, Footer } from "./components";

// #region Components
function Logo(props) {

    const { img = {} } = props

    return (
        <VStack space={1} alignItems={"center"}>

            {/* Term */}
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 24
            }}>Yatu Pro</Text>

            {/* Logo */}
            <Image
                source={img}
                resizeMode={"contain"}
                style={{
                    height: 100,
                    width: 100,
                    borderRadius: 8
                }}
                alt={"Yatu Pro Subscription"}
            />
        </VStack>
    )
}

function InfoTooltip(props) {

    const { hook = [] } = props;
    const [open, setOpen, toggleOpen] = hook;

    const navigation = useNavigation();

    const style = {
        hyperlink: {
            textDecorationLine: "underline",
            fontFamily: "Roboto-Medium",
            color: "#3366CC"
        },
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 14,
            color: "#484848"
        }
    }

    const GoToTnc = () => {
        toggleOpen();
        navigation.navigate("Tnc");
    }

    const GoToPolicy = () => {
        toggleOpen();
        navigation.navigate("Policy");
    }

    const Tnc = () => (
        <TouchableOpacity onPress={GoToTnc}>
            <Text style={style.hyperlink}>Terms of use</Text>
        </TouchableOpacity>
    );

    const Policy = () => (
        <TouchableOpacity onPress={GoToPolicy}>
            <Text style={style.hyperlink}>Privacy Policy</Text>
        </TouchableOpacity>
    );

    return (
        <VStack>
            <Text style={{ textAlign: "justify", ...style.txt }}>Payment will be charged to your Payment Service at the confirmation of purchase. If you have paid for renewal service, your account will be charged for renewal within 24 hours prior to the end of the current period. You can cancel your subscriptions at any time.</Text>
            <HStack alignItems={"flex-start"} space={1.5}>
                <Text style={style.txt}>Read Subscription:</Text>
                <Tnc />
                <Text>&</Text>
                <Policy />
            </HStack>
        </VStack>
    )
}

function InfoIcon(props) {

    const openHook = useToggle(false);

    return (
        <BcTooltip hook={openHook}
            placement={"bottom"} bgColor={"#FFF"}
            modalBgColor={"rgba(0, 0, 0, 0.25)"} borderWidth={0}
            content={<InfoTooltip hook={openHook} />}>
            <BcSvgIcon name={"InfoIcon"} size={24} />
        </BcTooltip>
    )
}
// #endregion

function Content(props) {

    const { hook = [] } = props;
    const [payDict, setPayDict, payDictKey, payProImg] = hook;

    if (payDictKey.length <= 0) {
        return (
            <EmptyList />
        )
    }

    return (
        <VStack space={3} flexGrow={1}>
            {/* Logo */}
            <Logo img={payProImg} />

            <Body {...props} />
        </VStack>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const colors = {
        activeColor: "#2898FF",
        inActiveColor: "#FFF",
    }

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const payDictHook = usePayDict();
    const [payDict, setPayDict, payDictKey, payProImg] = payDictHook;
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            SubscriptionProPlan();
        }
    }, [isFocused]);
    // #endregion

    // #region Api
    const SubscriptionProPlan = () => {
        setLoading(true);
        fetchSubscriptionProPlan({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
        .then(data => {
            setPayDict(data);
        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`);
        })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#F3F8FC"} style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd Right={<InfoIcon />}>Subscription</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <Content hook={payDictHook} colors={colors} />

                    {/* Footer */}
                    <Footer />

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;