import React, { useState, useEffect, useRef } from "react";
import { Dimensions, SafeAreaView, ScrollView, Text } from "react-native";

import * as echarts from 'echarts/core';
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { LineChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';

import { Logger, Utility } from "@utility";

import { useOrientation } from "@hooks";

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

	const { height = 480, width = 320, option } = props;

	const chartRef = useRef(null);

	useEffect(() => {
		let chart;

		if (chartRef.current) {
			chart = echarts.init(chartRef.current, 'light', {
				renderer: 'svg',
				width: width,
				height: height
			});
			chart.setOption(option);
		}

		return () => chart?.dispose();
	}, [option]);1

	return <SkiaChart ref={chartRef} />;
}

// Component usage
function Index(props) {

	const { hook = [] } = props;

	const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, chartKeyOption, setChartKeyOption] = hook;

	const { label = [], dataset = [], min_dt = 0, max_dt = 0 } = chartData;

	const [width] = useOrientation();

	const option = {
		animation: false,
		tooltip: {
			trigger: 'axis',
			renderMode: "richText"
		},
		toolbox: {
			feature: {
				restore: {}
			},
			top: 40,
			right: 10,
		},
		legend: {
			data: chartLegend,
			type: "scroll",
			bottom: 20,
		},
		xAxis: {
			type: "time",
			min: min_dt,
			max: max_dt,
			axisLabel: {
				formatter: '{HH}:{mm}',
				rotate: 45,
				showMinLabel: true,
				showMaxLabel: true
			},
			hideOverlap: true,
			animation: false
		},
		// xAxis: {
		// 	type: "category",
		// 	axisLabel: {
		// 		rotate: 45,
		// 		showMinLabel: true,
		// 		showMaxLabel: true
		// 	},
		// 	boundaryGap: false,
		// 	data: label,
		// },
		yAxis: {
			type: 'value',
			renderMode: "richText"
		},
		dataZoom: [
			{
				start: 0,
				end: 100,
				top: 0,
			},
			{
				type: "inside"
			}
		],
		grid: {
			left: 5,
			right: 5,
			containLabel: true,
		},
		series: dataset.map(x => ({
			...x,
			type: "line",
			symbol: "circle",
			symbolSize: 5
		}))
	};

	return (
		<>
		<Text style={{
				fontStyle: 'italic'
			}}>
				Hint: You can use the bottom bar to zoom in on graph
			</Text>
			<ChartComponent
			option={option}
			width={width * 0.85}
			{...props} />
		</>
	)
}

export default Index;