#!/bin/bash

yarn remove @textactor/domain
yarn remove @textactor/actor-domain
yarn remove @textactor/wikientity-domain
yarn remove @textactor/wikientity-data
yarn remove @textactor/actor-domain
yarn remove @textactor/actor-data
yarn remove textactor-explorer

yarn link @textactor/domain
yarn link @textactor/actor-domain
yarn link @textactor/wikientity-domain
yarn link @textactor/wikientity-data
yarn link @textactor/actor-domain
yarn link @textactor/actor-data
yarn link textactor-explorer

yarn tsc
