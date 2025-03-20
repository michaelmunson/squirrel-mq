```sql
@auth(jwt)(
    groups varchar(255)[],
    identity uuid
);

users(
    id uuid primary key,
    first_name varchar(255) @auth (
        $(select id from users where org_id = groups)
    ),
    ssn varchar(255) @auth(
        identity = id,
        groups = "admin"
    ),
    org_id,
    @methods (POST)
)


@post(/example){
    
}
```


```sql

authorized (
    * if "super" in jwt.groups,
    read,create,update 
        if org_id in groups
    read if identity is id
)

```
