import FormContainer from '../components/FormContainer'
import CheckoutProgress from '../components/CheckoutProgress'

import { saveAddress } from '../store'
import React, { useState } from 'react'
import { Form, Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

function ShippingPage() {
    const [city, setCity] = useState(shippingAddress.city)
    const [address, setAddress] = useState(shippingAddress.address)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)
    const { shippingAddress } = useSelector((state) => state.cart)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitHandler = (event) => {
        event.preventDefault()
        const form = event.currentTarget

        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else {
            dispatch(saveAddress({address, city, postalCode, country}))
            navigate('/payment')        
        }
    }

    return (
        <FormContainer>
            <CheckoutProgress stage1 stage2/>
            <Form onSubmit={submitHandler} className="mt-4 border-b border-solid border-b-gray-300" validated>
                <h1>SHIPPING</h1>
                <Form.Group controlId='address' className="mt-3">
                    <Form.Label>
                        Address
                    </Form.Label>
                    <Form.Control required type='text' placeholder='Enter Address' value={address ? address : ''} onChange={(event) => setAddress(event.target.value)}>

                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='city' className="mt-3">
                    <Form.Label>
                        City
                    </Form.Label>
                    <Form.Control required type='text' placeholder='Enter City' value={city ? city : ''} onChange={(event) => setCity(event.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='postalCode' className="mt-3">
                    <Form.Label>
                        Postal Code
                    </Form.Label>
                    <Form.Control required type='text' placeholder='Enter Postal Code' value={postalCode ? postalCode : ''} onChange={(event) => setPostalCode(event.target.value)}>

                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='country' className="mt-3">
                    <Form.Label>
                        Country
                    </Form.Label>
                    <Form.Control required type='text' placeholder='Enter Country' value={country ? country : ''} onChange={(event) => setCountry(event.target.value)}>

                    </Form.Control>
                </Form.Group>

                <Button className="my-3 border-b-gray-400" type='submit' variant='primary'>CONTINUE</Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingPage
