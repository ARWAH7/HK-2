# 织布厂生产管理系统后端（NestJS + TypeORM + PostgreSQL）

## 1. 项目目录结构

```text
src
├── app.controller.ts
├── app.module.ts
├── main.ts
├── common
│   ├── base.entity.ts
│   └── enums/domain.enums.ts
├── roles
├── users
├── customers
├── product-specs
├── orders
├── rolls
├── production
├── warehouses
├── bleaching
├── finishing
├── shipping
├── bom
└── materials
```

## 2. 安装依赖

```bash
npm install
```

## 3. 初始化数据库

先执行：

```bash
psql -U postgres -d weaving_erp -f db/postgresql_schema.sql
```

## 4. 环境变量

```bash
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_NAME=weaving_erp
export PORT=3000
```

## 5. 启动

```bash
npm run start:dev
```

服务地址：
- `GET /api/health`
- `POST /api/orders`
- `POST /api/bom`
- `POST /api/bom/calculate/theoretical`
- `POST /api/materials/actual`
- `GET /api/materials/variance/:orderId`

## 6. 重点能力

- BOM 按工序 + 版本 + 明细配置。
- BOM 理论耗材自动计算（支持按卷/米/重量/只/包/箱/固定值）。
- 只/包/箱单位换算（`piecePerPack`, `packPerBox`）。
- 实际耗材录入与差异分析（variance）。
- 卷号规则：`订单号-规格-序号`。

## 7. 前端（React + Ant Design）

前端代码目录：`frontend/`

安装与启动：

```bash
cd frontend
npm install
npm run dev
```

默认地址：`http://localhost:5173`

说明：若后端 `http://127.0.0.1:3000` 未启动，前端会自动启用浏览器本地 Mock 数据模式，避免出现 Network Error 导致无法新增。

页面：
- 订单管理页
- 卷号列表
- BOM配置页
- 耗材分析页

前端环境变量（可选）：

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

## 8. 认证与权限（RBAC）

后端：NestJS + JWT + 权限守卫
- 登录接口：`POST /api/auth/login`
- 当前用户：`GET /api/auth/me`
- 全局 JWT 鉴权（`/api/auth/login` 与 `/api/health` 为公开接口）
- 基于 `@RequirePermissions(...)` 做接口级权限控制

前端：React 路由鉴权
- 登录页：`/login`
- 未登录不可访问业务页
- 登录后保存 `access_token` 与 `auth_user`
- 左侧菜单按权限动态显示
- 支持退出登录

新增管理页面：
- 用户管理页 `/users`
- 角色管理页 `/roles`
- 权限配置页 `/permissions`

本地 Mock 默认账号（前端离线模式）
- 用户名：`admin`
- 密码：`123456`


## 9. 常见问题排查（登录 500 / ECONNREFUSED）

### 1) 前端登录 500（`/api/auth/login`）
通常是后端连接 PostgreSQL 失败导致。

### 2) 后端日志出现 `password authentication failed for user "postgres"`
请配置正确数据库账号密码（不要使用默认值硬猜）：

```bash
cp .env.example .env
# 编辑 .env，填写真实 DB_PASSWORD
```

### 3) 前端 `ECONNREFUSED 127.0.0.1:3000`
表示后端服务未成功启动（常见原因是数据库连接失败）。

### 4) 本项目前端降级策略
当前端遇到网络错误或 5xx 错误时，会自动启用本地 mock 登录/数据模式，便于继续演示页面流程。
