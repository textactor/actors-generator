#!/bin/bash

yarn tsc

LOCALE=ru-ru yarn collect

LOCALE=ru-ru yarn generate

#LOCALE=ru-ru yarn generate-from-queries
