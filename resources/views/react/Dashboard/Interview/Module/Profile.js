import React from 'react'
import { MdOutlineFileDownload, MdOutlineDescription } from "react-icons/md";

export const Profile = ({ token, data, userInfo }) => {
    const personal_information = Array.isArray(data?.personal_information) ? data.personal_information[0] : data?.personal_information;
    const address_information = Array.isArray(data?.address_information) ? data.address_information[0] : data?.address_information;
    const resume = data?.resume || undefined;
    return(
        <>
            <PersonalInformation data={personal_information} />
            <AddressInformation data={address_information} />
            <DownloadResume data={resume} />
        </>
    )
}

const PersonalInformation = ({
    data
}) => {
    return(
        <div className="card mt-4">
            <div className="card-header">
                <h6 className="m-0 font-primary-bold">Personal Information</h6>
            </div>
            <div className="card-body pb-0">
                <div className="row align-items-center">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">
                                Candiate Name
                            </p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_name || "n/a"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Phone</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_phone || "-"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Gender</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_gender || "n/a"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Date of Birth</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_date_birth || "n/a"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Email</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_email || "n/a"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Nationality</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_nationality || "-"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Religion</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_religion || "-"}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Marital status</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_marital_status || "-"}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
const AddressInformation = ({ data }) => {
    return(
        <div className="card mt-4">
            <div className="card-header">
                <h6 className="m-0 font-primary-bold">Address Information</h6>
            </div>
            <div className="card-body pb-0">
                <div className="row">
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Address</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_address || '-'}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">City</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_city || '-'}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">State</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_state || '-'}</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="mb-3">
                            <p className="mb-1 color-label font-primary">Country</p>
                            <h6 className="fw-medium m-0 fs-14">{data?.candidate_country || '-'}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const DownloadResume = ({ data }) => {
    return(
        <div className="card mt-4">
            <div className="card-header">
                <h6 className="m-0 font-primary-bold">Resume</h6>
            </div>
            <div className="card-body pb-0">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                            <span className="avatar border text-dark me-2">
                                <MdOutlineDescription />
                            </span>
                            <div>
                                <h6 className="fw-medium m-0 fs-14">Resume.doc</h6>
                                <span>120 KB</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 text-md-end">
                            <a className="btn btn-dark d-inline-flex align-items-center fs-14 font-primary" href={data} target='_blank' data-discover="true">
                                <MdOutlineFileDownload className='me-1 fs-5' />
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}