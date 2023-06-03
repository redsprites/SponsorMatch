const blogs = {

	index: async function () {
	
		$('#blogs').html('Loading Blogs, please wait...');
		try{
			var btns = $("#btns");
			var index = getAllUrlParams().page;
			if (index == null || index == "nan") {
				index = 0;
			}
			var items = await ax.GET() 
			if (index >= (items.length / 4) || index < 0 || index == null) {
				$("body").html(`<h1 style="color: #555; font-size: 50px; margin-top: 50px; text-align: center; font-family: Arial, sans-serif">Error 404: Page not found</h1>
			 	<p style = "font-size: 20px; color: #888; margin-bottom: 50px; text-align: center; font-family: Arial, sans-serif">Sorry, the page you're looking for doesn't exist.</p>`);
			}
			btns.append(`
			 <div style="padding-bottom: 20px; display: flex; justify-content: space-evenly; align-items: center">
			 <a href="index.html?page=${(index - 1) < 0 ? ((items.blogs.length / 4) - 1) : (index - 1)}" role="button" class="btn btn-primary text-uppercase">Previous</a>
			 <a href="index.html?page=${(parseInt(index) + 1) >= (items.blogs.length / 4) ? 0 : (parseInt(index) + 1)}" role="button" class="btn btn-primary text-uppercase">Next</a>
			 </div>`);
			
				$('#blogs').empty();
				var endIndex = (index * 4) + items.blogs.length % 4;
				if (endIndex > items.length) {
					endIndex = items.length;
				}
				var innerItem = items.blogs;
				
				for (let i = index * 4; i < endIndex; i++) {
					let blog = innerItem[i];
					let el = $('<div>').html(`
						<div class="post-preview">
							<a href="post.html?index=${blog._id}">
								<h2 class="post-title">${blog.title}</h2>
								<h3 class="post-subtitle">${blog.subtitle}</h3>	
							</a>	
							<p class="post-meta">
							Posted by <a href="user.html?index=${blog.author._id}">${blog.author.userName}</a>
							on ${new Date(blog.date).toLocaleDateString()}
							</p>	
						</div>
					`);
					$('#post-preview').append(el);
				}
			}
		catch(error){
			console.log('Error fetching data:', error);
		}
	},
	detail: async function (id) {
		try{
			item = await ax.GET_ONE(id);
			$('#loading').hide();
			$('#post-title').text(item.title);
			$('#post-sub-title').text(item.subtitle);
			const user =  await ax.GET_USER(item.author._id);
			userName = user.userName;
				$('#blog-name').get(0).innerHTML = `
		  	Posted by <a id="blog-name" href="user.html?index=${item.author._id}"> ${userName} </a> 
			on <span id="blog-date"></span>`;
				$('#blog-text').get(0).innerHTML = (item.content);
				$('#blog-date').text(new Date(item.date).toLocaleDateString());
				$('#btn-edit').attr('href', `edit.html?index=${blog._id}`);
				let deleteButton = $('#btn-delete');
				deleteButton.on('click', function () {
					database.delete(blogs.documentID, index);
				});
				if (item.hasOwnProperty('comments')) {
					for (let i = 0; i < item.comments.length; i++) {
						let comment = item.comments[i];
						let el = $('<div>').html(`
			  <div>
					  <em>${comment.comment}</em>
				  <blockquote>
				  ${comment.firstName} ${comment.lastName} on ${comment.datePosted}
				  </blockquote>
				  <div class="comment-actions">
				  		<button class="btn btn-outline-primary btn-sm" class="delete-button" id="${comment.commentID}-delete-button">Delete</button>
						<button class="btn btn-outline-primary btn-sm" class="like-button" id="${comment.commentID}-like-button">Like</button>
						<span class="likes-count" id="${comment.commentID}-likes-count" style="font-size:medium">${comment.likes}</span>
				  </div>
				  <hr />
			  </div>
		  `);
						$('#display-comments').append(el);
						// Add like button functionality
						let deleteButton = $(`#${comment.commentID}-delete-button`);
						let likeButton = $(`#${comment.commentID}-like-button`);
						let likesCount = $(`#${comment.commentID}-likes-count`);

						likeButton.click(function () {
							comment.likes++;
							database.updateComment(blogs.documentID, index, comment.commentID, comment);
							likesCount.text(comment.likes);
						});
						deleteButton.click(function () {
							database.deleteComment(blogs.documentID, index, comment.commentID, comment);
						});
					}
				}
			}
			catch(error){
				console.log(error);
			}
		
	},
	create: function () {
		if (!document.cookie.includes('token')) {
			location.href = 'signin.html';
		} else {
			$('form').on('submit', function (e) {
				e.preventDefault();
				// Assuming you have the userId available

				let title = $('form input[name=title]');
				let subTitle = $('form input[name=subTitle]');
				let blogContent = $('form textarea[name=blog]');
				const date = new Date();
				const todaysDate = date.toLocaleDateString();

				// Create a new blog object
				let newBlog = {
					title: title.val(),
					subTitle: subTitle.val(),
					content: blogContent.val(),
					date: todaysDate,
				};

				// Send the new blog data to your server using the POST method
				ax.POST(newBlog, function (response) {
					// console.log('Blog created:', response);
					location.href = "post.html?index=" + response.blog._id;
				});
			});
		}
	},
	update: function (index) {
		database.detail(blogs.documentID, index, function (item) {
			$('#loading').hide();
			$('input[name=firstName]').val(item.firstName);
			$('input[name=lastName]').val(item.lastName);
			$('input[name=title]').val(item.title);
			$('input[name=subTitle]').val(item.subTitle);
			$('textarea[name=blog]').val(item.blog);

			$('form').submit(function (e) {
				e.preventDefault();
				let firstName = $('input[name=firstName]').val();
				let lastName = $('input[name=lastName]').val();
				let title = $('input[name=title]').val();
				let subTitle = $('input[name=subTitle]').val();
				let userName = $('form input[name=userName]').val();
				let email = $('form input[name=email]').val();
				let internship = $('form input[name=internship]:checked').val();
				let blog = $('textarea[name=blog]').val();
				const date = new Date()
				const todaysDate = date.toLocaleDateString();
				let newBlog = {
					firstName: firstName,
					lastName: lastName,
					title: title,
					subTitle: subTitle,
					userName: userName,
					email: email,
					internship: internship,
					blog: blog,
					blogDate: todaysDate
				};
				database.update(blogs.documentID, index, newBlog);
			});
		});
	},
	addComment: function (index) {
		$('#add-comment-form').submit(function (e) {
			e.preventDefault();
			let firstName = $('input[name=firstName]').val();
			let lastName = $('input[name=lastName]').val();
			let comment = $('textarea[name=comment]').val();
			const date = new Date()
			const todaysDate = date.toLocaleDateString();
			let newComment = {
				firstName: firstName,
				lastName: lastName,
				comment: comment,
				datePosted: todaysDate,
				likes: 0
			};

			database.addComment(blogs.documentID, index, newComment, function (commentID) {

				// Add like button functionality
				let likeButton = $(`#${commentID}-like-button`);
				let likesCount = $(`#${commentID}-likes-count`);
				let deleteButton = $(`#${commentID}-delete-button`);

				likeButton.click(function () {
					newComment.likes++;
					database.updateComment(documentID, index, commentID, newComment);
					likesCount.text(newComment.likes);
				});

				deleteButton.click(function () { // change onclick to click
					database.deleteComment(blogs.documentID, index, commentID); // use blogs.documentID instead of documentID
				})
			});
		});
	},
	showUserOptions: function () {
		if (userIsSignedIn()) {
			document.querySelector('#btn-edit-blog').style.display = 'inline-block';
			document.querySelector('#btn-edit-blog').style.display = 'inline-block';
			// Add other buttons or elements you want to show for signed-in users
		}
		else {
			console.log("user not signd in");
		}
	}
};
