# Quick cURL Reference for Photo Upload

## 🚀 Essential Commands

### Upload Single Image

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue" \
  -F "images=@/path/to/image.jpg"
```

### Upload Multiple Images

```bash
curl -X POST http://localhost:3000/upload/images \
  -F "color=red" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

### Create Product with Color Images

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "image": "https://example.com/main-image.jpg",
    "price": 199.99,
    "categoryId": "your-category-id",
    "articleNo": "PROD-001",
    "colors": [
      {
        "color": "blue",
        "urls": ["https://res.cloudinary.com/.../image1.jpg"]
      }
    ]
  }'
```

### Create Product Without Color Images

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "image": "https://example.com/main-image.jpg",
    "price": 199.99,
    "categoryId": "your-category-id",
    "articleNo": "PROD-001"
  }'
```

## 🎨 Color Examples

```bash
# Blue shoes
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue" \
  -F "images=@/images/blue-shoe.jpg"

# Red shoes
curl -X POST http://localhost:3000/upload/images \
  -F "color=red" \
  -F "images=@/images/red-shoe.jpg"

# Black shoes
curl -X POST http://localhost:3000/upload/images \
  -F "color=black" \
  -F "images=@/images/black-shoe.jpg"

# White shoes
curl -X POST http://localhost:3000/upload/images \
  -F "color=white" \
  -F "images=@/images/white-shoe.jpg"
```

## 📁 File Format Examples

```bash
# JPG
curl -X POST http://localhost:3000/upload/images \
  -F "color=green" \
  -F "images=@/images/shoe.jpg"

# PNG
curl -X POST http://localhost:3000/upload/images \
  -F "color=yellow" \
  -F "images=@/images/shoe.png"

# WebP
curl -X POST http://localhost:3000/upload/images \
  -F "color=purple" \
  -F "images=@/images/shoe.webp"
```

## ✅ Expected Response

```json
{
  "color": "blue",
  "urls": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/image1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/babu-shoes/image2.jpg"
  ]
}
```

## ❌ Common Errors

```bash
# Missing color
curl -X POST http://localhost:3000/upload/images \
  -F "images=@/path/to/image.jpg"
# Response: {"statusCode": 400, "message": "Color is required"}

# No images
curl -X POST http://localhost:3000/upload/images \
  -F "color=blue"
# Response: {"statusCode": 400, "message": "No images provided"}
```

## 🔧 Tips

- **Max 10 images** per color
- **Supported formats**: JPG, PNG, WebP, GIF
- **File size**: Keep under 10MB
- **Color names**: Use descriptive names (e.g., "navy-blue", "light-gray")
- **Save URLs**: Store returned URLs for product creation
