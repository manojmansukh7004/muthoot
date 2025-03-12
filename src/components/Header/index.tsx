import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Title from 'components/Title';
import Icon from 'components/Icon';
import { useNavigation } from '@react-navigation/native';

type HeaderType = {
  title: string;
  loanSummary: boolean;
  leadManagement: boolean;
  accountAggregator: boolean;
  isMasterApp: boolean;
  onPress?: () => void;
  language?: boolean;
};

const Header: FC<HeaderType> = ({
  title,
  loanSummary,
  leadManagement,
  accountAggregator,
  isMasterApp,
  onPress,
  language
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingVertical: 20,
        marginTop: 12,
        // marginLeft: 12,
        // backgroundColor: 'red'
      }}>
      <View style={{ flexDirection: 'row', width: '85%', backgroundColor: 'transparent' }}>
        <TouchableOpacity
          onPress={() => {
            isMasterApp
              ? navigation.navigate('Dashboard' as never)
              : loanSummary
                ? navigation.navigate('LeadManagement' as never)
                : leadManagement
                  ? navigation.navigate('Dashboard' as never)
                  : accountAggregator
                    ? navigation.navigate('ProductDetails' as never)
                    : navigation.goBack();
          }}>
          <Icon name="arrow-back" />
        </TouchableOpacity>
        <Title text={title} heading />
      </View>
     {language&& <TouchableOpacity
        onPress={() => {
          if (onPress) {
            onPress(); // Make sure onPress is called here
          }
        }}
        style={{
          flexDirection: 'row', width: '15%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'
        }}>
        <Icon name="download" />
      </TouchableOpacity>}
    </View>
  );
};

export default Header;
