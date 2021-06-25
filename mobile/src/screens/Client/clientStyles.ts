import { StyleSheet } from "react-native";

const clientStyle = () =>
StyleSheet.create({
    clientButtons: {
        padding: 3,
        marginTop: 3,
        marginBottom: 15,
        width: 256,
        borderRadius: 5,  
    },
    clientCardContainerStyles: {
        marginTop: 10,
        alignItems: "center",
        borderRadius: 20,
    },
    clientCardImageStyle:{
        width: 256,
        height: 256,
        marginTop: 10,
        marginBottom: 10,
        borderColor: "#273263",
        borderWidth: 10,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        overflow: 'hidden',
    },

    clientDetailsContainerStyles: {
        marginTop: 20,
        marginBottom: 20,
        paddingBottom: 15,
        paddingTop: 15,
        alignItems: "center",
        borderRadius: 20,
    },
    clientTextStyle:{
        marginTop: 10,
        marginBottom: 10,
        height: 60,
        width: 350,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
    clientDetailsButtons: {
        alignItems: "center",
        padding: 3,
        marginTop: 5,
        marginBottom: 15,
        width: 350,
        borderRadius: 5,
    },
    clientDetailsView: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        height: 40,
        width: 350,
        marginTop: 15,
        marginBottom: 15,
    },
    clientDetailsCheckboxText: {
        alignContent: "flex-start",
        fontSize:18,
        width: 256,
        marginBottom:15,
    },
    scrollViewStyles:{
        marginHorizontal:5,
    },
    clientDetailsFinalButtons: {
        padding: 3,
        marginTop: 3,
        marginBottom: 15,
        marginLeft:10,
        marginRight:10,
        width: 112,
        borderRadius: 5,  
    },
    disabilityButton:{
        justifyContent:"flex-start",
        width: 184,
    },
    clientDetailsFinalView: {
        alignItems: "center",
        justifyContent: "flex-end",
        display: "flex",
        flexDirection: "row",
        height: 40,
        width: 350,
        marginTop: 15,
        marginBottom: 15,
    },
    riskTitleStyle: {
        
    }
  });

export default clientStyle;