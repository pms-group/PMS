import { createContext, useReducer } from "react";

export const AdminContext = createContext();

export const adminReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ADMINS':
            return {
                admins: action.payload
            };
        case 'CREATE_ADMIN':
            return {
                admins: [action.payload, ...state.admins]
            };
        case 'DELETE_ADMIN':
            return {
                admins: state.admins.filter(admin => admin._id !== action.payload._id)
            }
        default:
            return state;
    }
}

export const AdminContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(adminReducer, {
        admins: null
    });


    return(
        <AdminContext.Provider value={{...state, dispatch}}>
            { children }
        </AdminContext.Provider>
    )
}