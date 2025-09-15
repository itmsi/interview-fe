import React, { useEffect, useRef, useState } from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { Tooltip as BsTooltip } from "bootstrap";
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axios from 'axios';

// Extend dayjs with plugins
dayjs.extend(customParseFormat);

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

const getHeaders = (token, extra = {}) => {
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        ...extra,
    };
}

export const apiGet = async(BASE_URL, endpoint, token, options = {}) => {
    try {
        let url = `${BASE_URL}${endpoint}`;
        
        // Add query parameters if provided
        if (options.params && typeof options.params === 'object') {
            const query = new URLSearchParams(options.params).toString();
            url += `?${query}`;
        }
        
        const response = await fetch(url, {
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

export const apiPost = async(BASE_URL, endpoint, token, body) => {
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
    
    const responseData = await response.json();
    
    if (responseData?.status === false) {
        throw new Error('Gagal untuk post');
    }
    
    return responseData;
}

export const apiPostFormData = async(BASE_URL, endpoint, token, formData) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: formData, // FormData object
    });
    if (!response.ok) {
        let errorMessage = 'Failed to post form data';
        try {
            const errorData = await response.json();
            errorMessage = errorData?.message || errorMessage;
        } catch (e) {
        }
        throw new Error(errorMessage);
    }
    
    const responseData = await response.json();
    
    if (responseData?.status === false) {
        throw new Error('Gagal untuk post form data');
    }
    
    return responseData;
}

export const apiPut = async(BASE_URL, endpoint, token, body = {}, options = {}) => {
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
    
    // Get response data
    const responseData = await response.json();
    
    // Check if response status is false
    if (responseData?.status === false) {
        throw new Error('Gagal untuk update');
    }
    
    return responseData;
}

export const apiPatch = async(BASE_URL, endpoint, token, body = {}, options = {}) => {
    let url = `${BASE_URL}${endpoint}`;
    if (options.params && typeof options.params === 'object') {
        const query = new URLSearchParams(options.params).toString();
        url += `?${query}`;
    }
    const response = await fetch(url, {
        method: 'PATCH',
        headers: getHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Failed to patch');
    
    // Get response data
    const responseData = await response.json();
    
    // Check if response status is false
    if (responseData?.status === false) {
        throw new Error('Gagal untuk patch');
    }
    
    return responseData;
}

export const apiPatchFormData = async (
    BASE_URL,
    endpoint,
    token,
    data,
    options = {}
) => {
    let url = `${BASE_URL}${endpoint}`;

    if (options.params && typeof options.params === "object") {
        const query = new URLSearchParams(options.params).toString();
        url += `?${query}`;
    }

    const formData = new FormData();
    if (data instanceof FormData) {
        data.forEach((value, key) => formData.append(key, value));
    } else {
        Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            formData.append(key, value);
        }
        });
    }

    const response = await axios.patch(url, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    return response.data;
};
export const apiDelete = async(BASE_URL, endpoint, token, options = {}) => {
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
    
    // Get response data
    const responseData = await response.json();
    
    // Check if response status is false
    if (responseData?.status === false) {
        throw new Error('Gagal untuk delete');
    }
    
    return responseData;
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

export const SortableDateHeader = ({ label, columnKey, sortConfig, onSort }) => {
    const isActive = sortConfig.key === columnKey;
    const isAsc = sortConfig.direction === 'asc';

    const handleDateSort = () => {
        onSort(columnKey, 'date'); // Pass 'date' as type indicator
    };

    return (
        <th style={{ cursor: 'pointer' }} onClick={handleDateSort}>
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

export const sortDataByDate = (data, key, direction = 'asc') => {
    return [...data].sort((a, b) => {
        // Parse date format "28/05/2025 3:00:00" to Date object
        const parseDate = (dateStr) => {
            if (!dateStr) return new Date(0);
            
            // Split date and time
            const [datePart, timePart = '00:00:00'] = dateStr.split(' ');
            const [day, month, year] = datePart.split('/');
            
            // Create date string in format "YYYY-MM-DD HH:mm:ss"
            const isoDateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${timePart}`;
            return new Date(isoDateStr);
        };

        const dateA = parseDate(a[key]);
        const dateB = parseDate(b[key]);

        if (direction === 'asc') {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });
};

export const formatDate = (date, includeTime = true) => {
    if (!date) return '';
    
    let dateObj;
    
    if (typeof date === 'string' && date.includes('/')) {
        const [datePart, timePart = '00:00:00'] = date.split(' ');
        const [day, month, year] = datePart.split('/');
        const isoDateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${timePart}`;
        dateObj = new Date(isoDateStr);
    } else {
        dateObj = new Date(date);
    }
    
    if (isNaN(dateObj.getTime())) return '';
    
    let dateStr = dayjs(dateObj).format('DD MMM YYYY');
    
    if (includeTime) {
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');
        return `${dateStr} ${hours}:${minutes}:${seconds}`;
    }
    
    return dateStr;
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

export const AnimatedLoadingSpinner = ({text}) => (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="loading-spinner mb-3"></div>
        <p className="text-muted fs-14">Loading {text}...</p>
    </div>
);