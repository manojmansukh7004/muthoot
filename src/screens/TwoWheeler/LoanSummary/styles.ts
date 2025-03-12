import { StyleSheet } from "react-native";
import Colors from "config/Colors";
import { APP_FONTS, FONT_SIZE } from "config/Fonts";
import useFontNormalise from "hooks/useFontNormalise";

const styles = StyleSheet.create({
    container: {
      height: 'auto',
      marginTop: 10,
      marginBottom: 20,
      flexDirection: 'row',
    },
    leadContainer: {
      height: 'auto',
      paddingHorizontal: 15,
      backgroundColor: Colors.White,
      borderRadius: 8,
      paddingVertical: 5,
      marginVertical: 10,
      elevation: 3,
      
    },
   
    cardContainer: {
      padding: 15,
      marginRight: 15,
      backgroundColor: Colors.White,
      borderRadius: 8,
    },
    activeCardHeaderStyle: {
      color: Colors.Primary,
      fontFamily: APP_FONTS.Roboto_SemiBold,
      fontSize: FONT_SIZE.xl,
    },
    selected: {
      backgroundColor: Colors.LightGrey,
    },
    applicantText: {
      color: Colors.Black,
      fontFamily: APP_FONTS.Roboto_Medium,
      fontSize: useFontNormalise(14),
    },
    appIdText: {
      color: Colors.LabelGrey,
      textAlign: 'center',
      fontSize: useFontNormalise(12),
    },
  });

  
  export default styles