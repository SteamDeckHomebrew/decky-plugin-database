#!/bin/sh

cd /plugin

if ! pnpm i --frozen-lockfile;
then
  printf "error code: %s\npnpm lockfile not found or other error occurred, please report this issue to the CI maintainer and the plugin developer." "$?"
  exit 1
fi

if ! pnpm run build;
then
  printf "error code: %s\npnpm build failed, please report this issue to the CI maintainer and the plugin developer." "$?"
  exit 1
fi

rsync -r --exclude "src/" --exclude "__pycache__" --exclude "node_modules" /plugin/ /out/
