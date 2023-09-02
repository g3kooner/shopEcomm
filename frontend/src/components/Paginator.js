import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Paginator({ pages, page, keyword='', isAdmin = false}) {
    console.log(keyword)
    if (keyword) {
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }

    return ( pages > 1 && (
            <Pagination className="m-0 pt-3">
                {
                    [...Array(pages).keys()].map((value, key) => {
                        return (<LinkContainer key={value + 1} to={!isAdmin ? {pathname: "/", search: `?keyword=${keyword}&page=${value + 1}`} : {pathname: "/admin/productlist", search: `?keyword=${keyword}&page=${value + 1}`}}>
                            <Pagination.Item className="mr-1">  
                                {value + 1}
                            </Pagination.Item>
                        </LinkContainer>)
                    })
                }
            </Pagination>
        )
        
    )
}

export default Paginator
