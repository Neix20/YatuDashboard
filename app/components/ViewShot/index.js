import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Dimensions } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Utility } from "@utility";

import { BcBoxShadow } from "@components";

import ViewShot from "react-native-view-shot";
import BottomModal from "@components/Modal/BottomModals";

import Modal from "@components/Modal/CommunityModals";

import Share from "react-native-share";

import { useToggle } from "@hooks";

function ExpandModal(props) {
    const { children } = props;
    return (
        <Modal showCross={false} {...props}>
            <View
                width={"90%"}>{children}</View>
        </Modal>
    )
}

function VSModal(props) {

    // #region Props
    const { onDownload = () => { }, onShare = () => { }, onExpand = () => { } } = props;
    // #endregion

    return (
        <BottomModal {...props} showCross={false}>
            <VStack space={3} width={"100%"}>
                <TouchableOpacity onPress={onExpand}>
                    <View alignItems={"center"} justifyContent={"center"} style={{ height: 40 }}>
                        <HStack width={"90%"} space={5} alignItems={"center"}>
                            <FontAwesome5 name={"expand-arrows-alt"} size={27} />
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                            }}>Expand</Text>
                        </HStack>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={onShare}>
                    <View alignItems={"center"} justifyContent={"center"} style={{ height: 40 }}>
                        <HStack width={"90%"} space={5} alignItems={"center"}>
                            <FontAwesome5 name={"share-alt"} size={27} />
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                            }}>Share</Text>
                        </HStack>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDownload}>
                    <View alignItems={"center"} justifyContent={"center"} style={{ height: 40 }}>
                        <HStack width={"90%"} space={5} alignItems={"center"}>
                            <FontAwesome5 name={"download"} size={27} />
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                            }}>Download</Text>
                        </HStack>
                    </View>
                </TouchableOpacity>
            </VStack>
        </BottomModal>
    );
}

function Index(props) {

    const toast = useToast();

    // #region Props
    const { title, children } = props;
    const { imgOption, shareOption } = props;
    // #endregion

    // #region UseState
    const [showVsModal, setShowVsModal] = useState(false);
    const [showExModal, setShowExModal] = useState(false);
    // #endregion

    // #region UseRef
    const itemRef = useRef(null);
    // #endregion

    // #region Helper
    const toggleVsModal = () => setShowVsModal((val) => !val);
    const toggleExModal = () => {
        toggleVsModal();
        setShowExModal((val) => !val);
    };
    const closeModal = () => setShowVsModal(false);

    const shareFunc = () => {
        itemRef.current.capture()
            .then(async (uri) => {
                const shareOptions = {
                    title: 'Yatu Devices Dashboard',
                    url: uri,
                    subject: 'Yatu Daily dashboard',
                };
                Share.open(shareOptions)
                    .then(res => {
                        console.log('res:', res);
                        closeModal();
                    }).catch(err => {
                        throw new Error("An Error has occurred", err.message);
                    });
            })
            .catch(err => {
                console.log("Error ", err)
            });
    }

    const dlFunc = () => {
        itemRef.current.capture()
            .then(async (uri) => {
                await Utility.cacheDownloadFile(uri);
                closeModal();
            })
            .catch(err => {
                console.log("Error ", err)
            });
    }
    // #endregion

    return (
        <>
            <VSModal
                onDownload={dlFunc}
                onShare={shareFunc}
                onExpand={toggleExModal}
                showModal={showVsModal} setShowModal={setShowVsModal}
            />
            <ExpandModal showModal={showExModal} setShowModal={setShowExModal}>{children}</ExpandModal>
            <BcBoxShadow>
                <VStack py={3}
                    space={3}
                    bgColor={"#FFF"}
                    alignItems={"center"}
                    width={"100%"}
                    style={{ maxWidth: width - 24 }}>
                    <HStack width={"90%"}
                        alignItems={"center"}
                        justifyContent={"space-between"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                        }}>{title}</Text>
                        <TouchableOpacity onPress={toggleVsModal}>
                            <FontAwesome5 name={"ellipsis-v"} size={27} />
                        </TouchableOpacity>
                    </HStack>

                    <ViewShot ref={itemRef}
                        options={{ fileName: "test", format: "jpg", quality: 0.9 }}
                        style={{ width: "90%" }}>
                        <View bgColor={"#FFF"}>
                            {children}
                        </View>
                    </ViewShot>
                </VStack>
            </BcBoxShadow>
        </>
    );
}

export default Index;