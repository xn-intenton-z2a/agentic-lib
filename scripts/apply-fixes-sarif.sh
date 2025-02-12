#!/usr/bin/env bash
# Usage: ./scripts/apply-fixes-sarif.sh
srcDir='./src/ ./tests/'
programFitnessCommand="npx --silent eslint --fix --format=@microsoft/eslint-formatter-sarif ${srcDir?}"
. ./secrets.env
export CHATGPT_API_SECRET_KEY="${CHATGPT_API_SECRET_KEY?}"
export I7N_SAFETY_PROTOCOLS='off'
export LOG_LEVEL='info'
echo "${programFitnessCommand}"
eval "${programFitnessCommand}"
npm install --no-save
npm link
# time node ./node_modules/.bin/apply-fixes-sarif \
# time node ./node_modules/.bin/apply-fixes-sarif \
time node ./node_modules/@polycode-projects/apply-fixes-sarif/dist/apply-fixes-sarif-main/index.js \
  programFitnessCommand:"${programFitnessCommand}" \
  iterations:5 \
  baseDir:'./' \
  resultsToResolve:1 \
  2>&1 \
  | pino-pretty \
  ;
echo "${programFitnessCommand}"
eval "${programFitnessCommand}"
