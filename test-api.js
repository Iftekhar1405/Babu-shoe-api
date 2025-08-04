const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const BASE_URL = "http://localhost:3000";

async function testImageUpload() {
  try {
    console.log("Testing image upload endpoint...");

    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "base64"
    );

    const formData = new FormData();
    formData.append("color", "blue");
    formData.append("images", testImageBuffer, { filename: "test1.png" });
    formData.append("images", testImageBuffer, { filename: "test2.png" });

    const response = await axios.post(`${BASE_URL}/upload/images`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log("Image upload response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Image upload test failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function testProductCreation(uploadResult) {
  try {
    console.log("Testing product creation with color images...");

    const productData = {
      name: "Test Nike Shoes",
      image: "https://example.com/main-image.jpg",
      price: 199.99,
      categoryId: "507f1f77bcf86cd799439011", // You'll need a valid category ID
      articleNo: "TEST-001",
      colors: [
        {
          color: uploadResult.color,
          urls: uploadResult.urls,
        },
      ],
    };

    const response = await axios.post(`${BASE_URL}/products`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Product creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Product creation test failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function testProductCreationWithoutImages() {
  try {
    console.log("Testing product creation without color images...");

    const productData = {
      name: "Test Adidas Shoes",
      image: "https://example.com/main-image.jpg",
      price: 149.99,
      categoryId: "507f1f77bcf86cd799439011", // You'll need a valid category ID
      articleNo: "TEST-002",
      // Note: colors field is omitted - product can be created without color images
    };

    const response = await axios.post(`${BASE_URL}/products`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Product creation without images response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Product creation without images test failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function runTests() {
  try {
    console.log("Starting API tests...\n");

    // Test 1: Image upload
    const uploadResult = await testImageUpload();

    // Test 2: Product creation with uploaded images
    await testProductCreation(uploadResult);

    // Test 3: Product creation without color images
    await testProductCreationWithoutImages();

    console.log("\n✅ All tests passed!");
  } catch (error) {
    console.error("\n❌ Tests failed:", error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testImageUpload,
  testProductCreation,
  testProductCreationWithoutImages,
};
