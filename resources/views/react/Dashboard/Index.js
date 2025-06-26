import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Routes } from "react-router-dom";
import { Sidemenu } from './Component/Sidemenu';
import { Header } from './Component/Header';
import { Index as Home } from './Home/Index';
import { Index as ManageUser } from './Manageuser/Index';
import { slugify } from './Helper/Helper';

const Index = (props) => {
    const { access_token, profile, system_access } = props;
    const [page, setPage] = useState('Dashboard');
    console.log({
        system_access: system_access,
        profile: profile,
        access_token: access_token,
    });

    return (
        <Container fluid>
            <Row>
                <Sidemenu systems={system_access || []} />
                <Col lg="9">
                    <Header profile={profile || []} page={page} />
                    <div className='mt-4 w-100'>
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
        </Container>
    )
}

export default Index
