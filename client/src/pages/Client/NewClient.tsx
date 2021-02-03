// TODO: Caregiver profile picture <upload>
// TODO: Clean code

import React, { Component } from "react";
import styles from "./NewClient.module.css";

interface FormProps {}

interface FormState {
    profilePicture: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    villageNo: Number;
    zone: string;
    contact: string;
    interviewConsent: boolean;
    hasCaregiver: boolean;
    caregiverContact: string;
    disability: string;
    healthRisk: Number;
    healthRequirement: string;
    healthGoals: string;
    educationStatus: Number;
    educationRequirement: string;
    educationGoals: string;
    socialStatus: Number;
    socialRequirement: string;
    socialGoals: string;
}

class NewClient extends Component<FormProps, FormState> {
    profilePicInputRef: React.RefObject<HTMLInputElement> = React.createRef();

    constructor(props: FormProps, state: FormState) {
        super(props);

        this.state = {
            profilePicture:
                // "data:image/webp;base64,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",
                "data:image/webp;base64,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",
            firstName: "",
            lastName: "",
            birthDate: "",
            gender: "",
            villageNo: 0,
            zone: "",
            contact: "",
            interviewConsent: false,
            hasCaregiver: false,
            caregiverContact: "",
            disability: "",
            healthRisk: 0,
            healthRequirement: "",
            healthGoals: "",
            educationStatus: 0,
            educationRequirement: "",
            educationGoals: "",
            socialStatus: 0,
            socialRequirement: "",
            socialGoals: "",
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onChecked = this.onChecked.bind(this);
    }

    triggerFileUpload = () => {
        this.profilePicInputRef.current!.click();
    };

    onProfilePictureChange = (e: any) => {
        this.setState({
            profilePicture: URL.createObjectURL(e.target.files[0]),
        });
    };

    onInputChange = (e: any) => {
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    };

    onChecked = (e: any) => {
        this.setState({ ...this.state, [e.target.id]: e.target.checked });
    };

    render() {
        return (
            <>
                <div className="row col-sm-12 justify-content-md-center">
                    <div className={`col-lg-2 ${styles.profilePictureBlock}`}>
                        <div
                            className={`card d-block ${styles.profileImgContainer} mb-2 mt-4`}
                        >
                            <img
                                className={`${styles.profilePicture}`}
                                src={this.state.profilePicture}
                                alt="user icon"
                            />
                            <div
                                onClick={this.triggerFileUpload}
                                className={`${styles.uploadIcon} col`}
                            >
                                <div>
                                    <span className="fa fa-upload fa-5x"></span>{" "}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={this.profilePicInputRef}
                                        className="invisible profile-pic-uploader"
                                        onChange={this.onProfilePictureChange}
                                    />
                                </div>
                                <span>Upload Profile Picture</span>
                            </div>
                        </div>
                    </div>
                    <div className="col ml-md-5">
                        <form className="ml-3">
                            <div className="row">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="firstName">
                                            FIRST NAME <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            required
                                            className="form-control"
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="lastName">
                                            LAST NAME <span className="text-danger">*</span>:{" "}
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            className="form-control"
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="birthDate">
                                            BIRTHDATE <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="birthDate"
                                            type="date"
                                            className="form-control"
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="gender">
                                            GENDER <span className="text-danger">*</span>:{" "}
                                        </label>
                                        <select id="gender" className="form-control">
                                            <option value="" selected disabled hidden>
                                                Choose Gender
                                            </option>
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="villageNo">
                                            VILLAGE NO. <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="villageNo"
                                            type="number"
                                            className="form-control"
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="zone">
                                            ZONE <span className="text-danger">*</span>:{" "}
                                        </label>
                                        <select id="zone" className="form-control">
                                            <option value="" selected disabled hidden>
                                                Select Zone
                                            </option>
                                            <option value="bidibidi1">Bidibidi #1</option>
                                            <option value="bidibidi2">Bidibidi #2</option>
                                            <option value="bidibidi3">Bidibidi #3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="contact">
                                            CONTACT NO. <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="contact"
                                            type="text"
                                            className="form-control"
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="interviewConsent form-check-label">
                                            CONSENT TO INTERVIEW?{" "}
                                            <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="interviewConsent"
                                            type="checkbox"
                                            onClick={this.onChecked}
                                            className={`form-check-input ${styles.checkbox}`}
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="hasCaregiver form-check-label">
                                            CAREGIVER PRESENT?{" "}
                                            <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="hasCaregiver"
                                            type="checkbox"
                                            onChange={this.onChecked}
                                            className={`form-check-input ${styles.checkbox}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {this.state.hasCaregiver ? (
                                <div className="row container mt-4 mb-5 ml-lg-2">
                                    <div
                                        className={`col-lg-6 col-md-12 col-sm-12 col-xs-12 ${styles.caregiverInfo}`}
                                    >
                                        <div className="col">
                                            <label htmlFor="caregiverContact">
                                                CAREGIVER CONTACT #:
                                            </label>
                                            <input
                                                id="caregiverContact"
                                                type="text"
                                                onChange={this.onInputChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="row mt-4 mb-5">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="gender">TYPE OF DISABILITY:</label>
                                        <select id="gender" className="form-control">
                                            <option value="" selected disabled hidden>
                                                Select Disability
                                            </option>
                                            <option value="disability1">Option #1</option>
                                            <option value="disability2">Option #2</option>
                                            <option value="disability3">Option #3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="row mt-4">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="healthRisk">
                                            HEALTH RISK <span className="text-danger">*</span>:
                                        </label>
                                        <select id="healthRisk" className="form-control">
                                            <option value="" selected disabled hidden>
                                                Select Risk
                                            </option>
                                            <option value="4">Critical</option>
                                            <option value="3">High</option>
                                            <option value="2">Medium</option>
                                            <option value="1">Low</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 mt-3">
                                    <div className="col">
                                        <label htmlFor="healthRequirement">
                                            REQUIRES <span className="text-danger">*</span>:
                                        </label>
                                        <textarea id="healthRequirement" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 mt-3">
                                    <div className="col">
                                        <label htmlFor="healthGoals">
                                            GOALS <span className="text-danger">*</span>:
                                        </label>
                                        <textarea id="healthGoals" className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="educationStatus">
                                            EDUCATION STATUS <span className="text-danger">*</span>:
                                        </label>
                                        <select id="educationStatus" className="form-control">
                                            <option value="" selected disabled hidden>
                                                Select Risk
                                            </option>
                                            <option value="4">Critical</option>
                                            <option value="3">High</option>
                                            <option value="2">Medium</option>
                                            <option value="1">Low</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 mt-3">
                                    <div className="col">
                                        <label htmlFor="educationRequirement">
                                            REQUIRES <span className="text-danger">*</span>:
                                        </label>
                                        <textarea
                                            id="educationRequirement"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 mt-3">
                                    <div className="col">
                                        <label htmlFor="educationGoals">
                                            GOALS <span className="text-danger">*</span>:
                                        </label>
                                        <textarea id="educationGoals" className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4 mb-5">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="socialStatus">
                                            SOCIAL STATUS <span className="text-danger">*</span>:
                                        </label>
                                        <select id="socialStatus" className="form-control">
                                            <option value="" selected disabled hidden>
                                                Select Risk
                                            </option>
                                            <option value="4">Critical</option>
                                            <option value="3">High</option>
                                            <option value="2">Medium</option>
                                            <option value="1">Low</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 mt-3">
                                    <div className="col">
                                        <label htmlFor="socialRequirement">
                                            REQUIRES <span className="text-danger">*</span>:
                                        </label>
                                        <textarea id="socialRequirement" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 mt-3">
                                    <div className="col">
                                        <label htmlFor="socialGoals">
                                            GOALS <span className="text-danger">*</span>:
                                        </label>
                                        <textarea id="socialGoals" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row float-right mr-3 mb-2">
                                <button type="reset" className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className={`btn ${styles.submitBtn}`}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default NewClient;
