import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {Routes} from "../../constant/routes";

import {Link, withRouter} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import {AuthContext} from "../AuthProvider";
import IconButton from "@material-ui/core/IconButton";
import {ExitToApp} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { orange } from "@material-ui/core/colors";
import { green } from "@material-ui/core/colors";
import socket from '../../socket';

class Navbar extends React.Component {
    create = () => {
        this.props.history.push(Routes.factCreate);
    };

    facts = () => {
        this.props.history.push(Routes.facts);
    };

    logout = () => {
        socket.emit('auth:signout');
        this.context.logout();
    }
    render() {
        return (
            <AppBar position='static' style={{ color: orange[200] }}>
                <Toolbar>
                    <Button onClick={this.facts} color={"inherit"}>
                        Facts
                    </Button>
                    {this.context.currentUser ?
                        <>
                            <Button onClick={this.create} color={"inherit"}>
                                Create fact
                            </Button>
                            <IconButton onClick={this.logout}>
                                <ExitToApp style={{ color: green[500] }} >
                                </ExitToApp>
                            </IconButton>
                            <Typography>
                                Hi,{this.context.currentUser.name}!
                            </Typography>
                        </>
                        :
                        <Link to={Routes.login}>
                            <IconButton>
                                <ExitToApp color='action'/>
                            </IconButton>
                        </Link>
                    }
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.contextType = AuthContext;
export default withRouter(Navbar)
