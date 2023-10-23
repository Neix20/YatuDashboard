import React, { useState, useEffect, useRef } from "react";
import { Dimensions, SafeAreaView, ScrollView, Text } from "react-native";
import { View } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import * as echarts from 'echarts/core';
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { LineChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';

import { useOrientation } from "@hooks";

import { Logger, Utility } from "@utility";

// Register extensions
echarts.use([
	SVGRenderer,
	LineChart,
	BarChart,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	ToolboxComponent,
	DataZoomComponent
])

// Initialize
function ChartComponent(props) {

	const { height = 480, width = 320 } = props;
	const { option = {}, chartRef = null } = props;

	let chart;

	useEffect(() => {
		if (chartRef.current) {
			// const chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current, 'light', {
			// 	renderer: 'svg',
			// 	width: width,
			// 	height: height
			// });

			chart = echarts.init(chartRef.current, 'light', {
				renderer: 'svg',
				width: width,
				height: height
			});

			chart.setOption(option);
		}

		return () => chart?.dispose();
	}, [option]);

	return (
		<SkiaChart ref={chartRef} />
	);
}

// Component usage
function Index(props) {

	const { hook = [] } = props;

	const [ chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, chartKeyOption, setChartKeyOption ] = hook;

	const { label = [], dataset = [], min = 0, max = 25 } = chartData;

	const chartRef = useRef(null);

	const [width] = useOrientation();

	const [unit, setUnit] = useState("");

	useEffect(() => {
		let ut = Utility.genUnit(chartKey);
		setUnit(_ => ut);
	}, [chartKey]);

	const option = {
		animation: false,
		tooltip: {
			trigger: 'axis',
			renderMode: "richText",
			valueFormatter: (value) => `${value}${unit}`
		},
		toolbox: {
			feature: {
                restore: {}
            },
			top: 40,
			right: 5,
		},
		legend: {
			data: chartLegend,
			orient: 'horizontal',
			bottom: 0,
		},
		xAxis: {
			type: "category",
			axisLabel: {
				rotate: 45,
				showMinLabel: true,
				showMaxLabel: true
			},
			data: label,
			axisPointer: {
				snap: true,
				lineStyle: {
					color: '#7581BD',
					width: 2
				},
				label: {
					show: true,
					formatter: function (params) {
						return params.value;
					},
					backgroundColor: '#7581BD'
				},
				handle: {
					show: true,
					color: '#7581BD',
					size: [48, 48]
				},
				zlevel: 0,
			}
		},
		yAxis: {
			type: 'value',
			renderMode: "richText",
			min: Math.ceil(min * 0.9),
			max: Math.floor(max * 1.1),
		},
		dataZoom: [
			{
				type: 'slider',
				top: 0,
				left: 5,
				right: 5,
			},
			{
				type: 'inside',
				xAxisIndex: [0]
			}
		],
		grid: {
			left: 5,
			right: 5,
			bottom: 50,
			containLabel: true,
		},
		series: dataset.map(x => ({
			...x,
			type: "bar"
		}))
	};

	return (
		<>
			<View alignItems={"center"}>
				<Text style={{ fontStyle: 'italic' }}>
					Hint: Drag the bar to zoom out graph
				</Text>
			</View>
			<ChartComponent 
                width={width * 0.85}
				option={option}
				chartRef={chartRef}
				{...props}
			/>
		</>
	)
}

export default Index;