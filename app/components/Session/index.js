import React, { useState, useEffect } from "react";
import { View, VStack, HStack, useToast } from "native-base";
import { Text, TouchableOpacity, FlatList } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Logger, Utility } from "@utility";

import { Actions, Selectors } from '@redux';
import { useDispatch, useSelector } from 'react-redux';

import { fetchGetParamApi, fetchGenerateViewerAccessCode, fetchDeviceListII } from "@api";
import { BaseModal, BcDisableII } from "@components";

import { useToggle, useTimer, useModalToast } from "@hooks";

function useDeviceLs() {
    const [ls, setLs] = useState([]);

    const updateLs = (data) => {
        let arr = [...data];
        for (let ind = 0; ind < arr.length; ind += 1) {
            const obj = {
                ...arr[ind],
                flag: false,
                pos: ind
            }
            arr[ind] = obj;
        }
        setLs(_ => arr);
    }

    const toggleItem = (item) => {
        const { pos } = item;

        let arr = [...ls];

        arr[pos].flag = !arr[pos].flag;

        setLs(_ => arr);
    }

    // At Least One
    const flag = ls.filter(x => x.flag).length > 0;

    return [ls, updateLs, toggleItem, flag];
}

import { CheckBox } from "@rneui/base";

function LinkDeviceItem(props) {

    const { Title, flag } = props;
    const { onSelect = () => { } } = props;

    return (
        <TouchableOpacity onPress={onSelect}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <View>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 16,
                    }}>{Title}</Text>

                </View>
                <CheckBox
                    containerStyle={{
                        paddingHorizontal: 5,
                        paddingVertical: 0,
                    }}
                    iconType={"material-community"}
                    checkedIcon={"checkbox-marked"}
                    uncheckedIcon={"checkbox-blank-outline"}
                    onPress={onSelect}
                    checked={flag} />
            </HStack>
        </TouchableOpacity>
    )
}

function SessionModal(props) {
    const { showModal, setShowModal = () => { } } = props;
    const { timerHook = [], accessCodeHook = [] } = props;

    const [timer, setTimer, t1, t2, progress] = timerHook;
    const [accessCode, setAccessCode] = accessCodeHook;

    const userId = useSelector(Selectors.userIdSelect);

    const [devLs, setDevLs, toggleItem, genFlag] = useDeviceLs();

    const genAccessCode = () => {

        // setAccessCode(_ => "101010");
        // setTimer(10080);

        fetchGenerateViewerAccessCode({
            param: {
                UserId: userId,
                DeviceLs: devLs.filter(x => x.flag)
            },
            onSetLoading: () => { }
        })
            .then(data => {
                const { Access_Code = "", Expiry_Date = "" } = data;

                setAccessCode(_ => Access_Code);

                // Get Time Difference Between expiry Date And Now
                const ts_diff = Utility.timeDiff(Expiry_Date);
                setTimer(ts_diff);
            })
            .catch(err => {
                console.error(err);
            })
    }

    const GetDeviceList = () => {
        fetchDeviceListII({
            param: {
                UserId: userId,
                HomeId: 152
            },
            onSetLoading: () => { }
        })
            .then(data => {
                const _data = data["All Devices"]
                setDevLs(_data);
            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(() => {
        GetDeviceList();
    }, []);

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 20,
            color: "#000",
        },
        description: {
            fontFamily: "Roboto-Bold",
            fontSize: 20,
            color: "#000",
        },
        btnTitle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#FFF",
        }
    };

    const renderItem = ({ item, index }) => {
        const onSelect = () => toggleItem(item);
        return (
            <LinkDeviceItem key={index} onSelect={onSelect} {...item} />
        )
    }


    if (timer > 0) {
        return (
            <BaseModal {...props}>
                {/* Content */}
                <VStack space={3} width={"80%"} alignItems={"center"}>
                    <HStack alignItems={"center"} justifyContent={"space-between"}>
                        <Text style={style.title}>Access Code: </Text>
                        <Text style={style.title}>{accessCode}</Text>
                    </HStack>
                    <HStack alignItems={"center"} justifyContent={"space-between"}>
                        <Text style={style.description}>Timer: </Text>
                        <Text style={style.description}>{Utility.formatTsTimer(timer)}</Text>
                    </HStack>
                </VStack>
            </BaseModal>
        )
    }

    return (
        <BaseModal {...props}>
            {/* Content */}
            <VStack space={3} width={"90%"} py={3} alignItems={"center"}>
                <Text style={style.title}>Session has not yet generated!</Text>

                {/* Device List */}
                <FlatList
                    data={devLs}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 2 }}
                />

                {
                    (genFlag) ? (
                        <TouchableOpacity onPress={genAccessCode} style={{ width: "60%", height: 40 }}>
                            <View flex={1} backgroundColor={"#ff0000"}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={style.btnTitle}>Generate Access Code</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <BcDisableII style={{ width: "60%", height: 40 }}>
                            <View flex={1} backgroundColor={"#ff0000"}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={style.btnTitle}>Generate Access Code</Text>
                            </View>
                        </BcDisableII>
                    )
                }
            </VStack>
        </BaseModal>
    )
}

function Index(props) {

    const [sesModal, setSesModal, toggleSesModal] = useToggle(false);

    const timerEnd = () => {
        setSesModal(_ => false);
    }

    const timerHook = useTimer(0, timerEnd);
    const [timer, setTimer, t1, t2, progress] = timerHook;

    const accessCodeHook = useState("");
    const [accessCode, setAccessCode] = accessCodeHook;

    const color = timer > 0 ? "#FFAA00" : "#212121";

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: color
        },
        timerTxt: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        },
        chkBox: {
            paddingHorizontal: 0,
            paddingVertical: 0,
        }
    };

    return (
        <>
            <SessionModal showModal={sesModal} setShowModal={setSesModal}
                timerHook={timerHook} accessCodeHook={accessCodeHook} />
            {
                (timer == 0) ? (
                    <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
                        <TouchableOpacity onPress={toggleSesModal} style={{ width: "90%" }}>
                            <HStack alignItems={"center"} style={{ height: 60 }}>
                                <View alignItems={"flex-start"} style={{ width: 40 }}>
                                    <MaterialCommunityIcons name={"progress-clock"} size={24} color={color} />
                                </View>
                                <Text style={style.title}>Share Session</Text>
                            </HStack>
                        </TouchableOpacity>
                    </VStack>
                ) : (
                    <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
                        <TouchableOpacity onPress={toggleSesModal} style={{ width: "90%" }}>
                            <HStack alignItems={"center"} justifyContent={"space-between"} style={{ height: 60 }}>
                                {/* Icon & Title */}
                                <HStack alignItems={"center"}>
                                    <View alignItems={"flex-start"} style={{ width: 40 }}>
                                        <MaterialCommunityIcons name={"progress-clock"} size={24} color={color} />
                                    </View>
                                    <Text style={style.title}>Share Session: </Text>
                                    <Text style={[style.title, { color: "#000" }]}>{accessCode}</Text>
                                </HStack>

                                {/* Timer */}
                                <Text style={style.timerTxt}>{Utility.formatTsTimer(timer)}</Text>
                            </HStack>
                        </TouchableOpacity>
                    </VStack>
                )
            }

        </>
    )
}

export default Index