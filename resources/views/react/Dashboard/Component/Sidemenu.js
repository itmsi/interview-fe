import React, { useState } from 'react'
import { Col } from 'react-bootstrap'
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { AiOutlineAppstore } from 'react-icons/ai';
import { FaWarehouse, FaMoneyBillWave, FaAddressBook, FaUserFriends } from 'react-icons/fa';
import { isActive, isMenuGroupActive, slugify, } from '../Helper/Helper';

export const Sidemenu = ({ systems }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
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
        <StyleSideMenu xs="2" className='p-3 pe-0 vh-100'>
            <div className='page-sidebar overflow-auto h-100'>
                <div className="text-center">
                    <img 
                        src={"/assets/img/motor-sights-international.png"} 
                        className="img-fluid" 
                        alt=""
                    />
                </div>
                <ul className="list-unstyled my-5">
                    <li className={`mb-2`}>
                        <Link to={'/dashboard'} className={`${isActive('/dashboard') ? 'active' : ''}`}>
                            <RxDashboard className='me-2' />Dashboard 
                        </Link>
                    </li>
                    {systems.map((system, idx) => {
                        const isOpen = openIndex === idx || isMenuGroupActive(system);
                        return (
                        <li key={system.system_name + idx} className={`${isOpen ? ' current' : ''}`}>
                            <div className="dropdown">
                                <button
                                    className="btn btn-light w-100 text-start dropdown-toggle"
                                    type="button"
                                    id={`dropdownMenuButton${idx}`}
                                    data-bs-toggle="dropdown"
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
                                            <Link to={`/${slugify(system.system_name)}/${slugify(menu.menu_name)}`} className={`dropdown-item${isActive(`/${slugify(system.system_name)}/${slugify(menu.menu_name)}`) ? ' current' : ''}`} href="#">
                                                {menu.menu_name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    )})}
                </ul>
            </div>
        </StyleSideMenu>
    )
}

const StyleSideMenu = styled(Col) `
    .page-sidebar {
        padding: 1rem;
        background-color: #FAFAFA;
        border-radius: 10px;
    }
    li {
        a, button {
            text-decoration: none;
            color:var(--color-text);
            font-family: var(--font-primary);
            display: inline-flex;
            align-items: center;
            padding:8px 10px;
            position: relative;
            font-size: 1rem;
            
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
        .current {
            position: relative;
            color:var(--color-main);
            font-family: var(--font-main-bold);
            /* &::before {
                content:'';
                position: absolute;
                left:0;
                top:0;
                bottom:0;
                width: 2px;
                background-color: var(--color-main);
            } */
        }
    }
`