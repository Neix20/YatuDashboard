import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, FlatList, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

// const {width, height} = useWindowDimensions();

import { Logger, Utility } from "@utility";

import { BcSvgIcon, BcBoxShadow, BcLoading, BcYatuHome, BcCarousel, BaseModal } from "@components";

import { Devices, Images } from "@config";

import { Tab, TabView } from "@rneui/themed";

import { removeDevice as TuyaRemoveDevice } from "@volst/react-native-tuya";

import TopModal from "@components/Modal/TopModal";
import Modal from "react-native-modal";

import { fetchDeviceList, fetchDeleteDevice } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Add Device Modal
function AddDeviceModal(props) {

    // #region Props
    const { onDeviceScan = () => { } } = props;
    // #endregion

    return (
        <TopModal showCross={false} {...props}>
            <View alignItems={"center"} width={"100%"}>
                <TouchableOpacity onPress={onDeviceScan}
                    style={{ width: "90%" }}>
                    <HStack alignItems={"center"} style={{ height: 40 }}>
                        <View flex={.1}>
                            <Feather name={"target"} color={"#ccc"} size={20} />
                        </View>
                        <View flex={.9}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                            }}>Scan Device</Text>
                        </View>
                    </HStack>
                </TouchableOpacity>
            </View>
        </TopModal>
    )
}

function AddDeviceBtn(props) {

    const navigation = useNavigation();

    // #region UseState
    const [showAdModal, setShowAdModal] = useState(false);
    // #endregion

    // #region Helper
    const toggleAdModal = () => setShowAdModal((val) => !val);
    // #endregion

    // #region Navigation
    const GoToDeviceScan = () => {
        toggleAdModal();
        navigation.navigate("DeviceScan");
    }
    // #endregion

    return (
        <>
            <AddDeviceModal onDeviceScan={GoToDeviceScan}
                showModal={showAdModal} setShowModal={setShowAdModal} />
            <TouchableOpacity onPress={toggleAdModal}>
                <View borderRadius={20}
                    bgColor={"#2898FF"}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ width: 32, height: 32 }}>
                    <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                </View>
            </TouchableOpacity>
        </>
    )
}
// #endregion

// #region Hooks
function useViewMode(val = "list") {
    const [viewMode, setViewMode] = useState(val);

    const toggleViewMode = () => {
        const val = (viewMode === "List") ? "Grid" : "List";
        setViewMode(val);
    };

    return [viewMode, toggleViewMode];
}
// #endregion

// #region Tab Detail
function TabDetailModal(props) {

    // #region Props
    const { showModal, setShowModal } = props;
    const { onSelectRoomManagement = () => { } } = props;
    const { viewMode, toggleViewMode = () => { } } = props;
    // #endregion

    return (
        <Modal
            isVisible={showModal}
            animationInTiming={1}
            animationOutTiming={1}
            onBackButtonPress={() => setShowModal(false)}
            onBackdropPress={() => setShowModal(false)}
            backdropOpacity={.3}>
            <View py={3}
                alignItems={"center"}
                borderRadius={8}
                bgColor={"#FFF"}>

                <TouchableOpacity onPress={toggleViewMode}
                    style={{ width: "90%" }}>
                    <HStack
                        alignItems={"center"}
                        style={{ height: 40 }}>
                        <HStack alignItems={"center"} space={3}>
                            <MaterialCommunityIcons name={viewMode === "List" ? "view-grid-outline" : "view-list-outline"} size={28} />
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18
                            }}>{viewMode === "List" ? "Grid" : "List"} View</Text>
                        </HStack>
                    </HStack>
                </TouchableOpacity>

                <TouchableOpacity onPress={onSelectRoomManagement} style={{ width: "90%" }}>
                    <HStack
                        alignItems={"center"}
                        style={{ height: 40 }}>
                        <HStack alignItems={"center"} space={3}>
                            <MaterialCommunityIcons name={"hexagon-slice-4"} size={28} />
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18
                            }}>Room Management</Text>
                        </HStack>
                    </HStack>
                </TouchableOpacity>

            </View>
        </Modal>
    )
}

