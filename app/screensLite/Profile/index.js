import React, { useState, useEffect } from "react";
import { View, VStack, HStack, useToast } from "native-base";
import { Text, TouchableOpacity, TextInput, Image, SafeAreaView, ScrollView, FlatList } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { clsConst } from "@config";
import { Logger, Utility } from "@utility";

import { Actions, Selectors } from '@redux';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProfileInfo, fetchSubUserAccess, fetchDeleteAccount, fetchRestoreStorePurchase } from "@api";
import { fetchGetParamApi, fetchGenerateViewerAccessCode, fetchJoinViewerSession } from "@api";

import { BcLoading, BaseModal, BaseIIModal, BcYesNoModal, BcDisableII, BcSessionPanel } from "@components";
import { BcBoxShadow, BcSvgIcon, BcUserStatus } from "@components";

import { useToggle, useYatuIap, useTimer, useModalToast } from "@hooks";
import { withIAPContext } from "react-native-iap";

// #region Components
function Header(props) {

    const color = Utility.getColor();

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"}
                alignItems={"center"}
                justifyContent={"center"}
                style={{ height: 60 }}>
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ width: "90%" }}>
                    {/* Logo */}
                    <HStack alignItems={"center"} space={3}>
                        <BcSvgIcon name={"YatuLite"} size={80} color={Utility.getColor()} />
                        <BcUserStatus />
                    </HStack>
                </HStack>
            </View>
        </BcBoxShadow>
    
    )
}

function ProfilePremium(props) {
    const { AccountType = 1 } = props;

    const AccountStatus = (val = 1) => {
        val = +val;

        let dict = {
            1: {
                color: "#000",
                term: "Free"
            },
            2: {
                color: Utility.getColor(),
                term: "Free"
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
        <HStack alignItems={"center"} space={1.5}>
            <FontAwesome5 name={"crown"} color={color} size={18} />
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 18,
                color: color
            }}>{term}</Text>
        </HStack>
    )
}

function Profile(props) {

    const { Email = "temp@gmail.com" } = props;

    const { Created_Date = "2023-07-01", DataAvailableDate = "2023-07-01" } = props;

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    return (
        <View width={"90%"} alignItems={"center"} style={{ minHeight: 60 }}>
            <TouchableOpacity style={{ width: "90%" }} {...props}>
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                    {/* Btn */}
                    <HStack space={5} alignItems={'center'}>
                        <FontAwesome name={"user-o"} color={"#000"} size={48} />
                        <VStack width={"78%"}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18
                            }}>{Email}</Text>

                            <ProfilePremium AccountType={AccountType} />
                        </VStack>
                    </HStack>

                    {/* Angle-Right */}
                    <FontAwesome name={"angle-right"} color={"#000"} size={32} />
                </HStack>
            </TouchableOpacity>
        </View>
    )
}

function ProfileInfo(props) {

    const { Created_Date = "2023-07-01", DataAvailableDate = "2023-07-01" } = props;

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { DeviceQty = 0, ExpiryDate = "2023-07-01" } = subUserAccess;

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtnII Btn={FontAwesome} icon={"user"} title={"Joined in " + Utility.formatDt(Created_Date, "yyyy-MM-dd")} />
            <PanelBtnII Btn={FontAwesome5} icon={"user-alt-slash"} title={"Expires In " + Utility.formatDt(ExpiryDate, "yyyy-MM-dd")} />
            <PanelBtnII Btn={FontAwesome5} icon={"tools"} title={`Yatu Paid QR Count: ${DeviceQty}`} />
        </VStack>
    )
}

function PanelBtn(props) {

    const { Btn, icon } = props;
    const { showRight = true, disabled = false } = props;
    const { title = "", color = "#111111" } = props;
    const { onPress = () => { } } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: color
        }
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={{ width: "90%" }}>
            <HStack alignItems={"center"} justifyContent={"space-between"} style={{ height: 60 }}>
                {/* Icon & Title */}
                <HStack alignItems={"center"}>
                    <View alignItems={"flex-start"} style={{ width: 40 }}>
                        <Btn name={icon} color={color} size={24} />
                    </View>
                    <Text style={style.title}>{title}</Text>
                </HStack>
                {/* FontAwesome */}
                {
                    (showRight) ? (
                        <FontAwesome name={"angle-right"} color={color} size={32} />
                    ) : (
                        <></>
                    )
                }
            </HStack>
        </TouchableOpacity>
    )
}

