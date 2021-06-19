import React, { Component } from "react";
import { SafeAreaView, TextInput, View, Button, ScrollView } from "react-native";
import useStyles from "./visitSurvey.style";
import { Text, Title, List, Appbar, Checkbox } from "react-native-paper";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";

class ExampleOne extends Component {
    static navigationOptions = {
        header: null,
    };

    defaultScrollViewProps = {
        keyboardShouldPersistTaps: "handled",
        contentContainerStyle: {
            flex: 1,
            justifyContent: "center",
        },
    };

    onNextStep = () => {
        console.log("called next step");
    };

    onPaymentStepComplete = () => {
        alert("Visit Focus step completed!");
    };

    onPrevStep = () => {
        console.log("called previous step");
    };

    onSubmitSteps = () => {
        console.log("called on submit step.");
    };

    state = {
        isValid: false,
        errors: true,
    };

    render() {
        return (
            <View style={{ flex: 1, marginTop: 50 }}>
                <ProgressSteps>
                    <ProgressStep
                        label="Visit Focus"
                        onNext={this.onPaymentStepComplete}
                        onPrevious={this.onPrevStep}
                        scrollViewProps={this.defaultScrollViewProps}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text>Visit Focus step content</Text>
                        </View>
                    </ProgressStep>

                    <ProgressStep
                        label="Health Visit"
                        onNext={this.onNextStep}
                        onPrevious={this.onPrevStep}
                        scrollViewProps={this.defaultScrollViewProps}
                        errors={this.state.errors}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text>Health Visit step content</Text>
                        </View>
                    </ProgressStep>
                    <ProgressStep
                        label="Education Visit"
                        onNext={this.onNextStep}
                        onPrevious={this.onPrevStep}
                        scrollViewProps={this.defaultScrollViewProps}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text>Education Visit step content</Text>
                        </View>
                    </ProgressStep>
                    <ProgressStep
                        label="Social Visit"
                        onPrevious={this.onPrevStep}
                        onSubmit={this.onSubmitSteps}
                        scrollViewProps={this.defaultScrollViewProps}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text>Social Visit step content</Text>
                        </View>
                    </ProgressStep>
                </ProgressSteps>
            </View>
        );
    }
}

export default ExampleOne;
