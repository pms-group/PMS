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

    const {requests, requestsTotalPages: totalPages, requestsParams, setRequestsParams} = useDataContext();
    const {user} = useAuthContext();

    const [sortField, setSortField] = useState(requestsParams.sortField);
    const [sortOrder, setSortOrder] = useState(requestsParams.sortOrder);

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        const sortBy = searchParams.get('sort_by') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        if(page !== requestsParams.currentPage ||
            sortBy !== requestsParams.sortField ||
            order !== requestsParams.sortOrder){
                setRequestsParams({
                    currentPage: page !== requestsParams.currentPage ? page : requestsParams.currentPage,
                    sortField: sortBy !== requestsParams.sortField ? sortBy : requestsParams.sortField,
                    sortOrder: order !== requestsParams.sortOrder ? order : requestsParams.sortOrder,
                })
            }
    }, [requestsParams.currentPage, requestsParams.sortField, requestsParams.sortOrder, searchParams, setRequestsParams]);

    const handlePageClick = (page) => {
        const prevParams = Object.fromEntries(searchParams);
        setSearchParams({...prevParams, page});
        setId('');
    }

    const handleDropDownChange = (e) => {
        const { name, value } = e.target;
        const prevParams = Object.fromEntries(searchParams);
        if(name === 'sort_by'){
            setSortField(value);
            setSortOrder('asc');
            setSearchParams({...prevParams, [name]: value, order: 'asc'});
        } else{
            setSortOrder(value);
            setSearchParams({...prevParams, [name]: value});
        }
    }

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
          pages.push(
            <label key={i} className={i === requestsParams.currentPage ? 'active' : ''}>
              <button onClick={() => handlePageClick(i)}>{i}</button>
            </label>
          );
        }
        return pages;
      };

    return ( 
        <div className={user && ((user.privilege === 'admin' || user.privilege === 'client') ? 'request-page': 'request-page1')}>

            <div>
                <span>Sort by:</span>
                <select name='sort_by' value={sortField} onChange={handleDropDownChange}>
                    <option value="status">Status</option>
                    <option value="createdAt">Created Date</option>
                </select>
                <select name='order' value={sortOrder} onChange={handleDropDownChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

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
                <label className="arrows"><button onClick={() => requestsParams.currentPage > 1 && handlePageClick(requestsParams.currentPage - 1)}>
                    &lt;
                </button></label>
                {renderPageNumbers()}
                <label className="arrows"><button onClick={() => requestsParams.currentPage < totalPages && handlePageClick(requestsParams.currentPage + 1)}>
                    &gt;
                </button></label>
            </div>  }            
        </div>
     );
}