function TabDetail(props) {

    const navigation = useNavigation();

    // #region Props
    const { viewMode, toggleViewMode = () => { } } = props;
    // #endregion

    // #region UseState
    const [showTdModal, setShowTdModal] = useState(false);
    // #endregion

    // #region Helper
    const toggleTabDetail = () => setShowTdModal((val) => !val);

    const onSelectViewMode = () => {
        toggleViewMode();
        toggleTabDetail();
    }
    // #endregion

    // #region Navigation
    const GoToRoomManagement = () => {
        navigation.navigate("RoomManagement");
        toggleTabDetail();
    }
    // #endregion

    return (
        <>
            <TabDetailModal {...props}
                toggleViewMode={onSelectViewMode}
                onSelectRoomManagement={GoToRoomManagement}
                showModal={showTdModal} setShowModal={setShowTdModal} />
            <TouchableOpacity onPress={toggleTabDetail}>
                <MaterialCommunityIcons name={"dots-horizontal"} size={32} />
            </TouchableOpacity>
        </>
    )
}
// #endregion

// #region Device
function DeviceRemoveModal(props) {

    // #region Redux
    const lang = "en";
    // #endregion

    // #region Props
    const { onPress = () => { } } = props;
    // #endregion

    // #region Initial
    const init = {
        toast: {
            msg: "",
            flag: false
        },
    };
    // #endregion

    // #region Toast
    const [cusToast, setCusToast] = useState(init.toast);

    const setToastFlag = (val) => {
        setCusToast({
            ...cusToast,
            flag: val
        });
    }

    const showToastMsg = (val) => {
        setCusToast({
            ...cusToast,
            msg: val,
            flag: true
        })
    }

    useEffect(() => {
        if (cusToast.flag) {
            setTimeout(() => {
                setToastFlag(false);
            }, 3 * 1000);
        }
    }, [cusToast.flag]);
    // #endregion

    return (
        <BaseModal {...props} cusToast={cusToast}>
            <VStack
                py={5}
                space={5}
                alignItems={"center"}
                style={{
                    width: width - 100,
                }}>
                <View alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000",
                        textAlign: "center",
                    }}>Are you sure you want to remove this device?</Text>
                </View>

                <TouchableOpacity onPress={onPress}>
                    <View backgroundColor={"#ff0000"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{
                            width: width - 120,
                            height: 40,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={[{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "white",
                        }]}>Remove Device</Text>
                    </View>
                </TouchableOpacity>
            </VStack>
        </BaseModal>
    )
}

