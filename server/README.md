# Server API

Base URL (default):

```text
http://127.0.0.1:8000
```

## Endpoints

### Units

```text
GET    /units/data
GET    /units
GET    /units/{unit_id}
PUT    /units/{unit_id}
```

`PUT /units/{unit_id}` request body:

```json
{
  "changes": {
    "LEVEL": 2,
    "NAME_TXT": "x005ta0001",
    "HIT_POINT": 120
  }
}
```

### Attacks

```text
GET    /attacks/{attack_id}
PUT    /attacks/{attack_id}
```

`PUT /attacks/{attack_id}` request body:

```json
{
  "changes": {
    "NAME_TXT": "x005ta0002",
    "POWER": 65
  }
}
```

### Globals

```text
GET    /globals/{global_id}
PUT    /globals/{global_id}
```

`PUT /globals/{global_id}` request body:

```json
{
  "new_value": "updated value"
}
```

### Files

```text
POST   /files/Tglobal
POST   /files/Gunits
POST   /files/Gattacks
GET    /files/Tglobal
GET    /files/Tglobal/download
GET    /files/Gunits
GET    /files/Gunits/download
GET    /files/Gattacks
GET    /files/Gattacks/download
GET    /files/exist
DELETE /files/{file_name}
```

`DELETE /files/{file_name}` accepts only:

```text
Tglobal
Gunits
Gattacks
```
