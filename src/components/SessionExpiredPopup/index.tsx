import React, { useState, useEffect } from 'react';
import { Modal, Text, View, Image, TouchableOpacity } from 'react-native';
import { useAuthentication } from 'context/useAuthentication';
import { useEmployeeDetails } from 'context/useEmployeeDetails';
import Colors from 'config/Colors';
import { APP_FONTS, FONT_SIZE } from 'config/Fonts';

// Declare the function that will trigger the popup
let showPopup: (visible: boolean) => void = () => { };

let logOutDirectly: (logOut: boolean) => void = () => { };

// Function to show the popup
export const showSessionExpiredPopup = () => {
    showPopup(true); // Set the popup visible
};

export const directlyLogout = () => {
    logOutDirectly(true); // Set the popup visible
};

const SessionExpiredPopup: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const [logOut, setLogOut] = useState<boolean>(false);

    const { ActivateLoggingOut } = useAuthentication();
    const { ResetEmployeeDetails } = useEmployeeDetails();

    useEffect(() => {
        showPopup = setVisible; // Set the function to control the popup visibility
        logOutDirectly = setLogOut;
    }, []);

    const Logout = () => {
        console.log("poppppppiiiiiiiiippp");

        ResetEmployeeDetails();
        ActivateLoggingOut();
    };
    
    useEffect(() => {
        if (logOut) {
            console.log("poppppppppp");
            
            ResetEmployeeDetails();
            ActivateLoggingOut();
        }
    }, [logOut])

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={Logout}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Session Timeout</Text>
                    <Text style={[styles.description, { marginBottom: 10 }]}>
                        Your current session has timed out, and you have been logged out.
                    </Text>
                    <Text style={[styles.description, { marginBottom: 30 }]}>
                        Please login again to continue.
                    </Text>
                    <TouchableOpacity
                        onPress={() => { Logout() }} // Close the popup when "OK" is pressed
                        style={styles.okButton}
                    >
                        <Text style={styles.okText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 320,
        padding: 25,
        backgroundColor: 'white',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZE.xxl,
        fontFamily: APP_FONTS.Roboto_SemiBold,
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: FONT_SIZE.l,
        fontFamily: APP_FONTS.Roboto_Regular,
        textAlign: 'center',
    },
    okButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.Primary,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 40,
    },
    okText: {
        color: Colors.White,
        fontSize: 16,
        fontWeight: 'bold',
    },
};

export default SessionExpiredPopup;
