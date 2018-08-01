#!/bin/bash

yarn unlink @textactor/domain
yarn unlink @textactor/wikientity-domain
yarn unlink @textactor/wikientity-data
yarn unlink @textactor/actor-domain
yarn unlink @textactor/actor-data
yarn unlink textactor-explorer

yarn add @textactor/domain
yarn add @textactor/wikientity-domain
yarn add @textactor/wikientity-data
yarn add @textactor/actor-domain
yarn add @textactor/actor-data
yarn add textactor-explorer

yarn tsc
