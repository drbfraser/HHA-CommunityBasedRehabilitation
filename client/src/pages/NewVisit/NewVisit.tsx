import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Step,
    StepContent,
    StepLabel,
    Stepper,
} from "@material-ui/core";
import { Formik } from "formik";
import { useState } from "react";
import { initialValues, validationSchema } from "./formFields";
import { handleSubmit } from "./formHandler";

interface IImprovement {
    provided: string;
    description: string;
}

interface IVisit {
    visitLabel: string;
    visitType: boolean;
    setVisitType: React.Dispatch<React.SetStateAction<boolean>>;
    // //improvements: IImprovement;
    // goalStatus: string;
    // goalOutcome: string;
}

const NewVisit = () => {
    const [intermStep, setIntermStep] = useState<boolean>(true);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [isHealthVisit, setIsHealthVisit] = useState<boolean>(false);
    const [isEducationVisit, setIsEducationVisit] = useState<boolean>(false);
    const [isSocialVisit, setIsSocialVisit] = useState<boolean>(false);

    const visits: IVisit[] = [
        {
            visitLabel: "Health",
            visitType: isHealthVisit,
            setVisitType: setIsHealthVisit,
        },
        {
            visitLabel: "Education",
            visitType: isEducationVisit,
            setVisitType: setIsEducationVisit,
        },
        {
            visitLabel: "Social",
            visitType: isSocialVisit,
            setVisitType: setIsSocialVisit,
        },
    ];

    const nextStep = () => {
        setIntermStep(true);
        if (activeStep < 2) {
            setActiveStep(activeStep + 1);
        } else {
            setActiveStep(0);
        }
    };

    return (
        <div>
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step key={0}>
                    <StepLabel>Visit Focus</StepLabel>
                    <StepContent>
                        <FormControl component="fieldset">
                            <FormLabel>Select the Reasons for the Visit</FormLabel>
                            <FormGroup>
                                {visits.map((visit) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={visit.visitLabel}
                                                checked={visit.visitType}
                                                onChange={(event) =>
                                                    visit.setVisitType(event.target.checked)
                                                }
                                            />
                                        }
                                        label={visit.visitLabel}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                        <Button onClick={nextStep}>Add Step</Button>
                    </StepContent>
                </Step>
                {visits.map((visit => {
                    return(visit.visitType ? 
                    <Step>
                        <StepLabel>{visit.visitLabel} Visit</StepLabel>
                    </Step> 
                    : null);
                }))}
            </Stepper>
            <Button onClick={nextStep}>Add Step</Button>
        </div>
    );
};

export default NewVisit;
