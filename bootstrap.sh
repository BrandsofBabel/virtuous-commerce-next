#!/usr/bin/env bash
# Vercel bootstrap: pull the full site source from GitHub at build time.
set -e
git clone --depth 1 https://github.com/BrandsofBabel/virtuous-commerce-next.git /tmp/vcsrc
cp -rf /tmp/vcsrc/. .
rm -rf /tmp/vcsrc
