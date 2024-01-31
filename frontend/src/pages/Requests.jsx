import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import { useAuthContext, useDataContext } from "../hooks/useContexts";

// components
import RequestInfo from '../components/private/RequestInfo';
import UpdateRequest from '../components/private/client/UpdateRequest';
import RespondRequest from '../components/private/admin/RespondRequest';


export default function Requests(){
    const [id, setId] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const {requests, requestsCurrentPage: currentPage, requestsTotalPages: totalPages, setCurrentPage} = useDataContext();
    const {user} = useAuthContext();

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        page !== currentPage && setCurrentPage('REQUESTS', page);
    }, [currentPage, searchParams, setCurrentPage]);

    useEffect(() => {
        if(totalPages < 0){
            setSearchParams({page: 1});
        }
    }, [setSearchParams, totalPages]);

    const handlePageClick = (page) => {
        setSearchParams({page});
        setId('');
    }

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
          pages.push(
            <label key={i} className={i === currentPage ? 'active' : ''}>
              <button onClick={() => handlePageClick(i)}>{i}</button>
            </label>
          );
        }
        return pages;
      };

    return ( 
        <div className={user && ((user.privilege === 'admin' || user.privilege === 'client') ? 'request-page': 'request-page1')}>
            <div className="requests">
                <h2>Requests</h2>
                {requests.length === 0 &&  <h3>No Requests Available</h3>}    
                {requests.map(request => (
                    <div onClick={() => setId(request._id)} key={request._id} className="links">
                        <RequestInfo key={request._id} request={request} />
                    </div>
                ))}
                
            </div>
            
            {requests.length > 0 && user.privilege === 'admin' && <RespondRequest request_id={id}/>}
            {requests.length > 0 && user.privilege === 'client' && <UpdateRequest request_id={id}/>}

            {totalPages > 1 && <div className="pagination">
                <label className="arrows"><button onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}>
                    &lt;
                </button></label>
                {renderPageNumbers()}
                <label className="arrows"><button onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}>
                    &gt;
                </button></label>
            </div>  }            
        </div>
     );
}