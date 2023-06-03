
const ax = {
  endpoint: 'http://localhost:8080/api/blogs/',
  getCookie: function (name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();      
      if (cookie.indexOf(name + '=') === 0) {
        return cookie.substring((name + '=').length, cookie.length);
      }
    }
    return null;
  },
  GET: async function () {
    try {
      console.log("get called with", this.endpoint);
      const response = await axios.get(`${ax.endpoint}`, {});
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  GET_ONE: async function (id) {
    try {
      const response = await axios.get(`${ax.endpoint}${id}`, {});
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  GET_USER: async function (id) {
    try{
     const response = await axios.get(`http://localhost:8080/api/users/${id}`)
        return response.data;
    }
    catch(error){
      console.log(error);
      throw error;
    }
  },
  GET_COMPANIES: async function(jobTitle) {
    try{
      console.log("axios companies called with" , jobTitle);
      const response = await axios.get(`http://localhost:8080/api/companies/${jobTitle}`);
        return response.data;
    }
    catch(error){
      console.log(error);
      throw error;
    }
  },
    POST: function (data, callback) {
      const token = this.getCookie('token');
      if (!token) {
        console.error('No JWT token found in cookie');
        return;
      }
      axios.post(`${this.endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(function (response) {
        callback(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    },
}
