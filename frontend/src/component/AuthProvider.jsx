import * as React from "react";
//import authService from '../service/authService';

export const AuthContext = React.createContext();

export default class AuthProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getUserFromStorage = () => {
        let userName = localStorage.getItem('User name');
        let userSurname = localStorage.getItem('User surname');
        let userEmail = localStorage.getItem('User email');
        let userID = localStorage.getItem('User id');
        if (!userName && !userSurname && !userEmail && !userID) return null;
    
        let user = {
            name: userName,
            surname: userSurname,
            email: userEmail,
            id: userID
        };
        return user;
    };

    storeUser = (currentUser) => {
        localStorage.setItem('User name', currentUser.name);
        localStorage.setItem('User surname', currentUser.surname);
        localStorage.setItem('User email', currentUser.email);
        localStorage.setItem('User id', currentUser._id);
        console.log(localStorage.getItem('User name'), localStorage.getItem('User surname'), 
        localStorage.getItem('User email'), localStorage.getItem('User id'));
    }

    removeUser = () => {
        localStorage.removeItem('User name');
        localStorage.removeItem('User surname');
        localStorage.removeItem('User email');
        localStorage.removeItem('User id');
    };

    componentDidMount() {
        this.updateCurrentUser(this.getUserFromStorage());
        //this.updateCurrentUser(authService.getUserFromStorage());
    }

    updateCurrentUser = (user) => {
        this.setState({user});
    };

    login = (currentUser) => {
        this.storeUser(currentUser);
        this.updateCurrentUser(this.getUserFromStorage());
    }
        

    registration = (currentUser) => {
        this.storeUser(currentUser);
        this.updateCurrentUser(this.getUserFromStorage());
    }

    logout = (username, password) => {
        this.removeUser();
        this.updateCurrentUser(null)
    };

    render() {
        return (
            <AuthContext.Provider
                value={{
                    currentUser: this.state.user,
                    login: this.login,
                    registration: this.registration,
                    logout: this.logout
                }}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}
