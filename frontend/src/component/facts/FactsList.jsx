import * as React from "react";
import Fact from "./Fact";
import Container from "@material-ui/core/Container";
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
//import {RestRequest} from "../../service/requestService";
import {Routes} from "../../constant/routes";
//import {getAllFacts} from "../../service/apiFact";
import {withRouter} from "react-router-dom";
import socket from '../../socket';
import Cookies from 'js-cookie';

class FactsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {facts: [], loading: false, order: true};
    }

    deleteOneFact = (element) => {
        let facts = this.state.facts;
        let updatedFacts = facts.filter((fact) => !(fact['_id'] === element['_id']));
        this.setState({facts: updatedFacts});
    };

    componentDidMount() {
        let token = Cookies.get('token');
        socket.on('facts', (response) => {
            console.log(response);
            if (response.err) {
                console.log(response.err)
                return;
            }

            console.log(response.payload);
            this.setState({loading: false, facts: response.payload, oder: response.order});
        })

        socket.on('error : 401', () => {
            this.props.history.push(Routes.login); 
        })
  
        //this.load(this.state.order);

        this.setState({loading: true});
        socket.emit('facts', {token: token, order: this.state.order})
      }
  
      componentWillUnmount() {
          socket.removeAllListeners('facts');
          socket.removeAllListeners('error : 401');
      }

    /*load = (order) => {
        this.setState({loading: true});
        getAllFacts(order)
            .then(response => {
                console.log(response);
                if (!response) {
                    console.log('Cannot get response');
                    return;
                }

			    //if (response.err) {
				//    this.setState({redirect: true});
				//    return;
			    //} 
            
			    console.log(response.payload);
                this.setState({loading: false, facts: response.payload, order});
            })
    };*/
    
    topLike = () => {
        //this.load(false);
        let token = Cookies.get('token');
        this.setState({loading: true});
        socket.emit('facts', {token: token, order: false})
    };

    render() {
        let loading = this.state.loading;
        let facts = this.state.facts.map((fact) => {
            return <Fact deleteOne={this.deleteOneFact} key={fact['_id']} fact={fact}/>
        });
        return (
            <React.Fragment>
                <Container maxWidth="sm">
                    <IconButton onClick={this.topLike}>
                        {this.state.order ? <FavoriteBorderIcon/> : <FavoriteIcon/>}
                    </IconButton>
                    <Box>
                        <Container>
                            {loading ? <LinearProgress variant="determinate"/> : facts}
                        </Container>
                    </Box>
                </Container>
            </React.Fragment>)
    }

}

export default withRouter(FactsList)
