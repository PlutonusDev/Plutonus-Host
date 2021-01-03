const toast = Swal.mixin({
	toast: true,
	position: "bottom-end",
	showConfirmButton: false,
	timer: 5000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.addEventListener("mouseenter", Swal.stopTimer);
		toast.addEventListener("mouseleave", Swal.resumeTimer);
	}
});

$(document).load(function () {
	toast.fire({
		icon: "success",
		title: "test"
	});
});
