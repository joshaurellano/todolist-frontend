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
    const [specificTask, setSpecificTask] = useState(null)
    const [showAddtask, setShowAddTask] = useState(false);

    const handleCloseAddTask = () => setShowAddTask(false);
    const handleOpenAddTask = () => setShowAddTask(true);

    const [showTask, setShowTask] = useState(false);

    const handleCloseTask = () => setShowTask(false);
    const handleOpenTask = (taskData) => {
        setSpecificTask(taskData)
        setShowTask(true);
    }

    const [editValue, setEditValue] = useState(null);
    const [showEdittask, setShowEditTask] = useState(false);

    const handleCloseEditTask = () => setShowEditTask(false);
    const handleOpenEditTask = (taskData) => {
        setEditValue(taskData)
        setShowEditTask(true);
    }

    const navigate = useNavigate();

    useEffect(() => {
        const decodeUserId = async() => {
            try {
            const response = await axios.get(`${API_ENDPOINT}/token`,{
                    withCredentials:true})
            // console.log(response.data);
            setUser(response.data)
            } catch(error) {
                navigate('/login');
            }
        }
        decodeUserId();       
    },[]);
    useEffect(() =>{
        fetchTasks();
    },[user])
    const handleLogout = async () => {
        try {
            await axios.post(`${API_ENDPOINT}/token/logout`,{
                    withCredentials:true})
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
        // console.log(user.userID)
        const payload = {
            ...values,user_id:user.user_id
        }
        axios.post(`${API_ENDPOINT}/task/`,payload,{
                    withCredentials:true}).then((res)=>{
            console.log(res)
            fetchTasks();
        }).catch((err)=>console.log(err))
        handleCloseAddTask();
    }
     // Edit task
    const editTask = async (e) =>{
        e.preventDefault();
        const id = editValue.task_id
       
        axios.put(`${API_ENDPOINT}/task/${id}`,editValue,{
                    withCredentials:true}).then((res)=>{
            console.log(res)
            fetchTasks();
        }).catch((err)=>console.log(err))
        handleCloseEditTask();
    }
    
    // Read All tasks by user
    const fetchTasks = async (id) => {
        if(user&&user.user_id) {
            const id = user?.user_id
            // console.log(id);
            await axios.get(`${API_ENDPOINT}/task/user/${id}`,{
                    withCredentials:true}).then(({data})=>{
                setTasks(data.message);
            });
        }
    }

    // Delete task
    const deleteTask = async (id) => {
        await axios.delete(`${API_ENDPOINT}/task/${id}`,{
                    withCredentials:true}).then(({data})=>{
            fetchTasks()
        }).catch((err)=>console.log(err))
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
                                    <td>
                                    <Button variant="success"onClick={()=>handleOpenTask(taskData)}>View</Button> 
                                    <Button variant="primary" onClick={()=>handleOpenEditTask(taskData)}>Edit</Button> 
                                    <Button variant="danger" onClick={()=>deleteTask(taskData.task_id)}>Delete</Button></td>
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
                <Form onSubmit={addTask} id='addTaskForm'>
                    <Form.Group>
                        <Form.Control type='text' 
                        onChange={(e)=>setValues({...values,task_name: e.target.value})}></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' form='addTaskForm'>Submit</Button>
                <Button variant='secondary'onClick={handleCloseAddTask}>Close</Button>
            </Modal.Footer>
                </Modal>

            <Modal 
            show={showTask}
            onHide={handleCloseTask}
            backdrop='static'
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Viewing Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {specificTask ? (
                    <Form>
                        <Form.Group>
                            <Form.Control value={specificTask.task_name} readOnly>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control value={specificTask.created_at} readOnly></Form.Control>
                        </Form.Group>
                    </Form>
               ) : (
                <p>No data available</p>
               )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary'onClick={handleCloseTask}>Close</Button>
            </Modal.Footer>
                </Modal>

            <Modal 
            show={showEdittask}
            onHide={handleCloseEditTask}
            backdrop='static'
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {editValue ? (
                        <Form onSubmit={editTask} id='editForm'>
                            <Form.Group>
                                <Form.Control value={editValue.task_name} 
                                type='text' 
                                onChange={(e)=>setEditValue({...editValue,task_name: e.target.value})}>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                ) : (
                    <p>No data available</p>
                )}
                </Modal.Body>
            <Modal.Footer>
                <Button type='submit' form='editForm'>Submit</Button>
                <Button variant='secondary'onClick={handleCloseEditTask}>Close</Button>
            </Modal.Footer>
                </Modal>
            </Row>
        </Container>
            </>
    )
}

export default Dashboard;