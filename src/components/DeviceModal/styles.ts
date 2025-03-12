import Colors from 'config/Colors';
import {APP_FONTS} from 'config/Fonts';
import useFontNormalise from 'hooks/useFontNormalise';
import {StyleSheet, Platform} from 'react-native';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: '4%',
    alignItems: 'center',

    shadowColor: '#000',
    elevation: Platform.OS == 'ios' ? 0 : 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },

    paddingHorizontal: '6%',
    shadowOpacity: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  Button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#1A97DD'
  },
  CopyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  CloseText: {
    color: 'white',
    fontSize: useFontNormalise(13),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
  },
  CopyText: {
    color: '#1A97DD',
    fontSize: useFontNormalise(14),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
    marginTop:10
  },
  CopiedText: {
    color: 'green',
    fontSize: useFontNormalise(14),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
    marginTop:10
  },
  messageText: {
    fontSize: useFontNormalise(13),
    fontFamily: APP_FONTS.Medium,
    color: 'black',
    marginTop: 20,
    textAlign: 'center',
    fontWeight:"bold",
    textDecorationLine:'underline'
  },
  TitleText: {
    alignSelf: 'center',
    fontSize: useFontNormalise(19),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
    color: Colors.Black,
    textTransform: 'capitalize',
  },
  text: {
    fontSize: useFontNormalise(12),
    fontFamily: APP_FONTS.Regular,
    color: 'black',
    // paddingLeft: 10,
    flexWrap: 'wrap',
    // textAlign: 'left',
  },
  
});
export default styles;