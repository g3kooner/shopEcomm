import axios from "axios";
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import ReportIcon from '@mui/icons-material/Report';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { register, handleError, userUpdateSuccess, userUpdateRequest, userUpdateError, userUpdateReset } from "../store"
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'


function UserEditPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { userInfo, error } = useSelector((state) => state.user);
    const { success:successUpdate, loading:loadingUpdate, error:errorUpdate } = useSelector((state) => state.user.userUpdate);

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setAdmin] = useState(false)

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
        if (successUpdate === true) {
            navigate('/admin/userlist')
            dispatch(userUpdateReset())
        } else {
            if (!userInfo.name || userInfo._id != id) {
                axios.get(`/api/users/${id}/`, config).then((res) => {
                    setName(res.data.name)
                    setEmail(res.data.email)
                    setAdmin(res.data.isAdmin)
                })
            } else {
                setName(userInfo.name)
                setEmail(userInfo.email)
                setAdmin(userInfo.isAdmin)
            }
        }
    }, [successUpdate, navigate, dispatch]);

    const submitHandler = (event) => {
        event.preventDefault();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        dispatch(userUpdateRequest())

        axios.put(`/api/users/update/${id}/`, {name, email, isAdmin}, config).then((res) => {
            dispatch(userUpdateSuccess())
        }).catch((err) => {
            const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
            dispatch(userUpdateError(payload))
        })
    }

    return (
        <FormContainer>
            <div className="flex items-center justify-between">
                <h1 className="inline-block m-0">EDIT USER DETAILS</h1>
                <Link to="/admin/userlist" className="btn border-2 border-black hover:bg-black hover:text-white px-[24px] py-[12px]">GO BACK</Link>
            </div>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Alert variant='danger'>{errorUpdate}</Alert>}
            <Form onSubmit={submitHandler} className="mt-4 border-b border-solid border-b-gray-300">
                <Form.Group controlId='name' className="mt-3">
                    <Form.Label>
                        Name
                    </Form.Label>
                    <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(event) => setName(event.target.value)}>

                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='email' className="mt-3">
                    <Form.Label>
                        Email Address
                    </Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(event) => setEmail(event.target.value)}>

                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='isadmin' className="mt-3">
                    <Form.Check type="checkbox" label="Admin" checked={isAdmin} onChange={(event) => setAdmin(event.target.checked)}>
                        
                    </Form.Check>
                </Form.Group>
                <Button onClick={submitHandler} className="my-3 border-b-gray-400" type='submit' variant='primary'>UPDATE</Button>
            </Form>
        </FormContainer>
    );
}

export default UserEditPage
