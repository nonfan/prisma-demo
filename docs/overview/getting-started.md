# 快速开始

> 废话不多说，实战才是真理 (你会在学会骑自行车后, 研究齿轮转动的原理吗:question:)

下面是一个基于 PostgreSQL 数据库、Prisma ORM、Express 框架的完整入门级“增删改查（CRUD）”示例。

## Docker 初始化数据库

确保你的Docker容器已经安装了PostgreSQL镜像。

```bash
docker run --name test-myapp -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=postgres -p 5431:5432 -d postgres:latest
```

## 初始化项目

安装基础依赖，在这里我以 `express` 你也可以替换其他 NodeJs 框架或全栈框架 NextJs ：

```bash
mkdir express-prisma-crud
cd express-prisma-crud
npm init -y
npm install express prisma @prisma/client
```

## 初始化 Prisma

```bash
npx prisma init
```

初始化后，编辑 `schema.prisma`：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

配置环境变量（`.env`）：

```text
DATABASE_URL="postgresql://postgres:123456@localhost:5431/postgres?schema=public"
```

数据库的连接 URL 格式取决于你使用的数据库。对于 PostgreSQL，它看起来如下所示（全部大写的部分是你的具体连接详细信息的占位符）。

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA 
```

以下是对每个组成部分的简短说明

- `USER`：你的数据库用户名
- `PASSWORD`：你的数据库用户密码
- `HOST`：你的主机名（对于本地环境，它是 localhost）
- `PORT`：数据库服务器运行的端口（PostgreSQL 通常是 5432）
- `DATABASE`：数据库的名称
- `SCHEMA`：数据库内schema的名称

如果你不确定 PostgreSQL 连接 URL 的 schema 参数应该填什么，通常可以省略它。在这种情况下，将使用默认的 schema 名称 public。

## 初始化 Prisma Client

开发环境中启用热重载时，频繁重启会导致多个 PrismaClient 实例，可能造成数据库连接数暴涨。为此，我们推荐为 PrismaClient
实现一个单例模式，以避免资源浪费。

:::code-group

```js [lib/prisma.js]
const {PrismaClient} = require("@prisma/client");

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // 在开发环境中挂在 global 上，防止热重载时重复创建 PrismaClient 实例
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
```

```ts [lib/prisma.ts]
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

:::

## 运行迁移

```bash
npx prisma migrate dev --name init
npx prisma generate
```

*调试和测试*: 使用 `Prisma Studio` 查看数据

```bash
npx prisma studio
```

## 编写CRUD示例

### 创建用户

```js
app.post("/users", async (req, res) => {
  const data = await prisma.user.create({
    data: {
      email: "223@qq.com",
      name: "Liming",
    },
  });

  res.json(data);
});
```

### 查询用户

```js
app.get("/users", async (req, res) => {
  const data = await prisma.user.findMany();
  res.json(data);
});
```

### 更新用户

```js
app.put("/users", async (req, res) => {
  const data = await prisma.user.update({
    where: { id: 1 },
    data: { email: "new-223@qq.com" },
  });

  res.json(data);
});
```

### 删除用户

```js
app.delete("/users", async (req, res) => {
  const data = await prisma.user.delete({
    where: { id: 1 },
  });

  res.json(data);
});
```

## Next.js框架

::: danger BUG
按照上诉方式运行在NextJs框架会遇到 [@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again](https://github.com/prisma/prisma/discussions/22213) 错误, 按照如下方式进行解决。
:::

无论您是使用 `new PrismaClient()` 实例一个 `db` 还是如下使用一个单例模式（避免热重载），都将遇到如上错误：

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query", "error", "warn"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

根本原因是 `@prisma/client` 找不到 Prisma 客户端，故作如下修改即可：

```ts
import { PrismaClient } from "@prisma/client"; // [!code --]
import { PrismaClient } from "@/generated/prisma"; // [!code ++]

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query", "error", "warn"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

这里的 `@/generated/prisma` 导入路径根据您 `schema.prisma` 的 `output` 输出路径。