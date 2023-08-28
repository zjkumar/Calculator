

let historyBarEl = document.getElementById('historyBar');
let inputOutputEl = document.getElementById('inputOutput');
let buttonsContainer = document.querySelector('.buttons-container');


// let uniqueId = setInterval(updateInputDisplay, 700);

inputOutputEl.value = '0'
inputOutputEl.style.textAlign = 'right';

let buttons = [
  
  {name: 'delete',cols: 2, symbol: 'DEL', action: backspace},
  {name: 'clear',cols: 2, symbol: 'CLEAR', action: processAllClear},
  {name: 'plusMinus',cols: 1, symbol: '±', action: processPlusOrMinus},
  {name: 'seven',cols: 1, symbol: '7',   action: processNumbers},
  {name: 'eight',cols: 1, symbol: '8',   action: processNumbers},
  {name: 'nine',cols: 1, symbol: '9',   action: processNumbers},
  {name: 'multiply',cols: 1, symbol: 'x',   action: processOperator},
  {name: 'plus',cols: 1, symbol: '+',   action: processOperator},
  {name: 'four',cols: 1, symbol: '4',   action: processNumbers},
  {name: 'five',cols: 1, symbol: '5',   action: processNumbers},
  {name: 'six',cols: 1, symbol: '6',   action: processNumbers},
  {name: 'minus',cols: 1, symbol: '-',   action: processOperator},
  {name: 'divide',cols: 1, symbol: '/',   action: processOperator},
  {name: 'one',cols: 1, symbol: '1',   action: processNumbers},
  {name: 'two',cols: 1, symbol: '2',   action: processNumbers},
  {name: 'three',cols: 1, symbol: '3',   action: processNumbers},
  {name: 'factorial',cols: 1, symbol: 'n!', action: processFactorial},
  {name: 'percentage',cols: 1, symbol: '%', action: processPercentage},
  {name: 'zero',cols: 1, symbol: '0',   action: processNumbers},
  {name: 'decimal',cols: 1, symbol: '.', action: processDecimal},
  {name: 'doubleZero',cols: 1, symbol: '00',  action: processNumbers},
  {name: 'equalTo',cols: 2, symbol: '=', action: processFinalAnswer}
];


function triggerMultiplication(){
  document.getElementById('multiplySymbol').click();
}

let cache = {
  num: '',
  ans: '',
  operator: '',
  plusOrMinusUsed: false,
  ansNotCalculated: true,
  decimalPointExist: false,
  error: false
}

let temporary = {
  tempAns : ''
}

let trackSpecialOperators = {
  specialOperatorIsClickedFirst : false,
  bracketsModeTurnedOn: false
}

let details = {
  num: '',
  operator: '',

}

let history = [{...details}];


function processAllClear(){
  details = {
    num: '',
    operator: '',
  };
  history = [{...details}];
  trackSpecialOperators = {
    specialOperatorIsClickedFirst : false,
    bracketsModeTurnedOn: false
  };
  cache = {
    num: '',
    ans: '',
    operator: '',
    plusOrMinusUsed: false,
    ansNotCalculated: true,
    decimalPointExist: false,
    error: false
  }
  inputOutputEl.value = '0';
  historyBarEl.value = '';
}

function processPercentage(){
  if (cache.error){
    return;
  }
  if (cache.num === '' || cache.num === '0'){
    return;
  }
  cache.num = String(cache.num/100);
  cache.operator = '+';
  historyBarEl.value = historyBarEl.value + cache.num + '+';
  document.getElementById('plusSymbol').click();
  inputOutputEl.value = cache.num;  

}

function getFactorial(num){
  let result = 1;
  for (let i = 1; i <= num; i++) {
    result *= i;
  }
  return result;
}

