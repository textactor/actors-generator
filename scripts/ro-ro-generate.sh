#!/bin/bash

yarn tsc

LOCALE=ro-ro yarn collect

LOCALE=ro-ro yarn generate

#LOCALE=ro-ro yarn generate-from-queries
