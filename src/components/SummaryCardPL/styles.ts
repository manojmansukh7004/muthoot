import Colors from "config/Colors";
import { APP_FONTS, FONT_SIZE } from "config/Fonts";
import { StyleSheet } from "react-native";
import useFontNormalise from 'hooks/useFontNormalise';

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    paddingHorizontal: 15,
    backgroundColor: Colors.White,
    borderRadius: 8,
    paddingVertical: 5,
    marginVertical: 10,
    elevation: 3,
  },
  verifiedTickStyle: {
    height: 20,
    width: 20,
    marginTop: 12,
  },
  childContainer: {
    position: 'relative',
  },
  flexRowStyle: {
    flexDirection: 'row',
  },
  cifIDText: {
    fontFamily: APP_FONTS.Roboto_Regular,
    color: Colors.Black,
    fontSize: FONT_SIZE.l,
    alignSelf: 'center',
  },
  pendingTextLabels: {
    fontFamily: APP_FONTS.Roboto_Regular,
    color: Colors.Black,
    fontSize: FONT_SIZE.l,
    marginTop: 10,
  },
  border: {
    position: 'absolute',
    left: -15,
    right: -15,
    bottom: 0,
    height: 0.5,
    backgroundColor: Colors.LabelGrey,
  },
  cardContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  activeCardHeaderStyle: {
    color: Colors.Primary,
    fontFamily: APP_FONTS.Roboto_SemiBold,
    fontSize: FONT_SIZE.xl,
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