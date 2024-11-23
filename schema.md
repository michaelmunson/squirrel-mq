# Creating Tables
```typescript
@Table
class School {
    id = id()
    name = varchar(255)
}

@Table
class Student {
    id = id()
    graduation_year = int()
    is_enl = bool({default: false})
}

@Table
@Auth({
    create: './mut_handler',
    read: (ctx) => ctx.user.id = ctx.entry
})
class Class {
    id = id()
    subject = enum('HISTORY', 'SCIENCE')
}

@Table
@ManyToMany(Class, Students)
class Class_Students {
    class_id = fk(Class)
    student_id = fk(Students)
}
```

```typescript
@GlobalAuth('./handler.ts')
class Schema {
    
}
```