function PanelBtnII(props) {

    const { Btn, icon } = props;
    const { title = "", color = "#111111" } = props;

    return (
        <HStack
            width={"90%"}
            alignItems={"center"}
            style={{ height: 40 }}>
            <View alignItems={"flex-start"} style={{ width: 40 }}>
                <Btn name={icon} color={color} size={24} />
            </View>
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 16,
                color: color
            }}>{title}</Text>
        </HStack>
    )
}

function NavPanel(props) {

    const toast = useToast();
    const navigation = useNavigation();

    const GoToHomeManagement = () => navigation.navigate("HomeManagement");
    const GoToAlert = () => navigation.navigate("Alert");
    const GoToReportSchedule = () => navigation.navigate("ReportSchedule");

    const GoToSubUser = () => navigation.navigate("SubUser");
    const GoToAddSubUser = () => navigation.navigate("AddSubUserWithCode");

    const GoToSubscription = () => navigation.navigate("Subscription");
    const GoToUserToken = () => navigation.navigate("UserToken");
    const GoToProfileWorkspace = () => navigation.navigate("ProfileWorkspace");

    const workInProgress = () => {
        toast.show({
            description: "Work In-Progress!"
        })
    }

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { MS_Email = -1, MS_User = -1 } = subUserAccess;

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtn onPress={GoToProfileWorkspace} Btn={Ionicons} icon={"settings-sharp"} title={"View Profile Selection"} />
            <PanelBtn onPress={GoToUserToken} Btn={FontAwesome5} icon={"shopping-cart"} title={"View Yatu Paid QR"} />
            {/* <PanelBtn onPress={GoToSubscription} Btn={FontAwesome5} icon={"shopping-cart"} title={"View Purchased Add-Ons"} /> */}
        </VStack>
    )
}

function CompanyInfoPanel(props) {
    const navigation = useNavigation();

    const GoToAboutUs = () => navigation.navigate("AboutUs");
    const GoToYatu = () => navigation.navigate("Yatu");
    const GoToTnc = () => navigation.navigate("Tnc");
    const GoToPolicy = () => navigation.navigate("Policy");
    const GoToFaq = () => navigation.navigate("Faq");
    const GoContactUs = () => navigation.navigate("ContactUs");

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtn onPress={GoToAboutUs} Btn={FontAwesome5} icon={"info-circle"} title={"About Us"} />
            <PanelBtn onPress={GoToYatu} Btn={FontAwesome5} icon={"tablet-alt"} title={"What is Yatu"} />
            <PanelBtn onPress={GoToTnc} Btn={FontAwesome5} icon={"clipboard-list"} title={"Terms & Conditions"} />
            <PanelBtn onPress={GoToPolicy} Btn={FontAwesome5} icon={"unlock-alt"} title={"Privacy Policy"} />
            <PanelBtn onPress={GoToFaq} Btn={FontAwesome5} icon={"question-circle"} title={"FAQ"} />
            <PanelBtn onPress={GoContactUs} Btn={FontAwesome5} icon={"phone-square-alt"} title={"Contact Us"} />
        </VStack>
    )
}

function PaymentSubscriptionPanel(props) {

    const toast = useToast();
    const navigation = useNavigation();

    const GoToPayment = () => {
        navigation.navigate("PaymentProSubscription");
    };

    return (
        <VStack bgColor={"#FFF"} borderRadius={8}
            width={"90%"} alignItems={"center"}>
            <PanelBtn
                onPress={GoToPayment} title={"Get Value with Pro Subscription"}
                Btn={FontAwesome5} icon={"crown"}
                color={"#FFAA00"} showRight={false} />
        </VStack>
    )
}

