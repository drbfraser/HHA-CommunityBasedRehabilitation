import { StyleSheet } from "react-native";

const useStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
    list: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
  });

export default useStyles;
