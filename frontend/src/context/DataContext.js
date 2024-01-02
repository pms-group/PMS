import { createContext, useReducer, useEffect } from "react";
import { useAuthContext } from "../hooks/useContexts";

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

    const {user, realestatesCurrentPage, apartmentsCurrentPage, requestsCurrentPage, dispatch: pageDispatch} = useAuthContext();

    useEffect(() => {
        const fetchRealEstates = async () => {
            const response = await fetch(`/api/user/view_realestates?page=${realestatesCurrentPage}`);
            const json = await response.json();
            if(response.ok){
                pageDispatch({type: 'SET_REALESTATES_TOTALPAGE', payload: Number(response.headers.get('X-Total-Pages'))});
                dispatch({type: 'SET_REALESTATES', payload: json});
            }
        };

        fetchRealEstates();
    }, [pageDispatch, realestatesCurrentPage]);

    useEffect(() => {
        const fetchApartments = async () => {
            const response = await fetch(`/api/apartments?page=${apartmentsCurrentPage}`);
            const json = await response.json();
            if(response.ok){
                pageDispatch({type: 'SET_APARTMENTS_TOTALPAGE', payload: Number(response.headers.get('X-Total-Pages'))});
                dispatch({type: 'SET_APARTMENTS', payload: json});
            }
        };

        fetchApartments();
    }, [apartmentsCurrentPage, pageDispatch]);

    useEffect(() => {
        const fetchRequests = async () => {
            let requestType
            switch(user?.privilege){
                case 'client':
                    requestType = 'client_requests';
                    break;
                case 'admin':
                    requestType = 'realestate_requests';
                    break;
                default :
                    requestType = 'superadmin_requests';
                }
            const response = await fetch(`/api/requests/${requestType}?page=${requestsCurrentPage}`, {
                headers: {'Authorization': `Bearer ${user?.token}`}
            });
            const json = await response.json();
            if(response.ok){
                pageDispatch({type: 'SET_REQUESTS_TOTALPAGE', payload: Number(response.headers.get('X-Total-Pages'))});
                dispatch({type: 'SET_REQUESTS', payload: json});
            }
        };

        user?.privilege && fetchRequests()
    }, [pageDispatch, requestsCurrentPage, user?.privilege, user?.token]);

    return(
        <DataContext.Provider value={{...state, dispatch}}>
            { children }
        </DataContext.Provider>
    )
}