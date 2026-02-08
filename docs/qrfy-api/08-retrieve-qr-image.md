# QRFY API - Retrieve a QR Image

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `GET`

**URL:** `/api/public/qrs/{id}/{format}`

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | **Required** - The ID of the resource to retrieve |
| format | string | **Required** - The format of the image to retrieve: `webp`, `png`, `jpeg` |

## Responses

### 200 OK

Returns the requested image in the specified format.

### Error Responses

- **404** - Resource not found
