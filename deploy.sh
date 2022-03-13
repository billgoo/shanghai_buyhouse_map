#!/usr/bin/env sh
VERSION=$1
echo "[INFO] ---------- Version: ${VERSION} ----------"

# 发生错误时终止
set -e

# 构建
rm -r -f dist/
echo "[INFO] ---------- start build ----------"
# npm install
npm run build
# 移动静态文件
cp -r static/ dist/static/

# 进入构建文件夹
cd dist

# 如果你要部署到自定义域名
echo "[INFO] ---------- git init ----------"
# echo "www.example.com" > CNAME
git init
git checkout -b main
git add -A
git commit -m "deploy ${VERSION}"

echo "[INFO] ---------- deploy ${VERSION} ----------"
# 如果你要部署在 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main
# git push -f git@github.com:billgoo/billgoo.github.io.git main

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages
# git push -f git@github.com:billgoo/billgoo.github.io.git main:gh-pages
git push -f git@github.com:billgoo/shanghai_buyhouse_map.git main:gh-pages

cd -