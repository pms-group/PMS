import { createContext, useReducer, useEffect } from "react";
import { useAuthContext } from "../hooks/useContexts";

export const DataContext = createContext();

export const dataReducer = (state, action) => {
    switch (action.type) {
        case 'SET_REALESTATES':
            return {...state, realestates: action.payload};
        case 'CREATE_REALESTATE':
            return {...state, realestates: [action.payload, ...state.realestates || []]};
        case 'DELETE_REALESTATE':
            return {...state, realestates: state.realestates.filter(realestate => realestate._id !== action.payload._id)};
        case 'SET_APARTMENTS':
            return {...state, apts: action.payload};
        case 'CREATE_APARTMENT':
            return {...state, apts: [action.payload, ...state.apts || []]};
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
            return {...state, apts: state.apts.filter(apt => apt._id !== action.payload._id)};
        case 'SET_REQUESTS':
            return {...state, requests: action.payload};
        case 'CREATE_REQUEST':
            return {...state, requests: [action.payload, ...state.requests || []]};
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
            return {...state, requests: state.requests.filter(request => request._id !== action.payload._id)};
        case 'SET_REALESTATEINFO':
            return {...state, realestateInfo: action.payload};
        case 'SET_REALESTATEAPTS':
            return {...state, realestateApts: action.payload};
        case 'SET_CURRENT_PAGE':
            switch (action.payload.type){
                case 'REALESTATES':
                    return {...state, realestatesCurrentPage: action.payload.number};
                case 'APTS':
                    return {...state, aptsCurrentPage: action.payload.number};
                case 'REQUESTS':
                    return {...state, requestsCurrentPage: action.payload.number};
                case 'REALESTATEAPTS':
                    return {...state, realestateAptsCurrentPage: action.payload.number};
                default: 
                    return state
            };
        case 'SET_TOTAL_PAGES':
            switch (action.payload.type){
                case 'REALESTATES':
                    return {...state, realestatesTotalPages: action.payload.number};
                case 'APTS':
                    return {...state, aptsTotalPages: action.payload.number};
                case 'REQUESTS':
                    return {...state, requestsTotalPages: action.payload.number};
                case 'REALESTATEAPTS':
                    return {...state, realestateAptsTotalPages: action.payload.number};
                default: 
                    return state
            };
        case 'SET_SEARCH_KEY':
            return { ...state, realestatesSearchKey: action.payload};
        default:
            return state;
    }
}

export const DataContextProvider = ({children}) => {
    const {user} = useAuthContext();

    const [state, dispatch] = useReducer(dataReducer, {
        apts: [],
        realestates: [],
        requests: [],
        realestateInfo: null,
        realestateApts: [],
        aptsCurrentPage: 0,
        aptsTotalPages: 1,
        realestatesCurrentPage: 0,
        realestatesTotalPages: 1,
        realestatesSearchKey: '',
        requestsCurrentPage: 0,
        requestsTotalPages: 1,
        realestateAptsCurrentPage: 0,
        realestateAptsTotalPages: 1
    });

    useEffect(() => {
        const fetchRealEstates = async () => {
            const response = await fetch(`/api/user/view_realestates?page=${state.realestatesCurrentPage}&key=${state.realestatesSearchKey}`);
            const json = await response.json();
            if(response.ok){
                const totalPages = parseInt(response.headers.get('X-Total-Pages'));
                if(state.realestatesCurrentPage > totalPages && !state.realestatesSearchKey){
                    return dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'REALESTATES', number: -1}});
                }
                dispatch({type: 'SET_REALESTATES', payload: json});
                dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'REALESTATES', number: totalPages}});
            }
        };
        state.realestatesCurrentPage > 0 && fetchRealEstates();
    }, [state.realestatesCurrentPage, state.realestatesSearchKey]);

    useEffect(() => {
        const fetchApartments = async () => {
            const response = await fetch(`/api/apartments?page=${state.aptsCurrentPage}`);
            const json = await response.json();
            if(response.ok){
                const totalPages = parseInt(response.headers.get('X-Total-Pages'));
                if(state.aptsCurrentPage > totalPages){
                    return dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'APTS', number: -1}});
                }
                dispatch({type: 'SET_APARTMENTS', payload: json});
                dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'APTS', number: totalPages}});
            }
        };
        state.aptsCurrentPage > 0 && fetchApartments();
    }, [state.aptsCurrentPage]);

    useEffect(() => {
        const fetchRequests = async (privilege, token) => {
            let requestType;
            switch(privilege){
                case 'client':
                    requestType = 'client_requests';
                    break;
                case 'admin':
                    requestType = 'realestate_requests';
                    break;
                default :
                    requestType = 'superadmin_requests';
                }
            const response = await fetch(`/api/requests/${requestType}?page=${state.requestsCurrentPage}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            const json = await response.json();
            if(response.ok){
                const totalPages = parseInt(response.headers.get('X-Total-Pages'));
                if(state.requestsCurrentPage > totalPages){
                    return dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'REQUESTS', number: -1}});
                }
                dispatch({type: 'SET_REQUESTS', payload: json});
                dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'REQUESTS', number: totalPages}});
            }
        };
        user?.privilege && state.requestsCurrentPage > 0 && fetchRequests(user?.privilege, user?.token);
    }, [user?.privilege, user?.token, state.requestsCurrentPage]);

    useEffect(() => {
        const fetchRealEstateApts = async () => {
            const response = await fetch(`/api/apartments/realestate_apartments?page=${state.realestateAptsCurrentPage}&id=${state.realestateInfo._id}`);
            const json = await response.json();
            if(response.ok){
                const totalPages = parseInt(response.headers.get('X-Total-Pages'));
                if(state.realestateAptsCurrentPage > totalPages){
                    return dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'REALESTATEAPTS', number: -1}});
                }
                dispatch({type: 'SET_REALESTATEAPTS', payload: json});
                dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'REALESTATEAPTS', number: totalPages}})
            }
        };
        state.realestateInfo && state.realestateAptsCurrentPage > 0 && fetchRealEstateApts();
    }, [state.realestateInfo, state.realestateAptsCurrentPage]);

    const contextValue = {
        ...state,
        dispatch,
        setCurrentPage: (type, number) => dispatch({type: 'SET_CURRENT_PAGE', payload: {type, number}}),
        setSearchKey: (key) => dispatch({type: 'SET_SEARCH_KEY', payload: key})
      }; 

    return(
        <DataContext.Provider value={contextValue}>{ children }</DataContext.Provider>
    )
}