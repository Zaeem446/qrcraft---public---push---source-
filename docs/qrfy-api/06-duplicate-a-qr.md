# QRFY API - Duplicate a QR

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `POST`

**URL:** `/api/public/qrs/{id}/duplicate`

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | **Required** - ID of QR to duplicate |

## Responses

### 200 OK

| Parameter | Type |
|-----------|------|
| id | integer |

### Response Sample

```json
{
  "id": 1
}
```

### Error Responses

- **401** - Invalid API key
- **404** - Resource not found
