# 概述

> 使用 Prisma，您可以获得一流的 TypeScript ORM、声明式数据库迁移系统以及开箱即用的数据库

## Prisma 是什么:question:

Prisma 是一个开源的数据库工具包，提供以下核心组件：

- `Prisma Client`：一个类型安全的数据库客户端，用于执行查询（如 findMany、create 等）。
- `Prisma Schema`：一个声明式的配置文件，用于定义数据模型和数据库结构。
- `Prisma Migrate`：用于数据库迁移，同步 Prisma Schema 和数据库结构。
- `Prisma Studio`：一个图形化界面，用于浏览和操作数据库数据。

*Prisma 的设计目标是：*

- 提供类型安全的数据库访问，减少运行时错误。
- 简化复杂的 SQL 查询，提供直观的 API。
- 支持现代开发工作流，与 TypeScript 和框架（如 Next.js）无缝集成。


## 核心功能


### 类型安全的 Prisma Client

Prisma Client 是一个自动生成的 JavaScript/TypeScript 库，根据 Prisma Schema 生成类型安全的数据库操作方法。

```ts
const users = await prisma.user.findMany();
const newUser = await prisma.user.create({ data: { name: 'Alice', email: 'alice@example.com' } });
```

通过提供直观的 API 链式调用查询，支持复杂查询（如过滤、排序、关联）。

### 声明式的 Prisma Schema

使用 `schema.prisma` 文件定义数据模型，描述数据库表结构和关系。

```text
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}
```

可以轻易地定义表、字段、关系（如一对多、多对多）、支持数据库约束（如 @id、 @unique、 @default）、自动生成 TypeScript 类型，供 Prisma Client 使用等强大功能。


### Prisma Migrate

提供数据库迁移工具，同步 `schema.prisma` 和数据库结构。

```bash
npx prisma migrate dev  # 创建并应用迁移
npx prisma generate     # 根据 schema 生成 Prisma Client
```

具有自动生成 SQL 迁移脚本、支持增量迁移，适合团队协作和版本控制和可重置数据库（`npx prisma migrate reset`）等优势。

### Prisma Studio

一个内置的 GUI 工具，用于可视化管理和操作数据库。

```bash
npx prisma studio
```

### 支持多种数据库

- 支持的关系型数据库：PostgreSQL、MySQL、MariaDB、SQLite、SQL Server。
- 支持非关系型数据库：MongoDB。
- 通过统一的 API 操作不同数据库，减少学习成本。