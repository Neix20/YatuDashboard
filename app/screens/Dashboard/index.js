import React, { useState, useEffect, useRef, useCallback } from "react";
import { Text, TouchableOpacity, Image, Dimensions, SafeAreaView, ScrollView, FlatList, TouchableWithoutFeedback } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcSvgIcon, BcBoxShadow, BcGradient, BcDateRangeModal, BcViewShot, BcLoading } from "@components";

import { LineChart as LineChartSvg, YAxis, XAxis, Grid, Path } from 'react-native-svg-charts';

import * as shape from 'd3-shape';

import { CheckBox } from "@rneui/themed";
import { DateTime } from "luxon";

import { fetchDashboardInfo } from "@api";

// #region Components
function Header(props) {
    const { children } = props;

    return (
        <BcBoxShadow>
            <View
                pb={2}
                alignItems={"center"}
                justifyContent={"flex-end"}
                style={{
                    height: 60,
                    width: width,
                    backgroundColor: "#fff",
                }}>
                <HStack
                    style={{ width: width - 40 }}>
                    {/* Logo */}
                    <BcSvgIcon name={"Yatu"} width={80} height={40} />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function SvgLineChart(props) {
    const { metaData, chart, labels } = props;

    const Shadow = (props) => {
        const { lines } = props;
        return (
            <Path
                key={'shadow'}
                y={2}
                d={lines}
                fill={"none"}
                strokeWidth={4}
                stroke={'rgba(134, 65, 244, 0.2)'}
            />
        )
    }

    const { min, max } = metaData;

    return (
        <HStack space={2}>
            <YAxis
                data={[min, max]}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{
                    fill: 'grey',
                    fontSize: 10,
                }}
            />
            <VStack>
                <LineChartSvg
                    data={chart}
                    style={{ height: 300, width: width - 80 }}
                    svg={{
                        strokeWidth: 2,
                    }}
                    curve={shape.curveNatural}
                    contentInset={{ top: 20, bottom: 20 }}
                >
                </LineChartSvg>
                <XAxis
                    style={{ width: width - 80 }}
                    data={labels}
                    formatLabel={(_, index) => labels[index]}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
            </VStack>
        </HStack>
    )
}

function DashboardAtom(props) {
    const { title, children } = props;
    const { onPress = () => { } } = props;
    return (
        <TouchableOpacity onPress={onPress}>
            <BcGradient
                orientation={"horizontal"}
                style={{ borderRadius: 15 }}
                {...props}>
                <View p={3}
                    justifyContent={"space-between"}
                    style={{
                        width: (width - 60) / 2,
                        height: 100
                    }}>
                    {/* Title */}
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                        color: "#FFF",
                    }}>{title}</Text>

                    {/* Value */}
                    <View alignItems={"flex-end"}>
                        {children}
                    </View>
                </View>
            </BcGradient>
        </TouchableOpacity>
    )
}

function Dashboard(props) {

    const { onDevice, onAlert } = props;

    return (
        <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            style={{ width: width - 40 }}>
            <DashboardAtom
                onPress={onDevice}
                startColor={"#FF0000"} endColor={"#FF9900"}
                title={"Active Devices"}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 24,
                    color: "#FFF",
                }}>9</Text>
            </DashboardAtom>
            <DashboardAtom
                onPress={onAlert}
                startColor={"#0500FF"} endColor={"#00FFA3"}
                title={"No. Alerts"}>
                <HStack
                    space={1}
                    alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 24,
                        color: "#FFF",
                    }}>3</Text>
                    <FontAwesome name={"bell"} size={24} color={"#FFF"} />
                </HStack>
            </DashboardAtom>
        </HStack>
    )
}

function TimeInterval(props) {
    return (<></>)
}

function TimeIntervalAtom(props) {
    const { children, onPress = () => { }, flag = false } = props;
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                alignItems={"center"}
                borderRadius={15}
                style={{
                    width: 60,
                    backgroundColor: flag ? "#F01421" : "#FFF"
                }}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 16,
                    color: flag ? "#FFF" : "#000",
                }}>{children}</Text>
            </View>
        </TouchableOpacity>
    )
}

function DeviceAtom(props) {
    const { children, onPress = () => { }, flag = false } = props;
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                px={3}
                alignItems={"center"}
                borderRadius={15}
                style={{
                    maxWidth: 120,
                    backgroundColor: flag ? "#F01421" : "#FFF"
                }}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 16,
                    color: flag ? "#FFF" : "#000",
                }}>{children}</Text>
            </View>
        </TouchableOpacity>
    )
}

function TableHeader(props) {
    const { children, width = 80, noBorder = false } = props;
    return (
        <View
            borderRightWidth={noBorder ? 0 : 1}
            alignItems={"center"}
            justifyContent={"center"}
            style={{
                width: width,
                height: 40,
            }}>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 14,
                textAlign: "center",
            }}>{children}</Text>
        </View>
    )
}

