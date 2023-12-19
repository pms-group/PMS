import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            return {
                user: action.payload,
                authenticated: true
            }
        case 'LOGOUT':
            return {
                user: null,
                authenticated: false
            }
        default:
            return state
    }

};

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authenticated: localStorage.getItem('user') ? true : false 
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user){
            dispatch({type: 'LOGIN', payload: user});
        }
    }, [dispatch]);

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
};