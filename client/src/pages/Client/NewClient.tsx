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

    test = (e: any) => {
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
                    <div className="col-lg-2 ml-md-5">
                        <div
                            className={`card ${styles.profileImgContainer} mb-5 mt-4 ${styles.profileCard}`}
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
                                        onChange={this.test}
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
