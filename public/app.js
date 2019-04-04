let sendFileToServer = function (name, file) {
  var data = new FormData();
  data.append('name', name);
  data.append('image', file);

  fetch('/posts', {
    method: 'POST',
    body: data
  }).then(function () {
    console.log('file sent');
  });
};

let app = new Vue({
  el: '#app',
  data: {
    name: '',
    file: null
  },
  methods: {
    selectFile: function (event) {
      this.file = event.target.files[0];
    },
    sendFile: function () {
      sendFileToServer(this.name, this.file);
    }
  }
});
