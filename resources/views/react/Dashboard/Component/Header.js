import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap';
import { IoIosArrowDown, IoMdPerson, IoIosLogOut } from "react-icons/io";
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Header = ({ profile, page }) => {
    const { employee, roles, user } = profile;

    const now = new Date();
    const hour = now.getHours();

    let greet = "Welcome,";
    if (hour >= 0 && hour <= 9) {
        greet = "Good Morning";
    } else if (hour >= 10 && hour <= 11) {
        greet = "Good Day";
    } else if (hour >= 12 && hour <= 15) {
        greet = "Good Afternoon";
    } else if (hour >= 16 && hour <= 23) {
        greet = "Let’s make today count";
    }

    // Ambil hanya first name dari employee.name
    const firstName = employee?.name.split(' ')[0] || '';

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleProfileClick = () => {
        setDropdownOpen((prev) => !prev);
    };

    // Optional: close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <div className='d-flex justify-content-between align-items-center pt-3 pb-2 w-100'>
            <div className='greet'>
                <p className='m-0 lh-sm'>
                    {page === 'Dashboard' ? <>
                        <strong>Hello, {firstName}</strong> <br />
                        <small>{greet}</small>
                    </> : <>
                        <strong>{page}</strong> <br />
                        <small>All {page} lists</small>
                    </>
                    }
                </p>
            </div>
            <StyleDropdown className='action-profile' ref={dropdownRef}>
                <Button
                    className='thumb-profile'
                    onClick={handleProfileClick}
                >
                    <img src={'/assets/img/avatar5.png'} width={40} />
                    <div className='profile-dropdown mx-2'>
                        <h5 className='m-0'>{employee?.name || ''}</h5>
                        <small>{employee?.title?.name || ''}</small>
                    </div>
                    <IoIosArrowDown />
                </Button>
                {dropdownOpen && 
                <div className='onhover-dropdown'>
                    <ul className='list-unstyled m-0'>
                        <li>
                            <Link to={'/profile'}><IoMdPerson className='me-2' />My Profile</Link>
                        </li>
                        <li>
                            <Link className='text-danger' reloadDocument to={'/logout'}><IoIosLogOut className='me-2' />Logout</Link>
                        </li>
                    </ul>
                </div>
                }
            </StyleDropdown>
        </div>
    )
}

const StyleDropdown = styled.div `
    position: relative;
    .thumb-profile {
        display: flex;
        align-items: center;
        text-align: left;
        line-height: 1.25;
        border: 1px solid rgba(2, 83, 165, 0.1);
        background-color: transparent;
        color: var(--color-text);
        transition: all 0.3s ease;
        &:active, &:focus {
            background-color: transparent;
            color:var(--color-text);
            border: 1px solid rgba(2, 83, 165, 0.1);
        }
    }
    .profile-dropdown {
        h5 {
            font-size: 1rem;
            font-family: var(--font-main-bold);
        }
    }
    .onhover-dropdown {
        position: absolute;
        left: 1rem;
        right: 1rem;
        z-index: 1;
        background: #fafafa;
        padding: 10px;
        border-radius: 8px;
        top:120%;
        li {
            margin-bottom: .5rem;
        }
        a {
            text-decoration: none;
            color:var(--color-text);
            font-family: var(--font-primary);
            display: inline-flex;
            align-items: center;
            padding-left: 0;
            padding-right: 0;
            font-size: .89rem;
        }
    }
`