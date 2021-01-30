import React, { Component } from "react";
import styles from "./NewClient.module.css";

class NewClient extends Component {
    render() {
        return (
            <>
                {/* <div className="row">
          <i className="fa fa-arrow-left"></i> BACK TO CLIENT LIST
        </div> */}
                <div className="row justify-content-md-center">
                    <div className="col-lg-2 ml-md-5">
                        {/* <div className="card" style={{height:"150px"}}></div> */}
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
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="lastName">
                                            LAST NAME <span className="text-danger">*</span>:{" "}
                                        </label>
                                        <input id="lastName" type="text" className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="birthdate">
                                            BIRTHDATE <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="birthdate"
                                            type="date"
                                            className="form-control"
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
                                        <label htmlFor="villageNumber">
                                            VILLAGE NO. <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="villageNumber"
                                            type="number"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="gender">
                                            ZONE <span className="text-danger">*</span>:{" "}
                                        </label>
                                        <select id="gender" className="form-control">
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
                                        <input id="contact" type="text" className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col">
                                        <label htmlFor="interview form-check-label">
                                            CONSENT TO INTERVIEW?{" "}
                                            <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="interview"
                                            type="checkbox"
                                            className={`form-check-input ${styles.checkbox}`}
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="caregiver form-check-label">
                                            CAREGIVER PRESENT?{" "}
                                            <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            id="caregiver"
                                            type="checkbox"
                                            className={`form-check-input ${styles.checkbox}`}
                                        />
                                    </div>
                                </div>
                            </div>

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
                            <div className="row mt-4 mb-5">
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
                                <div className="col-8 mt-3">
                                    <div className="col">
                                        <label htmlFor="healthRequirement">
                                            REQUIRES <span className="text-danger">*</span>:
                                        </label>
                                        <textarea id="healthRequirement" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-8 mt-3">
                                    <div className="col">
                                        <label htmlFor="healthGoals">
                                            GOALS <span className="text-danger">*</span>:
                                        </label>
                                        <textarea id="healthGoals" className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4 mb-5">
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
                                <div className="col-8 mt-3">
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
                                <div className="col-8 mt-3">
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
                                <div className="col-8 mt-3">
                                    <div className="col">
                                        <label htmlFor="socialRequirement">
                                            REQUIRES <span className="text-danger">*</span>:
                                        </label>
                                        <textarea id="socialRequirement" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-8 mt-3">
                                    <div className="col">
                                        <label htmlFor="socialGoals">
                                            GOALS <span className="text-danger">*</span>:
                                        </label>
                                        <textarea id="socialGoals" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row float-right mr-5 mb-2">
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
