import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Alert, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { update, handleError, orderListRequest, orderListSuccess, orderListError } from "../store"
import Loader from '../components/Loader'

function ProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const { userInfo, error } = useSelector((state) => state.user);
    const { orders, loading:loadingOrders, error:errorOrders } = useSelector((state) => state.order.orderList);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }

            axios.get("/api/users/profile/", config).then((res) => {
                setName(res.data.name);
                setEmail(res.data.email);
            });

            dispatch(orderListRequest())

            axios.get(`/api/orders/myorders`, config).then((res) => {   
                dispatch(orderListSuccess(res.data));
            }).catch((err) => {
                const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
                dispatch(orderListError(payload));
            })
        }  
    }, [navigate, userInfo]);

    const submitHandler = (event) => {
        event.preventDefault();

        if (password != confirmPassword) {
            setMessage("Passwords do not match")
        } else { 
            setMessage("");

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }

            axios.put('/api/users/profile/update/', {'name': name, 'email': email, 'password': password}, config).then((res) => {
                dispatch(update(res.data));
            }).catch((err) => {
                dispatch(handleError(err));
            })
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>USER PROFILE</h2>
                {error && <Alert variant='danger'>{error.response.data.detail}</Alert>}

                <Form onSubmit={submitHandler} onChange={(event) => setMessage("")} className="mt-4 border-b border-solid border-b-gray-300">
                    <Form.Group controlId='name'>
                        <Form.Label>
                            Name
                        </Form.Label>
                        <Form.Control required type='name' placeholder='Enter Name' value={name} onChange={(event) => setName(event.target.value)}>

                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email' className="mt-3">
                        <Form.Label>
                            Email Address
                        </Form.Label>
                        <Form.Control required type='email' placeholder='Enter Email' value={email} onChange={(event) => setEmail(event.target.value)}>

                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='password' className="mt-3">
                        <Form.Label>
                            Password
                        </Form.Label>
                        <Form.Control className={message && 'border-red-400 border-2'} type='password' placeholder='Enter Password' value={password} onChange={(event) => setPassword(event.target.value)}>

                        </Form.Control>
                        {message && (
                            <div className="mt-2 flex items-center">
                                <ReportIcon className="text-red-400 w-5 mr-2">

                                </ReportIcon>
                                <span className="text-red-400">Passwords do not match</span>
                            </div>
                        )}
                    </Form.Group>
                    <Form.Group controlId='confirmPassword' className="mt-3">
                        <Form.Label>
                            Confirm Password
                        </Form.Label>
                        <Form.Control required={true} className={message && 'border-red-400 border-2'} type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}>

                        </Form.Control>
                    </Form.Group>

                    <Button onClick={submitHandler} className="my-3 border-b-gray-400" type='submit' variant='primary'>UPDATE</Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>MY ORDERS</h2>
                {loadingOrders ?  (
                    <Loader />
                ) : errorOrders ? (
                    <Alert variant='danger'>{errorOrders}</Alert>
                ) : (
                    <Table striped responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, key) => {
                                return (<tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0 ,10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>{order.isPaid ? <CheckCircleIcon className="text-green-600"/> : <CancelIcon className="text-red-600"/>}</td>
                                    <td>{order.isDelivered ? <CheckCircleIcon className="text-green-600"/> : <CancelIcon className="text-red-600"/>}</td>
                                    <td>
                                        <LinkContainer to={`/orders/${order._id}`}>
                                            <Button className="btn-sm">DETAILS</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>)
                            })}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}

export default ProfilePage
