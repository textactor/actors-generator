#!/bin/bash

yarn tsc

PAST_DAYS=4 PERIOD=4 LOCALE=ru-ru yarn collect
PAST_DAYS=7 PERIOD=4 LOCALE=ru-ru yarn collect
PAST_DAYS=10 PERIOD=4 LOCALE=ru-ru yarn collect

LOCALE=ru-ru yarn generate

LOCALE=ru-ru yarn generate-from-queries
