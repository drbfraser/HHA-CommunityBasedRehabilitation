//LanguagePicker.tsx
import useStyles from "./LanguagePicker.style";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Pressable } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { 
    isThisExportingString, 
    ClientField, 
    clientFieldLabels, 
    getCurrentLanguage, 
    getCurrentLanguageObject,
    getTranslationForFirstName,
 } from "@cbr/common";



const LanguagePicker = () => {

    const styles = useStyles();
    const [modalVisible, setModalVisible] = useState(false);
    const { i18n } = useTranslation(); //i18n instance
    const { t } = useTranslation();

    //array with all supported languages 
    const languages = [
        { name: "en", label: "English" },
        { name: "bari", label: "Bari" },
    ];

    const saveLanguage = async (name: string) => {
        try {
            await AsyncStorage.setItem("language", name);
            console.log("Language saved", name);
        } catch (e) {
            console.error(e);
        }
    }
    const LanguageItem = ({ name, label }: { name: string; label: string }) => (
        <Button
            mode={"contained"}
            style={styles.languageButton}
            onPress={() => {
                i18n.changeLanguage(name);
                saveLanguage(name);
                setModalVisible(!modalVisible);
            }}
        >
            {label}
        </Button>
    );
    const getLangName = (name: string) => {
        const lang = languages.find((lang) => lang.name === name);
        return lang ? lang.label : name;
    };

    // Debugging
    console.log("");
    console.log("-------- Mobile ----------");
    console.log("Current language: ", i18n.language);
    console.log("-------- Common ----------");
    console.log("isThisExportingString?: ", isThisExportingString);
    console.log("clientFieldLabels[ClientField.firstName]: ", clientFieldLabels[ClientField.firstName]);
    console.log("clientFieldLabels: ", clientFieldLabels);
    console.log("getCurrentLanguage(): ", getCurrentLanguage());
    console.log("getCurrentLanguageObject(): ", getCurrentLanguageObject());
    console.log("getTranslationForFirstName(): ", getTranslationForFirstName());
    console.log("");


    return (
        <View>
            <Pressable onPress={() => setModalVisible(true)}>
                <Text style={styles.displayText}>
                    <Text style={styles.selectedText}>{t("languagePicker.selectedLanguage")} </Text>
                    <Text>{getLangName(i18n.language)}</Text>
                </Text>                    
            </Pressable>
            
            <Portal>
                <Modal
                    visible={modalVisible}
                    style={styles.modalStyle}
                    onDismiss={() => {
                        setModalVisible(false);
                    }}

                >
                    <View>
                        <Text 
                            style={styles.selectTitle}
                        >
                            {t("languagePicker.selectLanguage")}
                        </Text>
                        <View>
                            {languages.map((lang) => (
                                <LanguageItem {...lang} key={lang.name} />
                            ))}
                        </View>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

export default LanguagePicker;
