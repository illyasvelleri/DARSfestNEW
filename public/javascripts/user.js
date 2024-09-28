
/* logoutCard*/

document.querySelector('.user-drop-down').addEventListener('click', function () {
    const dropdownMenu = document.querySelector('.sign-out-card');
    dropdownMenu.style.display = dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '' ? 'block' : 'none';
  });
  
  // Hide the dropdown when clicking outside
  document.addEventListener('click', function (event) {
    const isClickInside = document.querySelector('.user-drop-down').contains(event.target);
    const dropdownMenu = document.querySelector('.sign-out-card');
    if (!isClickInside && dropdownMenu.style.display === 'block') {
      dropdownMenu.style.display = 'none';
    }
  });
  
  
  /* notification*/
  document.querySelector('.notification-drop-down').addEventListener('click', function () {
    const dropdownMenu = document.querySelector('.notification');
    dropdownMenu.style.display = dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '' ? 'block' : 'none';
  });
  
  // Hide the dropdown when clicking outside
  document.addEventListener('click', function (event) {
    const isClickInside = document.querySelector('.notification-drop-down').contains(event.target);
    const dropdownMenu = document.querySelector('.notification');
    if (!isClickInside && dropdownMenu.style.display === 'block') {
      dropdownMenu.style.display = 'none';
    }
  });