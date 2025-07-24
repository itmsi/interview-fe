import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export const InterviewScoreChart = ({ metrics = [] }) => {
    // Ensure metrics is always an array and has valid structure
    const validMetrics = Array.isArray(metrics) ? metrics.filter(m => 
        m && 
        typeof m === 'object' && 
        typeof m.total_score === 'number' &&
        m.company_value
    ) : [];

    const isValid = validMetrics.length >= 1;

    const standard_value = [
        [
            {
                "company_value": "SDT",
                "total_score": 40
            },
            {
                "company_value": "CSE",
                "total_score": 40
            },
            {
                "company_value": "SIAH",
                "total_score": 0
            },
            {
                "company_value": "7 Values",
                "total_score": 0
            }
        ]
    ]

    if (!isValid) {
        return (
        <div className="p-4 border rounded bg-white shadow-sm text-center">
            <h5 className="mb-3">Interview Scoring</h5>
            <p className="text-muted">No scoring data available or insufficient data to display chart</p>
        </div>
        );
    }

    // Prepare data for chart first
    const companyValues = validMetrics.map(m => m.company_value);
    const actualScores = validMetrics.map(m => m.total_score);
    
    // Get standard values in the same order as metrics
    const standardScores = companyValues.map(companyValue => {
        const standardItem = standard_value[0].find(item => item.company_value === companyValue);
        return standardItem ? standardItem.total_score : 0;
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const datasetLabel = context.dataset.label;
                        const value = context.parsed.r;
                        const companyValue = context.label;
                        
                        if (datasetLabel === 'Actual Score') {
                            const standardIndex = companyValues.indexOf(companyValue);
                            const standard = standardScores[standardIndex];
                            // Jika standard adalah 0, maka persentase adalah 100%
                            const percentage = standard === 0 ? 100 : Math.round((value / standard) * 100);
                            const status = standard === 0 ? '✓ No Target Required' : (value >= standard ? '✓ Above Target' : '✗ Below Target');
                            return `${datasetLabel}: ${value} (${percentage}% - ${status})`;
                        } else {
                            return `${datasetLabel}: ${value}`;
                        }
                    }
                }
            }
        },
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                pointLabels: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 10,
                    font: {
                        size: 10
                    },
                    backdropColor: 'rgba(255, 255, 255, 0.8)'
                },
                suggestedMin: 0,
                suggestedMax: Math.max(...standardScores, ...actualScores) + 10
            }
        }
    };

    const total = validMetrics.reduce((sum, m) => sum + m.total_score, 0);

    const getEvaluation = (total) => {
        if (total <= 20) return { remark: "Very Poor", recommendation: "Reject" };
        if (total <= 40) return { remark: "Poor", recommendation: "Reject" };
        if (total <= 60) return { remark: "Average", recommendation: "Consideration - need comparison" };
        if (total <= 80) return { remark: "Good", recommendation: "Next Process To be Hired" };
        return { remark: "Excellent", recommendation: "Next Process To be Hired" };
    };

    const { remark, recommendation } = getEvaluation(total);

    const chartData = {
        labels: companyValues,
        datasets: [
            {
                label: 'Standard Target',
                data: standardScores,
                borderColor: 'rgba(255, 193, 7, 1)',
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 193, 7, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                fill: true
            },
            {
                label: 'Actual Score',
                data: actualScores,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.3)',
                borderWidth: 3,
                pointBackgroundColor: actualScores.map((score, index) => {
                    const standard = standardScores[index];
                    return score >= standard ? 'rgba(40, 167, 69, 1)' : 'rgba(220, 53, 69, 1)';
                }),
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                fill: true
            }
        ]
    };

    return (
        <StyleInterviewScore className="p-4 border rounded bg-white shadow-sm">
            <Row className='align-items-center'>
                <Col xs={12} md={8} className='mb-4'>
                    <div style={{ height: '400px', position: 'relative' }}>
                        <Radar data={chartData} options={options} />
                    </div>
                </Col>
                <Col xs={12} md={4} className='text-center'>
                    <div className='mb-4'>
                        <h4  className='titleScore'>{total}</h4>
                        <div className='remarkScore'>{remark}</div>
                    </div>
                    <div className='mb-4'>
                        <span className='color-label'>Recommendation</span> 
                        <h5 className='fs-6'>{recommendation}</h5>
                    </div>
                </Col>
                <Col xs={12} md={12} className='text-center'>
                    {/* Performance Summary */}
                    <h6 className='my-2'>Performance Summary</h6>
                    <Row className='mt-2 row-cols-md-2 g-2'>
                        {companyValues.map((value, index) => {
                            const actual = actualScores[index];
                            const standard = standardScores[index];
                            const percentage = standard === 0 ? 100 : Math.round((actual / standard) * 100);
                            const isAboveTarget = standard === 0 ? true : actual >= standard;
                            
                            return (
                                <div key={index}>
                                    <div className='score-comparison'>
                                        <div className='d-flex justify-content-between align-items-center mb-1'>
                                            <small className='fw-bold text-dark'>{value}</small>
                                            <small className={`badge ${isAboveTarget ? 'bg-success' : 'bg-warning'}`}>
                                                {standard === 0 ? 'No Target' : (isAboveTarget ? 'Achieved' : 'Not Achieved')}
                                            </small>
                                        </div>
                                        
                                        {/* Score Details */}
                                        <div className='score-details mb-2'>
                                            <div className='d-flex justify-content-between'>
                                                <span className='score-label'>Actual Score:</span>
                                                <span className='score-value fw-bold'>{actual}</span>
                                            </div>
                                            <div className='d-flex justify-content-between'>
                                                <span className='score-label'>Standard Target:</span>
                                                <span className='score-value'>{standard === 0 ? 'No Target' : standard}</span>
                                            </div>
                                            <div className='d-flex justify-content-between'>
                                                <span className='score-label'>Percentage:</span>
                                                <span className='score-value fw-bold text-primary'>{percentage}%</span>
                                            </div>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className='progress' style={{ height: '6px' }}>
                                            <div 
                                                className={`progress-bar ${isAboveTarget ? 'bg-success' : 'bg-warning'}`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Row>
                </Col>
            </Row>
        </StyleInterviewScore>
    );
};
const StyleInterviewScore = styled(Container) `
    .titleScore {
        font-family: var(--font-main-bold);
        font-weight: 700;
        font-size: 3rem;
        color: var(--color-primary);
    }
    .remarkScore {
        font-size: 1.5rem;
        font-weight: 400;
        margin: .3rem 0 1rem;
        line-height: 1;
        margin-top: -1rem;
    }
    span {
        font-family: var(--font-primary);
    }
    .performance-summary {
        text-align: left;
        background: rgba(248, 249, 250, 0.8);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
    .performance-summary h6 {
        color: var(--color-primary);
        font-weight: 600;
    }
    .progress {
        margin-top: 2px;
    }
    .score-comparison {
        background: rgba(255, 255, 255, 0.8);
        padding: 0.75rem;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }
    .score-details {
        font-size: 0.85rem;
    }
    .score-label {
        color: #6c757d;
        font-size: 0.8rem;
    }
    .score-value {
        color: #495057;
        font-size: 0.85rem;
    }
    .badge {
        font-size: 0.7rem;
    }
`