import React, { useState, useEffect, useRef } from "react";
import { Dimensions, SafeAreaView, ScrollView } from "react-native";

import * as echarts from 'echarts/core';
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';

import { Logger, Utility } from "@utility";

const screen = Dimensions.get("screen");
const { width } = screen;

// Register extensions
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	SVGRenderer,
	LineChart,
	LegendComponent,
	ToolboxComponent,
	DataZoomComponent
])

// Initialize
function ChartComponent(props) {

	const { height = 480, option } = props;

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
	}, [option]);

	return <SkiaChart ref={chartRef} />;
}

// Component usage
function Index(props) {

	const { hook = [] } = props;

	const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, chartKeyOption, setChartKeyOption] = hook;

	const { label=[], dataset = [], min, max } = chartData;

	const option = {
		tooltip: {
			trigger: 'axis',
			renderMode: "richText"
		},
		toolbox: {
			feature: {
				restore: {}
			},
			right: 10,
		},
		legend: {
			data: chartLegend,
			padding: 10,
			top: -10
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: label
		},
		yAxis: {
			type: 'value',
			renderMode: "richText",
		},
		dataZoom: [
			{
				start: 0,
				end: 100
			}
		],
		grid: {
			containLabel: true,
		},
		series: dataset
	};

	return <ChartComponent option={option} {...props} />
}

export default Index;