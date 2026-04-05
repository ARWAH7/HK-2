# 织布厂生产管理系统（ERP + MES + BOM + 权限系统）

技术栈：

- 后端：NestJS + PostgreSQL + TypeORM + JWT
- 前端：React + Ant Design + Vite
- 架构：前后端分离、RESTful API、RBAC 权限控制

## 目录结构

```bash
weaving-erp/
├─ db/
│  └─ postgresql_schema.sql
├─ server/
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ nest-cli.json
│  ├─ .env.example
│  └─ src/
│     ├─ main.ts
│     ├─ app.module.ts
│     └─ erp.system.ts
└─ client/
   ├─ package.json
   ├─ vite.config.js
   ├─ index.html
   └─ src/
      ├─ main.jsx
      ├─ App.jsx
      └─ request.js
```

## 数据库初始化

```bash
createdb weaving_erp
psql -U postgres -d weaving_erp -f db/postgresql_schema.sql
```

## 启动后端

```bash
cd server
cp .env.example .env
npm install
npm run start:dev
```

## 启动前端

```bash
cd client
npm install
npm run dev
```

## 默认登录账号

- 用户名：admin
- 密码：admin123

## 说明

当前版本已包含：

- JWT 登录认证
- 用户 / 角色 / 权限 / 菜单权限 / 接口权限
- 订单管理
- 产品规格管理
- 卷号生成
- BOM 配置
- 理论耗材 / 实际耗材 / 差异分析
- 仓库入库与库存查询
- 全中文前端后台框架

后续可继续扩展：

- PDA 扫码页面
- 发货管理
- 漂白管理
- 成品加工管理
- 看板统计
- 审批流
