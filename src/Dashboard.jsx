import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import axios from 'axios';

import {Container,Navbar,Nav,Button,Form,Row,Col,Card,NavDropdown,Table,Modal} from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';
import {API_ENDPOINT} from './Api';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

function Dashboard () {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showAddtask, setShowAddTask] = useState(false);

    const handleCloseAddTask = () => setShowAddTask(false);
    const handleOpenAddTask = () => setShowAddTask(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        const decodeUserId = async() => {
            // try {
            //     const response = await axios.get(`${API_ENDPOINT}/token`,{
            //         withCredentials:true})
            // console.log(response);
            // const user = response.data
            // setUser(response.data)
            // console.log(user)
            // } catch(error) {
            //     navigate('/login');
            // }
            try {
                const response = JSON.parse(localStorage.getItem('token'))
                const decoded_token = jwtDecode(response);
                setUser(decoded_token);
            }  catch(error) {
                navigate('/login');
            }
        }
        decodeUserId();
        
    },[]);
    useEffect(() =>{
        fetchTasks();
    },[user])

    const response = JSON.parse(localStorage.getItem('token'));
    // console.log(response);
    const token = response;

    const headers = {
        accept:'application/json',
        Authorization: token
    }
    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/login');
        } catch(error) {
            console.error('Logout failed',error)
        }
    }

    /*CRUD operations handler*/

    // Add task
    const [values, setValues] = useState({
        task_name: '',
        user_id: '',
    })
    const addTask = async (e) =>{
        e.preventDefault();
        const payload = {
            ...values,user_id:user?.user_id
        }
        axios.post(`${API_ENDPOINT}/task/`,payload,{headers:headers}).then((res)=>{
            console.log(res)
            fetchTasks();
        }).catch((err)=>console.log(err))
        handleCloseAddTask();
    }
    // Read All tasks by user
    const fetchTasks = async () => {
        if(user && user.user_id) {
            const id=user?.user_id;
            console.log(id);
            await axios.get(`${API_ENDPOINT}/task/user/${id}`,{headers:headers}).then(({data})=>{
                setTasks(data.message);
            });
        }
    }   
    return (
        <>
            <Navbar bg='primary'data-bs-theme="dark">
                <Navbar.Brand>To Do List App</Navbar.Brand>
                    <Nav className='me-auto'>
                        <Nav.Link>Users</Nav.Link>
                        <Nav.Link>Others</Nav.Link>
                    </Nav>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            <NavDropdown title={user?`User:${user.username}`: 'Dropdown'} id='basic-nav-dropdown'align='end'>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                                <NavDropdown.Item>Settings</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
            </Navbar>

        <br />

        <Container>
            <Row>
            <span>
                Dashboard
            </span>
            <br />

            <div>
                <Button variant="warning" onClick={handleOpenAddTask}>Add Task</Button>
            </div>
            
            <Table striped="columns">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Task</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tasks.length > 0 && (
                            tasks.map((taskData,key)=>(
                                <tr key={taskData.task_id}>
                                    <td>{key + 1}</td>
                                    <td>{taskData.task_name}</td>
                                    <td><Button>Edit</Button> <Button variant="danger">Delete</Button></td>
                                </tr>
                            ))
                        )
                    }
    
                </tbody>
            </Table>

            <Modal 
            show={showAddtask}
            onHide={handleCloseAddTask}
            backdrop='static'
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span className='mb-2'>Enter your task</span>
                <br />
                <Form onSubmit={addTask}>
                    <Form.Group>
                        <Form.Control type='text' 
                        onChange={(e)=>setValues({...values,task_name: e.target.value})}></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit'>Submit</Button>
                <Button variant='secondary'onClick={handleCloseAddTask}>Close</Button>
            </Modal.Footer>
                </Modal>
            </Row>
        </Container>
            </>
    )
}

export default Dashboard;