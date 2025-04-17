import { useEffect, useState, useMemo } from 'react'
import { db } from '../data/db.js'
import type { Guitar, CartItem } from '../types/index.ts'

export const useCart = () => {

    const initialState = () : CartItem[] => {
        const localStorageCart = localStorage.getItem("cart")
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    //State
    const [data] = useState(db);
    const [cart, setCart] = useState(initialState);

    const MIN_ITEMS = 1

    useEffect( () => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    function addToCart(item : Guitar) {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id)

        if (itemExists >= 0) {
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        } else {
            const newItem : CartItem = {
                ...item,
                quantity: 1
            }
            setCart([...cart, newItem])
        }
    }

    function removeToCart(id : Guitar['id']) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id : Guitar['id']) {
        const updatedCart = cart.map( item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: item.quantity + 1 
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id : Guitar['id']) {
        const updatedCart = cart.map( item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1 
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([])
    }

    //State derivado
    const isEmpty = useMemo( () => cart.length === 0, [cart])
    const cartTotal = useMemo( () => cart.reduce( (total, item) => total + (item.price * item.quantity ), 0), [cart]) 

    return {
        data,
        cart,
        addToCart,
        removeToCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal,
    }
}