function processFactorial(){
  if (cache.error){
    return;
  }
  if (cache.num === '' || cache.num === '0' || cache.decimalPointExist || cache.plusOrMinusUsed){
    return;
  }
  cache.num = String(getFactorial(cache.num));
  cache.operator = '+';
  historyBarEl.value = historyBarEl.value + cache.num + '+';
  document.getElementById('plusSymbol').click();
  inputOutputEl.value = cache.num;
}

function backspace(){
  if (cache.num === '' || cache.num === '0'){
    cache.num = '0';
    inputOutputEl.value = cache.num;
    return;
  }
  const num = cache.num;
  const slicedNum = num.slice(0, num.length-1)
  let resultantNum = '';
  if (slicedNum === '' || slicedNum === '-'){
    resultantNum = '0';
  }else if (slicedNum.length-1 === '.'){
    resultantNum = slicedNum.slice(0, slicedNum.length-1)
  }else{
    resultantNum = slicedNum;
  }
  let numLst = num.split("") 
  if (numLst.includes('.') && !resultantNum.includes(".")){
    cache.decimalPointExist = false;
  }if (num[0] === '-' && resultantNum[0] !== '-'){
    cache.plusOrMinusUsed = false;
  }
  cache.num = resultantNum;
  inputOutputEl.value = cache.num;
}


function thereExistsAnOperatorInCache(){
  return cache.operator !== '';
}

function finalizeOperatorInDetailsDict(){
  let l = history.length;
  history[l-1].operator = cache.operator;
  cache.operator = '';
}

function createNewDetailsInHistory(){
  history.push({...details});
}

function updateCurrentNumberInCache(num){
  if ((cache.num === '' || cache.num === '0') && num !== '.'){
    cache.num =  ['0', '00'].includes(num) ? '0' : num
  }else{
    cache.num = cache.num + num;
  }
}

function displayNumberInInputBar(){
  inputOutputEl.value = cache.num;
}

function restoreDefaultValuesOfTrackSpecialOperators(){
  trackSpecialOperators.bracketsModeTurnedOn = false;
  trackSpecialOperators.specialOperatorIsClickedFirst = false;
}

function temporaryAnsExists(){
  return temporary.tempAns !== '';
}

function clearTextOnCalculationBar(){
  historyBarEl.value = '';
}
function processNumbers(){
  if (cache.error){
    return;
  }
  if (temporaryAnsExists()){
    temporary.tempAns = '';
    createFreshHistory();
    clearTextOnCalculationBar();
  }
  restoreDefaultValuesOfTrackSpecialOperators();
  
  const num = this.dataset['symbol'];
  if (thereExistsAnOperatorInCache()){
    cache.ansNotCalculated = true;
    finalizeOperatorInDetailsDict()
    createNewDetailsInHistory()
  }
  updateCurrentNumberInCache(num);
  displayNumberInInputBar();
  if (cache.num[0] === '-'){
    cache.plusOrMinusUsed = true;
  }else{
    cache.plusOrMinusUsed = false;
  }

}

function processDecimal(){
  if (cache.error){
    return;
  }
  if (cache.decimalPointExist){
    return;
  }else if (cache.num === '' || cache.num === '0'){
    updateCurrentNumberInCache('0.');
    cache.decimalPointExist = true;
  }else {
    updateCurrentNumberInCache('.');
    cache.decimalPointExist = true;
  }
  displayNumberInInputBar();
}

function finalizeNum(idx){
  // finalizing the num in cache and storing in details
  const finalizedNum = cache.num === '' ? '0' : cache.num;
  history[idx].num = finalizedNum;
}

function updateTemporaryOperatorInCache(tempOperator){
  cache.operator = tempOperator;
}

function displayCalculationBar(tempOperator){
  // displaying it on caculation bar

  let str = '';
  for (let detailsDict of history){
    str += detailsDict["num"] + detailsDict["operator"]
  }
  historyBarEl.value = str + tempOperator
}

function stringEndingIncludesSymbol(stringOnhistoryBar){
  return (["=", "+" ,"-", "/", "*", "."].includes(stringOnhistoryBar[stringOnhistoryBar.length-1]));
}

