import { createContext, useReducer, useEffect } from "react";

export const RealEstateContext = createContext();

export const realestateReducer = (state, action) => {
    switch (action.type) {
        case 'SET_REALESTATES':
            return {
                realestates: action.payload
            };
        case 'CREATE_REALESTATE':
            if(state){
                return {
                    realestates: [action.payload, ...state.realestates]
                };
            }
            return {
                realestates: [action.payload]
            };
        case 'DELETE_REALESTATE':
            return {
                realestates: state.realestates.filter(realestate => realestate._id !== action.payload._id)
            }
        default:
            return state;
    }
}

export const RealEstateContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(realestateReducer, {
        realestates: null
    });

    useEffect(() => {
        const fetchRealEstates = async () => {
            const response = await fetch('/api/user/view_realestates');
            const json = await response.json();
            if(response.ok){
                dispatch({type: 'SET_REALESTATES', payload: json});
            }
        };
        fetchRealEstates();
    }, [dispatch]);

    return(
        <RealEstateContext.Provider value={{...state, dispatch}}>
            { children }
        </RealEstateContext.Provider>
    )
}