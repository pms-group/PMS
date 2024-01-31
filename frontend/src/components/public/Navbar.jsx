import { Link } from "react-router-dom";
import { useAuthContext, useDataContext } from "../../hooks/useContexts";

export default function Navbar(){
    const {user, dispatch: userDispatch} = useAuthContext();

    const {dispatch: requestDispatch} = useDataContext();

    const handleClick = () => {
        localStorage.removeItem('user');

        // dispatch logout action
        userDispatch({type: 'LOGOUT'});

        // dispatch SET_REQUEST action
        requestDispatch({type: 'SET_REQUESTS', payload: []});

    }

    return ( 
        <header>
            <div className="container">
                <Link to='/'>
                    <h1>Everlink's PMS</h1>
                </Link>
                <nav>       

                    <Link to={'/apartments'}><button>Apartments</button></Link>
                    <Link to={'/'}><button>Real Estates</button></Link>

                    {user && (
                        <div>
                            <Link to='/profile'>
                            <img src={user.imageUrl ? `http://localhost:5000/${user.imageUrl}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt='' />
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