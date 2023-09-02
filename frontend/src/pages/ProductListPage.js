import axios from "axios";
import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Alert } from 'react-bootstrap'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { errorProducts, requestProducts, setDeleteId, setMethod, setShowDeleteModal, successProducts, productCreateRequest, productCreateSuccess, productCreateError, productCreateReset } from "../store"
import Loader from '../components/Loader'
import Paginator from '../components/Paginator'

function ProductListPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {products, loading, error, pages, page} = useSelector((state) =>  state.products.value)
    const { loading:loadingDelete, success:successDelete, error:errorDelete} = useSelector((state) => state.products.productDelete)
    const { product:createdProduct, loading:loadingCreate, success:successCreate, error:errorCreate} = useSelector((state) => state.products.productCreate)
    const { userInfo } = useSelector((state) => state.user);

    const keyword = window.location.search ? window.location.search : '';

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) navigate('/login')

        dispatch(requestProducts())

        if (successCreate === true) {
            dispatch(productCreateReset())
            navigate(`/admin/products/${createdProduct._id}/edit`)
        }

        axios.get(`/api/products${keyword}`).then((res) => {
            dispatch(successProducts(res.data))
        }).catch((err) => {
            const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
            dispatch(errorProducts(payload))
        });
    }, [dispatch, successDelete, successCreate, keyword])

    const deleteHandler = (id) => {
        dispatch(setDeleteId(id))
        dispatch(setShowDeleteModal(true))
        dispatch(setMethod('product'))
    }

    const createProductHandler = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        dispatch(productCreateRequest())

        axios.post('/api/products/create/', {}, config).then((res) => {
            dispatch(productCreateSuccess(res.data))
        }).catch((err) => {
            const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
            dispatch(productCreateError(payload))
        })
    }

    return (
        <div>
            <Row className="items-center"> 
                <Col>
                    <h1 className="mt-4">Products</h1>
                </Col>
                <Col className="text-right">
                    <Button className="my-3" onClick={createProductHandler}>
                        <i className="fas fa-plus mr-1"></i> Create Product
                    </Button>
                </Col>  
            </Row>



            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <div>
                    <Table striped bordered hover responsive className="table-sm my-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, key) => {
                                return (<tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td className="flex items-center">
                                        <LinkContainer to={`/admin/products/${product._id}/edit`}>
                                            <Button variant='light' className="btn-sm bg-gray-200 hover:bg-gray-400">
                                                <ModeEditIcon />
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='light' className="btn-sm bg-gray-200 hover:bg-gray-400 ml-2" onClick={() => deleteHandler(product._id)}>
                                            <DeleteForeverIcon />
                                        </Button>
                                    </td>
                                </tr>)
                            })}
                        </tbody>
                    </Table>
                    <Paginator pages={pages} page={page} isAdmin={true} />
                </div>
            )}
        </div>
    )
}

export default ProductListPage
