import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: "Serums",
        new_price: "",
        old_price: "",
        summary: "",
        detailed_description: ""
    });

    const changeHandler = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value
        });
    };

    const mainImageHandler = (e) => {
        setMainImage(e.target.files[0]);
    };

    const otherImagesHandler = (e) => {
        setOtherImages(Array.from(e.target.files));
    };

    const addProduct = async () => {
        if (!mainImage) {
            alert("Please select a main image.");
            return;
        }
    
        const formData = new FormData();
        formData.append('main_image', mainImage);
        otherImages.forEach(image => formData.append('other_images', image));
    
        try {
            // Upload images
            const uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });
    
            const uploadData = await uploadResponse.json();
    
            if (uploadData.success) {
                const product = {
                    ...productDetails,
                    main_image_url: uploadData.main_image_url,
                    other_images_url: uploadData.other_images_url
                };
    
                // Add product to the database
                const addProductResponse = await fetch('http://localhost:4000/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
    
                const addProductData = await addProductResponse.json();
                if (addProductData.success) {
                    alert("Product added successfully!");
                } else {
                    alert("Error adding product: " + addProductData.message);
                }
            } else {
                alert("Error uploading images: " + uploadData.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred: " + error.message);
        }
    };
    
    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name='name'
                    placeholder='Type here'
                />
            </div>

            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type="text"
                        name="old_price"
                        placeholder='Type here'
                    />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type="text"
                        name='new_price'
                        placeholder='Type here'
                    />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select
                    name="category"
                    className='add-product-selector'
                    value={productDetails.category}
                    onChange={changeHandler}
                >
                    <option value="Serums">Serums</option>
                    <option value="Moisturisers">Moisturisers</option>
                    <option value="Supplements">Supplements</option>
                    <option value="Soaps">Soaps</option>
                    <option value="Toners">Toners</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Summary Description</p>
                <textarea
                    value={productDetails.summary}
                    onChange={changeHandler}
                    name="summary"
                    placeholder='Type summary here'
                />
            </div>
            <div className="addproduct-itemfield">
                <p>Detailed Description</p>
                <textarea
                    value={productDetails.detailed_description}
                    onChange={changeHandler}
                    name="detailed_description"
                    placeholder='Type detailed description here'
                />
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="main-image">
                    <img
                        src={mainImage ? URL.createObjectURL(mainImage) : upload_area}
                        className='addproduct-thumbnail-img'
                        alt="Upload main image"
                    />
                </label>
                <input
                    onChange={mainImageHandler}
                    type="file"
                    id='main-image'
                    hidden
                />
                <p>Main Image</p>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="additional-images">
                    <img
                        src={otherImages.length ? URL.createObjectURL(otherImages[0]) : upload_area}
                        className='addproduct-thumbnail-img'
                        alt="Upload additional images"
                    />
                </label>
                <input
                    onChange={otherImagesHandler}
                    type="file"
                    id='additional-images'
                    multiple
                    hidden
                />
                <p>Upload Additional Images</p>
            </div>
            <button onClick={addProduct} className='addproduct-btn'>ADD</button>
        </div>
    );
}

export default AddProduct;
