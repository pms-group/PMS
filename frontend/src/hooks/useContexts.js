import { AuthContext } from '../context/AuthContext';
import { AptContext } from '../context/AptContext';
import { RequestContext } from '../context/RequestContext';
import { AdminContext } from '../context/AdminContext';
import { useContext } from 'react';

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw Error('useAuthContext must be used inside an AuthContextProvider');
    }
    return context;
};

 export const useAptContext = () => {
    const context = useContext(AptContext);

    if(!context){
        throw Error('useAptContext must be used inside an AptContextProvider');
    }
    return context;
};

export const useRequestContext = () => {
    const context = useContext(RequestContext);

    if(!context){
        throw Error('useRequestContext must be used inside an RequestContextProvider');
    }
    return context;
};

export const useAdminContext = () => {
    const context = useContext(AdminContext);

    if(!context){
        throw Error('useAdminContext must be used inside an AdminContextProvider');
    }
    return context;
};