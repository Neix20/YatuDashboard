import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { Animation, Images, clsConst } from "@config";

import Lottie from "lottie-react-native";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { fetchAuthTuyaCode, fetchRegister } from "@api";

import Clipboard from '@react-native-clipboard/clipboard';

import { useModalToast, useToggle, useTimer } from "@hooks";

import { BcPhotoGalleryModal, BcYesNoModal } from "@components";

import { BackHandler } from "react-native";


// #region Components
function GenQrLoading(props) {

    const { onTimerEnd = () => { } } = props;

    const [timer, setTimer, totalDuration, setTotalDuration, progress] = useTimer(45);

    const style = {
        center: {
            textAlign: "center"
        },
        loading: {
            color: "#F00",
            fontSize: 36
        }
    }

    return (
        <View mt={3}>
            <Text style={style.center}>
                Please wait for the generating process to complete.
            </Text>
            <VStack space={3}>
                <Text style={style.center}>
                    This process will finish in
                </Text>
                <Text style={[style.center, style.loading]}>{timer}</Text>
                <Text style={style.center}>
                    seconds
                </Text>
            </VStack>
        </View>
    )
}

function SyncWithSmartLife(props) {

    const { onTimerEnd = () => { } } = props;

    const [timer, setTimer, totalDuration, setTotalDuration, progress] = useTimer(180);

    useEffect(() => {
        if (timer == 1) {
            onTimerEnd();
        }
    }, [timer]);

    const style = {
        center: {
            textAlign: "center"
        },
        loading: {
            color: "#F00",
            fontSize: 36
        }
    }

    return (
        <>
            <VStack space={2} mt={3}>
                <View width={"80%"}>
                    <Text style={style.center}>
                        Please wait for the data synchronization process to complete.
                    </Text>
                </View>
                <Text style={style.center}>
                    This process will finish in
                </Text>
                <Text style={[style.center, style.loading]}>{timer}</Text>
                <Text style={style.center}>
                    seconds
                </Text>
            </VStack>
        </>
    )
}

function Loading(props) {

    const { children = "", onGenQrDone = () => {}, onSyncSmart = () => {} } = props;

    const flag = children === "Syncing Data With Smart Life App...";

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 20,
            textAlign: "center"
        },
        animation: {
            width: 200,
            height: 360
        }
    }

    if (flag) {
        return (
            <View flexGrow={1} alignItems={"center"} justifyContent={"center"}>
                <Text style={style.title}>Please Refrain from Closing the App</Text>
                <Lottie loop={true} autoPlay
                    source={Animation.SyncData}
                    style={style.animation} />
                <Text style={style.title}>{children}</Text>
                <SyncWithSmartLife onTimerEnd={onSyncSmart} />
            </View>
        )
    }

    return (
        <View flexGrow={1} alignItems={"center"} justifyContent={"center"}>
            <Text style={style.title}>Please Refrain from Closing the App</Text>
            <Lottie loop={true} autoPlay
                source={Animation.Qrgenerate}
                style={style.animation} />
            <Text style={style.title}>{children}</Text>
            <GenQrLoading onTimerEnd={onGenQrDone} />
        </View>
    )
}

function TutorialGuideBtn(props) {

    const [showTGModal, setShowTGModal, toggleTGModal] = useToggle(false);

    useEffect(() => {
        // const timeout = setTimeout(() => {
        //     toggleTGModal();
        // }, 1000)
        // return () => clearTimeout(timeout);
    }, [])

    const images = [
        { uri: Images.ScanQrI },
        { uri: Images.ScanQrII },
        { uri: Images.ScanQrIII },
    ]

    return (
        <>
            <BcPhotoGalleryModal showModal={showTGModal} setShowModal={setShowTGModal} images={images} />
            <TouchableOpacity onPress={toggleTGModal}>
                <VStack alignItems={"center"}>
                    <View borderRadius={20}
                        bgColor={"#000"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 32, height: 32 }}>
                        <FontAwesome5 name={"info"} size={16} color={"#FFF"} />
                    </View>
                    <Text>Guide</Text>
                </VStack>
            </TouchableOpacity>
        </>
    )
}

