#!/bin/bash

yarn tsc

PAST_DAYS=4 PERIOD=4 LOCALE=ro-md yarn collect
PAST_DAYS=7 PERIOD=4 LOCALE=ro-md yarn collect
PAST_DAYS=10 PERIOD=4 LOCALE=ro-md yarn collect

LOCALE=ro-md yarn generate

LOCALE=ro-md yarn generate-from-queries
