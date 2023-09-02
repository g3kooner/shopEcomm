import axios from "axios";
import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Alert } from 'react-bootstrap'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { userListError, userlistSuccess, userListRequest, setShowDeleteModal, setDeleteId, setMethod } from "../store"
import Loader from '../components/Loader'

function UserListPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {users, loading, error} = useSelector((state) => state.user.userList)
    const { loading:loadingDelete, success:successDelete, error:errorDelete} = useSelector((state) => state.user.userDelete)
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) navigate('/login')

        dispatch(userListRequest());

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        axios.get(`/api/users`, config).then((res) => {   
            dispatch(userlistSuccess(res.data));
        }).catch((err) => {
            const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
            dispatch(userListError(payload));
        })
    }, [dispatch, successDelete, navigate])

    const deleteHandler = (id) => {
        dispatch(setDeleteId(id))
        dispatch(setShowDeleteModal(true))
        dispatch(setMethod('user'))
    }

    return (
        <div>
            <h1 className="mt-4">USERS</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Table striped bordered hover responsive className="table-sm my-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, key) => {
                            return (<tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? <CheckCircleIcon className="text-green-600"/> : <CancelIcon className="text-red-600"/>}</td>
                                <td className="flex items-center">
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant='light' className="btn-sm bg-gray-200 hover:bg-gray-400">
                                            <ModeEditIcon />
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='light' className="btn-sm bg-gray-200 hover:bg-gray-400 ml-2" onClick={() => deleteHandler(user._id)}>
                                        <DeleteForeverIcon />
                                    </Button>
                                </td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default UserListPage
