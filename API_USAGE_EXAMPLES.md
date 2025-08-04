# API Usage Examples

## Example 1: Upload Images for Blue Color

### Using cURL

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue" \
  -F "images=@/path/to/blue-shoe-1.jpg" \
  -F "images=@/path/to/blue-shoe-2.jpg" \
  -F "images=@/path/to/blue-shoe-3.jpg"
```

### Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append("color", "blue");
formData.append("images", file1);
formData.append("images", file2);
formData.append("images", file3);

const response = await fetch("http://localhost:3000/upload/images", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result);
// Output:
// {
//   "color": "blue",
//   "urls": [
//     "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-1.jpg",
//     "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-2.jpg",
//     "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-3.jpg"
//   ]
// }
```

## Example 2: Upload Images for Red Color

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=red" \
  -F "images=@/path/to/red-shoe-1.jpg" \
  -F "images=@/path/to/red-shoe-2.jpg"
```

## Example 3: Create Product with Multiple Color Images

### Using cURL

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike Air Max 270",
    "image": "https://example.com/main-nike-image.jpg",
    "price": 199.99,
    "categoryId": "507f1f77bcf86cd799439011",
    "articleNo": "NIKE-AM-270",
    "colors": [
      {
        "color": "blue",
        "urls": [
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-1.jpg",
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-2.jpg",
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-3.jpg"
        ]
      },
      {
        "color": "red",
        "urls": [
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-1.jpg",
          "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-2.jpg"
        ]
      }
    ]
  }'
```

## Example 3.1: Create Product Without Color Images

### Using cURL

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike Air Max 270",
    "image": "https://example.com/main-nike-image.jpg",
    "price": 199.99,
    "categoryId": "507f1f77bcf86cd799439011",
    "articleNo": "NIKE-AM-270"
  }'
```

### Using JavaScript/Fetch

```javascript
const productData = {
  name: "Nike Air Max 270",
  image: "https://example.com/main-nike-image.jpg",
  price: 199.99,
  categoryId: "507f1f77bcf86cd799439011",
  articleNo: "NIKE-AM-270",
  // Note: colors field is optional and can be omitted
};

const response = await fetch("http://localhost:3000/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(productData),
});

const result = await response.json();
console.log(result);
```

### Using JavaScript/Fetch

```javascript
const productData = {
  name: "Nike Air Max 270",
  image: "https://example.com/main-nike-image.jpg",
  price: 199.99,
  categoryId: "507f1f77bcf86cd799439011",
  articleNo: "NIKE-AM-270",
  colors: [
    {
      color: "blue",
      urls: [
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-1.jpg",
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-2.jpg",
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-3.jpg",
      ],
    },
    {
      color: "red",
      urls: [
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-1.jpg",
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-2.jpg",
      ],
    },
  ],
};

const response = await fetch("http://localhost:3000/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(productData),
});

const result = await response.json();
console.log(result);
// Output:
// {
//   "success": true,
//   "data": {
//     "_id": "507f1f77bcf86cd799439012",
//     "name": "Nike Air Max 270",
//     "image": "https://example.com/main-nike-image.jpg",
//     "price": 199.99,
//     "categoryId": "507f1f77bcf86cd799439011",
//     "articleNo": "NIKE-AM-270",
//     "colors": [
//       {
//         "color": "blue",
//         "urls": [
//           "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-1.jpg",
//           "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-2.jpg",
//           "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/blue-shoe-3.jpg"
//         ]
//       },
//       {
//         "color": "red",
//         "urls": [
//           "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-1.jpg",
//           "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/red-shoe-2.jpg"
//         ]
//       }
//     ],
//     "createdAt": "2024-01-15T10:30:00.000Z",
//     "updatedAt": "2024-01-15T10:30:00.000Z"
//   },
//   "message": "Product created successfully"
// }
```

## Example 4: Complete Workflow

```javascript
// Step 1: Upload images for blue color
const blueImagesFormData = new FormData();
blueImagesFormData.append("color", "blue");
blueImagesFormData.append("images", blueShoeImage1);
blueImagesFormData.append("images", blueShoeImage2);

const blueUploadResponse = await fetch("http://localhost:3000/upload/images", {
  method: "POST",
  body: blueImagesFormData,
});
const blueResult = await blueUploadResponse.json();

// Step 2: Upload images for red color
const redImagesFormData = new FormData();
redImagesFormData.append("color", "red");
redImagesFormData.append("images", redShoeImage1);
redImagesFormData.append("images", redShoeImage2);

const redUploadResponse = await fetch("http://localhost:3000/upload/images", {
  method: "POST",
  body: redImagesFormData,
});
const redResult = await redUploadResponse.json();

// Step 3: Create product with both color images
const productData = {
  name: "Adidas Ultraboost",
  image: "https://example.com/main-adidas-image.jpg",
  price: 249.99,
  categoryId: "507f1f77bcf86cd799439011",
  articleNo: "ADIDAS-UB-001",
  colors: [blueResult, redResult],
};

const productResponse = await fetch("http://localhost:3000/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(productData),
});

const productResult = await productResponse.json();
console.log("Product created:", productResult);
```

## Error Handling Examples

### Invalid Color

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "images=@/path/to/image.jpg"
# Response: {"statusCode": 400, "message": "Color is required"}
```

### No Images Provided

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue"
# Response: {"statusCode": 400, "message": "No images provided"}
```

### Invalid Product Data

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "price": -10
  }'
# Response: Validation errors for the provided data
```
