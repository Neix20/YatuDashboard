import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { fetchProfileInfo, fetchUpdateProfile } from "@api";

import { BcLoading, BcBoxShadow, BcDisable, BcHeaderWithAdd } from "@components";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle } from "@hooks";

// #region Components
function InfoItem(props) {
    const { Title, Value, Placeholder = "", onChangeValue = () => { }, Editable = true } = props;
    return (
        <HStack width={"90%"}
            alignItems={"center"}
            style={{ height: 48 }}>
            <View flex={.3}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18
                }}>{Title}: </Text>
            </View>
            <View flex={.7}>
                <TextInput
                    editable={Editable}
                    defaultValue={Value}
                    onChangeText={onChangeValue}
                    placeholder={Placeholder}
                    autoCapitalize={"none"}
                    style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#000",
                    }} />
            </View>
        </HStack>
    )
}

function HeaderRight(props) {
    const { flag = true, showFlag = true, onSelect = () => { } } = props;

    if (!flag) {
        return (<></>)
    }

    const Item = () => (
        <Text style={{
            fontSize: 20,
            color: Utility.getColor()
        }}>Save</Text>
    )

    return (showFlag) ? (
        <TouchableOpacity onPress={onSelect}>
            <Item />
        </TouchableOpacity>
    ) : (
        <BcDisable>
            <Item />
        </BcDisable>
    )
}

function InfoPassword(props) {
    const { Title, Value, onChangeValue = () => { } } = props;
    return (
        <HStack width={"90%"}
            alignItems={"center"}
            style={{ height: 48 }}>
            <View flex={.3}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18
                }}>{Title}: </Text>
            </View>
            <View flex={.7}>
                <TextInput
                    secureTextEntry
                    defaultValue={Value}
                    onChangeValue={onChangeValue}
                    placeholder={""}
                    autoCapitalize={"none"}
                    style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#000",
                    }} />
            </View>
        </HStack>
    )
}

function InfoPanel(props) {

    const { hook = [] } = props;
    const [profile, setProfile, onChangeUsername, onChangeMobileNo, onChangeEmail, onChangeAddress, onChangeTariffType] = hook;

    const { Username, MobileNo, Email, TariffType } = profile;

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    const AccountStatus = (val = 1) => {
        val = +val;

        let dict = {
            1: {
                color: "#000",
                term: "Free"
            },
            2: {
                color: Utility.getColor(),
                term: "Standard"
            },
            3: {
                color: "#FFAA00",
                term: "Premium"
            }
        }

        if (val in dict) {
            return dict[val];
        }

        return {
            color: "#000",
            term: "Free"
        };
    }

    const { color, term } = AccountStatus(AccountType);

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"}>
                <InfoItem Title={"Email"} Value={Email} Placeholder={"xxx@gmail.com"} />
                <InfoItem Title={"Name"} Value={Username} onChangeValue={onChangeUsername} Placeholder={"Name"} />
                <InfoItem Title={"MobileNo"} Value={MobileNo} onChangeValue={onChangeMobileNo} Placeholder={"+60 XXX-XXXX"} />
                <InfoItem Title={"Tariff Type"} Value={TariffType} onChangeValue={onChangeTariffType} Placeholder={"Residential / Complex"} />
            </View>
        </BcBoxShadow>
    )
}
// #endregion

// #region Hooks
function useProfile() {
    const [profile, setProfile] = useState({});

    const updateProfile = (name, value) => {
        const nextState = { ...profile };
        nextState[name] = value;

        setProfile(() => nextState);
    }

    const onChangeUsername = (val) => updateProfile("Username", val);
    const onChangeMobileNo = (val) => updateProfile("MobileNo", val);
    const onChangeEmail = (val) => updateProfile("Email", val);
    const onChangeAddress = (val) => updateProfile("Address", val);
    const onChangeTariffType = (val) => updateProfile("TariffType", val);

    return [profile, setProfile, onChangeUsername, onChangeMobileNo, onChangeEmail, onChangeAddress, onChangeTariffType];
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle();
    const [flag, setFlag, toggleFlag] = useToggle();

    const profileHook = useProfile();
    const [profile, setProfile] = profileHook.slice(0, 2);

    const [oProfile, setOProfile] = useState({});
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchProfileInfo({
                param: {
                    UserId: userId,
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    setProfile(() => data);
                    setOProfile(() => data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused, userId]);

    // Compare Flag
    useEffect(() => {
        const str = JSON.stringify(profile);
        const str_2 = JSON.stringify(oProfile);

        const t_flag = str !== str_2;
        setFlag(() => t_flag);
    }, [profile])
    // #endregion

    const updateProfile = () => {
        setLoading(true);
        fetchUpdateProfile({
            param: {
                UserId: userId,
                ...profile
            },
            onSetLoading: setLoading
        })
            .then(data => { })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { UpdateProfile = -1 } = subUserAccess;

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd Right={<HeaderRight flag={UpdateProfile == 1} showFlag={flag} onSelect={updateProfile} />}>Profile Info</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <InfoPanel hook={profileHook} />
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;