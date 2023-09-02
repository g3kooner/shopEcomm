import { configureStore, createSlice } from "@reduxjs/toolkit"

const initialProductsState = {value: {products: [], loading: true, error: null, page:null, pages:null}, 
    productDelete: {loading: true, success:false, error: null}, 
    productCreate: {product: {}, loading: true, success: false, error: null}, 
    topProducts: {products: [], loading:true, error:null}}

const productsSlice = createSlice({
    name: "products",
    initialState: initialProductsState,
    reducers: {
        requestProducts:(state, action) => {
            state.value.loading = true
            state.value.error = null
        },
        successProducts:(state, action) => {
            state.value.products = action.payload.products
            state.value.page = action.payload.page
            state.value.pages = action.payload.pages
            state.value.loading = false
        },
        errorProducts:(state, action) => {
            state.value.error = action.payload
            state.value.loading = false
        },
        productDeleteRequest: (state, action) => {
            state.productDelete.success = false
            state.productDelete.loading = true
            state.productDelete.error = null
        }, 
        productDeleteSuccess: (state, action) => {
            state.productDelete.loading = false
            state.productDelete.success = true
        },
        productDeleteError: (state, action) => {
            state.productDelete.loading = false
            state.productDelete.error = action.payload
        },
        productCreateRequest: (state, action) => {
            state.productCreate.loading = true
            state.productCreate.error = null
        }, 
        productCreateSuccess: (state, action) => {
            state.productCreate.loading = false
            state.productCreate.success = true
            state.productCreate.product = action.payload
        },
        productCreateError: (state, action) => {
            state.productCreate.loading = false
            state.productCreate.error = action.payload
        },
        productCreateReset: (state, action) => {
            state.productCreate.success = false
            state.productCreate.product = {}
        },
        topProductsRequest: (state, action) => {
            state.topProducts.loading = true
            state.topProducts.error = null
        },
        topProductsSuccess: (state, action) => {
            state.topProducts.loading = false
            state.topProducts.products = action.payload
        },
        topProductsError: (state, action) => {
            state.topProducts.error = action.payload
            state.topProducts.loading = false
        },
    }
})

const initialProductState = {value: {product: {}, loading:true, error:null}, 
    productUpdate: {success: false, loading: false, error: null}}

const productSlice = createSlice({
    name: "product",
    initialState: initialProductState,
    reducers: {
        requestProduct:(state, action) => {
            state.value.loading = true
            state.value.error = null
        },
        successProduct:(state, action) => {
            state.value.product = action.payload
            state.value.loading = false
        },
        errorProduct:(state, action) => {
            state.value.error = action.payload
            state.value.loading = false
        },
        productUpdateRequest: (state, action) => {
            state.productUpdate.success = false
            state.productUpdate.loading = true
        }, 
        productUpdateSuccess: (state, action) => {
            state.productUpdate.loading = false
            state.productUpdate.success = true
        },
        productUpdateError: (state, action) => {
            state.productUpdate.loading = false
            state.productUpdate.error = action.payload
        },
        productUpdateReset: (state, action) => {
            state.productUpdate.success = false
            state.productUpdate.loading = false
            state.productUpdate.error = null
        },
    }
})

const cartLocalStorage = localStorage.getItem('cartItems') ? 
    JSON.parse(localStorage.getItem('cartItems')): []

const shippingLocalStorage = localStorage.getItem('shippingAddress') ? 
    JSON.parse(localStorage.getItem('shippingAddress')): {}

const paymentLocalStorage = localStorage.getItem('paymentMethod') ? 
    JSON.parse(localStorage.getItem('paymentMethod')): {}

const initialCartState = {cartItems: cartLocalStorage, shippingAddress: shippingLocalStorage, paymentMethod: paymentLocalStorage}

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        addCart:(state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find((x) => x.product === item.product)

            if (existItem) {
                for (let i = 0; i < state.cartItems.length; i++) {  
                    if (state.cartItems[i].product === item.product) state.cartItems[i] = item
                }
            } else {
                state.cartItems = [...state.cartItems, item] 
            }

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        removeCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload.product)

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        clearCart: (state, action) => {
            state.cartItems = []
            localStorage.removeItem('cartItems')
        },
        saveAddress: (state, action) => {
            state.shippingAddress = action.payload

            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress))
        },
        saveMethod: (state, action) => {
            state.paymentMethod = action.payload

            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod))
        }
    }
})

const userLocalStorage = localStorage.getItem('userInfo') ? 
    JSON.parse(localStorage.getItem('userInfo')): null

const initialUserState = {userInfo: userLocalStorage, error: null, 
        userList: {users: [], loading:true, error:null}, 
        userDelete: {loading: true, success:false, error: null}, 
        userUpdate: {success: false, loading: false, error: null}}

