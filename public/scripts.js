firebase
	.auth()
	.signInAnonymously()
	.then(e => {
		setTimeout(() => {
      document.querySelector('#connecting').classList.add('hidden')
		document.querySelector('.main').classList.remove('hidden')
    }, 1500);
	})
	.catch(e => alert('Database error -  Please, check your Internet connection'))

const start_menu = document.getElementById('start-menu')
const car_line_grid = document.getElementById('car-line-grid')
const class_list = document.getElementById('class-list')

const hide = element => element.classList.add('hidden')
const show = element => element.classList.remove('hidden')

function back() {
	hide(car_line_grid)
	hide(class_list)
	show(start_menu)
}
function open_car_line() {
	hide(start_menu)
	show(car_line_grid)

	var year = new Date().getFullYear()
	var month = new Date().getMonth() + 1
	month < 10 ? month = '0' + month.toString() : null
	console.log(month)
	var day = new Date().getDate()
	var today = year + '-' + month + '-' + day
	document.getElementById('car-line-date').value = today
}
function open_class_list() {
	hide(start_menu)
	show(class_list)
}

const car_line_date = document.getElementById('car-line-date')
const car_line_btn_date = document.getElementById('car-line-btn-date')

car_line_btn_date.addEventListener('click', e => {
	document.querySelector('.car-numbers').innerHTML = ''
	document.querySelector('.car-line').innerHTML = ''
	let date = car_line_date.value.replaceAll('-', '')
	if (date != '') {
		database
			.ref('carlines')
			.once('value')
			.then(snap => {
				var lines = snap.val()
				var dates = Object.keys(lines)
				var registered = dates.includes(date)
				if (registered) {
					create_cars_list(date)
					create_cars_in_line_list(date)
				} else {
					let template = {
						classes: 'null',
            history: ['God bless you!']
					}
					database
						.ref('carlines/' + date)
						.set(template)
						.then(() => create_cars_list(date))
						.catch(e => alert(e.message))
				}
			})
			.catch(e => alert(e.message))
	} else {
		alert('Please, select the date')
	}
})

let history = []

function create_cars_in_line_list(date) {
	database
		.ref('carlines/' + date + '/history')
		.once('value')
		.then(snap => {
      history = []
			history = snap.val()
			document.querySelector('.car-line').innerHTML = ''
			history.reverse().map(register => {
				let item = `<div class="car-line-item">${register}</div>`
				document.querySelector('.car-line').innerHTML += item
			})
		})
		.catch(e => alert(e.message))
}

function create_cars_list(date) {
	database
		.ref('cars')
		.once('value')
		.then(snap => {
			let cars_numbers = Object.keys(snap.val())
			document.querySelector('.car-numbers').innerHTML = ''
			cars_numbers.map(number => {
				let item = `<div class="car-number" onclick="car_arrived(${number},${date})">${number}</div>`
				document.querySelector('.car-numbers').innerHTML += item
			})
		})
		.catch(e => alert(e.message))
}



function car_arrived(number, date) {
	let now = new Date().getTime()
	let names = []
	database
		.ref('cars/' + number)
		.once('value')
		.then(snap => {
			let car = snap.val()
			console.log(car)
			let car_students = car.students
			car_students.map(student => {
				console.log(student.name)
				names.push(student.name)
				student['time'] = now
				database.ref('carlines/' + date + '/classes/' + student.class + '/' + student._id).set(student)
			})
		})
		.then(() => {
			let time = new Date(now).toLocaleTimeString()
			let register = number + ' | ' + names.toString() + ' | ' + time
			history.push(register)
			let item = `<div class="car-line-item">${register}</div>`
			var pre = document.querySelector('.car-line').innerHTML
			document.querySelector('.car-line').innerHTML = ''
			document.querySelector('.car-line').innerHTML += item + pre
			database.ref('carlines/' + date + '/history').set(history)
		})
		.catch(e => alert(e.message))
}
