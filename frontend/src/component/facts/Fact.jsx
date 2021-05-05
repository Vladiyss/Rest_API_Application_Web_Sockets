
import * as React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from '@material-ui/icons/Favorite';
//import {endPoints} from "../../constant/endPoints";
//import {RestRequest} from "../../service/requestService";
import {AuthContext} from "../AuthProvider";
import {withRouter} from "react-router-dom";

//import {deleteFact} from "../../service/apiFact";
//import {likeFact} from "../../service/apiFact";
import {Routes} from "../../constant/routes";
import { orange } from "@material-ui/core/colors";
import socket from '../../socket';
import Cookies from 'js-cookie';

class Fact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fact: props.fact};
    }

    delete = (e) => {

        e.preventDefault();

        let token = Cookies.get('token');
        console.log(this.state.fact.factId);
        console.log(this.state.fact['_id']);
	    socket.emit('fact:delete', {factId: this.props.fact['_id'], token: token});
    };

    like = (e) => {

        e.preventDefault();

        let token = Cookies.get('token')
	    if (this.context.currentUser) {
            console.log("Like fact client - ", this.context.currentUser);
            socket.emit('fact:update', {fact_id: this.state.fact['_id'], token: token});
        }

    };


    componentDidMount() {
        socket.on('fact:update', (response) => {
            console.log(response);

            if (response.payload.factId !== this.state.fact['_id']) {
              return;
            }
    
            let fact = this.state.fact;
            fact.likes.length = response.payload.likes.length;
            this.setState(fact);
        })
    
        socket.on('fact:delete', (response) => {
            console.log(response);

            if (response.factId === this.state.fact['_id']) {
                this.props.deleteOne(this.props.fact);
            }
        })
    
        socket.on('error : 401', () => {
            this.props.history.push(Routes.login);
        })
    
      }
    
      componentWillUnmount() {
        socket.removeAllListeners('fact:delete');
        socket.removeAllListeners('fact:update');
        socket.removeAllListeners('error : 401');
      }

    render() {
        return (
            <Box m={1}>
                <Card>
                    <CardHeader title={this.props.fact.title}/>
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {this.props.fact.content}
                        </Typography>
                    </CardContent>
                    <img className ="post-image" src={this.props.fact.image} width="480" height="320" />
                    <img src={this.props.fact.image} width="480" height="320" alt={""}/>
                    <CardActions>
                        <IconButton onClick={this.like} aria-label="Like">
                            <FavoriteIcon/>
                        </IconButton>
                        <Typography>
                            {this.props.fact.likes}
                        </Typography>
                        {
                            this.context.currentUser
                                ?
                                <Button onClick={this.delete} variant="outlined" style={{ color: orange[500] }}>
                                    Delete
                                </Button>
                                :
                                <>
                                </>
                        }
                    </CardActions>
                </Card>
            </Box>
        )
    }
}

Fact.contextType = AuthContext;
export default withRouter(Fact);