const userSlice = createSlice({
    name: "user",
    initialState: initialUserState,
    reducers: {
        login: (state, action) => {
            state.userInfo = action.payload
            state.error = null
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        handleError: (state, action) => {
            state.error = action.payload
        },
        logout: (state, action) => {
            state.userInfo = null
            state.error = null
            localStorage.removeItem('userInfo')
            localStorage.removeItem('shippingAddress')
        }, 
        register: (state, action) => {
            state.userInfo = action.payload
            state.error = null
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        update: (state, action) => {
            state.userInfo = action.payload
            state.error = null
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        userListRequest: (state, action) => {
            state.userList.loading = true
        }, 
        userlistSuccess: (state, action) => {
            state.userList.loading = false
            state.userList.users = action.payload
        },
        userListError: (state, action) => {
            state.userList.loading = false
            state.userList.error = action.payload
        },
        userListReset: (state, action) => {
            state.userList.users = []
        }, 
        userDeleteRequest: (state, action) => {
            state.userDelete.success = false
            state.userDelete.loading = true
        }, 
        userDeleteSuccess: (state, action) => {
            state.userDelete.loading = false
            state.userDelete.success = true
        },
        userDeleteError: (state, action) => {
            state.userDelete.loading = false
            state.userDelete.error = action.payload
        },
        userUpdateRequest: (state, action) => {
            state.userUpdate.success = false
            state.userUpdate.loading = true
        }, 
        userUpdateSuccess: (state, action) => {
            state.userUpdate.loading = false
            state.userUpdate.success = true
        },
        userUpdateError: (state, action) => {
            state.userUpdate.loading = false
            state.userUpdate.error = action.payload
        },
        userUpdateReset: (state, action) => {
            state.userUpdate.success = false
            state.userUpdate.loading = false
            state.userUpdate.error = null
        },
    }
})

const initialOrderState = {orderDeliver: {loading: true, success: false}, 
    orderPay: {loadingPay: true, successPay: false}, 
    newOrderInfo: {}, success: false, getOrderDetails: {}, loading:true, 
    orderList:{orders: [], loading: true, error: null}, 
    adminOrders: {orders: [], loading: true, error: null}}

const orderSlice = createSlice({
    name: "order",
    initialState: initialOrderState,
    reducers: {
        resetNewOrder: (state, action) => {
            state.newOrderInfo = {}
            state.success = false
        },
        createNewOrder: (state, action) => {
            state.newOrderInfo = action.payload
            state.success = true
        },
        getOrder: (state, action) => {
            state.getOrderDetails = action.payload
            state.loading = false
        },
        payOrder: (state, action) => {
            state.orderPay.loadingPay = false
            state.orderPay.successPay = true
        },
        deliverOrder: (state, action) => {
            state.orderDeliver.loading = false
            state.orderDeliver.success = true
        },
        orderListRequest: (state, action) => {
            state.orderList.loading = true
        }, 
        orderListSuccess: (state, action) => {
            state.orderList.loading = false
            state.orderList.orders = action.payload
        },
        orderListError: (state, action) => {
            state.orderList.loading = false
            state.orderList.error = action.payload
        },
        orderListReset: (state, action) => {
            state.orderList.orders = []
        },
        adminListRequest: (state, action) => {
            state.adminOrders.loading = true
        }, 
        adminListSuccess: (state, action) => {
            state.adminOrders.loading = false
            state.adminOrders.orders = action.payload
        },
        adminListError: (state, action) => {
            state.adminOrders.loading = false
            state.adminOrders.error = action.payload
        },
    }
})

const initialDeleteModalState = {showModal: false, deleteId: null, method: null}

const deleteModalSlice = createSlice({
    name: "deleteModal",
    initialState: initialDeleteModalState,
    reducers: {
        setShowDeleteModal: (state, action) => {
            state.showModal = action.payload
        },
        setDeleteId: (state, action) => {
            state.deleteId = action.payload
        },
        setMethod: (state, action) => {
            state.method = action.payload
        }
    }
})

export const { requestProducts, successProducts, errorProducts, productDeleteRequest, 
    productDeleteSuccess, productDeleteError, productCreateRequest, productCreateSuccess, productCreateError, productCreateReset, topProductsRequest, topProductsSuccess, topProductsError } = productsSlice.actions

export const { requestProduct, successProduct, errorProduct, productUpdateRequest, 
    productUpdateSuccess, productUpdateError, productUpdateReset } = productSlice.actions

export const { addCart, removeCart, clearCart, saveAddress, saveMethod } = cartSlice.actions

export const { login, handleError, logout, register, update, userListRequest,
     userlistSuccess, userListError, userListReset, userDeleteRequest, userDeleteSuccess,
      userDeleteError, userUpdateRequest, userUpdateSuccess, userUpdateError, userUpdateReset } = userSlice.actions

export const { resetNewOrder, createNewOrder, getOrder, payOrder, deliverOrder, 
    orderListRequest, orderListSuccess, orderListError, orderListReset, 
    adminListRequest, adminListSuccess, adminListError} = orderSlice.actions

export const { setShowDeleteModal, setDeleteId, setMethod } = deleteModalSlice.actions

export const store = configureStore({
    reducer: {
        products: productsSlice.reducer,
        product: productSlice.reducer,
        cart: cartSlice.reducer,
        user: userSlice.reducer,
        order: orderSlice.reducer,
        deleteModal: deleteModalSlice.reducer,
    },  
})