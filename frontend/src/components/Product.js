import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import {Link} from 'react-router-dom'

function Product({ product }) {
    return (
        <Card className="p-3 my-3 rounded shadow-md">
            <Link to={`/products/${product._id}`}>
                <Card.Img src={product.image} className=""/>
            </Link>
            <Card.Body>
                <Link to={`/products/${product._id}`} className="no-underline hover:underline">
                    <Card.Title as="div">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as="div">
                    <div className="my-3">
                        <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                    </div>
                </Card.Text>

                <Card.Text as="h2">
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product
