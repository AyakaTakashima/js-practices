const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const { Select } = require('enquirer')

const filenames = fs.readdirSync('memo_data')
const memoTitles = []
for (let i = 0; i < filenames.length; i++) {
  memoTitles.push(filenames[i].split('.txt')[0])
}

class Memo {
  constructor (filenames, memoTitles) {
    this.filenames = filenames
    this.memoTitles = memoTitles
  }

  static list () {
    for (let i = 0; i < filenames.length; i++) {
      console.log(filenames[i].split('.txt')[0])
    }
  }

  static show () {
    const prompt = new Select({
      message: '閲覧したいメモを選んでください。',
      choices: memoTitles
    })

    prompt.run()
      .then(answer => console.log(fs.readFileSync('memo_data/' + answer + '.txt', 'utf-8')))
      .catch(console.error)
  }

  static delete () {
    const prompt = new Select({
      message: '削除したいメモを選んでください。',
      choices: memoTitles
    })

    prompt.run()
      .then(function (answer = []) {
        unlink('memo_data/' + answer + '.txt')
        console.log(answer + 'を削除しました。')
      })
      .catch(console.error)
  }

  static create () {
    const lines = []
    const reader = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    console.log('メモを保存します。文字を入力してください。1行目がタイトルになります。')

    reader.on('line', function (line) {
      lines.push(line + '\n')
      const title = lines[0].split('\n')[0]
      const content = lines.slice(1).join('')
      fs.writeFile(`memo_data/${title}.txt`, content.toString(), (err) => {
        if (err) {
          console.log('エラーが発生しました。' + err)
          throw err
        }
      })
    })

    reader.on('close', function () {
      if (!lines.length) {
        console.log('終了しました。')
      } else if (memoTitles.includes(lines[0].split('\n')[0])) {
        console.log('そのタイトルのメモはすでにあります。\nメモの保存ができませんでした')
      } else {
        console.log('下記をメモとして保存しました。')
        for (let i = 0; i < lines.length; i++) {
          console.log(lines[i].split('\n')[0])
        }
      }
    })
  }
}

function unlink (fileName) {
  fs.unlink(fileName, function (err) {
    if (err) {
      throw err
    }
  })
}

if (argv.l) {
  Memo.list()
} else if (argv.r) {
  Memo.show()
} else if (argv.d) {
  Memo.delete()
} else {
  Memo.create()
}
