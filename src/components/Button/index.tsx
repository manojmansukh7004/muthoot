import React, { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import Colors from 'config/Colors';
import styles from './styles';
import Icon from 'components/Icon';

type textTypes =
  | 'Proceed'
  | 'Login'
  | 'Cancel'
  | 'Save'
  | 'Logout'
  | 'Submit'
  | 'Next'
  | 'Verify'
  | 'Bureau Report'
  | 'Loan Summary'
  | 'Continue'
  | 'Accept'
  | 'Calculate EMI'
  | 'Get Details'
  | 'Sanction Letter'
  | 'Loan Agreement'
  | 'Generate OTP'
  | 'Add Guarantor'
  | 'Sign Agreement'
  | 'Get Nach Status'
  | 'Get Pre-Approved Offer'
  | 'Main Applicant'
  | 'Guarantor'
  | 'Skip OVD'
  | 'Skip'
  | 'Reject'
  | 'Re-Edit'
  | 'Retry'
  | 'Edit OTP'
  | 'Edit CKYC'
  | 'Okay'
  | 'Generate Prefill Nach Form'
  | 'KFS Doc'
  | 'Sign KFS'
  | 'Add New Bank Details'
  | 'Mandate with Existing Bank Details'
  | 'Back to NACH Reactivation'
  | 'Go Digit Life Insurance'
  | "Submit To Disbursment";

interface ButtonType {
  text: textTypes;
  active: boolean;
  onPress: () => void;
  halfSize?: boolean;
  marginVertical?: number;
  position?: boolean;
  backgroundColor?: string;
  textColor?: string;
  marginTop?: number;
  flexEnd?: boolean;

}

const Button: FC<ButtonType> = ({
  text,
  active,
  onPress,
  halfSize,
  position,
  marginVertical,
  backgroundColor,
  textColor,
  marginTop,
  flexEnd
}) => {
  type DownloadTypes = 'Sanction Letter' | 'Loan Agreement' | 'Generate Prefill Nach Form' | 'KFS Doc' | 'Go Digit Life Insurance';
  type FileTypes = 'Bureau Report';

  const isDownloadType = (label: textTypes): label is DownloadTypes =>
    ['Sanction Letter', 'Loan Agreement', 'Generate Prefill Nach Form', 'KFS Doc', 'Go Digit Life Insurance'].includes(label);

  const isFileType = (label: textTypes): label is DownloadTypes =>
    ['Bureau Report',].includes(label);

  const { ButtonContainer, ButtonText } = styles;
  return (
    <TouchableOpacity
      style={[
        ButtonContainer,
        {
          backgroundColor:
            active && text !== 'Cancel'
              ? text === 'Logout'
                ? Colors.Primary
                : text == 'Reject' ?
                  Colors.Red
                  : Colors.Button
              : active
                ? Colors.White
                : Colors.LightGrey,
          width: halfSize ? '45%' : text === 'Re-Edit' ? '100%' : '90%',
          borderWidth: text === 'Cancel' ? 1 : 0,
          borderColor:
            text === 'Cancel'
              ? Colors.Primary
              : text === 'Logout'
                ? Colors.Red
                : Colors.LightGrey,
          marginVertical: marginVertical || 0,
          alignSelf: position ? 'flex-start' : flexEnd ? 'flex-end' : 'center',
          marginTop: marginTop || 10,

          flexDirection: 'row',
        },
      ]}
      onPress={onPress}
      disabled={!active}>
      <Text
        style={[
          ButtonText,
          {
            color: textColor ? textColor : Colors.White,
          },
        ]}>
        {text}
      </Text>
      {isDownloadType(text) && <Icon name="download-file" />}
      {isFileType(text) && <Icon name="file" />}
    </TouchableOpacity>
  );
};
export default Button;