import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { useContext } from 'react';

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw Error('useAuthContext must be used inside an AuthContextProvider');
    }
    return context;
};

 export const useDataContext = () => {
    const context = useContext(DataContext);

    if(!context){
        throw Error('useDataContext must be used inside an DataContextProvider');
    }
    return context;
};