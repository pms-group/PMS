import { createContext, useReducer } from "react";

export const AptContext = createContext();

export const aptReducer = (state, action) => {
    switch (action.type) {
        case 'SET_APARTMENTS':
            return {
                apts: action.payload
            };
        case 'CREATE_APARTMENT':
            if(state){
                return {
                    apts: [action.payload, ...state.apts]
                };
            }
            return {
                apts: [action.payload]
            };
        case 'DELETE_APARTMENT':
            return {
                apts: state.apts.filter(apt => apt._id !== action.payload._id)
            }
        default:
            return state;
    }
}

export const AptContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(aptReducer, {
        apts: null
    });


    return(
        <AptContext.Provider value={{...state, dispatch}}>
            { children }
        </AptContext.Provider>
    )
}