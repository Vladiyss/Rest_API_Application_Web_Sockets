import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
//import {createFact} from "../../service/apiFact";
import {withRouter} from 'react-router-dom';
import {Routes} from "../../constant/routes";
//import {RestRequest} from "../../service/requestService";
import Card from "@material-ui/core/Card";
//import Axios from "axios";
import socket from '../../socket';
import Cookies from 'js-cookie';

class CreateFact extends React.Component {
    constructor() {
        super();
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    onChangeFile(e) {
        this.filedata = e.target.files[0];
    }

    onSubmit = (e) => {
        e.preventDefault();
  
        let reader = new FileReader();
        reader.readAsArrayBuffer(this.filedata);
        reader.onload = () => {
            let token = Cookies.get('token')
            socket.emit('fact:newFact', {
                token: token, 
                filedata: reader.result, 
                filename: this.filedata.name,
                title: e.target.elements[0].value,
                content: e.target.elements[1].value
            });
        }
      }

    componentDidMount() {
        //let token = Cookies.get('token')
  
        socket.on('fact:newFact', (response) => {
            this.props.history.push(Routes.facts);
            //this.state.posts.unshift(response);
            //this.setState({posts: this.state.posts});
        })
  
        socket.on('error : 401', () => {
            this.props.history.push(Routes.login); 
        })
      }
  
    componentWillUnmount() {
        socket.removeAllListeners('fact:newFact');
        socket.removeAllListeners('error : 401');
    }

    render() {
        return (
            <Container maxWidth="sm">
                <Box m={6}>
                    <Card>
                        <form noValidate autoComplete='off' onSubmit={this.onSubmit}>

                            <Grid
                                container
                                direction="column"
                                justify="space-evenly"
                                alignItems="center"
                            >
                                <Box m={4}>
                                    <Grid item>
                                        <TextField id='title' label='title'/>
                                    </Grid>
                                </Box>
                                <Box m={4}>
                                    <Grid>
                                        <TextareaAutosize id='content'
                                                          aria-label='empty textarea'
                                                          placeholder='content'
                                                          rowsMin={4}/>
                                    </Grid>
                                </Box>

                                <label>
                                Upload file:
                                <input type="file" name="filedata" onChange={this.onChangeFile} required/><br/>
                                </label>

                                <Box m={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </Grid>
                        </form>
                    </Card>
                </Box>
            </Container>
        )
    }
}

export default withRouter(CreateFact);
