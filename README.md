# How to install theme

## Install theme:
### 1. Make dir /app/design/frontend/Wise/dfstore
### 2. Add source code
#### `cd app/design/frontend/Wise/fancyfactory`
#### `git clone git@gitlab.wise.kh.ua:anton.zakharov/fancyfactory-theme.git.` 
### 3 Make build
#### Go to container with node.
##### `cd app/design/frontend/Wise/fancyfactory`
##### `npm i`
##### `npm run build`
### 4 Register theme
#### `bin/magento set:upgr`
#### `bin/magento set:di:c`
#### `bin/magento c:c`
#### `bin/magento c:f`


## Update theme:
### 1. Go to theme dir
#### `cd app/design/frontend/Wise/fancyfactory`
### 2. Update code
#### `git checkout -f`
#### `git pull`
### 3 Make build
#### Go to container with node.
##### `cd app/design/frontend/Wise/fancyfactory`
##### `npm i`
##### `npm run build`
### 4 Clear magento caches
#### `bin/magento c:c`
#### `bin/magento c:f`