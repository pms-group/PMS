import { createContext, useReducer, useEffect } from "react";
import { useAuthContext } from "../hooks/useContexts";


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

    const {user} = useAuthContext();

    useEffect(() => {
        const fetchRequests = async () => {
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


        if(user && user.privilege === 'superadmin'){
            fetchRequests();
        } else if(user && user.privilege === 'admin'){
            fetchAdminRequests();
        } else if(user && user.privilege === 'user'){
            fetchClientRequests();
        }

    }, [dispatch, user]);


    return(
        <RequestContext.Provider value={{...state, dispatch}}>
            { children }
        </RequestContext.Provider>
    )
}