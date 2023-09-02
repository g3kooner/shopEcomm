import React from 'react'

import { Container, Row, Col} from 'react-bootstrap'

function FormContainer({ children }) {
    return (
        <Container className="mt-3">
            <Row className="flex justify-center">
                <Col xs={12} md={6}>
                    { children }
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer
