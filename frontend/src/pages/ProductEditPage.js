import axios from "axios"
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button, Alert } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { requestProduct, successProduct, errorProduct, 
        productUpdateRequest, productUpdateSuccess, productUpdateError, productUpdateReset } from "../store"

function ProductEditPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { id } = useParams()
    const { userInfo, error } = useSelector((state) => state.user)
    const {product, loading:loadingProduct, error:errProduct} = useSelector((state) =>  state.product.value)
    const {success:successUpdate, loading:loadingUpdate, error:errorUpdate} = useSelector((state) =>  state.product.productUpdate)

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        dispatch(requestProduct())

        if (successUpdate === true) {
            navigate('/admin/productlist')
            dispatch(productUpdateReset())
        } else {
            axios.get(`/api/products/${id}/`, config).then((res) => {
                dispatch(successProduct(res.data))

                setName(res.data.name)
                setPrice(res.data.price)
                setImage(res.data.image)
                setBrand(res.data.brand)
                setCategory(res.data.category)
                setCountInStock(res.data.countInStock)
                setDescription(res.data.description)
            }).catch((err) => {
                const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message
                dispatch(errorProduct(payload))
            })
        }
    }, [navigate, dispatch, successUpdate])

    const submitHandler = (event) => {
        event.preventDefault()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        dispatch(productUpdateRequest())

        axios.put(`/api/products/update/${id}/`, {name, price, image, brand, category, countInStock, description}, config).then((res) => {
            dispatch(productUpdateSuccess())
        }).catch((err) => {
            const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message
            dispatch(productUpdateError(payload))
        })
    }

    const uploadHandler = async (event) => {
        const file = event.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', id)

        try {
            const config = {
                headers: {
                    'Content-Rype': `multipart/form-data `
                }
            }

            const { data } = await axios.post('/api/products/upload/', formData, config)

            setImage(file.name)
            document.querySelector("#image").classList.add("border-green-400",  "border-2")
        } catch(error) {
            setImage("Encountered an error uploading the image, please try again.")
            document.querySelector("#image").classList.add("border-red-400",  "border-2")
        }
    }

    return (
        <FormContainer>
            <div className="flex items-center justify-between">
                <h1 className="inline-block m-0">EDIT PRODUCT DETAILS</h1>
                <Link to="/admin/productlist" className="btn border-2 border-black hover:bg-black hover:text-white px-[24px] py-[12px]">GO BACK</Link>
            </div>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Alert variant='danger' className='mt-2'>{errorUpdate}</Alert>}

            {loadingProduct ? <Loader /> : errProduct ? <Alert variant='danger'>{errProduct}</Alert> : (
                <Form onSubmit={submitHandler} className="mt-4 border-b border-solid border-b-gray-300">
                    <Form.Group controlId='name' className="mt-3">
                        <Form.Label>
                            Name
                        </Form.Label>
                        <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(event) => setName(event.target.value)}>

                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='price' className="mt-3">
                        <Form.Label>
                            Price
                        </Form.Label>
                        <Form.Control type='number' placeholder='Enter Price' value={price} onChange={(event) => setPrice(event.target.value)}>

                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='image' className="mt-3">
                        <Form.Label>
                            Image
                        </Form.Label>
                        <Form.Control className="mb-2" readOnly type='text' placeholder='Enter Image' value={image} onChange={(event) => setImage(event.target.value)}>
                        </Form.Control>
                        <Form.Control type="file" onChange={uploadHandler}/>
                    </Form.Group>
                    <Form.Group controlId='brand' className="mt-3">
                        <Form.Label>
                            Brand
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Brand' value={brand} onChange={(event) => setBrand(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='countInStock' className="mt-3">
                        <Form.Label>
                            Stock
                        </Form.Label>
                        <Form.Control type='number' placeholder='Enter Stock' value={countInStock} onChange={(event) => setCountInStock(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='category' className="mt-3">
                        <Form.Label>
                            Category
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Category' value={category} onChange={(event) => setCategory(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='description' className="mt-3">
                        <Form.Label>
                            Description
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Description' value={description} onChange={(event) => setDescription(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Button onClick={submitHandler} className="my-3 border-b-gray-400" type='submit' variant='primary'>UPDATE</Button>
                </Form>
            )}
        </FormContainer>
    )
}

export default ProductEditPage