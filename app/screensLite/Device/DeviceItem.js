import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { View, VStack, HStack } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { CheckBox } from "@rneui/base";

import { Logger, Utility } from "@utility";
import { Images } from "@config";

import { BcBoxShadow } from "@components";

function Index(props) {

    // #region Props
    const { Title, Online_Status, pwsFlag, img, flag, Status } = props;
    const { onLinkDevice = () => { }, onAddToFavorite = () => { } } = props;
    const { showFavorite = true, showCheckbox = true, showOnlineStatus = true } = props;
    // #endregion

    const borderRadius = 8;

    const ols = (Online_Status === 1) ? ({ color: "#0F0", term: "Online" }) : ({ color: "#F00", term: "Offline" });
    const pwsColor = pwsFlag ? Utility.getColor() : "#98A0A8";

    const style = {
        img: {
            height: 60,
            width: "25%",
        },
        title: {
            fontSize: 14,
            fontFamily: 'Roboto-Bold',
            color: "#000",
        },
        onlineStatus: {
            fontSize: 12,
            fontFamily: 'Roboto-Bold',
            color: ols.color,
        },
        chkBox: {
            paddingHorizontal: 0,
            paddingVertical: 0,
        }
    }

    return (
        <TouchableOpacity onPress={onLinkDevice} onLongPress={onAddToFavorite} disabled={!showCheckbox}>
            <BcBoxShadow style={{ borderRadius: borderRadius, width: "100%" }}>
                <HStack py={2} px={2} bgColor={"#FFF"}
                    justifyContent={"space-between"} alignItems={"center"}
                    style={{ borderRadius: borderRadius }}>
                    <HStack space={2} alignItems={"center"} w={"75%"}>
                        <Image source={img} style={style.img} resizeMode={"cover"} alt={Title} />
                        <VStack width={"68%"}>
                            <Text style={style.title}>{Title}</Text>
                            { 
                                (showOnlineStatus == 1) ? (<Text style={style.onlineStatus}>{ols.term}</Text>) : (<></>)
                            }
                        </VStack>
                    </HStack>
                    <HStack alignItems={"center"} space={2}>
                        {
                            (showFavorite) ? (
                                <FontAwesome name={"star"} size={24} color={pwsColor} />
                            ) : (
                                <View style={{ width: 32, height: 32 }} />
                            )
                        }
                        {
                            (showCheckbox) ? (
                                <CheckBox
                                    containerStyle={style.chkBox}
                                    iconType={"material-community"}
                                    checkedIcon={"checkbox-marked"}
                                    uncheckedIcon={"checkbox-blank-outline"}
                                    checked={flag}
                                    onPress={onLinkDevice}
                                    checkedColor={Utility.getColor()} />
                            ) : (
                                <></>
                            )
                        }
                    </HStack>
                </HStack>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

export default Index;