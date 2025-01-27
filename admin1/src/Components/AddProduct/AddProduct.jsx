import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: "",
        available: true // Ensure this field is set
    });

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    // const Add_Product = async () => {
    //     console.log(productDetails);
    //     let responseData;
    //     let product = productDetails;

    //     let formData = new FormData();
    //     formData.append('product', image);

    //     await fetch('http://localhost:3000/upload', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json'
    //         },
    //         body: formData,
    //     })
    //         .then((resp) => resp.json())
    //         .then((data) => { responseData = data });

    //     if (responseData.success) {
    //         product.image = responseData.image_url;
    //         console.log(product);
    //         await fetch('http://localhost:3000/addproduct', {
    //             method: 'POST',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(product),
    //         })
    //             .then((resp) => resp.json())
    //             .then((data) => {
    //                 data.success ? alert("Product Added") : alert("Failed");
    //             })
    //             .catch((error) => {
    //                 console.error("Error adding product:", error);
    //             });
    //     }
    // };


    const Add_Product = async () => {
        if (!image || !productDetails.name || !productDetails.old_price || !productDetails.new_price) {
            alert("Please fill out all fields and upload an image.");
            return;
        }
    
        try {
            // Prepare FormData for image upload
            let formData = new FormData();
            formData.append("image", image);
    
            // Upload image to Cloudinary
            const response = await fetch("https://shopifylastback.onrender.com/upload", {
                method: "POST",
                body: formData,
            });
    
            const data = await response.json();
    
            if (data.success) {
                // Set image URL returned from the server
                const product = {
                    ...productDetails,
                    image: data.url, // Assuming backend returns `url` for the Cloudinary image
                };
                console.log(data.url);
    
                // Save product details
                const productResponse = await fetch("https://shopifylastback.onrender.com/addproduct", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(product),
                });
    
                const productData = await productResponse.json();
                if (productData.success) {
                    alert("Product added successfully!");
                } else {
                    alert("Failed to add product.");
                }
            } else {
                alert("Failed to upload image.");
            }
        } catch (error) {
            console.error("Error uploading product:", error);
            alert("Something went wrong. Please try again.");
        }
    };
    

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumnail-img' alt="" />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
                <br />
                <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
            </div>
        </div>
    );
};

export default AddProduct;
