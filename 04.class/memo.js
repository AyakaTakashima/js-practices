const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const { Select } = require('enquirer')
const readline = require('readline')

const path = 'memo_data/'
if (!fs.existsSync(path)) {
  fs.mkdirSync(path)
}

class MemoDb {
  static fileNames () {
    return fs.readdirSync('memo_data')
  }

  static findAll () {
    const filenames = MemoDb.fileNames()
    const memoTitles = []
    for (let i = 0; i < filenames.length; i++) {
      memoTitles.push(filenames[i].split('.txt')[0])
    }
    return memoTitles
  }
}

class Memo {
  static list () {
    const memoTitles = MemoDb.findAll()
    for (let i = 0; i < memoTitles.length; i++) {
      console.log(memoTitles[i])
    }
  }

  static async show () {
    const memoTitles = MemoDb.findAll()
    const prompt = new Select({
      message: '閲覧したいメモを選んでください。',
      choices: memoTitles
    })

    const answer = await prompt.run()
    console.log(fs.readFileSync(`memo_data/${answer}.txt`, 'utf-8'))
  }

  static async delete () {
    const memoTitles = MemoDb.findAll()
    const prompt = new Select({
      message: '削除したいメモを選んでください。',
      choices: memoTitles
    })

    await prompt.run()
      .then(function (answer = []) {
        unlink(`memo_data/${answer}.txt`)
        console.log(answer + 'を削除しました。')
      })
      .catch(console.error)
  }

  static create () {
    const lines = []
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    console.log('メモを保存します。文字を入力してください。1行目がタイトルになります。')

    reader.on('line', function (line) {
      lines.push(line + '\n')
    })

    const memoTitles = MemoDb.findAll()
    reader.on('close', function () {
      if (!lines.length) {
        console.log('終了しました。')
      } else if (memoTitles.includes(lines[0].split('\n')[0])) {
        console.log('そのタイトルのメモはすでにあります。\nメモの保存ができませんでした')
      } else {
        console.log('下記をメモとして保存しました。')
        const title = lines[0].split('\n')[0]
        const content = lines.slice(1).join('')
        fs.writeFile(`memo_data/${title}.txt`, content.toString(), (err) => {
          if (err) {
            console.log('エラーが発生しました。' + err)
            throw err
          }
        })
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
