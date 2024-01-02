import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
                authenticated: true
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                authenticated: false
            }
        case 'SET_REALESTATES_CURRENTPAGE':
            return {
                ...state,
                realestatesCurrentPage: action.payload
            }
        case 'SET_APARTMENTS_CURRENTPAGE':
            return {
                ...state,
                apartmentsCurrentPage: action.payload
            }
        case 'SET_REQUESTS_CURRENTPAGE':
            return {
                ...state,
                requestsCurrentPage: action.payload
            }
        case 'SET_REALESTATES_TOTALPAGE':
            return {
                ...state,
                realestatesTotalPage: action.payload
            }
        case 'SET_APARTMENTS_TOTALPAGE':
            return {
                ...state,
                apartmentsTotalPage: action.payload
            }
        case 'SET_REQUESTS_TOTALPAGE':
            return {
                ...state,
                requestsTotalPage: action.payload
            }
        default:
            return state
    }

};

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authenticated: localStorage.getItem('user') ? true : false,
        realestatesCurrentPage: 1,
        apartmentsCurrentPage: 1,
        requestsCurrentPage: 1,
        realestatesTotalPage: 1,
        apartmentsTotalPage: 1,
        requestsTotalPage: 1
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user){
            dispatch({type: 'LOGIN', payload: user});
        }
    }, []);

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
};