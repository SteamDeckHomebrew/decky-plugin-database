#!/bin/sh

cd /plugin

pnpm i
pnpm run build

rsync -r --exclude "src/" --exclude "__pycache__" --exclude "node_modules" /plugin/ /out/