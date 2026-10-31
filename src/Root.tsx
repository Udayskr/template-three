name: Render 3D Video

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  render:
    name: Render Video on Ubuntu
    runs-on: ubuntu-22.04

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Linux Dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 ffmpeg

      - name: Install NPM Packages
        run: npm install

      - name: Render 3D Video with Remotion
        run: npx remotion render src/index.ts Scene out/video.mp4 --gl=angle

      - name: Upload Rendered MP4
        uses: actions/upload-artifact@v4
        with:
          name: rendered-3d-video
          path: out/video.mp4

