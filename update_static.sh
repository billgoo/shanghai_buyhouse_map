git add static/
git commit -m "update static"
git push -f git@github.com:billgoo/shanghai_buyhouse_map.git main

echo "[INFO] ---------- git init ----------"
mkdir dist

cd dist
git init
git checkout -b gh-pages
git pull git@github.com:billgoo/shanghai_buyhouse_map.git gh-pages
cd -
rm -r -f dist/static/
cp -r static/ dist/static/
cd dist
git add -A
git commit -m "update static"

echo "[INFO] ---------- deploy ----------"
# 如果你要部署在 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main
# git push -f git@github.com:billgoo/billgoo.github.io.git main

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages
# git push -f git@github.com:billgoo/billgoo.github.io.git main:gh-pages
git push -f git@github.com:billgoo/shanghai_buyhouse_map.git gh-pages:gh-pages

cd -