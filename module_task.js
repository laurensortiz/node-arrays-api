var Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  _ = require('lodash');

function readFiles(files) {

  Promise.map(files, function (file) {
    return fs.readFileAsync(file)
      .then(function (data) {
        return JSON.parse(data);
      });
  }).then(abstractNumbers)
    .then(hasSameSize)
    .then(doMathParallal)
    .then(getResult)
    .catch(function(e) {
      console.log('Exception ' + e);
    });
}

function readFile(file) {

  Promise.map(file, function (file) {
    return fs.readFileAsync(file)
      .then(function (data) {
        return JSON.parse(data);
      });
  }).then(abstractNumbers)
    .then(doMathSingle)
    .then(evalResult)
    .catch(function(e) {
      console.log('Exception ' + e);
    });
}

function abstractNumbers(arrayOfNumbers) {

  var result = arrayOfNumbers.map(function (array) {
    if ('myNumbers' in array) {
      return array.myNumbers;
    }
  });

  return result;
}

function hasSameSize(cleanArrays) {
  var cleanArrays_sizes = [],
    areEquals = false; //The arrays should has the same size = true

  //Get each array size and store it in cleanArrays_sizes
  _.forEach(cleanArrays, function (anArray){
    cleanArrays_sizes.push(_.size(anArray));
  });

  //Once we have the size of each array check if it has all the same size
  areEquals = _.every(cleanArrays_sizes, function (value) {
    if (value === cleanArrays_sizes[0]) {
      return true;
    }
  });

  // Ok great all has the same size
  if (areEquals) {
    return cleanArrays;
  } else {
    throw new Error("The Array sizes are not the same");
  }
}

function doMathParallal(readyArrays) {
  var newArrayBySum = readyArrays[0].map(function (num, ind) {
    return num + readyArrays[1][ind];
  });

  return newArrayBySum;

}

function doMathSingle(arrayOfNumbers) {
  return _.sum(arrayOfNumbers[0]);
}

function getEvenNumbers(numbers){

  var newArrayOfEvens = _.filter(numbers.myNumbers, function(num){ return num % 2 == 0; });

  //Show the new Array
  getResult(newArrayOfEvens);

}

function doMathOddNumbers(numbers) {

  var newArrayOfOdd = _.filter(numbers.myNumbers, function(num){ return num % 2 == 1; }),
      sumOddNumbers = _.sum(newArrayOfOdd);

  //Show result
  getResult(sumOddNumbers);

}

function evalResult(number) {

  if ( number % 2 === 0) {
    //IsEven: read another file from the file system containing
    // an array of numbers, b.json, and print only the
    // even numbers.
    fs.readFileAsync('b.json')
      .then(function (data) {
        return JSON.parse(data);
      })
      .then(getEvenNumbers)
      .catch(function(e) {
        console.log('Exception ' + e);
      });
  }
  else{
    //IsOdd: read another file from the file system containing an array
    //of numbers, c.json, and print the sum of the odd numbers.
    fs.readFileAsync('c.json')
      .then(function (data) {
        return JSON.parse(data);
      })
      .then(doMathOddNumbers)
      .catch(function(e) {
        console.log('Exception ' + e);
      });
  }
}

function getResult(newArray) {
  console.log(newArray);
}

function sumParallel(files) {
  readFiles(files);
}

function evaluateContent(file) {
  readFile(file);
}

module.exports = {
  sumParallel : sumParallel,
  evaluateContent : evaluateContent
}