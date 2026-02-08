# QRFY API - Batch Delete

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `POST`

**URL:** `/api/public/qrs/batch-delete`

**Content-Type:** `application/json`

## Request Body Schema

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| ids | array of integer | - | **Required** - Array of QR IDs |

## Responses

### 204 No Content

Successfully deleted.

### Error Responses

- **401** - Invalid API key
- **404** - Not Found
