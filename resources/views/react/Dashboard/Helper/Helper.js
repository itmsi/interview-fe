import { FaSortUp, FaSortDown } from 'react-icons/fa';


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
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
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