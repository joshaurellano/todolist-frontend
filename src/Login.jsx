import React, {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import 'bootstrap/dist/css/bootstrap.css';

import {Container,Navbar,Nav,Button,Form,Row,Col,Card} from 'react-bootstrap';

import {jwtDecode} from 'jwt-decode';

import {API_ENDPOINT} from './Api';

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    useEffect(() => {
        const checkUserSession = async () => {
            try{
                const checkUserToken = JSON.parse(localStorage.getItem('token'));
                setUser(checkUserToken.data);

                navigate('/');
            } catch(error){
                navigate('/login');
            }
        }
        checkUserSession();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            // const response = await axios.post(`${API_ENDPOINT}/auth/login`,{
            //     username,
            //     password
            // },{
            //     withCredentials: true
            // });
            // console.log(response)
            const login = await axios.post(`${API_ENDPOINT}/auth/login`,{
                username,
                password
            });
            const token = login.data.token;
            localStorage.setItem('token',JSON.stringify(token));
            setError('');
            navigate('/');
        } catch(error) {
           setError(error);
        }
    }
    return (
        <>
        <Navbar bg='success' data-bs-theme='dark'>
            <Container>
                <Navbar.Brand>To Do List</Navbar.Brand>
            </Container>
        </Navbar>
        
        <Container>
            <Row className='justify-content-md-center'>
                <Col md={6} sm={12}>
                    <div>
                        <Card>
                            <Card.Body>
                            <span style={{display:'flex',justifyContent:'center',fontSize:'24px'}}>Login to</span>
                            <span style={{display:'flex',justifyContent:'center',fontWeight:'bold',fontSize:'30px'}}>ToDo List App</span> <br/>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type='text'
                                    placeholder='Enter Username'
                                    value={username}
                                    onChange={(e) =>setUsername(e.target.value)} required>
                                    </Form.Control>
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type='password'
                                    placeholder='Enter your Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Button type='submit'>Login</Button>
                                </Form.Group>
                            </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>

            </>
    )
}
export default Login
