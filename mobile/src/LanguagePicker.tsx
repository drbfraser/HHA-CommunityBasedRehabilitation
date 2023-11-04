//LanguagePicker.tsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

const LanguagePicker = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { i18n } = useTranslation(); //i18n instance

  //array with all supported languages
  const languages = [
    { name: "en", label: "English" },
    { name: "ne", label: "NotEnglish" },
  ];

  const LanguageItem = ({ name, label }: { name: string; label: string }) => (
    <Pressable
      onPress={() => {
        i18n.changeLanguage(name); 
        setModalVisible(!modalVisible);
      }}
    >
      <Text >{label}</Text>
    </Pressable>
  );

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View >
          <View >
            {languages.map((lang) => (
              <LanguageItem {...lang} key={lang.name} />
            ))}
          </View>
        </View>
      </Modal>
      <Pressable
        
        onPress={() => setModalVisible(true)}
      >
        <Text >{i18n.language}</Text>
      </Pressable>
    </View>
  );
};

export default LanguagePicker;