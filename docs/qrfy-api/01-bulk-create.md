# QRFY API - Bulk Create

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `POST`

**URL:** `/api/public/qrs`

**Content-Type:** `application/json`

## Request Body Schema

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| style | object | - | Style applied to all qrs |
| folder | integer or null | 1 | Folder ID, assign a user folder to the qr |
| qrs | array of object | - | **Required** |

## Responses

### 200 Created

| Parameter | Type |
|-----------|------|
| ids | array of integer |

### Response Sample

```json
{
  "ids": [1, 2, 3, 4]
}
```

### Error Responses

- **400** - Validation Failed
- **401** - Invalid API key
- **404** - Not Found (when optional folder doesn't exist on user folder records)