function evaluationTillNowInOutputBar(){
  let stringOnhistoryBar = (historyBarEl.value);

  if (stringOnhistoryBar === '' || stringOnhistoryBar === undefined){
    cache.num = '';
    return history[0].num;
  }
  let l = stringOnhistoryBar.length, i=0, previouslyNeg=false, output = ''
  
  if (stringEndingIncludesSymbol(stringOnhistoryBar)){
    stringOnhistoryBar = stringOnhistoryBar.slice(0, l-1);
    l -= 1;
  }
  // eval function arises problem when there is consecutive negative symbols
  // so making them positive
  while (i < l){
      let currVal = stringOnhistoryBar[i]
      if (previouslyNeg === true && currVal === '-'){
          output = output.slice(0, output.length-1) + '+';
          i += 1;
          previouslyNeg = false;
          continue
      }
      output += currVal;
      if (currVal === '-'){
        previouslyNeg = true;
      }else{
        previouslyNeg = false;
      }
      i += 1;
  }
  cache.num = '';
  try {
    const ans = eval(output);
    if (isNaN(ans) || ans === Infinity){
      cache.error = true;
      return ans === Infinity ? 'Infinity': 'Undefined';  
    }
    return ans;  
  }catch(e){
    cache.error = true;
    return 'Undefined'
  }
  
  
  

}

function symbolIsSpecOperAndCacheOperIsEmpty(symbol){
  return ["/", "*"].includes(symbol) && cache.operator === '';
}

function isSpecOperAndBracModeNotTurnedOnAndSpecOperIsNotClickedFirst(symbol){
  let boolVal = ["/", "*"].includes(symbol);
  boolVal = boolVal && !trackSpecialOperators.bracketsModeTurnedOn;
  boolVal = boolVal && !trackSpecialOperators.specialOperatorIsClickedFirst 
  return boolVal;
}


function includeBracketsInCalculation(){  
  // normal operators are +, -
  // special operators are *, /
  history[0].num = "(" + history[0].num;
  history[history.length-1].num = history[history.length-1].num + ")"
  trackSpecialOperators.bracketsModeTurnedOn = true;
}

function cacheNumHasDecimal(){
  const cacheNum = cache.num
  return (cacheNum.split("")).includes('.');
}

function enableDisableDecimalPoint(){
  if (cache.num === '' || !(cacheNumHasDecimal())){
    cache.decimalPointExist = false;
  }else if ((cache.num).split('.').includes('.')){
    cache.decimalPointExist = true;
  }
}

function processOperator(){
  if (cache.error){
    return;
  }

  enableDisableDecimalPoint()
  let tempOperator = this.dataset['symbol'];
  if (tempOperator === 'x') {
    tempOperator = '*'
  }
  if (temporary.tempAns !== ''){
    history[history.length-1].num = temporary.tempAns;
    temporary.tempAns = '';
  }
  l = history.length;
  if (history[l-1].num === ''){
    finalizeNum(l-1)
  }
  if (symbolIsSpecOperAndCacheOperIsEmpty(tempOperator)){
    trackSpecialOperators.specialOperatorIsClickedFirst = true;
  }
  if (isSpecOperAndBracModeNotTurnedOnAndSpecOperIsNotClickedFirst(tempOperator)){
    includeBracketsInCalculation()
  }

  updateTemporaryOperatorInCache(tempOperator)
  displayCalculationBar(tempOperator)
  inputOutputEl.value = evaluationTillNowInOutputBar() // this step should be below the calculation bar bcz it takes value from calculation bar
  cache.decimalPointExist = false;
}

function cacheNumIsNotEmpty(){
  return (cache.num !== '');
}

function cacheNumIsNotZero(){
  return (cache.num !== '0');
}

function cachePlusOrMinusNotInUsage(){
  return cache.plusOrMinusUsed === false;
}

