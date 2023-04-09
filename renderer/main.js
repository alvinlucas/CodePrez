const diapoList = document.getElementById('diapo-list');

window.api.importCodePrez((data) => {
  const sections = data.sections;
  for(const section of sections) {
    const li = document.createElement('li');
    li.innerHTML = section;
    diapoList.appendChild(li);
  }

});