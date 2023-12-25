import { createContext, useReducer, useEffect } from "react";
import { useAuthContext } from "../hooks/useContexts";

export const DataContext = createContext();

export const dataReducer = (state, action) => {
    switch (action.type) {
        case 'SET_APARTMENTS':
            return {
                ...state,
                apts: action.payload
            };
        case 'CREATE_APARTMENT':
            return {
                ...state,
                apts: [action.payload, ...state.apts]
            };
        case 'DELETE_APARTMENT':
            return {
                ...state,
                apts: state.apts.filter(apt => apt._id !== action.payload._id)
            };
        case 'SET_REALESTATES':
            return {
                ...state,
                realestates: action.payload
            };
        case 'CREATE_REALESTATE':
            return {
                ...state,
                realestates: [action.payload, ...state.realestates]
            };
        case 'DELETE_REALESTATE':
            return {
                ...state,
                realestates: state.realestates.filter(realestate => realestate._id !== action.payload._id)
            }
        case 'SET_REQUESTS':
            return {
                ...state,
                requests: action.payload
            };
        case 'CREATE_REQUEST':
            return {
                ...state,
                requests: [action.payload, ...state.requests]
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

    const {user} = useAuthContext();

    useEffect(() => {
        const fetchApartments = async () => {
            const response = await fetch('/api/apartments');
            const json = await response.json();
            if(response.ok){
                dispatch({type: 'SET_APARTMENTS', payload: json});
            }
        };

        const fetchRealEstates = async () => {
            const response = await fetch('/api/user/view_realestates');
            const json = await response.json();
            if(response.ok){
                dispatch({type: 'SET_REALESTATES', payload: json});
            }
        };

        const fetchAllRequests = async () => {
            const response = await fetch('/api/requests', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                dispatch({type: 'SET_REQUESTS', payload: json});
            }
        };

        const fetchClientRequests = async () => {
            const response = await fetch('/api/requests/client_requests', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                dispatch({type: 'SET_REQUESTS', payload: json});
            }
        };

        const fetchAdminRequests = async () => {
            const response = await fetch('/api/requests/realestate_requests', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                dispatch({type: 'SET_REQUESTS', payload: json});
            }
        };

        fetchRealEstates();
        fetchApartments();
        if(user?.privilege === 'superadmin'){
            fetchAllRequests();
        } else if(user?.privilege === 'admin'){
            fetchAdminRequests();
        } else if(user?.privilege === 'user'){
            fetchClientRequests();
        }
    }, [dispatch, user])

    return(
        <DataContext.Provider value={{...state, dispatch}}>
            { children }
        </DataContext.Provider>
    )
}