function cacheNumIsEmpty(){
  return cache.num === '';
}

function ioValueIsEmpty(){
  return inputOutputEl.value === ''
}

function ioValueIsZero(){
  return inputOutputEl.value === '0'
}

function ioValueIsPositive(){
  return (inputOutputEl.value)[0] !== '-'
}

function processPlusOrMinus(){
  if (cache.error){
    return;
  }
  if (cacheNumIsNotEmpty() && cacheNumIsNotZero() && cachePlusOrMinusNotInUsage()){
    cache.num = "-" + cache.num;
    cache.plusOrMinusUsed = true;
  }else if (cacheNumIsEmpty() && !(ioValueIsEmpty() || ioValueIsZero())){
    if (ioValueIsPositive()){
      cache.num = '-' + inputOutputEl.value
      cache.plusOrMinusUsed = true;
    }else{
      cache.num = (inputOutputEl.value).slice(1)
      cache.plusOrMinusUsed = false;
    }
    restoreDefaultValuesOfTrackSpecialOperators()
  }
  else if (cache.plusOrMinusUsed){
    cache.num = (cache.num).slice(1)
    cache.plusOrMinusUsed = false;
  }
  inputOutputEl.value = cache.num === '' ? "0": cache.num;
}

function historyIsFreshAndOperatorNeverUsed(){
  return history.length === 1 && history[0].operator === '' && history[0].num === '';
}

function equalToPressedImmediatelyAfterOperator(){
  // equal to pressed thats why entered process final answer func.
  // so we need to check if there is operator in cache
  // to satisfy if there is operator in cache and equal to pressed immediately
  return cache.operator !== '' && history[history.length-1].operator === '';
}


function createFreshHistory(){
  cache.decimalPointExist = false;
  cache.operator = '';
  cache.num = '';
  cache.plusOrMinusUsed = false;
  history = [{...details}];
  restoreDefaultValuesOfTrackSpecialOperators();
}

function createTemporaryAnswer(){
  temporary.tempAns = inputOutputEl.value;
}

function enableDisablePlusOrMinusUsed(){
  if (!ioValueIsPositive()){
    cache.plusOrMinusUsed = true;
  }else{
    cache.plusOrMinusUsed = false;
  }
}

function processFinalAnswer(){
  if (cache.error){
    return;
  }
  if (historyIsFreshAndOperatorNeverUsed()){
    cache.num = cacheNumIsEmpty() ? '0' : cache.num
    historyBarEl.value = cache.num + '='
    cache.num = '' 
  }else{
    
    enableDisableDecimalPoint();
    enableDisablePlusOrMinusUsed();
    
    restoreDefaultValuesOfTrackSpecialOperators();
    
    finalizeOperatorInDetailsDict()
    createNewDetailsInHistory()
    history[history.length-1].num = inputOutputEl.value;
    displayCalculationBar("=")
    inputOutputEl.value = evaluationTillNowInOutputBar() // this step should be below the calculation bar bcz it takes value from calculation bar
    createFreshHistory();
    createTemporaryAnswer();
  }
  // else{
  //   displayCalculationBar("=")
  //   inputOutputEl.value = evaluationTillNowInOutputBar()
  // }
}

let iconEl = document.createElement('i');
iconEl.classList.add('fa-solid', 'fa-circle-xmark');

buttons.forEach((btn) => {
  let btnEl = document.createElement('button');
  btnEl.setAttribute('data-symbol', btn.symbol);
  btnEl.setAttribute('id', btn.name + 'Symbol')
  btnEl.textContent = btn.symbol;
  if (btn.symbol === 'DEL'){
    btnEl.textContent = '';
    btnEl.appendChild(iconEl)
  }
  btnEl.classList.add(`btn-cols-${btn.cols}`);
  
  btnEl.addEventListener('mouseup', btn.action);

  btn['buttonElement'] = btnEl;
  buttonsContainer.appendChild(btnEl)
})



