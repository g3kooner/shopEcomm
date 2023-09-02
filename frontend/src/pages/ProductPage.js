import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"
import { Row, Col, Image, ListGroup, Form, Alert } from "react-bootstrap"
import Loader from '../components/Loader'
import { requestProduct, successProduct, errorProduct, addCart } from "../store"
import Rating  from "../components/Rating"
import axios from 'axios'

function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const dispatch = useDispatch();
    const {product, loading, error} = useSelector((state) =>  state.product.value)

    useEffect(() => {   
        dispatch(requestProduct())

        axios.get(`/api/products/${id}`).then((res) => {
            dispatch(successProduct(res.data));
        }).catch((err) => {
            const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
            dispatch(errorProduct(payload));
        });
    }, [dispatch]);

    const addToCardHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`);
    }
    
    return (
        <div className="mt-10">
            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant='danger'>{error}</Alert>
            ) : (
                <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid className="rounded"/>
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>{product.name}</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating value={product.rating} text={`${product.numReviews} reviews`}></Rating>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: ${product.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row className="flex">
                                    <Col className="flex flex-grow basis-0">Status:</Col>
                                    <Col className="flex flex-grow basis-0">{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                </Row>
                            </ListGroup.Item>
                            {product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row className="flex">
                                        <Col className="flex items-center flex-grow basis-0">Quantity:</Col>
                                        <Col xs='auto' className="flex flex-grow basis-0">
                                            <Form.Select as="select" value={qty} onChange={(event) => setQty(event.target.value)}>
                                                {
                                                    [...Array(product.countInStock).keys()].map((value, key) => {
                                                        return <option key={key + 1} value={value + 1}>{value + 1}</option>
                                                    })
                                                }
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item className="flex justify-between items-center">
                                <Link to="/" className="btn border-2 border-black hover:bg-black hover:text-white">GO BACK</Link>
                                <button onClick={addToCardHandler} disabled={product.countInStock === 0} className="btn border-2 border-black hover:bg-black hover:text-white px-[24px] py-[12px]">ADD TO CART</button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default ProductPage
