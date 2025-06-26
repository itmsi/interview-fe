import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Routes } from "react-router-dom";
import { Sidemenu } from './Component/Sidemenu';
import { Header } from './Component/Header';
import { Index as Home } from './Home/Index';
import { Index as ManageUser } from './Manageuser/Index';
import { ToastContainer } from 'react-toastify';

const Index = (props) => {
    const { access_token, userInfo, system_access } = props;
    const [page, setPage] = useState('Dashboard');
    return (
        <Container fluid>
            <Row>
                <Sidemenu systems={system_access || []} />
                <Col lg="10">
                    <Header profile={userInfo || []} page={page} />
                    <div className='mt-3 w-100'>
                        <Routes>
                            <Route 
                                path="/dashboard" 
                                element={
                                    <Home
                                        token={access_token}
                                        setPage={setPage} 
                                    />
                                } 
                            />
                            <Route 
                                path={`/hr-system/user-management`}
                                element={
                                    <ManageUser
                                        token={access_token}
                                        setPage={setPage} 
                                    />
                                } 
                            />
                        </Routes>
                    </div>
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