function TableData(props) {
    const { children, width = 80, noBorder = false } = props;
    return (
        <View
            borderRightWidth={noBorder ? 0 : 1}
            alignItems={"center"}
            justifyContent={"center"}
            style={{
                width: width,
                height: 40,
            }}>
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 14,
                textAlign: "center",
            }}>{children}</Text>
        </View>
    )
}

function Table(props) {
    const { data, wt = width - 40 } = props;

    const header = Object.keys(data[0]);

    // #region Render
    const renderItem = ({ item, index }) => {

        let value = Object.values(item);
        value[0] = value[0].replace(" ", "T");
        return (
            <HStack
                key={index}
                alignItems={"center"}
                justifyContent={"space-between"}
                borderWidth={1}
                style={{
                    width: wt,
                }}>
                <TableData width={wt / 4}>{Utility.formatDt(value[0], "hh:mm:ss a")}</TableData>
                <TableData width={wt / 4}>{value[1]}</TableData>
                <TableData width={wt / 4}>{value[2]}</TableData>
                <TableData width={wt / 4} noBorder={true}>{value.at(-1)}</TableData>
            </HStack>
        )
    }
    // #endregion

    return (
        <VStack>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                borderWidth={1}
                borderBottomWidth={0}
                style={{
                    width: wt,
                }}>
                {
                    header.slice(0, -1).map(obj => {
                        return (
                            <TableHeader width={wt / 4}>{obj}</TableHeader>
                        )
                    })
                }
                <TableHeader width={wt / 4} noBorder={true}>{header.at(-1)}</TableHeader>
            </HStack>

            <View style={{
                height: 400,
            }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                />
            </View>


        </VStack>
    )
}

function CheckBoxLegend(props) {
    const { name, flag, color } = props;
    const { onPress = () => { } } = props;
    return (
        <View style={{ width: (width - 40) / 3 }}>
            <CheckBox
                title={name}
                titleProps={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 16,
                    color: color,
                }}
                checked={flag}
                onPress={onPress}
                checkedColor={color} />
        </View>
    )
}

