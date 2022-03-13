mkdir dist
rm -r -f dist/static/
cp -r static/ dist/static/

# 进入构建文件夹
cd dist

# 如果你要部署到自定义域名
echo "[INFO] ---------- git init ----------"
# echo "www.example.com" > CNAME
git init
git checkout -b main
git add -A
git commit -m "update static"

echo "[INFO] ---------- deploy ----------"
# 如果你要部署在 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main
# git push -f git@github.com:billgoo/billgoo.github.io.git main

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages
# git push -f git@github.com:billgoo/billgoo.github.io.git main:gh-pages
git push -f git@github.com:billgoo/shanghai_buyhouse_map.git main:gh-pages

cd -