function Disable(props) {
    const { children, timer = 0 } = props;
    return (
        <View>
            {/* Front Layer */}
            <View alignItems={"center"}
                justifyContent={"center"}
                borderRadius={12}
                style={{
                    position: "absolute",
                    zIndex: 10,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
                backgroundColor={"rgba(0, 0, 0, 0.5)"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#FFF"
                }}>
                    {timer}
                </Text>
            </View>
            <View>
                {children}
            </View>
        </View>
    )
}

function RefreshQrBtn(props) {
    const { timer = 0, onPress = () => { } } = props;

    const Item = () => (
        <View backgroundColor={"#F00"} borderRadius={12}
            alignItems={"center"} justifyContent={"center"}
            style={{ height: 60, width: 130 }}>
            <Text style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FFF",
                textAlign: "center",
            }}>Regenerate QR</Text>
        </View>
    )

    if (timer > 0) {
        return (
            <Disable {...props}>
                <Item />
            </Disable>
        )
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <Item />
        </TouchableOpacity>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    const Email = props?.route?.params?.Email || "";

    // #region UseState
    const [loading, setLoading] = useState(false);
    const [refLink, setRefLink] = useState("");
    const [refImg, setRefImg] = useState("");
    const [loadingTxt, setLoadingTxt] = useState("");
    const [titleTxt, setTitleTxt] = useState("");
    const [timer, setTimer] = useTimer(-1);

    const [atcFlag, setAtcFlag] = useState(false);
    const [showExitModal, setShowExitModal, toggleExitModal] = useToggle(false);
    // #endregion

    const updateAtcFlag = () => {
        const timeout = setTimeout(() => {
            if (navigation.isFocused()) {
                setAtcFlag(_ => true);
            }
        }, 1500)
        return () => clearTimeout(timeout);
    }

    // #region Api
    // Loading A
    const authTuyaCode = () => {
        setLoading(true);
        setLoadingTxt("Generating Smart Home QR Code...");
        setTitleTxt("STEP 1 : QR Generator");
        fetchAuthTuyaCode({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                const { AuthCode, Flag = false, AuthImg } = data;
                setAtcFlag(_ => Flag);

                if (Flag) {
                    setRefImg(AuthImg);
                    setRefLink(AuthCode);
                    setTitleTxt("STEP 2: Smart Life Authentication");

                    setTimer(60);
                } else {
                    navigation.navigate("AuthTuyaHighTraffic", data);
                }
            })

            .catch(err => {
                setLoading(false);
                console.log(`AuthTuyaCode Error: ${err}`);
            })
    }

    // Loading B
    const register = () => {
        setLoading(true);
        setLoadingTxt("Syncing Data With Smart Life App...");
        setTitleTxt("STEP 3 : Verified Account");

        fetchRegister({
            param: {
                UserId: userId,
                Email: Email
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                const { ResponseCode, ResponseMessage } = data;

                if (ResponseCode == "00") {
                    GoToHome();
                } else {
                    toast.show({
                        description: ResponseMessage
                    })
                }

            })
            .catch(err => {
                setLoading(false);
                console.log(`Register Error: ${err}`);
            })
    }
    // #endregion

    useEffect(() => {
        if (isFocused) {
            authTuyaCode();
            updateAtcFlag();

            setTitleTxt(_ => "STEP 1 : QR Generator");
        }
    }, [isFocused]);

    const copyRefLink = () => {
        Clipboard.setString(refLink);
        toast.show({
            description: `'${refLink}' has been copied to Clipboard!`
        })
    }

    const GoToHome = () => {
        navigation.navigate("ScanQr", {
            title: "AuthTuya"
        });
    }

    // Disable Back Button
    useEffect(() => {
        const backAction = () => {
            if (!isFocused) {
                return false;
            }

            toggleExitModal();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isFocused]);

    const GoBack = () => {
        navigation.goBack();
    }

    const GenQrDone = () => {
        navigation.navigate("AuthTuyaHighTraffic", data);
    }

    // Shown at False
    if (!atcFlag) {
        return (
            <>
                <BcYesNoModal showModal={showExitModal} setShowModal={setShowExitModal}
                    title={"Warning"} showCross={false}
                    onPressYes={GoBack}
                    onPressNo={toggleExitModal}
                    description={"Are you sure you want to exit this page?"} />
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 80 }} />
                        <Loading onGenQrDone={GenQrDone} onSyncSmart={GoToHome}>{loadingTxt}</Loading>
                    </View>

                    <View
                        justifyContent={"center"}
                        alignItems={"center"}
                        style={{ height: 60 }}>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 16
                        }}>Powered By {clsConst.ORG_NAME}</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14
                        }}>© Version {clsConst.APP_VERSION}</Text>
                    </View>
                </SafeAreaView>
            </>
        )
    }

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 20
        },
        instruction: {
            fontSize: 14,
            textAlign: 'justify'
        }
    }

    // Never Show Not Once
    return (
        <>
            <BcYesNoModal showModal={showExitModal} setShowModal={setShowExitModal}
                title={"Warning"} showCross={false}
                onPressYes={GoBack}
                onPressNo={toggleExitModal}
                description={"Are you sure you want to exit this page?"} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View alignItems={"center"} justifyContent={"center"} style={{ height: 80 }}>
                        <HStack width={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                            <Text style={style.title}>{titleTxt}</Text>
                            <TutorialGuideBtn />
                        </HStack>
                    </View>
                    {
                        (loading) ? (
                            <Loading>{loadingTxt}</Loading>
                        ) : (
                            <>
                                <VStack flexGrow={1} space={5}>
                                    <VStack space={3} alignItems={"center"}>
                                        {/* Instruction */}
                                        <View width={"90%"}>
                                            <Text style={style.title}>
                                                Authentication Instructions:
                                            </Text>
                                        </View>

                                        <VStack p={3} space={1} width={"90%"}
                                            borderColor={"#000"} borderWidth={2}>

                                            {/* Check Smart Life User */}
                                            <Text style={style.instruction}>1. An email have been sent to your mailbox. Please check your email for the <Text style={[style.instruction, { fontWeight: '700' }]}>Authentication QR code.</Text></Text>

                                            {/* Ready a Computer to do Setup */}
                                            <Text style={style.instruction}>2. <Text style={[style.instruction, { fontWeight: '700' }]}>Scan the Authentication QR code</Text> from your email using the <Text style={[style.instruction, { fontWeight: '700' }]}>Smart Life app</Text>. Ensure you have downloaded, installed, registered, and added your device to the app.</Text>

                                        </VStack>
                                        <View paddingX={5}>

                                            <Text style={style.instruction}>If you have any questions or concerns, please contact us at {clsConst.VIGTECH_BUSINESS_PHONE_NUMBER} or {clsConst.VIGTECH_EMAIL}</Text>
                                        </View>

                                        <VStack width={"90%"}>
                                            <Image source={Images.YatuAuthGif}
                                                style={{
                                                    width: "100%",
                                                    height: 250
                                                }}
                                                resizeMode={"contain"}
                                                alt={"Auth QR Code"} />
                                        </VStack>

                                        {/* Button To Register */}
                                        <HStack space={5}
                                            alignItems={"center"} justifyContent={"center"}>
                                            <TouchableOpacity onPress={register}>
                                                <View backgroundColor={Utility.getColor()} borderRadius={12}
                                                    alignItems={"center"} justifyContent={"center"}
                                                    style={{ height: 60, width: 130 }}>
                                                    <Text style={[{
                                                        fontSize: 18,
                                                        fontWeight: "bold",
                                                        color: "white",
                                                    }]}>Register</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <RefreshQrBtn onPress={authTuyaCode} timer={timer} />
                                        </HStack>
                                    </VStack>
                                </VStack>
                            </>
                        )
                    }
                </View>

                <View
                    justifyContent={"center"}
                    alignItems={"center"}
                    style={{ height: 60 }}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 16
                    }}>Powered By {clsConst.ORG_NAME}</Text>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 14
                    }}>© Version {clsConst.APP_VERSION}</Text>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;