function Legend(props) {
    const { data, onUpdateLegend = () => { } } = props;

    let arr = Utility.splitItemsIntoK(data, 3);

    // #region Render
    const renderItem = (item, ind) => {
        const len = arr[0].length;
        return (
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                {
                    item.map((obj, jnd) => {
                        const onSelect = () => onUpdateLegend(len * ind + jnd);
                        return (
                            <CheckBoxLegend
                                onPress={onSelect}
                                {...obj} />
                        )
                    })
                }
            </HStack>
        )
    }
    // #endregion

    if (data.length <= 0) {
        return (<></>)
    }

    return (
        <BcBoxShadow style={{ borderRadius: 20, height: 200 }}>
            <View bgColor={"#FFF"} borderRadius={20} style={{
                maxHeight: 200,
            }}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{
                        width: width - 40,
                    }}>
                    <VStack>
                        {
                            arr.map((obj, ind) => renderItem(obj, ind))
                        }
                    </VStack>
                </ScrollView>
            </View>
        </BcBoxShadow>
    );
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Initial
    const init = {
        svgChart: [
            {
                data: [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
            }
        ],
        svgMetaData: {
            min: Number.MIN_VALUE,
            max: Number.MAX_VALUE
        },
        legend: {
            name: "",
            flag: false,
            color: "#000",
        },
        colors: ["#DB7D86", "#E7E005", "#188B9A", "#DB2E54", "#A53202", "#82EB20", "#75368B", "#395DAD", "#EC259F", "#0FA1AF", "#ADAC72", "#7FD106", "#6AC237", "#C5F022", "#76862A"],
        dt: DateTime.now().toFormat("yyyy-MM-dd"),
    }
    // #endregion

    // #region UseState
    const [svgChart, setSvgChart] = useState(init.svgChart);
    const [svgLegend, setSvgLegend] = useState([]);
    const [svgLabels, setSvgLabels] = useState(["00", "06", "12", "18", "24"]);

    const [svgMetaData, setSvgMetaData] = useState({});

    const [showDtModal, setShowDtModal] = useState(false);

    const [startDt, setStartDt] = useState("2023-07-01");
    const [endDt, setEndDt] = useState("2023-07-01");

    const [loading, setLoading] = useState(false);

    const [chartData, setChartData] = useState({});
    // #endregion

    // #region UseEffect

    // Update Data
    useEffect(() => {
        if (isFocused) {
            getDashboard(startDt, endDt);
        }
    }, [JSON.stringify(startDt + endDt)]);

    // Update Legend
    useEffect(() => {

        let legend = [...svgLegend];

        let datasets = [];

        let ind = 0;
        for (let key in chartData) {
            if (legend[ind] != null && legend[ind].flag) {
                let val = chartData[key];

                // Limit value
                val = val.slice(0, 100);

                val = val.map(obj => obj["absolute_humidity"]);

                val = val.map((obj, ind) => obj * +ind);

                let obj = {
                    data: val,
                    svg: { stroke: init.colors[ind] },
                    strokeWidth: 2,
                }

                datasets.push(obj);
            }

            ind += 1;
        }

        setSvgChart(datasets);

    }, [JSON.stringify(svgLegend.map(obj => obj.flag)), JSON.stringify(chartData)]);
    // #endregion

    // #region Navigation
    const GoToDevice = () => {
        navigation.navigate("TabNavigation", {
            screen: "Device"
        });
    }

    const GoToAlert = () => {
        navigation.navigate("TabNavigation", {
            screen: "Alert"
        });
    }
    // #endregion

    // #region Helper
    const updateLegend = (pos) => {
        let arr = [...svgLegend];

        const { flag } = arr[pos];
        arr[pos].flag = !flag;

        setSvgLegend(arr);
    }

    const toggleDateModal = () => setShowDtModal(!showDtModal);

    const addDt = () => {
        const tStartDt = DateTime.fromISO(startDt)
                    .plus({days: 1})
                    .toFormat("yyyy-MM-dd");
        setStartDt(tStartDt);

        const tEndDt = DateTime.fromISO(endDt)
                    .plus({days: 1})
                    .toFormat("yyyy-MM-dd");
        setEndDt(tEndDt);

    };
    const minusDt = () => {
        const tStartDt = DateTime.fromISO(startDt)
                    .plus({days: -1})
                    .toFormat("yyyy-MM-dd");
        setStartDt(tStartDt);

        const tEndDt = DateTime.fromISO(endDt)
                    .plus({days: -1})
                    .toFormat("yyyy-MM-dd");
        setEndDt(tEndDt);
    };
    // #endregion

    // #region API
    const getDashboard = (start_date = '2023-07-01', end_date = '2023-07-01') => {
        setLoading(true);
        fetchDashboardInfo({
            param: {
                UserId: 2,
                StartDate: start_date,
                EndDate: `${end_date} 23:59:59`
            },
            onSetLoading: setLoading,
        })
        .then(res => {
            const {Data} = res;
            setChartData(Data);

            let datasets = [];
            let legend = [];

            let minData = Number.MAX_VALUE;
            let maxData = Number.MIN_VALUE;

            let ind = 0;
            for (let key in Data) {
                let val = Data[key];

                // Limit value
                val = val.slice(0, 100);

                val = val.map(obj => obj["absolute_humidity"]);

                val = val.map((obj, ind) => obj * +ind);

                minData = Math.min(...val, minData);
                maxData = Math.max(...val, maxData);

                let obj = {
                    data: val,
                    svg: { stroke: init.colors[ind] },
                    strokeWidth: 2,
                }

                datasets.push(obj);

                let legendObj = {
                    name: key,
                    flag: true,
                    color: init.colors[ind],
                }

                legend.push(legendObj);

                ind += 1;
            }

            setSvgChart(datasets);
            setSvgLegend(legend);

            setSvgMetaData({
                min: minData,
                max: maxData,
            });
        })
        .catch(err => {
            setLoading(false);
            console.log("Error! Help Me");
            console.log(`Error: ${err}`);
        })
    }
    // #endregion

    return (
        <>
            <BcLoading showLoading={loading} />
            <BcDateRangeModal 
                dt={init.dt}
                startDt={startDt} setStartDt={setStartDt}
                endDt={endDt} setEndDt={setEndDt}
                showModal={showDtModal} setShowModal={setShowDtModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {/* Header */}
                    <Header>Dashboard</Header>

                    <View style={{ height: 5 }} />

                    <TouchableOpacity onPress={toggleDateModal}>
                        <View py={3}
                            bgColor={"#fff"}
                            alignItems={"center"}>
                            <HStack
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                style={{ width: width - 40 }}>
                                <HStack space={3} alignItems={"center"}>
                                    <FontAwesome5 name={"calendar-alt"} size={27} color={"#606267"} />
                                    <VStack space={1}>
                                        <Text style={{
                                            fontFamily: "Roboto-Bold",
                                            fontSize: 16,
                                        }}>{Utility.formatDt(startDt, "EEEE, d MMMM")}</Text>
                                        {/* <Text>vs {Utility.formatDt(prevDt, "EEEE, d MMMM")}</Text> */}
                                    </VStack>
                                </HStack>
                                <HStack>
                                    <TouchableOpacity onPress={minusDt}>
                                        <View
                                            // bgColor={"#F00"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                            style={{ height: 40, width: 40 }}>
                                            <FontAwesome name={"angle-left"} size={27} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={addDt}>
                                        <View
                                            // bgColor={"#F00"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                            style={{ height: 40, width: 40 }}>
                                            <FontAwesome name={"angle-right"} size={27} />
                                        </View>
                                    </TouchableOpacity>
                                </HStack>
                            </HStack>
                        </View>
                    </TouchableOpacity>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>

                        <VStack space={2}
                            alignItems={"center"}>
                            <BcViewShot title="Daily Device Report">
                                <SvgLineChart
                                    metaData={svgMetaData}
                                    chart={svgChart}
                                    labels={svgLabels} />
                            </BcViewShot>

                            {/* Legend Checkbox */}
                            <Legend data={svgLegend} onUpdateLegend={updateLegend} />
                        </VStack>

                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>

        </>
    );
}

export default Index;