function TokenSubscriptionPanel(props) {

    const toast = useToast();
    const navigation = useNavigation();

    const GoToRedeemToken = () => {
        navigation.navigate("TokenActivation");
    };

    return (
        <VStack bgColor={"#FFF"} borderRadius={8}
            width={"90%"} alignItems={"center"}>
            <PanelBtn
                onPress={GoToRedeemToken} title={"Redeem Your Yatu Paid QR!"}
                Btn={FontAwesome} icon={"ticket"}
                color={"#FFAA00"} showRight={false} />
        </VStack>
    )
}

function AuthUserCheckTuyaEmail(props) {

    const navigation = useNavigation();

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { Email = "" } = subUserAccess;

    const AuthUser = () => {
        navigation.navigate("CheckTuyaEmail", { Email: Email })
    };

    return (
        <VStack bgColor={"#FFF"} borderRadius={8}
            width={"90%"} alignItems={"center"}>
            <PanelBtn
                onPress={AuthUser} title={"Authenticate User"}
                Btn={FontAwesome} icon={"user-plus"}
                color={"#FFAA00"} showRight={false} />
        </VStack>
    )
}

function RestorePurchasePanel(props) {

    const toast = useToast();

    const { onGetPurchaseHistory = () => { } } = props;

    const userId = useSelector(Selectors.userIdSelect);

    // #region Restore Purchase Helper
    const [showRpModal, setShowRpModal, toggleRpModal] = useToggle();

    const closeRpModal = () => setShowRpModal(false);

    const RestoreStorePurchase = (SubscriptionCode = "") => {
        setLoading(true);
        fetchRestoreStorePurchase({
            param: {
                UserId: userId,
                SubscriptionCode
            },
            onSetLoading: setLoading
        })
            .catch(err => {
                setLoading(false);
                console.error(`Error: ${err}`);
            })
    }

    const RestorePurchase = () => {
        const onEndTrue = () => {
            if (purchaseHistoryLs.length > 0) {

                const { productId = "" } = purchaseHistoryLs[0];

                // const sku = "com.subscription.mspp0100";
                const sku = productId.split(".").at(-1);
                RestoreStorePurchase(sku);

                toast.show({
                    description: "Successfully restored your subscription."
                })
            } else {
                toast.show({
                    description: "No subscription available to restore."
                })
            }
            closeRpModal();
        }

        const onEndFalse = () => {
            toast.show({
                description: "No subscription available to restore."
            })
            closeRpModal();
        }

        onGetPurchaseHistory({ onEndTrue, onEndFalse });
    };
    // #endregion

    return (
        <>
            <BcYesNoModal
                showModal={showRpModal} setShowModal={setShowRpModal}
                title={"Restore Purchase"}
                description={`This will restore all your deleted purchases from App Store & Google play store.\n\nWould you like to restore your purchases?`}
                titleYes={"Restore"} titleNo={"Cancel"}
                onPressYes={RestorePurchase} onPressNo={toggleRpModal}
            />
            <VStack bgColor={"#FFF"} borderRadius={8}
                width={"90%"} alignItems={"center"}>
                <PanelBtn onPress={toggleRpModal}
                    Btn={FontAwesome5} icon={"cart-arrow-down"}
                    title={"Restore Purchases"} showRight={false} />
            </VStack>
        </>
    )
}

function LogoutPanel(props) {

    const { onLogout = () => { }, onDeleteAccount = () => { } } = props;

    // #region Logout Helper
    const [showLgModal, setShowLgModal, toggleLgModal] = useToggle(false);

    const closeLgModal = () => setShowLgModal(false);

    const DeleteAccount = () => {
        onDeleteAccount();
        closeLgModal();
    }

    const Logout = () => {
        onLogout();
        closeLgModal();
    }
    // #endregion

    return (
        <>
            <BcYesNoModal
                showModal={showLgModal} setShowModal={setShowLgModal}
                title={"Confirm Log Out"} description={"Are you sure you want to log out? You will be returned to the login screen."}
                titleYes={"Delete"} titleNo={"Logout"}
                onPressYes={DeleteAccount} onPressNo={Logout}
            />
            <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
                <PanelBtn onPress={toggleLgModal} title={"Log Out"}
                    Btn={MaterialIcons} icon={"logout"}
                    color={Utility.getColor()} showRight={false} />
            </VStack>
        </>
    )
}

