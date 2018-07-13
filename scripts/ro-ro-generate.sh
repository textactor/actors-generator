#!/bin/bash

yarn tsc

PAST_DAYS=4 PERIOD=4 LOCALE=ro-ro yarn collect
PAST_DAYS=7 PERIOD=4 LOCALE=ro-ro yarn collect
PAST_DAYS=10 PERIOD=4 LOCALE=ro-ro yarn collect

LOCALE=ro-ro yarn generate

LOCALE=ro-ro yarn generate-from-queries
