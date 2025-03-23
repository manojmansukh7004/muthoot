import React from 'react';

import { useAuthentication } from 'context/useAuthentication';
import LoginStack from './LoginStack';
import DashboardStack from './DashboardStack';
import TwoWheelerStack from './TwoWheelerStack';


const HomeStack = () => {
    const { isLoggedIn, isLoggedOut } = useAuthentication();
    if (isLoggedIn) {
        return (
            <DashboardStack />
            // <TwoWheelerStack/>
        );
    } else {
        return (
            <LoginStack />
        );
    }
};
export default HomeStack;
