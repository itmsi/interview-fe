import React, { useEffect, useRef, useState } from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { Tooltip as BsTooltip } from "bootstrap";
import { useLocation } from 'react-router-dom';

const placeholderProfileImage = '/assets/img/avatar.png';
export const onImageProfileError = (e) => {
    e.target.src = placeholderProfileImage
}

export const ImageProfileSrc = ({ src, alt, className = "", width="auto" }) => {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            className={className}
            onError={onImageProfileError}
        />
    );
}
export const isActive = (path) => location.pathname.startsWith(path);
export const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
export const isMenuGroupActive = (system) => {
    return system.access_list.some(menu =>
        isActive(`/${slugify(system.system_name)}/${slugify(menu.menu_name)}`)
    );
};

const BASE_URL = process.env.REACT_APP_ENDPOINT_APP;

const getHeaders = (token, extra = {}) => {
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        ...extra,
    };
}

export const apiGet = async(endpoint, token) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(token),
        });
        if (!response.ok) {
            let errorMessage = 'Failed to fetch';
            try {
                const errorData = await response.json();
                errorMessage = errorData?.message || errorMessage;
            } catch (e) {
                // response is not JSON or other error
            }
            throw new Error(errorMessage);
        }
        return response.json();
    } catch (error) {
        throw new Error('URL tidak dapat diakses');
    }
}

export const apiPost = async(endpoint, token, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        let errorMessage = 'Failed to post';
        try {
            const errorData = await response.json();
            errorMessage = errorData?.message || errorMessage;
        } catch (e) {
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export const apiPut = async(endpoint, token, body = {}, options = {}) => {
    let url = `${BASE_URL}${endpoint}`;
    if (options.params && typeof options.params === 'object') {
        const query = new URLSearchParams(options.params).toString();
        url += `?${query}`;
    }
    const response = await fetch(url, {
        method: 'PUT',
        headers: getHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Failed to update');
    return response.json();
}

export const apiDelete = async(endpoint, token, options = {}) => {
    let url = `${BASE_URL}${endpoint}`;
    if (options.params && typeof options.params === 'object') {
        const query = new URLSearchParams(options.params).toString();
        url += `?${query}`;
    }
    const response = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete');
    return response.json();
}

export const SortableHeader = ({ label, columnKey, sortConfig, onSort }) => {
    const isActive = sortConfig.key === columnKey;
    const isAsc = sortConfig.direction === 'asc';

    return (
        <th style={{ cursor: 'pointer' }} onClick={() => onSort(columnKey)}>
            <div className='d-flex justify-content-between align-items-center'>
                {label}
                <span className="sortTable">
                    <span className={isActive && isAsc ? 'active' : ''}><FaSortUp /></span>
                    <span className={`ceret-down${isActive && !isAsc ? ' active' : ''}`}><FaSortDown /></span>
                </span>
            </div>
        </th>
    );
};

export const getBadgeVariant = (status) => {
    switch (status) {
    case 'Complete':
        return 'success';
    case 'submit':
        return 'success';
    case 'Interviewed':
        return 'primary';
    case 'save':
        return 'secondary';
    default:
        return 'info';
    }
};

export const Tooltips = ({children, title, position, nameClass = ''}) => {
    const childRef = useRef(undefined);

    useEffect(() => {
        const t = new BsTooltip(childRef.current, {
            title: title,
            placement: position,
            customClass: nameClass,
            trigger: "hover"
        })
        return () => t.dispose()
    }, [title])

    return React.cloneElement(children, { ref: childRef })
}

export const useSystemFromUrl = (systemsData) => {
    const location = useLocation();

    const pathParts = location.pathname.split('/').filter(Boolean);
    const slug = pathParts[0];

    const matchedSystem = systemsData.find(
        (system) => system.system_name.toLowerCase() === slug.toLowerCase()
    );

    return matchedSystem;
};

export const useWindowSize = () => {
    const [width, setWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleWindowSizeChange = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowSizeChange);

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    const isMobile = width <= 1024;
    
    return { width, isMobile };
};

export const getImageBase64 = async (imagePath) => {
    try {
        const response = await fetch(imagePath)
        const blob = await response.blob()
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        console.error('Failed to load image:', error)
        return null
    }
}