function TutorialPanel(props) {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const tutorial = useSelector(Selectors.tutorialSelect);

    const toggleTutorial = () => {
        // Update Tutorial
        dispatch(Actions.onChangeTutorial(true));

        navigation.navigate("TabNavigation", {
            screen: "Device"
        })
    }

    const color = "#111111";

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: color
        },
        chkBox: {
            paddingHorizontal: 0,
            paddingVertical: 0,
        }
    }

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <TouchableOpacity onPress={toggleTutorial} style={{ width: "90%" }}>
                <HStack alignItems={"center"} style={{ height: 60 }}>
                    {/* Icon & Title */}
                    <View alignItems={"flex-start"} style={{ width: 40 }}>
                        <FontAwesome5 name={"graduation-cap"} size={24} color={color} />
                    </View>
                    <Text style={style.title}>Restart Tutorial</Text>
                </HStack>
            </TouchableOpacity>
        </VStack>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { UserStatus = 0 } = subUserAccess;

    // #region UseState
    const [profileInfo, setProfileInfo] = useState({});

    const loadingHook = useState(false);
    const [loading, setLoading] = loadingHook;

    const [t1, t2, t3, t4, t5, purchaseHistoryLs, getPurchaseHistory] = useYatuIap(setLoading);
    // #endregion

    useEffect(() => {
        if (isFocused) {
            GetProfileInfo();
            RequestAccess(userId);
        }
    }, [isFocused, userId]);

    // #region Navigation
    const GoToProfileInfo = () => {
        navigation.navigate("ProfileInfo");
    }

    const GoToTuyaPanel = () => {
        navigation.navigate("TuyaPanel");
    }

    const SignOut = () => {

        // Reset User Id
        dispatch(Actions.onChangeUserId(-1));

        // Reset Home Id
        dispatch(Actions.onChangeHomeId(-1));

        navigation.navigate("LoginII");
    }
    // #endregion

    // #region API
    const RequestAccess = (userId) => {
        fetchSubUserAccess({
            param: {
                UserId: userId
            },
            onSetLoading: () => { },
        })
            .then(data => {
                dispatch(Actions.onChangeSubUserAccess(data));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }

    const GetProfileInfo = () => {
        setLoading(true);
        fetchProfileInfo({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setProfileInfo(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    const DeleteAccount = () => {
        setLoading(true);
        fetchDeleteAccount({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                SignOut();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            });
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#F6F7FA"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header onSelectSetting={GoToTuyaPanel} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1} alignItems={"center"} space={4}>
                            {/* User */}
                            <Profile {...profileInfo} onPress={GoToProfileInfo} />

                            {/* Join Information */}
                            <ProfileInfo {...profileInfo} />

                            <NavPanel {...profileInfo} />

                            {/* Make Payment */}
                            {/* {(AccountType <= 2) ? <PaymentSubscriptionPanel /> : <></>} */}
                            <TokenSubscriptionPanel />

                            {(UserStatus == 0) ? <AuthUserCheckTuyaEmail /> : <></>}

                            <CompanyInfoPanel />

                            {/* <TutorialPanel /> */}

                            {/* <BcSessionPanel /> */}

                            {/* Logout */}
                            <LogoutPanel onLogout={SignOut} onDeleteAccount={DeleteAccount} />
                        </VStack>

                        <View style={{ height: 10 }} />

                        <VStack space={2}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ height: 80 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                                color: "#A6AFB8"
                            }}>App Version</Text>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 16,
                                color: Utility.getColor()
                            }}>{clsConst.LITE_APP_VERSION}</Text>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 16,
                                color: "#A6AFB8"
                            }}>Powered By {clsConst.ORG_NAME}</Text>
                        </VStack>

                        <View style={{ height: 10 }} />

                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default withIAPContext(Index);