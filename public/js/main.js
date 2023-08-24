const borrowButtons = document.querySelectorAll('.borrow-button');

borrowButtons.forEach(button => {
  button.addEventListener('click', () => {
    const bookId = button.parentNode.dataset.id;

    fetch(`/borrow/${bookId}`, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const statusElement = button.parentNode.querySelector('.status');
          statusElement.textContent = 'On loan';
          button.disabled = true;
        }
      })
      .catch(error => {
        console.error('Error borrowing book:', error);
      });
  });
});