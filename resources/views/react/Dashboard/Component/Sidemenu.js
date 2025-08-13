import React, { useState, useEffect } from 'react'
import { Col } from 'react-bootstrap'
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { AiOutlineAppstore } from 'react-icons/ai';
import { FaWarehouse, FaMoneyBillWave, FaAddressBook } from 'react-icons/fa';
import { IoIosLogOut } from "react-icons/io";
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';
import { isActive, isMenuGroupActive, slugify, useWindowSize } from '../Helper/Helper';

export const Sidemenu = ({ systems, profile }) => {
    const { employee } = profile;
    const [openIndex, setOpenIndex] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isMobile } = useWindowSize();

    const handleToggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const getSystemIcon = (name) => {
        switch (name.toLowerCase()) {
            case 'hr system':
                return <FaAddressBook className="me-2" />;
            case 'warehouse':
                return <FaWarehouse className="me-2" />;
            case 'finance & accounts':
                return <FaMoneyBillWave className="me-2" />;
            default:
                return <AiOutlineAppstore className="me-2" />; // fallback icon
        }
    };
    
    return (
        <>
            {isMobile && (
                <HeaderMobile className={`d-flex justify-content-between align-items-center px-3 py-2 ${isMenuOpen ? 'active' : ''}`} >
                    <button onClick={toggleMenu}>
                        {isMenuOpen ? <RxCross2 size={24} /> : <RxHamburgerMenu size={24} />}
                    </button>
                    <div className="text-center">
                        <img 
                            src={"/assets/img/motor-sights-international.png"} 
                            width={200}
                            alt=""
                        />
                    </div>
                </HeaderMobile>
            )}
            <StyleSideMenu 
                xs="2" 
                className={`p-lg-3 p-0 pe-0 vh-100${isMobile ? ' mobile-menu ' : ''}${isMenuOpen ? ' open' : ''}`}
            >
                <div className='page-sidebar overflow-auto h-100' >
                    {isMobile ?
                    <div className='action-profile text-center mt-4'>
                        <img src={'/assets/img/avatar5.png'} width={80} className='rounded-circle' />
                        <div className='profile-dropdown mx-2'>
                            <h5 className='m-0 h6'>{employee?.name || ''}</h5>
                            <small>{employee?.title?.name || ''}</small>
                        </div>
                    </div>
                    :
                    <div className="text-center">
                        <img 
                            src={"/assets/img/motor-sights-international.png"} 
                            className="img-fluid" 
                            alt=""
                        />
                    </div>
                    }
                    <ul className="list-unstyled my-5">
                        {profile.user.username === 'admin' && (
                            <li className={`mb-2`}>
                                <Link to={'/dashboard'} className={`${isActive('/dashboard') ? 'active' : ''}`}>
                                    <RxDashboard className='me-2' />Dashboard 
                                </Link>
                            </li>
                        )}
                        {systems.map((system, idx) => {
                            const isOpen = openIndex === idx || isMenuGroupActive(system);
                            return (
                            <li key={system.system_name + idx} className={`mb-2 ${isOpen ? ' current' : ''}`}>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-light w-100 text-start dropdown-toggle"
                                        type="button"
                                        id={`dropdownMenuButton${idx}`}
                                        // data-bs-toggle="dropdown"
                                        onClick={() => handleToggle(idx)}
                                        aria-expanded={isOpen}
                                    >
                                        {getSystemIcon(system.system_name)}{system.system_name}
                                    </button>
                                    <ul
                                        className={`dropdown-menu pb-0 w-100${isOpen ? ' show' : ''}`}
                                        aria-labelledby={`dropdownMenuButton${idx}`}
                                        style={{ position: 'static', float: 'none' }}
                                    >
                                        {system.access_list.map((menu, i) => (
                                            <li key={menu.menu_name + i} className={``}>
                                                <Link 
                                                    to={`/${slugify(system.system_name)}/${slugify(menu.menu_name)}`} 
                                                    className={`dropdown-item${isActive(`/${slugify(system.system_name)}/${slugify(menu.menu_name)}`) ? ' current' : ''}`} 
                                                    href="#"
                                                    onClick={() => isMobile && setIsMenuOpen(false)}
                                                >
                                                    {menu.menu_name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        )})}
                        {isMobile && (
                            <li>
                                <Link className='text-danger' reloadDocument to={'/logout'}><IoIosLogOut className='me-2' />Logout</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </StyleSideMenu>
            {isMobile && isMenuOpen && <Overlay onClick={toggleMenu} />}
        </>
    )
}

const HeaderMobile = styled.div`
    position: sticky;
    top: 0;
    z-index: 1050;
    transition: all 0.3s ease;
    background-color:#fff;
    box-shadow: 15px -8px 15px #000;
    &.active {
        transform: translateX(17.5rem);
    }
    button { 
        background: var(--color-main, #0253A5);
        color: white;
        border: none;
        border-radius: 3px;
        padding: 5px 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const StyleSideMenu = styled(Col)`
    position: sticky;
    left: 0;
    top:0;
    .page-sidebar {
        padding: 1rem;
        background-color: #dfe8f2;
        border-radius: 10px;
    }
    li {
        a, button {
            text-decoration: none;
            color:var(--color-text);
            font-family: var(--font-primary);
            display: block;
            align-items: center;
            padding:8px 10px;
            position: relative;
            font-size: 1rem;
            background-color: transparent;
            border: none;
            &.active {
                background-color:rgba(2, 83, 165, 0.08);
                color:var(--color-main);
                font-family: var(--font-main-bold);
                    
                &::before {
                    content:'';
                    position: absolute;
                    left:0;
                    top:0;
                    bottom:0;
                    width: 2px;
                    background-color: var(--color-main);
                }
            }
        }
        ul {
            padding-left: 1.7rem;
            li {
                padding-top:0px;
                padding-bottom:0px;
                a {
                    font-size: .89rem;
                }
            }
        }
    }
    .dropdown-toggle {
        &:hover {
            background-color: transparent;
            border-color:transparent;
        }
    }
    .dropdown-menu {
        margin-top: 0;
        border:0;
        border-radius: 0 0 8px 8px;
        background-color: transparent;
    }
    .current {
        .dropdown-toggle {
            background-color:#fff;
            color:var(--color-main);
            font-family: var(--font-main-bold);
                
            &::before {
                content:'';
                position: absolute;
                left:0;
                top:0;
                bottom:0;
                width: 2px;
                background-color: var(--color-main);
            }
        }
        .current {
            position: relative;
            color:var(--color-main);
            font-family: var(--font-main-bold);
        }
    }
    
    /* Mobile menu styles */
    &.mobile-menu {
        position: fixed;
        top: 0;
        width: 20em !important;
        max-width: 20em;
        left: -20em;
        transition: left 0.3s ease-in-out;
        z-index: 1030;
        background-color: white;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        margin: 0;
        
        &.open {
            left: 0;
        }
    }
    
    @media (max-width: 1024px) {
        display: block;
    }
`