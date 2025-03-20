@auth(jwt)(
    groups varchar(255)[],
    identity uuid
);

users(
    id uuid primary key,
    first_name varchar(255),
    org_id
) authorized (
    * if "super" in jwt.groups,
    read,create,update 
        if org_id in groups
    read if identity is id
)

