import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Routes } from "react-router-dom";
import { Sidemenu } from './Component/Sidemenu';
import { Header } from './Component/Header';
import { Index as Home } from './Home/Index';
import { Index as ManageUser } from './Manageuser/Index';
import { System as ManageSystem } from './Manageuser/System';
import { Menu as ManageMenu } from './Manageuser/Menu';
import { Role as ManageRole } from './Manageuser/Role';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { Candidate } from './Interview/Candidate';
import { ListPaySlip } from './Payslip/ListPaySlip';
import { ListPaySlipTKA } from './Payslip/ListPaySlipTKA';

const Index = (props) => {
    const { access_token, userInfo, system_access } = props;
    const [page, setPage] = useState('Dashboard');
    console.log({
        access_token, userInfo, system_access
    });
    
    // CUM Endpoint
    const BASE_URL = process.env.REACT_APP_ENDPOINT_APP;

    // INTERVIE Endpoint
    const BASE_URL_INT = process.env.REACT_APP_ENDPOINT_APP_INTERVIEW;
    return (
        <Container fluid>
            <Row>
                <Sidemenu systems={system_access || []} profile={userInfo || []} />
                <Col lg="10">
                    <Header profile={userInfo || []} page={page} />
                    <motion.div 
                        className='mt-3 w-100'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: .6, delay: 0.3, ease:0.3 }}
                    >
                        <Routes>
                            <Route 
                                path="/dashboard" 
                                element={
                                    <Home
                                        token={access_token}
                                        setPage={setPage} 
                                        userInfo={userInfo}
                                    />
                                } 
                            />
                            <Route 
                                path={`/central-user/user`}
                                element={
                                    <ManageUser
                                        token={access_token}
                                        setPage={setPage} 
                                        userInfo={userInfo}
                                        endpoint={BASE_URL}
                                    />
                                } 
                            />
                            <Route 
                                path={`/central-user/system`}
                                element={
                                    <ManageSystem
                                        token={access_token}
                                        setPage={setPage} 
                                        userInfo={userInfo}
                                        endpoint={BASE_URL}
                                    />
                                } 
                            />
                            <Route 
                                path={`/central-user/menu`}
                                element={
                                    <ManageMenu
                                        token={access_token}
                                        setPage={setPage} 
                                        userInfo={userInfo}
                                        endpoint={BASE_URL}
                                    />
                                } 
                            />
                            <Route 
                                path={`/central-user/role`}
                                element={
                                    <ManageRole
                                        token={access_token}
                                        setPage={setPage} 
                                        userInfo={userInfo}
                                        endpoint={BASE_URL}
                                    />
                                } 
                            />
                            <Route 
                                path={`/interview/candidate`}
                                element={
                                    <Candidate
                                        systems={system_access || []}
                                        token={access_token}
                                        setPage={setPage} 
                                        loginInfo={userInfo}
                                        endpoint={BASE_URL_INT}
                                    />
                                } 
                            />
                            <Route 
                                path={`/payslip/wni`}
                                element={
                                    <ListPaySlip
                                        systems={system_access || []}
                                        token={access_token}
                                        setPage={setPage} 
                                        userInfo={userInfo}
                                    />
                                } 
                            />
                            <Route 
                                path={`/payslip/wna`}
                                element={
                                    <ListPaySlipTKA
                                        systems={system_access || []}
                                        token={access_token}
                                        setPage={setPage} 
                                        userInfo={userInfo}
                                    />
                                } 
                            />
                        </Routes>
                    </motion.div>
                </Col>
            </Row>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                limit={3}
            />
        </Container>
    )
}

export default Index
