import React from 'react'
import { Link } from 'react-router-dom'

function CheckoutProgress({stage1, stage2, stage3, stage4}) {
    return (
        <div class="flex mb-4">
          <Link to='/login' class={stage1 ? "flex-grow text-black border-b-2 border-black  py-2 text-lg px-1" : "flex-grow border-b-2 border-gray-300 py-2 text-lg px-1 pointer-events-none"}>Login</Link>
          <Link to='/shipping' class={stage2 ? "flex-grow text-black border-b-2 border-black  py-2 text-lg px-1" : "flex-grow border-b-2 border-gray-300 py-2 text-lg px-1 pointer-events-none"}>Shipping</Link>
          <Link to='/payment' class={stage3 ? "flex-grow text-black border-b-2 border-black  py-2 text-lg px-1" : "flex-grow border-b-2 border-gray-300 py-2 text-lg px-1 pointer-events-none"}>Payment</Link>
          <Link to='/placeorder' class={stage4 ? "flex-grow text-black border-b-2 border-black  py-2 text-lg px-1" : "flex-grow border-b-2 border-gray-300 py-2 text-lg px-1 pointer-events-none"}>Summary</Link>
        </div>
    )
}

export default CheckoutProgress
