import { createContext, useReducer } from "react";

export const RequestContext = createContext();

export const requestReducer = (state, action) => {
    switch (action.type) {
        case 'SET_REQUESTS':
            return {
                requests: action.payload
            };
        case 'CREATE_REQUEST':
            if(state){
                return {
                    requests: [action.payload, ...state.requests]
                };
            }
            return {
                requests: [action.payload]
            };
        case 'DELETE_REQUEST':
            return {
                requests: state.requests.filter(request => request._id !== action.payload._id)
            }
        default:
            return state;
    }
}

export const RequestContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(requestReducer, {
        requests: null
    });


    return(
        <RequestContext.Provider value={{...state, dispatch}}>
            { children }
        </RequestContext.Provider>
    )
}