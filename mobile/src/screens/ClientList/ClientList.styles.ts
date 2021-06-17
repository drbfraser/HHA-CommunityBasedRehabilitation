import { StyleSheet } from "react-native";

const useStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 0,
    },
    item: {
      padding: 5,
      fontSize: 14,
      height: 44,
    },
    list: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
  });

export default useStyles;
