function showUserOptions() {

	if (!document.cookie.includes('token')) {
		document.querySelector('#btn-edit-blog').style.display = 'none';
		document.querySelector('#btn-delete-blog').style.display = 'none';
		console.log("user not signd in");
		// Add other buttons or elements you want to show for signed-in users
	}
}