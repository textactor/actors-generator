#!/bin/bash

yarn tsc

LOCALE=ro-md yarn collect

LOCALE=ro-md yarn generate

LOCALE=ro-md yarn generate-from-queries
