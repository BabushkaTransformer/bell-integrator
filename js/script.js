const parent = document.querySelector(".seats");
const btn = document.querySelector(".book");
const clearCur = document.querySelector(".clear-current");
const clearAll = document.querySelector(".clear-all");
const time = document.querySelector("#time");
const day = document.querySelector("#day");

function dates(current) {
	const daySetValue = document.querySelector("#day");
	let options = "";
	let week = new Array();
	current.setDate(current.getDate() - current.getDay() + 1);
	for (let i = 0; i < 7; i++) {
		week.push(new Date(current));
		current.setDate(current.getDate() + 1);
	}
	week.forEach((el) => {
		if (el.toLocaleDateString() == new Date().toLocaleDateString()) {
			options += `
                <option selected>${el.toLocaleDateString("en-US")}</option>
            `;
		} else {
			options += `
                <option>${el.toLocaleDateString("en-US")}</option>
            `;
		}
	});
	daySetValue.innerHTML = options;
}
dates(new Date());

// генерация seats-item===============================================================
const generate = () => {
	let str = "";
	const dayValue = document.querySelector("#day").value;
	const timeValue = document.querySelector("#time").value;
	let local_data = JSON.parse(localStorage.getItem([dayValue, timeValue]));

	let curdate = new Date(new Date().toLocaleDateString("en-US"));
	let olddate = new Date(dayValue);

	for (let i = 1; i <= 60; i++) {
		if (curdate - olddate > 0) {
			str += `
                <span class="seats-item disabled" data-id="${i}"></span>
            `;
		} else if (local_data !== null) {
			if (local_data.includes(i.toString()))
				str += `
                    <span class="seats-item booked" data-id="${i}"></span>
                `;
			else
				str += `
                    <span class="seats-item" data-id="${i}"></span>
                `;
		} else {
			str += `
                <span class="seats-item" data-id="${i}"></span>
            `;
		}
		parent.innerHTML = str;
	}
};
generate();

// Добавление в localStorage======================================
const bookSeats = () => {
	const child = document.querySelectorAll(".seats-item");
	const dayValue = document.querySelector("#day").value;
	const timeValue = document.querySelector("#time").value;
	let arr = [];
	child.forEach((el) => {
		if (el.classList.contains("select")) {
			el.classList.remove("select");
			el.classList.add("booked");
		}
		if (el.classList.contains("booked")) {
			arr.push(el.getAttribute("data-id"));
		}
	});

	localStorage.setItem([dayValue, timeValue], JSON.stringify(arr));
};

// удаление================================================
const deleteCurrent = () => {
	const dayValue = document.querySelector("#day").value;
	const timeValue = document.querySelector("#time").value;
	localStorage.removeItem([dayValue, timeValue]);
	generate();
};
const deleteAll = () => {
	localStorage.clear();
	generate();
};

day.addEventListener("change", function () {
	generate();
	let child = document.querySelectorAll(".seats-item");
	child[0].classList.contains("disabled") ? btn.setAttribute("disabled", "disabled") : btn.removeAttribute("disabled");
});
time.addEventListener("change", generate);

parent.addEventListener("click", function (event) {
	if (event.target.classList.contains("seats-item")) {
		event.target.classList.toggle("select");
	}
});

btn.addEventListener("click", bookSeats);
clearCur.addEventListener("click", deleteCurrent);
clearAll.addEventListener("click", deleteAll);
