import React, { useContext } from 'react';
import jwtDecode from 'jwt-decode';

import authApi from "../api/auth";
import AuthContext from '../auth/context';
import authStorage from '../auth/storage';

function LoginScreen(props) {
    const authContext = useContext(AuthContext);
    //const [loginFailed, setLoginFailed] = useState(false);
    
    const handleSubmit = async ({email, password}) => {
        const result = await authApi.login(email, password);
        if (!result.ok) {
            //show error message "Invalid email and/or password."
            //use the state variable loginFailed to toggle the visibility of error message
            //return setLoginFailed(true);
            return;
        }

        //setLoginFailed(false);
        const user = jwtDecode(result.data);
        authContext.setUser(user);
        authStorage.storeToken(result.data);
    }

    return (
        <>
            
        </>
    );
}

export default LoginScreen;