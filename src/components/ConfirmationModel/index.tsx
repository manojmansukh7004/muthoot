import React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Colors from "config/Colors";
import { APP_FONTS, FONT_SIZE } from "config/Fonts";
import useFontNormalise from 'hooks/useFontNormalise';

interface ConfirmRejectModalProps {
  isVisible: boolean;
  title?: string;  // Optional title prop
  message: string;  // Message prop
  button1Title?: string;
  button2Title?: string;
  button3Title?: string;
  cibil?: boolean;
  onConfirm: () => void;
  onCibilConfirm?: () => void ;
  onClose: () => void;
}

const ConfirmationModel: React.FC<ConfirmRejectModalProps> = ({
  isVisible,
  title = 'WARNING!!!', // Default title if not provided
  message,
  button1Title = 'YES',
  button2Title = 'NO',
  button3Title,
  onConfirm,
  onCibilConfirm,
  onClose,
  cibil = false
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.TitleText}>{title}</Text> 
          <Text style={styles.messageText}>{message}</Text> 
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                onConfirm();
              }}
              style={styles.Button}>
              <Text style={styles.SuccessText}>{button1Title}</Text>
            </TouchableOpacity>
           {button3Title&& <TouchableOpacity
              onPress={() => {
                onCibilConfirm?.();
              }}
              style={styles.Button}>
              <Text style={styles.CloseText}>{button3Title}</Text>
            </TouchableOpacity>}
            {!cibil&&<TouchableOpacity
              onPress={onClose}
              style={styles.Button}>
              <Text style={styles.CloseText}>{button2Title}</Text>
            </TouchableOpacity>}
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ConfirmationModel;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  TitleText: {
    alignSelf: 'center',
    fontSize: useFontNormalise(19),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
    // color: Colors.Red,
    textTransform: 'capitalize',
  },
  messageText: {
    fontSize: useFontNormalise(15),
    fontFamily: APP_FONTS.Medium,
    color: 'black',
    marginVertical: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop:10
  },
  Button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '40%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor:Colors.Button,
    borderColor:Colors.White,
    // margin:10  
  },
  SuccessText: {
    color: Colors.White,
    fontSize: useFontNormalise(13),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
  },
  CloseText: {
    color: Colors.White,
    fontSize: useFontNormalise(13),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
  },
});

