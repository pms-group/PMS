import { createContext, useReducer } from "react";

export const DataContext = createContext();

export const dataReducer = (state, action) => {
    switch (action.type) {
        case 'SET_REALESTATES':
            return {
                ...state,
                realestates: action.payload
            };
        case 'CREATE_REALESTATE':
            return {
                ...state,
                realestates: [action.payload, ...state.realestates || []]
            };
        case 'DELETE_REALESTATE':
            return {
                ...state,
                realestates: state.realestates.filter(realestate => realestate._id !== action.payload._id)
            }
        case 'SET_APARTMENTS':
            return {
                ...state,
                apts: action.payload
            };
        case 'CREATE_APARTMENT':
            return {
                ...state,
                apts: [action.payload, ...state.apts || []]
            };
        case 'UPDATE_APARTMENT':
            return {
                ...state,
                apts: state.apts.map(apt =>{
                    if(apt._id === action.payload._id){
                        return action.payload
                    }
                    return apt;
                })
            };
        case 'DELETE_APARTMENT':
            return {
                ...state,
                apts: state.apts.filter(apt => apt._id !== action.payload._id)
            };
        case 'SET_REQUESTS':
            return {
                ...state,
                requests: action.payload
            };
        case 'CREATE_REQUEST':
            return {
                ...state,
                requests: [action.payload, ...state.requests || []]
            };
        case 'UPDATE_REQUEST':
            return {
                ...state,
                requests: state.requests.map(request =>{
                    if(request._id === action.payload._id){
                        return action.payload
                    }
                    return request;
                })
            };
        case 'DELETE_REQUEST':
            return {
                ...state,
                requests: state.requests.filter(request => request._id !== action.payload._id)
            };
        default:
            return state;
    }
}

export const DataContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(dataReducer, {
        apts: [],
        realestates: [],
        requests: []
    });

    return(
        <DataContext.Provider value={{...state, dispatch}}>
            { children }
        </DataContext.Provider>
    )
}