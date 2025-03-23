import { StyleSheet } from "react-native"
import Colors from "config/Colors"
import { APP_FONTS, FONT_SIZE } from "config/Fonts"
import useFontNormalise from "hooks/useFontNormalise";
import { Platform} from 'react-native'

const styles=StyleSheet.create({
    containerbox:{
        width:'100%',
        marginVertical:12,
        alignSelf:'center',
        // backgroundColor: 'red'
    },
    inputbox:{
        borderRadius:15,
        borderColor:Colors.PlaceHolder,
        borderWidth:1,
        paddingLeft:10,
        marginTop:10,
        color:Colors.Black,
        fontSize:useFontNormalise(14),
        paddingVertical:8,
        height: 
        Platform.OS == 'android' ? useFontNormalise(42): useFontNormalise(35),
        // height: 'auto',       

    },
    labelStyle:{
        fontFamily:APP_FONTS.Medium,
        fontSize:FONT_SIZE.s
    },
    errorMessagge:{
        marginTop:useFontNormalise(2),
        fontSize: useFontNormalise(11),
        color: Colors.Red,
        fontFamily: APP_FONTS.Medium,
    }
})
export default styles;