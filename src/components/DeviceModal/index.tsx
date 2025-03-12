import React, { FC } from 'react';
import {
  Modal as ReactNativeModal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from './styles';
import Colors from 'config/Colors';
import { APP_FONTS } from 'config/Fonts';

interface ModalProps {
  onClose: () => void;
  title?: string;
  message?: string;
  Close?: string;
  visible?: boolean;
  buttonTitle?: string;
  tc?: boolean;
  isRejected?: boolean;
  popMessage?: boolean;
  appVersion?: boolean;
  credit?: boolean;
  isCopied?: boolean;
  copied: () => void;

}

const DeviceModal: FC<ModalProps> = ({
  onClose,
  message,
  visible,
  copied,
  isCopied
}) => {
  const handleOnClose = () => {
    onClose();
  };

  return (
    <ReactNativeModal
      visible={visible}
      animationType="slide"
      style={{ marginLeft: -16 }}
      onRequestClose={handleOnClose}
      transparent>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  }}>
        <View style={styles.modalOverlay} />
        <View
          style={{
            backgroundColor: '#fff',
            // paddingHorizontal: 20,
            paddingVertical: 15,
            elevation: 2,
            width: '85%',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.text}>Your device ID is given below</Text>
           <Text style={styles.messageText}>{message}</Text>
           <TouchableOpacity
            onPress={copied}
            style={[
              styles.CopyButton
            ]}>
          <Text style={!isCopied?styles.CopyText:styles.CopiedText}>{!isCopied?"Copy":"Copied"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOnClose}
            style={[
              styles.Button
            ]}>
          <Text style={styles.CloseText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default DeviceModal;