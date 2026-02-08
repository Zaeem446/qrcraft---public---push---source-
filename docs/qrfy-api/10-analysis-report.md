# QRFY API - Analysis Report

## Authorization

**Header:** `API-KEY`

## Request

**Method:** `GET`

**URL:** `/api/public/qrs/report`

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| from | integer | **Required** - Start time for report data in Unix timestamp |
| to | integer | **Required** - End time for report data in Unix timestamp |
| ids[] | array of integer | An array of integers representing the QR IDs to include in the output |
| format | string | **Required** - The format in which the report data should be returned: `json`, `csv`, `xlsx` |
| folders[] | array of integer | An array of integers representing the folder IDs to include in the output |
| type | string | The type of report to generate: `detailed`, `totals` |
| grouping | string | The grouping for totals report: `daily`, `monthly`, `yearly` |

## Responses

### 200 OK

Returns the report data in the requested format.

### Response Sample

```json
{}
```
