import datejs from 'datejs';

// input is an array that holds the format of ['yyyy','mm','dd']
function formatDate (input) {
  let year = input[0]; // yyyy
  let month = input[1]; // mm
  let day = input[2]; // dd

  let formatDate = `${month}.${day}.${year}`;
  return Date.parse(formatDate).toDateString(); 
}

module.exports = formatDate;
