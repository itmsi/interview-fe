import React from 'react'
import { ImageProfileSrc } from '../../Helper/Helper';


export const Notes = ({ token, data, userInfo }) => {
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className="card mt-4">
                <div className="card-body">
                    <p className='m-0'>No notes available.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="card mt-4">
            <div className="card-body">
                <div className="table-responsive">
                    <ul className="list-unstyled notes-candidate">
                        {data.map((note, idx) => (
                            <li key={idx}>
                                <div className="image-profile">
                                    <ImageProfileSrc
                                        src={note.image_profile} 
                                        alt={`${note.name} - ${note.email}`} 
                                        width={"50"} 
                                        className='avatar'
                                    />
                                </div>
                                <div className='description ms-2'>
                                    <div className='header-profile mb-2'>
                                        <div className="left-profile">
                                            <p className="text-dark mb-0">
                                                {note.name}
                                            </p>
                                            <span className="fs-12">{note.role} ({note.role_alias})</span>
                                        </div>
                                        <span className="right-profile">
                                            {note.date_created}
                                        </span>
                                    </div>
                                    <p>{note.note}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
