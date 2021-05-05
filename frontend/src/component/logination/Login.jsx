import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Link, withRouter} from 'react-router-dom';
import {Routes} from '../../constant/routes';
import {AuthContext} from "../AuthProvider";
//import {signin} from '../../service/apiAuth';
import Alert from "../alert/Alert";
import socket from '../../socket';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            err: '',
            msg: '',
            email: '',
            password: '',
            signedIn: false
        };

        this.login = this.login.bind(this);
	    //this.handleChangeEmail = this.handleChangeEmail.bind(this);
	    //this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    /*handleChangeEmail(e) {
        this.setState({email: e.target.value});
    }	  
      
    handleChangePassword(e) {
        this.setState({password: e.target.value});
    }*/


    componentDidMount() {

        socket.on('auth:login', (response) => {
            if (response.err) {
                this.setState({err: response.err});
            } else {
                console.log(response); 

                document.cookie = `token=${response.token}`;
                this.setState({signedIn: true, userId: response.userId});
                this.context.login(response.user);
                this.props.history.push(Routes.facts);

            }
        });
    
    }
    
      componentWillUnmount() {
        socket.removeAllListeners('auth:login');
      }

    login(e) {
        e.preventDefault();
        const email = e.target.elements[0].value;
        const password = e.target.elements[2].value;

        //let {email, password} = this.state;
	    let user = {email, password};
	    console.log(user);

        socket.emit('auth:login', user);
    };

    render() {
        return (
            <Container component='main' maxWidth='xs'>
                <CssBaseline/>
                {this.state.error ? <Alert severity="error">{this.state.err}</Alert> : <></>}
                <div>
                    <Typography component='h1' variant='h5'>
                        Sign in
                    </Typography>
                    <form noValidate onSubmit={this.login}>
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label='Email Address'
                            name='email'
                            autoComplete='email'
                            autoFocus
                        />
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            name='password'
                            label='Password'
                            type='password'
                            id='password'
                            autoComplete='current-password'
                        />
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            color='primary'
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to={Routes.registration} variant='body2'>
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        )
    }
}

Login.contextType = AuthContext;
export default withRouter(Login)
