import React from 'react';

import { useAuthentication } from 'context/useAuthentication';
import LoginStack from './LoginStack';
import DashboardStack from './DashboardStack';


const HomeStack = () => {
    const { isLoggedIn, isLoggedOut } = useAuthentication();
    if (isLoggedIn) {
        return (
            <DashboardStack />
        );
    } else {
        return (
            <LoginStack />
        );
    }
};
export default HomeStack;
