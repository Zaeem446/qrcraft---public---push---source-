# QRFY API - Generate QR Image

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `POST`

**URL:** `/api/public/qrs/{format}`

**Content-Type:** `application/json`

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | **Required** - The format of the image to retrieve: `webp`, `png`, `jpeg` |

## Request Body Schema

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| type | string | - | **Required** - `email`, `sms`, `text`, `url-static`, `vcard`, `whatsapp`, `wifi` |
| data | object | - | **Required** - EmailBody, SmsBody, TextBody, UrlStaticBody, VcardBody, WifiBody, WhatsappBody |
| style | object | - | **Required** |

## Responses

### 200 OK

Returns the QR code image in the requested format.

### Error Responses

- **400** - Validation Failed
- **401** - Invalid API key
