INSERT INTO roles (code, name, status, remark)
VALUES
('SUPER_ADMIN', '超级管理员', 1, '系统最高权限'),
('BOSS', '老板', 1, '经营管理权限'),
('PRODUCTION_MANAGER', '生产主管', 1, '生产管理'),
('ORDER_CLERK', '订单员', 1, '订单录入'),
('WAREHOUSE_CLERK', '仓库员', 1, '仓储管理'),
('REPORT_OPERATOR', '报工员', 1, '生产报工'),
('BLEACHING_OPERATOR', '漂白车间人员', 1, '漂白操作'),
('PACKAGING_OPERATOR', '成品车间人员', 1, '包装操作')
ON CONFLICT (code) DO NOTHING;

INSERT INTO users (username, password, real_name, status, remark)
VALUES ('admin', '$2b$10$7mM4v7P1FDsC5T5Qq5xTGu2u9pO0P9x8P2q5X7Q0WzTQfJ2b7qB5G', '系统管理员', 1, '默认管理员')
ON CONFLICT (username) DO NOTHING;

INSERT INTO permissions (type, code, name, path, method, sort_no, visible)
VALUES
('menu', 'dashboard:view', '首页看板', '/dashboard', 'GET', 1, true),
('menu', 'user:view', '用户管理', '/users', 'GET', 2, true),
('button', 'user:create', '新增用户', NULL, 'POST', 21, true),
('menu', 'role:view', '角色管理', '/roles', 'GET', 3, true),
('menu', 'permission:view', '权限管理', '/permissions', 'GET', 4, true),
('menu', 'order:view', '订单管理', '/orders', 'GET', 5, true),
('button', 'order:create', '新增订单', NULL, 'POST', 51, true),
('menu', 'spec:view', '产品规格管理', '/specs', 'GET', 6, true),
('button', 'spec:create', '新增规格', NULL, 'POST', 61, true),
('menu', 'roll:view', '卷号管理', '/rolls', 'GET', 7, true),
('button', 'roll:create', '生成卷号', NULL, 'POST', 71, true),
('menu', 'material:view', '耗材主数据', '/materials', 'GET', 8, true),
('button', 'material:create', '新增耗材', NULL, 'POST', 81, true),
('menu', 'bom:view', 'BOM配置', '/bom', 'GET', 9, true),
('button', 'bom:create', '新增BOM', NULL, 'POST', 91, true),
('menu', 'material-analysis:view', '耗材分析', '/material-analysis', 'GET', 10, true),
('button', 'material-analysis:calculate', '理论耗材计算', NULL, 'POST', 101, true),
('button', 'material-analysis:actual', '录入实际耗材', NULL, 'POST', 102, true),
('menu', 'warehouse:view', '仓库管理', '/warehouse', 'GET', 11, true),
('button', 'warehouse:inbound', '扫码入库', NULL, 'POST', 111, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.code = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;