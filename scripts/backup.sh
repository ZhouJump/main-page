#!/usr/bin/env bash
#
# 数据库 + 上传目录备份脚本
#
# 用法：
#   bash scripts/backup.sh                     # 使用默认参数
#   BACKUP_DIR=/var/backups bash scripts/backup.sh
#   RETAIN_DAYS=7 bash scripts/backup.sh
#
# 依赖：pg_dump（PostgreSQL 客户端）、tar
# 环境变量：
#   DATABASE_URL  PostgreSQL 连接串（默认从 .env 读取）
#   UPLOAD_DIR    上传目录（默认 ./data/uploads）
#   BACKUP_DIR    备份输出目录（默认 ./data/backups）
#   RETAIN_DAYS   保留天数，默认 14
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

DATABASE_URL="${DATABASE_URL:-}"
UPLOAD_DIR="${UPLOAD_DIR:-${ROOT_DIR}/data/uploads}"
BACKUP_DIR="${BACKUP_DIR:-${ROOT_DIR}/data/backups}"
RETAIN_DAYS="${RETAIN_DAYS:-14}"

if [[ -z "${DATABASE_URL}" ]]; then
  echo "错误：未设置 DATABASE_URL" >&2
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "错误：未找到 pg_dump，请安装 PostgreSQL 客户端" >&2
  exit 1
fi

mkdir -p "${BACKUP_DIR}"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DB_DUMP="${BACKUP_DIR}/db-${TIMESTAMP}.sql"
UPLOADS_ARCHIVE="${BACKUP_DIR}/uploads-${TIMESTAMP}.tar.gz"

echo "备份数据库到 ${DB_DUMP}"
pg_dump "${DATABASE_URL}" --no-owner --no-privileges --file "${DB_DUMP}"

if [[ -d "${UPLOAD_DIR}" ]]; then
  echo "打包上传目录到 ${UPLOADS_ARCHIVE}"
  tar -czf "${UPLOADS_ARCHIVE}" -C "${ROOT_DIR}" "$(basename "${UPLOAD_DIR}")"
else
  echo "上传目录不存在，跳过：${UPLOAD_DIR}"
fi

echo "清理 ${RETAIN_DAYS} 天前的备份"
find "${BACKUP_DIR}" -type f \( -name 'db-*.sql' -o -name 'uploads-*.tar.gz' \) \
  -mtime "+${RETAIN_DAYS}" -print -delete

echo "备份完成：${TIMESTAMP}"
