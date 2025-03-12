import Colors from 'config/Colors';
import { APP_FONTS, FONT_SIZE } from 'config/Fonts';
import useFontNormalise from 'hooks/useFontNormalise';
import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    backgroundColor: Colors.Primary,
    right: 0,
    bottom: 0,
  },
  avatarContainer: {
    position: 'absolute',
    margin: 30,
    backgroundColor: Colors.Primary,
    right: 0,
    bottom: 0,
    height: 55,
    width: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.LightGrey,
    backgroundColor: Colors.Secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.Black,
    paddingVertical: 5,
  },
  LeadButtonText: {
    color: Colors.Black,
    fontFamily: APP_FONTS.Regular,
    fontSize: useFontNormalise(17),
    textAlign: 'center',
  },
  Selection: {
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 20,
    backgroundColor: Colors.Button,
    width: (width * 30) / 100,
    justifyContent: 'center',
  },
  UnSelected: {
    paddingVertical: 5,
    borderRadius: 10,
    // marginHorizontal: 20,
    justifyContent: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    height: 2,
    backgroundColor: Colors.Button,
    paddingHorizontal: 50,
    alignSelf: 'center',
  },
  TileText: {
    color: Colors.Black,
    fontFamily: APP_FONTS.Medium,
    fontSize: useFontNormalise(13),
  },
  TileTextHighlight: {
    fontSize: useFontNormalise(14),
    fontFamily: APP_FONTS.Roboto_Medium,
    color: Colors.Black,
    marginTop: 2,
    width: '90%'
    // fontWeight:'700'
  },
  ApplicantIdFont: {
    color: Colors.Black,
    fontFamily: APP_FONTS.Roboto_Regular,
    fontSize: useFontNormalise(12),
    // fontWeight:'700'
  },
  leadLabel: {
    color: Colors.LabelGrey,
    fontFamily: APP_FONTS.Roboto_Regular,
    fontSize: useFontNormalise(12),
  },

  listBoxStyle: {
    flex: 1,
    backgroundColor: Colors.White,
    shadowColor: Colors.Black,
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowOffset: { height: 0.5, width: 0.5 },
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    marginBottom: 10,
    marginTop: 1,
    padding: 10,
    borderRadius: 8,

  },
  tabularLayout: {
    width: '33%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 8,
    // backgroundColor: 'red'
  },
  dataContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: "flex-start",
    flexWrap: 'wrap'
    // backgroundColor: 'red'
  },
  divider:{borderColor: Colors.PlaceHolderGrey, height:.5, borderWidth: .3, flexDirection: 'row'},
  lableStyle: {
    color: Colors.LabelGrey,
    fontFamily: APP_FONTS.Roboto_Regular,
    fontSize: FONT_SIZE.m,
    marginTop: 5,
    paddingHorizontal: 3

  },
  dataStyle: {
    color: Colors.Black,
    fontFamily: APP_FONTS.Roboto_SemiBold,
    fontSize: FONT_SIZE.l,
    marginTop: 4,
    paddingHorizontal: 3
  },
});
export default styles;
