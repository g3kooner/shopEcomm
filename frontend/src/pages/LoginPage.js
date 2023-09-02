import axios from "axios";
import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { login, handleError } from "../store"
import FormContainer from '../components/FormContainer'

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const redirect = window.location.href.includes('redirect') ? '/' + window.location.href.split('=')[1] : '/';

    const { userInfo, error} = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }   
    }, [navigate, userInfo, redirect])

    const submitHandler = (event) => {
        event.preventDefault();

        axios.post('/api/users/login/', {'username': email, 'password': password}).then((res) => {
            dispatch(login(res.data));

            navigate(redirect);
        }).catch((err) => {
            dispatch(handleError(err));
        })
    }

    return (
        <FormContainer>
            <h1>SIGN IN</h1>
            {error && <Alert variant='danger'>{error.response.data.detail}</Alert>}

            <Form className="mt-4 border-b border-solid border-b-gray-300">
                <Form.Group controlId='email'>
                    <Form.Label>
                        Email Address
                    </Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(event) => setEmail(event.target.value)}>

                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='password' className="mt-3">
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(event) => setPassword(event.target.value)}>

                    </Form.Control>
                </Form.Group>

                <Button onClick={submitHandler} className="my-3 border-b-gray-400" type='submit' variant='primary'>SIGN IN</Button>
            </Form>

            <Row className="py-3">
                <Col>
                    <span className="font-bold text-black mr-3">Don't have an account?</span>  
                    <Link className="font-normal text-blue-600 hover:underline" to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        Create an account
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginPage
