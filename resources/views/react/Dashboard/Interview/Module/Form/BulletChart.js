import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const BulletChart = ({ metrics = [], standard_value = [] }) => {
    const companyValues = metrics.map(m => m.company_value);
    const actualScores = metrics.map(m => m.total_score);
    
    const standardScores = companyValues.map(companyValue => {
        const standardItem = standard_value[0]?.find(item => item.company_value === companyValue);
        return standardItem ? standardItem.total_score : 0;
    });

    const chartData = {
        labels: companyValues,
        datasets: [
            {
                label: 'Target Range',
                data: standardScores,
                backgroundColor: 'rgba(206, 212, 218, 0.8)',
                borderColor: 'rgba(173, 181, 189, 1)',
                borderWidth: 1,
                order: 2
            },
            {
                label: 'Actual Performance',
                data: actualScores,
                backgroundColor: actualScores.map((score, index) => {
                    const standard = standardScores[index];
                    if (score >= standard * 0.9) return 'rgba(40, 167, 69, 0.9)'; // Green - Excellent
                    if (score >= standard * 0.7) return 'rgba(255, 193, 7, 0.9)'; // Yellow - Good
                    return 'rgba(220, 53, 69, 0.9)'; // Red - Poor
                }),
                borderWidth: 0,
                order: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const datasetLabel = context.dataset.label;
                        const value = context.parsed.y;
                        if (datasetLabel === 'Actual Performance') {
                            const standard = standardScores[context.dataIndex];
                            const percentage = standard > 0 ? Math.round((value / standard) * 100) : 0;
                            return `${datasetLabel}: ${value} (${percentage}% of target)`;
                        }
                        return `${datasetLabel}: ${value}`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: false,
            },
            y: {
                stacked: false,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score'
                }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};
