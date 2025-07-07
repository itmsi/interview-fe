import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale  } from 'chart.js';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);

export const InterviewScoreChart = ({ metrics = [] }) => {
    const isValid = metrics.length >= 2 && metrics.every(m => typeof m.score === 'number');

    if (!isValid) {
        return (
        <div className="p-4 border rounded bg-white shadow-sm text-center">
            <h5 className="mb-3">Interview Scoring</h5>
            <p className="text-muted">Scoring is not available</p>
        </div>
        );
    }

    const options = {
        responsive: true,
        layout: {
            padding: 0
        },
        scales: {
            r: {
                ticks: {
                    display: false,
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        }
        };

    const total = metrics.reduce((sum, m) => sum + m.score, 0);

    const getEvaluation = (total) => {
        if (total <= 20) return { remark: "Very Poor", recommendation: "Reject" };
        if (total <= 40) return { remark: "Poor", recommendation: "Reject" };
        if (total <= 60) return { remark: "Average", recommendation: "Consideration - need comparison" };
        if (total <= 80) return { remark: "Good", recommendation: "Next Process To be Hired" };
        return { remark: "Excellent", recommendation: "Next Process To be Hired" };
    };

    const { remark, recommendation } = getEvaluation(total);

    const chartData = {
        labels: metrics.map(m => m.name),
        datasets: [{
            data: metrics.map(m => m.score),
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#00AEEF'],
            hoverOffset: 6
        }]
    };

    return (
        <StyleInterviewScore className="p-4 border rounded bg-white shadow-sm">
            <Row className='align-items-center'>
                <Col xs={8} className='mx-auto'>
                    <PolarArea data={chartData} options={options} />
                </Col>
                <Col xs={12} className='text-center'>
                    <div className='mb-4'>
                        <h4  className='titleScore'>{total}</h4>
                        <div className='remarkScore'>{remark}</div>
                    </div>
                    <div className='mb-4'>
                        <span className='color-label'>Recommendation</span> 
                        <h5 className='fs-6'>{recommendation}</h5>
                    </div>
                </Col>
            </Row>
        </StyleInterviewScore>
    );
};
const StyleInterviewScore = styled(Container) `
    .titleScore {
        font-family: var(--font-main-bold);
        font-weight: 700;
        font-size: 5rem;
        color: var(--color-primary);
    }
    .remarkScore {
        font-size: 2rem;
        font-weight: 400;
        margin: .3rem 0 1rem;
        line-height: 1;
        margin-top: -1rem;
    }
    span {
        font-family: var(--font-primary);
    }
`