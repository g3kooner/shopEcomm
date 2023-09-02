import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Alert } from "react-bootstrap"
import Product from '../components/Product'
import Loader from '../components/Loader'
import Paginator from '../components/Paginator'
import ProductSpin from '../components/ProductSpin'
import { requestProducts, successProducts, errorProducts } from "../store"

function HomePage() {
    const dispatch = useDispatch();
    const {products, loading, error, page, pages} = useSelector((state) =>  state.products.value)

    const keyword = window.location.hash.toString() !== '#/' ? window.location.hash.substring(1) : '';

    useEffect(() => {   
        dispatch(requestProducts())

        axios.get(`/api/products${keyword}`).then((res) => {
            dispatch(successProducts(res.data));
        }).catch((err) => {
            const payload = err.response && err.response.data.detail ? err.response.data.detail : err.message;
            dispatch(errorProducts(payload));
        });
    }, [dispatch, keyword]);

    return (
        <div>
            {!keyword && <ProductSpin />}
            <div className="flex items-center justify-between">
                <h1 className="mt-4">Latest Products</h1>
                <Paginator pages={pages} page={page} keyword={keyword}/>
            </div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant='danger'>{error}</Alert>
            ) : (
                <div>
                    <Row> 
                        {products.map((product) => {
                            return (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product}/>
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            )}
        </div>
    )
}

export default HomePage
