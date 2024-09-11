import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 301; index++) { // Adjusted index range
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        // Fetch all products
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/allproducts');
                const data = await response.json();
                setAll_Product(data);
            } catch (error) {
                console.error('Error fetching all products:', error);
            }
        };

        fetchProducts();

        // Fetch cart data if the user is authenticated
        const token = localStorage.getItem('auth-token');
        if (token) {
            const fetchCartData = async () => {
                try {
                    const response = await fetch('http://localhost:4000/getdata', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'auth-token': token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({})
                    });
                    const data = await response.json();
                    setCartItems(data);
                } catch (error) {
                    console.error('Error fetching cart data:', error);
                }
            };

            fetchCartData();
        }
    }, []);

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        if (localStorage.getItem('auth-token')) {
            try {
                const response = await fetch('http://localhost:4000/addtocart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': localStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "itemId": itemId }),
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (localStorage.getItem('auth-token')) {
            try {
                const response = await fetch('http://localhost:4000/removefromcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': localStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "itemId": itemId }),
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
        }
    }
    
    const updateProduct = async (id, updatedProductData) => {
        try {
            const response = await fetch('http://localhost:4000/updateproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    name: updatedProductData.name,
                    old_price: updatedProductData.old_price,
                    new_price: updatedProductData.new_price,
                    category: updatedProductData.category,
                    main_image: updatedProductData.image
                }),
            });
            const result = await response.json();
            console.log(result);
            // Refresh the product list
            const fetchProducts = async () => {
                try {
                    const response = await fetch('http://localhost:4000/allproducts');
                    const data = await response.json();
                    setAll_Product(data);
                } catch (error) {
                    console.error('Error fetching all products:', error);
                }
            };
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    

    const getTotalCartAmount = () => {
        return Object.keys(cartItems).reduce((totalAmount, item) => {
            if (cartItems[item] > 0) {
                const itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
            return totalAmount;
        }, 0);
    };

    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce((totalItems, count) => count > 0 ? totalItems + count : totalItems, 0);
    };

    const contextValue = { getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart, updateProduct };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
