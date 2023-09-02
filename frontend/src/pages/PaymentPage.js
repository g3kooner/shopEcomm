import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import paypal from '../assets/paypal.png';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutProgress from '../components/CheckoutProgress'
import { saveMethod } from '../store'

function PaymentPage() {
    const { shippingAddress } = useSelector((state) => state.cart);
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!shippingAddress.address) {
        navigate('/shipping');
    }

    const submitHandler = (event) => {
        event.preventDefault();

        dispatch(saveMethod(paymentMethod));
        navigate('/summary')
    }

    return (
        <FormContainer>
            <CheckoutProgress stage1 stage2 stage3/>
            <h1>SELECT PAYMENT METHOD</h1>

            <Form onSubmit={submitHandler} className="-mt-5 border-b border-solid border-b-gray-300">
                <Form.Group>
                    <Form.Label></Form.Label>
                    <Col className="flex flex-row justify-left items-center">
                        <Form.Check onChange={(event) => setPaymentMethod(event.target.value)} className="pr-3 inline-block" type='radio' label='PayPal' id='paypal' name='paymentMethod' checked>
                            
                        </Form.Check>
                        <img className="inline-block" src={paypal} className="w-[64px]" />

                        <span className="pl-3">Covers 202 countries or regions, 25 curriences are supported and currency exchange and charge fees are produced when non dollar curriences are paid debit and credit cards of the local cooperative bank</span>
                    </Col>
                </Form.Group>
                <Button onClick={submitHandler} className="my-3 border-b-gray-400" type='submit' variant='primary'>CONTINUE</Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentPage
