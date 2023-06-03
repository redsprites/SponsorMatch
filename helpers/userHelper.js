const users = {
    displayUser: async function (id) {
      item = await ax.GET_USER(id);
        $('#loading').hide();
        // $('#btn-edit-blog').attr('href', `edit.html?index=${blog._id}`);
        let el = $('<div>').html(`
          <div class="user-preview">
            <p class="first-name">First Name: ${item.firstName}</p>
            <p class="last-name">Last Name: ${item.lastName}</p>
            <p class="user-name">User Name: ${item.userName}</p>
            <p class="email">Email: ${item.email}</p>
            <p class="internship">Looking for Internship: ${item.internship}</p>
          </div>
        `);
        $('#user-preview').append(el);
        // Call showUserOptions() function after rendering the user profile
        showUserOptions();
      
    },
  };
  