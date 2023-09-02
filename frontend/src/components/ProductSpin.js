import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image, Alert } from 'react-bootstrap'
import axios from 'axios'
import { topProductsRequest, topProductsSuccess, topProductsError } from "../store"

import Loader from './Loader'

function ProductSpin() {
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state) => state.products.topProducts) 

    useEffect(() => {
        dispatch(topProductsRequest())

        axios.get(`/api/products/top`).then((res) => {
            dispatch(topProductsSuccess(res.data));
        }).catch((err) => {
            const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
            dispatch(topProductsError(payload));
        });
    }, [dispatch])

    return (
        loading ?  <Loader />
        : error ? <Alert variant='danger'>{error}</Alert>
        : (
            <Carousel pause='hover' className="bg-dark mb-4">
                {products.map((product) => {
                    return (<Carousel.Item key={product._id}>
                        <Link to={`/products/${product._id}`}>
                            <Image src={product.image} alt={product.name} fluid/>
                            <Carousel.Caption className="carousel-caption">
                                <h4>{product.name} (${product.price})</h4>
                            </Carousel.Caption>
                        </Link>
                    </Carousel.Item>)
                })}
            </Carousel>
        )
    )
}

export default ProductSpin
