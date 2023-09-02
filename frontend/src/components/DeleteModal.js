import React from 'react'
import axios from 'axios'
import ErrorIcon from '@mui/icons-material/Error';
import { useSelector, useDispatch } from 'react-redux'
import { setShowDeleteModal, userDeleteRequest, userDeleteSuccess, userDeleteError, productDeleteRequest, productDeleteError, productDeleteSuccess } from '../store'

function DeleteModal() {
    const dispatch = useDispatch()
    const deleteId = useSelector((state) => state.deleteModal.deleteId)
    const method = useSelector((state) => state.deleteModal.method)
    const { userInfo } = useSelector((state) => state.user);

    const deleteHandler = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        if (method === 'user') {
            dispatch(userDeleteRequest())

            dispatch(setShowDeleteModal(false))

            axios.delete(`/api/users/delete/${deleteId}/`, config).then((res) => {
                dispatch(userDeleteSuccess())
            }).catch((err) => {
                const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
                dispatch(userDeleteError(payload))
            })
        } else if (method === 'product') {
            dispatch(productDeleteRequest())

            dispatch(setShowDeleteModal(false))

            axios.delete(`/api/products/delete/${deleteId}/`, config).then((res) => {
                dispatch(productDeleteSuccess())
            }).catch((err) => {
                const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
                dispatch(productDeleteError(payload))
            })
        }
    }

    return (
        <div className="w-screen h-screen fixed bg-gray-200 z-10 flex items-center justify-center">
            <div className="w-[350px] h-[300px] bg-white rounded-xl flex flex-col p-[25px] shadow-md fixed">
                <div className="flex justify-center">
                    <ErrorIcon className="text-orange-400 text-9xl"/>
                </div>
                <div className="flex justify-center"> 
                    <h2>Are you sure?</h2>
                </div>
                <div className="text-sm flex justify-center">
                    <p>You won't be able to revert this action!</p>
                </div>
                <div className="flex justify-between mt-3 px-12" >
                    <button onClick={() => dispatch(setShowDeleteModal(false))} className="ml-2 px-2 text-blue-400 border-2 border-blue-400 hover:bg-blue-400 hover:text-white transition-colors">CANCEL</button>
                    <button onClick={() => deleteHandler()} className="ml-2 px-2 text-red-400 border-2 border-red-400 hover:bg-red-400 hover:text-white transition-colors">DELETE</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
