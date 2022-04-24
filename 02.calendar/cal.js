const argv = require('minimist')(process.argv.slice(2))
const japanStandardTime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })

function findYear () {
  if (argv.y) {
    return argv.y
  } else if ((!argv.m) && (process.argv[3])) {
    return process.argv[3]
  } else {
    return new Date(japanStandardTime).getFullYear()
  }
}

function findMonth () {
  if (argv.m) {
    return argv.m
  } else if (process.argv[2] !== undefined) {
    return process.argv[2]
  } else {
    return new Date(japanStandardTime).getMonth() + 1
  }
}

function displayCalendar () {
  const month = findMonth()
  const year = findYear()

  const lastDay = new Date(year, month, 0, 9)
  const lastDate = lastDay.getDate()
  const firstDay = new Date(year, month - 1, 1, 9)
  const firstWday = firstDay.getDay()

  console.log('      ' + month + '月  ' + year)
  console.log('日 月 火 水 木 金 土')

  for (let i = 1; i <= firstWday; i++) {
    process.stdout.write('   ')
  }

  for (let i = 1; i <= lastDate; i++) {
    const date = new Date(year, month - 1, i)
    if ((date.getDay() === 6) && (i < 10)) {
      console.log(' ' + i.toString())
    } else if (date.getDay() === 6) {
      console.log(i.toString() + ' ')
    } else if (i < 10) {
      process.stdout.write(' ' + i.toString() + ' ')
    } else {
      process.stdout.write(i.toString() + ' ')
    }
  }
  console.log(' ')
}

displayCalendar()
