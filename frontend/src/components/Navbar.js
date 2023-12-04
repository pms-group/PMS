import { Link } from "react-router-dom";
import { useAuthContext, useRequestContext } from "../hooks/useContexts";

const Navbar = () => {
    const {user, dispatch: userDispatch} = useAuthContext();

    const {dispatch: requestDispatch} = useRequestContext();

    const handleClick = () => {
        localStorage.removeItem('user');

        // dispatch logout action
        userDispatch({type: 'LOGOUT'});

        // dispatch SET_REQUEST action
        requestDispatch({type: 'SET_REQUESTS', payload: null});

    }

    return ( 
        <header>
            <div className="container">
                <Link to='/'>
                    <h1>Everlink's PMS</h1>
                </Link>
                <nav>       

                    <Link to={'/real_estates'}><button>Real Estates</button></Link>

                    {user && (
                        <div>
                            <Link to='/profile'>
                                <span>{user.fullname}</span>
                            </Link>
                            <Link to={'/requests'}><button>My Requests</button></Link>
                            <button onClick={handleClick}>Log out</button>
                        </div>
                    )}
                    
                    {!user && (
                        <div>
                            <Link to={'/login'}>Log in</Link>
                            <Link to={'/signup'}>Sign up</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
     );
}
 
export default Navbar;