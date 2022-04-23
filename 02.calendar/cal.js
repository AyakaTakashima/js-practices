let argv = require('minimist')(process.argv.slice(2))

function findYear() {
  if ((!argv.y) && (process.argv[3] !== undefined)) {
    return process.argv[3]
  } else if (argv.y) {
    return argv.y
  } else {
    let day = new Date()
    return day.getFullYear()
  }  
}

function findMonth() {
  if ((!argv.m) && (process.argv[2] !== undefined)) {
    return process.argv[2]
  } else if (argv.m) {
    return argv.m
  } else {
    let day = new Date()
    return day.getMonth() + 1
 }
}


function displayCalendar(){
  let month = findMonth()
  let year = findYear()

  let last_day = new Date(year, month, 0)
  let last_date = last_day.getDate()
  let first_day = new Date(year, month -1, 1)
  let first_wday = first_day.getDay()

  console.log( '      ' + month + '月  ' + year)
  console.log('日 月 火 水 木 金 土')
  
  for ( let i = 1; i <= first_wday; i++ ) {
    process.stdout.write( "   " )
  }
  
  for ( let i = 1; i <= last_date; i++ ){
    let date = new Date(year, month-1, i)
    if (( date.getDay()== 6 ) && ( i < 10 )) {
      console.log ( " " + i.toString() )
    } else if ( date.getDay()== 6 ) {
      console.log ( i.toString() + " " )
    } else if (i < 10 ) {
      process.stdout.write(" " + i.toString() + " " )
    } else {
      process.stdout.write(i.toString() + " " )
    }
  }
  console.log ( " " )
}

displayCalendar()
