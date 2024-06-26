import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcDisable, BcLoading, BcBoxShadow, BcHeaderWithCancel } from "@components"

import { fetchAddRoom } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Components
function HomeForm(props) {

    const isFocused = useIsFocused();

    // #region Props
    const { form, setForm = () => { } } = props;
    // #endregion

    // #region Initial
    const init = {
        roomLs: ["Living Room", "Master Bedroom", "Dining Room", "Office", "Kitchen",]
    }
    // #endregion

    const { name } = form;

    // #region UseState
    const [roomLs, setRoomLs] = useState([]);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            let arr = [...init.roomLs];
            setRoomLs(arr);
        }
    }, [isFocused]);
    // #endregion

    // #region Helper
    const onChangeName = (val) => {
        const nextState = {
            ...form,
            name: val
        }
        setForm(nextState);
    }
    // #endregion

    // #region Render
    const renderItem = (item, index) => {
        const onSelect = () => onChangeName(item);
        return (
            <TouchableOpacity key={index}
                onPress={onSelect}>
                <View borderWidth={1} borderRadius={8} p={2}>
                    <Text>{item}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    // #endregion

    return (
        <VStack space={3}>
            <View bgColor={"#FFF"}
                alignItems={"center"}>
                <HStack
                    alignItems={"center"}
                    width={"90%"}
                    style={{ height: 60 }}>
                    <View flex={.3}>
                        <Text style={{
                            fontSize: 18
                        }}>Room Name</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={name}
                            onChangeText={onChangeName}
                            placeholder={"Room Name"}
                            autoCapitalize={"none"}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>
            </View>

            <View alignItems={"center"}>
                <HStack width={'90%'}>
                    <Text>Recommended</Text>
                </HStack>
            </View>

            <View alignItems={"center"}>
                <HStack space={3} rowGap={10}
                    flexWrap={"wrap"}
                    width={'90%'}>
                    {
                        roomLs.map(renderItem)
                    }
                </HStack>
            </View>


        </VStack>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    // #endregion

    // #region Initial
    const init = {
        form: {
            name: ""
        }
    }
    // #endregion

    // #region UseState
    const [flag, setFlag] = useState(false);
    const [form, setForm] = useState(init.form);
    const [loading, setLoading] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        let flag = true;

        flag = flag && form.name !== "";

        setFlag((_) => flag);
    }, [JSON.stringify(form)]);
    // #endregion

    // #region Helper
    const clearForm = () => {
        setForm(init.form);
    }
    const save = () => {
        const { name } = form;
        
        setLoading(true);
        fetchAddRoom({
            param: {
                UserId: userId,
                HomeId: homeId,
                Title: name,
                Description: name,
            },
            onSetLoading: setLoading,
        })
        .then(data => {
            clearForm();

            navigation.navigate("RoomManagement")
        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`);

            toast.show({
                description:  `Error: ${err}`
            })
        })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithCancel flag={flag} onSelect={save}>Add Room</BcHeaderWithCancel>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <HomeForm form={form} setForm={setForm} />
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;