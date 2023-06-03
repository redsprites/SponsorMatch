function displayErrorPage() {
	$("body").html(`<h1 style="color: #555; font-size: 50px; margin-top: 50px; text-align: center; font-family: Arial, sans-serif">Error 404: Page not found</h1>
	<p style = "font-size: 20px; color: #888; margin-bottom: 50px; text-align: center; font-family: Arial, sans-serif">Sorry, the page you're looking for doesn't exist.</p>`);
}

function displayPaginationButtons(index, totalItems) {
	const totalPages = Math.ceil(totalItems / 10);
	var btns = $("#btns");
	btns.append(`
	<div style="padding-bottom: 20px; display: flex; justify-content: space-evenly; align-items: center">
	<a href="companies.html?page=${(index - 1) < 0 ? (totalPages - 1) : (index - 1)}" role="button" class="btn btn-primary text-uppercase">Previous</a>
	<a href="companies.html?page=${(parseInt(index) + 1) >= totalPages ? 0 : (parseInt(index) + 1)}" role="button" class="btn btn-primary text-uppercase">Next</a>
	</div>`);
}

function displayCompany(company) {
	let el = $('<div>').html(`
		<div class="post-preview">
			<a href="${company.link}">
				<h2 class="post-title">${company.title}</h2>
				<h3 class="post-subtitle">Company: ${company.company}</h3>
				<p class="post-subtitle">Description: ${company.description}</p>
				<p class="post-subtitle">Published Date: ${company.pubDate}</p>
			</a>	
		</div>
	`);
	$('#post-preview').append(el);
}

const companies = {
	index: function (jobTitle) {
		console.log("index Called");
		$('#blogs').empty();
		$('#post-preview').empty();
		$('#btns').empty();
		$('#blogs').html('Loading Companies, please wait...');

		// Create an EventSource instance
		const es = new EventSource(`http://localhost:8080/api/companies/${jobTitle}`);

		es.onmessage = function(event) {
			const company = JSON.parse(event.data);
			displayCompany(company);
		}

		es.onerror = function(err) {
			console.error('Error:', err);
			$('#blogs').html('Error loading companies.');
			es.close();
		}
	},
};
