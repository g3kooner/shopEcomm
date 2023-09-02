import axios from "axios"
import ReportIcon from '@mui/icons-material/Report'
import FormContainer from '../components/FormContainer'

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { register, handleError } from "../store"
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'

function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()
    const redirect = window.location.href.includes('redirect') ? '/' + window.location.href.split('=')[1] : '/'

    const { userInfo, error} = useSelector((state) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }   
    }, [navigate, userInfo, redirect])

    const submitHandler = (event) => {
        event.preventDefault()
        if (password != confirmPassword) {
            setMessage("Passwords do not match")
        } else { 
            setMessage("")
            axios.post('/api/users/register/', {'name': name, 'email': email, 'password': password}).then((res) => {
                dispatch(register(res.data))

                navigate(redirect)
            }).catch((err) => {
                dispatch(handleError(err))
            })
        }
    }

    return (
        <FormContainer>
            <h1>CREATE AN ACCOUNT</h1>
            {error && <Alert variant='danger'>{error.response.data.detail}</Alert>}

            <Form onSubmit={submitHandler} onChange={(event) => setMessage("")} className="mt-4 border-b border-solid border-b-gray-300" validated>
                <Form.Group controlId='name' className="mt-3">
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
                    <Form.Control required={true} className={message && 'border-red-400 border-2'} type='password' placeholder='Enter Password' value={password} onChange={(event) => setPassword(event.target.value)}>

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

                <Button onClick={submitHandler} className="my-3 border-b-gray-400" type='submit' variant='primary'>REGISTER</Button>
            </Form>

            <Row className="py-3">
                <Col>
                    <span className="font-bold text-black mr-3">Already have an account?</span>  
                    <Link className="font-normal text-blue-600 hover:underline" to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        Sign in
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterPage
