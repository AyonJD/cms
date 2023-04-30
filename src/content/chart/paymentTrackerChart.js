import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';

const PaymentTrackerChart = ({ paymentTracker }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartData = {
            labels: [], // we will populate this array with unique payment dates
            datasets: [],
        };

        // Group the data by service name
        const groupedData = paymentTracker.reduce((accumulator, currentValue) => {
            const { serviceName } = currentValue;
            if (!(serviceName in accumulator)) {
                accumulator[serviceName] = [];
            }
            accumulator[serviceName].push(currentValue);
            return accumulator;
        }, {});

        // Extract the data for each service
        const services = Object.keys(groupedData);
        services.forEach((service) => {
            const data = groupedData[service].map((item) => ({
                x: moment(item.paymentDate).format('MMM D, YYYY'),
                y: item.paidAmount,
            }));
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            chartData.datasets.push({
                label: service,
                data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                stack: service, // use service name as stack group
            });

            // populate labels array with unique payment dates
            data.forEach((item) => {
                const date = moment(item.x).format('MMM D, YYYY');
                if (!chartData.labels.includes(date)) {
                    chartData.labels.push(date);
                }
            });
        });

        // sort labels array in ascending order
        chartData.labels.sort((a, b) => {
            return new Date(a) - new Date(b);
        });

        const myChartRef = chartRef.current.getContext('2d');
        new Chart(myChartRef, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            const label = data.datasets[tooltipItem.datasetIndex].label || '';
                            const date = tooltipItem.xLabel;
                            const value = tooltipItem.yLabel;
                            return `${label}: ${value} on ${date}`;
                        },
                    },
                },
                scales: {
                    xAxes: [
                        {
                            stacked: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Payment Date',
                            },
                        },
                    ],
                    yAxes: [
                        {
                            stacked: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Payment Amount',
                            },
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            },
        });
    }, [paymentTracker]);

    return <canvas ref={chartRef} height={300} />;
};

export default PaymentTrackerChart;