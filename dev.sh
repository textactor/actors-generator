#!/bin/bash

yarn remove @textactor/domain
yarn remove @textactor/wikientity-domain
yarn remove @textactor/actor-domain
yarn remove @textactor/concept-collector
yarn remove @textactor/wikientity-data
yarn remove @textactor/actor-domain
yarn remove @textactor/concept-domain
yarn remove @textactor/actor-data
yarn remove @textactor/concept-data

yarn link @textactor/domain
yarn link @textactor/wikientity-domain
yarn link @textactor/actor-domain
yarn link @textactor/concept-collector
yarn link @textactor/wikientity-data
yarn link @textactor/actor-domain
yarn link @textactor/concept-domain
yarn link @textactor/actor-data
yarn link @textactor/concept-data

tsc
