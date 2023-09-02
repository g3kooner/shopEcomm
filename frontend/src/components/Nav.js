import logo from '../assets/logo.png'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

import React, { useState } from 'react'
import { Image, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from 'react-redux'
import { logout, orderListReset, userListReset } from '../store'


function Nav() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')

    const { userInfo } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const logoutHandler = () => {
        dispatch(logout())
        dispatch(orderListReset())
        dispatch(userListReset())
        navigate('/login')
    }

    const submitHandler = (event) => {
        event.preventDefault()

        if (input) navigate(`/?keyword=${input}&page=1`)
    }

    return (
        <div className='shadow-md w-full'>
            <div className="md:flex bg-gray-600 py-4 md:px-10 px-7 items-center justify-between">
                <div className="flex flex-grow items-center justify-between text-gray-800">
                    <Image src={logo} className="w-[172px]" fluid/>
                    <div className="flex flex-1 px-4 max-w-xl">
                        <input className="w-4/5 h-[40px] flex-shrink min-w-[12px] p-3" onChange={(event) => setInput(event.target.value)}/>
                    <   button className="ml-2 px-2 text-green-400 border-2 border-green-400 hover:bg-green-400 hover:text-white transition-colors" onClick={submitHandler}>SUBMIT</button>
                    </div>
                </div>
                <div onClick={() => setOpen(!open)} className="absolute right-2.5 top-7 cursor-pointer md:hidden">
                    {!open && <MenuIcon className="text-3xl text-black" />}
                    {open && <CloseIcon className="text-3xl text-black" />}
                </div>
                <ul className={`md:flex block md:items-center m-0 p-0 ${open ? '' : 'hidden'}`}>
                    <li className="ml-8 text-xl md:my-0 my-7"><Link to="/" className="text-gray-800 hover:text-gray-400 duration-500">HOME</Link></li>
                    <li className="ml-8 text-xl md:my-0 my-7"><Link to="/cart" className="text-gray-800 hover:text-gray-400 duration-500">CART</Link></li>
                    {userInfo ? (
                        <li className="ml-8 text-xl md:my-0 my-7">
                            <NavDropdown title={userInfo.name.toUpperCase()} id='username' className="text-gray-800 hover:text-gray-400 duration-250">
                                <LinkContainer to="/profile">
                                    <NavDropdown.Item>
                                        PROFILE
                                    </NavDropdown.Item>
                                </LinkContainer>
                                {userInfo.isAdmin && (
                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item>
                                            USERS
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                )}
                                {userInfo.isAdmin && (
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item>
                                            PRODUCTS
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                )}
                                {userInfo.isAdmin && (
                                    <LinkContainer to="/admin/orderlist">
                                        <NavDropdown.Item>
                                            ORDERS
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                )}
                                <NavDropdown.Item onClick={logoutHandler}>
                                    LOGOUT
                                </NavDropdown.Item>
                            </NavDropdown>
                        </li>
                    ) : 
                    <li className="ml-8 text-xl md:my-0 my-7"><Link to="/login" className="text-gray-800 hover:text-gray-400 duration-500">LOGIN</Link></li> }
                </ul>
            </div>
        </div>
    )
}

export default Nav
