import React, {useEffect,useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.css';

import {Container,Navbar,Nav,Button,Form,Row,Col,Card,Spinner} from 'react-bootstrap';

import {API_ENDPOINT} from './Api';

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true)
        try{
            await axios.post(`${API_ENDPOINT}/auth/login`,{
                username,
                password
            });
            setButtonLoading(false)
            setError('');
            navigate('/');
        } catch(error) {
            setButtonLoading(false)
            setError(error);
        }
    }
    return (
        <>
        <Navbar bg='success' data-bs-theme='dark'>
            <Container>
                <Navbar.Brand>To Do List</Navbar.Brand>
                <Button variant ='warning' style={{color:'white', fontWeight:'bold'}}>
                    <Nav>
                        <Nav.Link as={Link} to='/register'>
                        Register
                        </Nav.Link>
                        </Nav>
                    </Button>
            </Container>
        </Navbar>
        
        <Container>
            <Row className='justify-content-md-center'>
                <Col md={6} sm={12}>
                    <div>
                        <Card>
                            <Card.Body>
                            <span style={{display:'flex',justifyContent:'center',fontSize:'24px'}}>Login to</span>
                            <span style={{display:'flex',justifyContent:'center',fontWeight:'bold',fontSize:'30px'}}>To Do List App</span> <br/>
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
                                    <Button type='submit' disabled={buttonLoading}>
                                        {buttonLoading ? 
                                        <>
                                            <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            /> Please Wait
                                        </>
                                        : 'Login'}
                                        </Button>
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
