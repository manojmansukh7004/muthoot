import { StyleSheet } from "react-native";

import Colors from "config/Colors";
import { APP_FONTS, FONT_SIZE } from "config/Fonts";
import useFontNormalise from "hooks/useFontNormalise";


const styles = StyleSheet.create({
    dobContainer: {
      marginVertical: 15,
      width: '90%',
      alignSelf:'center'
    },
    inputbox: {
      borderRadius: 15,
      borderColor: Colors.PlaceHolder,
      borderWidth: 1,
      color: Colors.Black,
      fontSize: useFontNormalise(14),
      width: '100%',
      paddingLeft: 10,
      justifyContent: 'center',
      paddingVertical:10
    },
    ButtonText: {
      color: Colors.Black,
      fontFamily: APP_FONTS.Regular,
      fontSize: useFontNormalise(12),
    },
    labelStyle:{
      color:Colors.LabelGrey,
      fontFamily:APP_FONTS.Medium,
      fontSize:FONT_SIZE.s
  }, 
   labelText: {
    color: Colors.LabelGrey,
    fontFamily: APP_FONTS.Medium,
    fontSize: FONT_SIZE.s,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  TitleText: {
    alignSelf: 'center',
    fontSize: useFontNormalise(19),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
    color: Colors.Red,
    textTransform: 'capitalize',
  },
  messageText: {
    fontSize: useFontNormalise(15),
    fontFamily: APP_FONTS.Medium,
    color: 'black',
    marginVertical: 20,
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: '4%',
    alignItems: 'center',

    shadowColor: '#000',
    elevation:5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    paddingHorizontal: '6%',
    shadowOpacity: 2,
  },
  Button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor:Colors.Button,
    borderColor:Colors.White,
    margin:10  
  },
  CloseText: {
    color: Colors.White,
    fontSize: useFontNormalise(13),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
  },
  SuccessText: {
    color: Colors.White,
    fontSize: useFontNormalise(13),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
  },


  });
  
  export default styles;