function DeviceItem(props) {

    const toast = useToast();

    // #region Props
    const { Title, img, Description, Tuya_Id = "", Id: deviceId } = props;
    const { loading, setLoading = () => { } } = props;
    const { onSelect = () => { } } = props;
    const { toggleRefresh = () => { } } = props;
    // #endregion

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [showRdModal, setShowRdModal] = useState(false);
    // #endregion

    // #region Helper
    const toggleRdModal = () => setShowRdModal((val) => !val);

    const onRemoveDevice = () => {
        setLoading(true);
        fetchDeleteDevice({
            param: {
                UserId: userId,
                DeviceId: deviceId,
            },
            onSetLoading: setLoading
        })
        .then(data => {
            toggleRdModal();
            toggleRefresh();
            toast.show({
                description: "Successfully Removed Device!"
            })
            
            TuyaRemoveDevice({
                devId: Tuya_Id
            })
            .then(res => {
                setLoading(false);
                Logger.info({
                    content: res,
                    page: "App",
                    fileName: "tuya_remove_device",
                });
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            });
        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`)
        })
    }
    // #endregion

    const borderRadius = 8;

    return (
        <>
            <DeviceRemoveModal onPress={onRemoveDevice}
                showModal={showRdModal} setShowModal={setShowRdModal} />
            <TouchableOpacity
                onPress={onSelect}
                onLongPress={toggleRdModal}>
                <BcBoxShadow
                    style={{
                        borderRadius: borderRadius,
                        minWidth: 160,
                        width: "100%",
                    }}>
                    <VStack
                        p={2} space={2}
                        style={{
                            backgroundColor: "#FFF",
                            borderRadius: borderRadius,
                        }}>
                        <Image
                            source={img}
                            style={{
                                height: 60,
                                width: 60,
                            }}
                            resizeMode={"cover"}
                            alt={Title} />
                        <VStack>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Roboto-Bold',
                                color: "#000",
                            }}>{Title}</Text>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Roboto-Medium',
                                color: "#c6c6c6"
                            }}>{Description}</Text>
                        </VStack>
                    </VStack>
                </BcBoxShadow>
            </TouchableOpacity>
        </>
    )
}
// #endregion

// #region Components
function Header(props) {
    return (
        <BcBoxShadow style={{ width: "100%" }}>
            <View bgColor={"#FFF"}
                alignItems={"center"}
                justifyContent={"center"}
                style={{ height: 60 }}>
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ width: "90%" }}>
                    {/* Logo */}
                    <BcYatuHome />

                    {/* Button */}
                    <AddDeviceBtn />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function EmptyList(props) {
    const { lang } = props;
    return (
        <View flexGrow={1}
            alignItems={"center"}
            justifyContent={"center"}>

            <VStack space={2}
                alignItems={"center"}
                width={"90%"}>

                <FontAwesome name={"plug"}
                    color={"#e6e6e6"}
                    size={80} />

                <Text style={{
                    fontSize: 18,
                    color: "#d3d3d3",
                    fontFamily: 'Roboto-Medium',
                    fontWeight: "700"
                }}>{Utility.translate("Empty List", lang)}</Text>
            </VStack>
        </View>
    )
}

function Search(props) {
    const { lang } = props;
    const { query, setQuery } = props;
    return (
        <View
            alignItems={"center"}
            justifyContent={"center"}
            style={{
                height: 60,
            }}>
            <View
                bgColor={"#EDEEEF"}
                borderRadius={4}>
                <TextInput
                    style={{
                        fontSize: 14,
                        fontFamily: "Roboto-Medium",
                        height: 40,
                        width: 360,
                        paddingHorizontal: 16,
                        color: "#000",
                    }}
                    placeholder={Utility.translate("Search", lang)}
                    placeholderTextColor={"#6A7683"}
                    defaultValue={query}
                    onChangeText={setQuery}
                />

                {/* Front Layer */}
                <View
                    justifyContent={"center"}
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 16,
                        display: (query !== "") ? "none" : "flex"
                    }}>
                    <FontAwesome5 name={"search"} size={20} color={"#6A7683"} />
                </View>
            </View>
        </View>
    )
}

function CardGradientItem(props) {
    const { bgName = "CardGradientRed" } = props;
    return (
        <View style={{ height: 180 }}>
            <Image source={Images[bgName]} style={{ width: "100%", height: "100%", borderRadius: 15 }} resizeMode={"cover"} alt={bgName} />
            <VStack p={2}
                space={4}
                position={"absolute"} style={{ left: 0, right: 0 }}>
                <View>
                    <Text style={{
                        fontSize: 12,
                        color: "#FFF",
                    }}>Cozy Home</Text>
                </View>

                <HStack space={3}>
                    <FontAwesome5 name={"cloud"} color={"#FFF"} size={36} />
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 32,
                        color: "#f1f1f1"
                    }}>29°C</Text>
                </HStack>

                <HStack alignItems={"center"} justifyContent={"space-between"}>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>Excellent</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor PM 2.5</Text>
                    </VStack>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>74.0%</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor Humidity</Text>
                    </VStack>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>1006.9hPa</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor Air Pres...</Text>
                    </VStack>
                </HStack>
            </VStack>
        </View>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    // #region Redux
    const lang = "en";

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    // #endregion

    // #region Init
    const init = {
        txtActive: "#2898FF",
        txtInActive: "#6A7683",
        bgActive: "#FFF",
        bgInActive: "#EDEEEF",
        roomLs: ["All Devices", "Living Room", "Office", "Kitchen", "Master Bedroom", "Dining Room"],
        imgLs: ["CardGradientRed", "CardGradientGreen", "CardGradientOrange", "CardGradientBlue"]
    }
    // #endregion

    // #region UseState
    const [deviceData, setDeviceData] = useState({});
    const [roomPaneInd, setRoomPaneInd] = useState(0);

    const [imgLs, setImgLs] = useState(init.imgLs);

    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [viewMode, toggleViewMode] = useViewMode();
    // #endregion

    const roomLs = Object.keys(deviceData);

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchDeviceList({
                param: {
                    UserId: userId,
                    HomeId: homeId
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    setDeviceData(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused, homeId, refresh]);
    // #endregion

    // #region Navigation
    const GoToDetail = (item) => navigation.navigate("DeviceLanding", item);
    // #endregion

    // #region Helper
    const onChangeTab = (ind) => {

        const room = roomLs[ind];
        dispatch(Actions.onChangeRoomId(room));

        setRoomPaneInd(ind)
    };

    const toggleRefresh = () => setRefresh((val) => !val);
    // #endregion

    // #region Render
    const renderDeviceItem = ({ item, index }) => {
        const onSelect = () => GoToDetail(item);
        return (
            <DeviceItem key={index}
            toggleRefresh={toggleRefresh}
                loading={loading} setLoading={setLoading}
                onSelect={onSelect} {...item} />
        )
    }

    const renderTabItem = (item, index) => {
        return (
            <Tab.Item
                key={index}
                title={item}
                titleStyle={(active) => ({
                    fontSize: 18,
                    paddingHorizontal: 0,
                    color: active ? init.txtActive : init.txtInActive
                })}
                buttonStyle={(active) => ({
                    // backgroundColor: active ? init.bgActive : init.bgInActive,
                    // borderWidth: active ? 1 : 0,
                    borderRadius: 8,
                    marginRight: 10,
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                })}
            />
        )
    }

    const renderTabViewItem = ({ item, index }) => {
        return (
            <></>
        )
    }

    const renderGradientItem = ({ index }) => {
        const bgName = imgLs[index];
        return (
            <CardGradientItem key={index} bgName={bgName} />
        )
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#FFF"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header />

                    <View style={{ height: 10 }} />

                    {/* Card Gradient */}
                    <View alignItems={"center"}>
                        <BcCarousel images={imgLs} renderItem={renderGradientItem} />
                    </View>

                    <View style={{ height: 5 }} />

                    <View alignItems={"center"}>
                        <HStack alignItems={"center"} width={"90%"}>
                            <Tab
                                scrollable={true}
                                disableIndicator={true}
                                value={roomPaneInd}
                                onChange={(e) => setRoomPaneInd(e)}>
                                {roomLs.map(renderTabItem)}
                            </Tab>
                            <View justifyContent={"center"}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    right: 0,
                                }}>
                                <TabDetail viewMode={viewMode} toggleViewMode={toggleViewMode} />
                            </View>
                        </HStack>
                    </View>

                    <TabView
                        value={roomPaneInd}
                        onChange={(e) => setRoomPaneInd(e)}>
                        {
                            roomLs.map((room, ind) => {
                                const deviceLs = deviceData[room];
                                return (
                                    <TabView.Item key={ind}
                                        style={{ width: "100%", alignItems: "center" }}>
                                        <FlatList
                                            key={viewMode}
                                            data={deviceLs}
                                            renderItem={renderDeviceItem}
                                            style={{ width: "90%" }}
                                            contentContainerStyle={{
                                                flexGrow: 1,
                                                flexDirection: (viewMode === "List") ? "column" : "row",
                                                flexWrap: (viewMode === "List") ? "nowrap" : "wrap",
                                                justifyContent: (viewMode === "List") ? "center" : "space-between",
                                                padding: 5, rowGap: 8,
                                            }}
                                            ListEmptyComponent={<EmptyList lang={lang} />}
                                        />
                                    </TabView.Item>
                                )
                            })
                        }
                    </TabView>

                    {/* Footer */}
                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default Index;