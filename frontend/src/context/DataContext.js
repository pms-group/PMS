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
        case 'SET_REALESTATES_PARAMS':
            return { ...state, realestatesParams: action.payload};
        case 'SET_APARTMENTS_PARAMS':
            return { ...state, aptsParams: action.payload};
        case 'SET_REQUESTS_PARAMS':
            return { ...state, requestsParams: action.payload};
        case 'SET_REALESTATEAPTS_PARAMS':
            return { ...state, realestateAptsParams: action.payload};
        default:
            return state;
    }
}

export const DataContextProvider = ({children}) => {
    const {user} = useAuthContext();

    const [state, dispatch] = useReducer(dataReducer, {
        realestates: [],
        realestatesParams: {
            currentPage: 0,
            searchKey: '',
            sortField: '',
            sortOrder: '',
        },
        realestatesTotalPages: 1,        
        apts: [],
        aptsParams: {
            currentPage: 0,
            sortField: '',
            sortOrder: '',
        },
        aptsTotalPages: 1,
        requests: [],
        requestsParams: {
            currentPage: 0,
            sortField: '',
            sortOrder: '',
        },
        requestsTotalPages: 1,
        realestateInfo: null,
        realestateApts: [],
        realestateAptsParams: {
            currentPage: 0,
            sortField: '',
            sortOrder: '',
        },
        realestateAptsTotalPages: 1
    });

    useEffect(() => {
        const fetchRealEstates = async () => {
            const response = await fetch(`/api/user/view_realestates?page=${state.realestatesParams.currentPage}&key=${state.realestatesParams.searchKey}&sort_by=${state.realestatesParams.sortField}&order=${state.realestatesParams.sortOrder}`);
            const json = await response.json();
            if(response.ok){
                const totalPages = parseInt(response.headers.get('X-Total-Pages'));
                dispatch({type: 'SET_REALESTATES', payload: json});
                dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'REALESTATES', number: totalPages}});
            }
        };
        state.realestatesParams.currentPage > 0 && fetchRealEstates();
    }, [state.realestatesParams.currentPage, state.realestatesParams.searchKey, state.realestatesParams.sortField, state.realestatesParams.sortOrder]);

    useEffect(() => {
        const fetchApartments = async () => {
            const response = await fetch(`/api/apartments?page=${state.aptsParams.currentPage}&sort_by=${state.aptsParams.sortField}&order=${state.aptsParams.sortOrder}`);
            const json = await response.json();
            if(response.ok){
                const totalPages = parseInt(response.headers.get('X-Total-Pages'));
                dispatch({type: 'SET_APARTMENTS', payload: json});
                dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'APTS', number: totalPages}});
            }
        };
        state.aptsParams.currentPage > 0 && fetchApartments();
    }, [state.aptsParams.currentPage, state.aptsParams.sortField, state.aptsParams.sortOrder]);

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
            const response = await fetch(`/api/requests/${requestType}?page=${state.requestsParams.currentPage}&sort_by=${state.requestsParams.sortField}&order=${state.requestsParams.sortOrder}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            const json = await response.json();
            if(response.ok){
                const totalPages = parseInt(response.headers.get('X-Total-Pages'));
                dispatch({type: 'SET_REQUESTS', payload: json});
                dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'REQUESTS', number: totalPages}});
            }
        };
        user?.privilege && state.requestsParams.currentPage > 0 && fetchRequests(user?.privilege, user?.token);
    }, [ state.requestsParams.currentPage, state.requestsParams.sortField, state.requestsParams.sortOrder, user?.privilege, user?.token]);

    useEffect(() => {
        const fetchRealEstateApts = async () => {
            const response = await fetch(`/api/apartments/realestate_apartments?page=${state.realestateAptsParams.currentPage}&id=${state.realestateInfo._id}&sort_by=${state.realestateAptsParams.sortField}&order=${state.realestateAptsParams.sortOrder}`);
            const json = await response.json();
            if(response.ok){
                const totalPages = parseInt(response.headers.get('X-Total-Pages'));
                dispatch({type: 'SET_REALESTATEAPTS', payload: json});
                dispatch({type: 'SET_TOTAL_PAGES', payload: {type: 'REALESTATEAPTS', number: totalPages}})
            }
        };
        state.realestateInfo && state.realestateAptsParams.currentPage > 0 && fetchRealEstateApts();
    }, [state.realestateAptsParams.currentPage, state.realestateAptsParams.sortField, state.realestateAptsParams.sortOrder, state.realestateInfo]);

    const contextValue = {
        ...state,
        dispatch,
        setRealEstatesParams: (params) => dispatch({type: 'SET_REALESTATES_PARAMS', payload: params}),
        setAptsParams: (params) => dispatch({type: 'SET_APARTMENTS_PARAMS', payload: params}),
        setRequestsParams: (params) => dispatch({type: 'SET_REQUESTS_PARAMS', payload: params}),
        setRealEstateAptsParams: (params) => dispatch({type: 'SET_REALESTATEAPTS_PARAMS', payload: params}),
      }; 

    return(
        <DataContext.Provider value={contextValue}>{ children }</DataContext.Provider>
    )
}