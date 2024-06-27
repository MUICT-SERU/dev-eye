// lib/mainFunctionResult.js

let mainFunctionResult = null;

export const setMainFunctionResult = (result) => {
  mainFunctionResult = result;
};

export const getMainFunctionResult = () => {
  return mainFunctionResult;
};