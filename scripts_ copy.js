
firebase.auth().signInAnonymously().then((e) => {
  document.querySelector('.main').classList.remove('hidden')
}).catch(e => alert('Database error -  Please, check your Internet connection'))

const start_menu = document.getElementById('start-menu')
const car_line_grid = document.getElementById('car-line-grid')
const class_list = document.getElementById('class-list')

const hide = (element) => element.classList.add('hidden')
const show = (element) => element.classList.remove('hidden')


function back() {
  hide(car_line_grid)
  hide(class_list)
  show(start_menu)
}
function open_car_line() {
  hide(start_menu);
  show(car_line_grid);
}
function open_class_list() {
  hide(start_menu);
  show(class_list);
}

const car_line_date = document.getElementById('car-line-date')
const car_line_btn_date = document.getElementById('car-line-btn-date')

var actual_line = {}
var cars = {}

car_line_btn_date.addEventListener('click', e => {
  let date = car_line_date.value.replaceAll('-', '')
  if (date != '') {
    // db.ref('carlines/' + date).set(value).then(e => console.log(e))
    database.ref('carlines').once('value').then(snap => {
      var lines = snap.val()
      var dates = Object.keys(lines)
      var registered = dates.includes(date)
      if (registered) {
        actual_line = lines[date]
        create_cars_list()
      } else {
        actual_line = {
          date: date,
          cars: [0],
          classes: {'0':[0]}
        }
        database.ref('carlines/' + date).set(actual_line).then(() => {
          create_cars_list()
        }).catch(e => alert(e.message))
      }
    }).catch(e => alert(e.message))
  } else {
    alert('Please, select the date')
  }
})


// var cars_list = {
//   01 : [{name: 'Miriã', class: 002}, {name: 'Lis', class: 001}],
//   02 : [{name: 'Beatriz', class: 013}, {name: 'Brenda', class: 005}],
//   03 : [{name: 'Daniel', class: 004}, {name: 'Izabel', class: 003}, {name: 'Raquel', class: 005}]
// }


function create_cars_list() {
  document.querySelector('.car-numbers').innerHTML = ''
  database.ref('cars').once('value').then(snap => {
    cars = snap.val()
    let cars_numbers = Object.keys(snap.val())
    cars_numbers.map(number => {
      let item = `<div class="car-number" onclick="car_arrived(${number})">${number}</div>`
      document.querySelector('.car-numbers').innerHTML += item
    })
  }).catch(e => alert(e.message))
}

function car_arrived(number) {
  let students = cars[number]
  students.map(student => {
    let student_class = student.class
    let actual_line_classes = Object.keys(actual_line['classes'])
    if (actual_line_classes.includes(student_class)) {
      actual_line['classes'][student_class].push(student.name)
      // database.ref('carlines/' + actual_line.date + '/classes/' + student_class)
    } else {
      // database.ref('carlines/' + actual_line.date + '/classes/' + student_class).once('value').then(snap => {
        //   let students_on_class = snap.val()
        //   students_on_class.push(student.name)
        // })
        actual_line['classes'][student_class].push(student.name)
      database.ref('carlines/' + actual_line.date + '/classes/' + student_class).set(actual_line['classes'][student_class]).then(() => console.log(student)).catch(e => alert(e.message))
    }
    // incluir a class em actual_line
    // notificar a class
    // class vai ouvir carlines/date/classes/class_number
  })
  // APÓS O MAP, INFORMAR QUE O REGISTRO FOI REALIZADO
  // remove from object cars
  // remove button
}