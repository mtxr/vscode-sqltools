var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { Facet as G2plotFacet } from '@antv/g2plot';
import useChart from '../../hooks/useChart';
import { getChart } from '../../utils';
import ErrorBoundary from '../../errorBoundary';
import ChartLoading from '../../utils/createLoading';
var FacetChart = forwardRef(function (props, ref) {
    var chartRef = props.chartRef, _a = props.style, style = _a === void 0 ? {
        height: 'inherit',
    } : _a, className = props.className, loading = props.loading, loadingTemplate = props.loadingTemplate, errorTemplate = props.errorTemplate, rest = __rest(props, ["chartRef", "style", "className", "loading", "loadingTemplate", "errorTemplate"]);
    var _b = useChart(G2plotFacet, rest), chart = _b.chart, container = _b.container;
    useEffect(function () {
        getChart(chartRef, chart.current);
    }, [chart.current]);
    useImperativeHandle(ref, function () { return ({
        getChart: function () { return chart.current; },
    }); });
    return (React.createElement(ErrorBoundary, { errorTemplate: errorTemplate },
        loading && React.createElement(ChartLoading, { loadingTemplate: loadingTemplate, theme: props.theme }),
        React.createElement("div", { className: className, style: style, ref: container })));
});
export default FacetChart;
