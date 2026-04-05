-- 织布厂生产管理系统 PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  real_name VARCHAR(50) NOT NULL,
  mobile VARCHAR(30),
  status SMALLINT NOT NULL DEFAULT 1,
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  status SMALLINT NOT NULL DEFAULT 1,
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NULL REFERENCES permissions(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  path VARCHAR(255),
  method VARCHAR(20),
  icon VARCHAR(100),
  sort_no INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE TABLE IF NOT EXISTS product_spec (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spec_code VARCHAR(100) NOT NULL UNIQUE,
  spec_name VARCHAR(100) NOT NULL,
  width_cm NUMERIC(10,2),
  weight_gsm NUMERIC(10,2),
  roll_length_m NUMERIC(12,2),
  piece_per_pack INT DEFAULT 0,
  pack_per_box INT DEFAULT 0,
  remark VARCHAR(255),
  status SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS unit_conversion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spec_id UUID NULL REFERENCES product_spec(id) ON DELETE CASCADE,
  from_unit VARCHAR(20) NOT NULL,
  to_unit VARCHAR(20) NOT NULL,
  ratio NUMERIC(18,6) NOT NULL,
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_no VARCHAR(100) NOT NULL UNIQUE,
  customer_name VARCHAR(100),
  order_date DATE NOT NULL,
  delivery_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  remark VARCHAR(255),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  spec_id UUID NOT NULL REFERENCES product_spec(id),
  quantity NUMERIC(18,2) NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  planned_roll_count INT NOT NULL DEFAULT 0,
  planned_meter NUMERIC(18,2) DEFAULT 0,
  planned_weight NUMERIC(18,2) DEFAULT 0,
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  spec_id UUID NOT NULL REFERENCES product_spec(id),
  roll_no VARCHAR(100) NOT NULL UNIQUE,
  seq_no INT NOT NULL,
  length_m NUMERIC(18,2) DEFAULT 0,
  weight_kg NUMERIC(18,2) DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'created',
  warehouse_id UUID,
  location_id UUID,
  qr_code VARCHAR(255),
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS production_report (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_no VARCHAR(100) NOT NULL UNIQUE,
  order_id UUID NOT NULL REFERENCES orders(id),
  order_item_id UUID REFERENCES order_items(id),
  roll_id UUID REFERENCES roll(id),
  process_type VARCHAR(30) NOT NULL,
  report_date DATE NOT NULL,
  quantity NUMERIC(18,2) NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  meter NUMERIC(18,2) DEFAULT 0,
  weight NUMERIC(18,2) DEFAULT 0,
  operator_id UUID REFERENCES users(id),
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warehouse (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_code VARCHAR(50) NOT NULL UNIQUE,
  warehouse_name VARCHAR(100) NOT NULL,
  status SMALLINT NOT NULL DEFAULT 1,
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS location (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID NOT NULL REFERENCES warehouse(id) ON DELETE CASCADE,
  location_code VARCHAR(50) NOT NULL,
  location_name VARCHAR(100) NOT NULL,
  status SMALLINT NOT NULL DEFAULT 1,
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(warehouse_id, location_code)
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID NOT NULL REFERENCES warehouse(id),
  location_id UUID REFERENCES location(id),
  material_id UUID,
  roll_id UUID REFERENCES roll(id),
  spec_id UUID REFERENCES product_spec(id),
  quantity NUMERIC(18,2) NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  batch_no VARCHAR(100),
  status VARCHAR(30) DEFAULT 'normal',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_code VARCHAR(100) NOT NULL UNIQUE,
  material_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  base_unit VARCHAR(20) NOT NULL,
  status SMALLINT NOT NULL DEFAULT 1,
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bom_header (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bom_code VARCHAR(100) NOT NULL UNIQUE,
  spec_id UUID NOT NULL REFERENCES product_spec(id),
  process_type VARCHAR(30) NOT NULL,
  version_no VARCHAR(30) NOT NULL DEFAULT 'V1',
  status SMALLINT NOT NULL DEFAULT 1,
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(spec_id, process_type, version_no)
);

CREATE TABLE IF NOT EXISTS bom_detail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bom_header_id UUID NOT NULL REFERENCES bom_header(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES material_master(id),
  calc_basis VARCHAR(20) NOT NULL,
  numerator NUMERIC(18,6) NOT NULL DEFAULT 1,
  denominator NUMERIC(18,6) NOT NULL DEFAULT 1,
  fixed_value NUMERIC(18,6) NOT NULL DEFAULT 0,
  loss_rate NUMERIC(8,4) NOT NULL DEFAULT 0,
  sort_no INT NOT NULL DEFAULT 0,
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_theoretical (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  order_item_id UUID REFERENCES order_items(id),
  spec_id UUID REFERENCES product_spec(id),
  process_type VARCHAR(30) NOT NULL,
  material_id UUID NOT NULL REFERENCES material_master(id),
  quantity NUMERIC(18,6) NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  source_type VARCHAR(20) NOT NULL DEFAULT 'system',
  source_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_actual (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  order_item_id UUID REFERENCES order_items(id),
  spec_id UUID REFERENCES product_spec(id),
  process_type VARCHAR(30) NOT NULL,
  material_id UUID NOT NULL REFERENCES material_master(id),
  quantity NUMERIC(18,6) NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  report_date DATE NOT NULL,
  remark VARCHAR(255),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_variance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  order_item_id UUID REFERENCES order_items(id),
  spec_id UUID REFERENCES product_spec(id),
  process_type VARCHAR(30) NOT NULL,
  material_id UUID NOT NULL REFERENCES material_master(id),
  theoretical_qty NUMERIC(18,6) NOT NULL DEFAULT 0,
  actual_qty NUMERIC(18,6) NOT NULL DEFAULT 0,
  variance_qty NUMERIC(18,6) NOT NULL DEFAULT 0,
  variance_rate NUMERIC(18,6) NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scan_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_code VARCHAR(255) NOT NULL,
  scan_type VARCHAR(30) NOT NULL,
  biz_type VARCHAR(30),
  biz_id UUID,
  operator_id UUID REFERENCES users(id),
  warehouse_id UUID REFERENCES warehouse(id),
  location_id UUID REFERENCES location(id),
  remark VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);