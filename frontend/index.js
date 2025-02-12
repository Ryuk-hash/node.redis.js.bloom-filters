const addFilterBtn = document.getElementById('addFilterBtn');
const searchFilterBtn = document.getElementById('searchFilterBtn');
const clearInputBtn = document.getElementById('clearInputBtn');
const apiUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async (e) => {
  try {
    const response = await fetch(`${apiUrl}/bloom/info`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    const info = data?.data?.info;
    if (info) {
      const bloomFilterInfoDiv = document.getElementById('bloomFilterInfo');
      bloomFilterInfoDiv.innerHTML = `
      <p>Capacity: ${info.capacity}</p>
      <p>Size: ${info.size}</p>
      <p>Number of Filters: ${info.numberOfFilters}</p>
      <p>Number of Inserted Items: ${info.numberOfInsertedItems}</p>
      <p>Expansion Rate: ${info.expansionRate}</p>
      `;
    } else throw new Error('Could not find bloom filter info.');
  } catch (err) {
    console.log('Something went wrong with the add request.', err);
  }
});

addFilterBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log('Add button pressed.');
  const addFilterInput = document.getElementById('addFilterInput');
  if (addFilterInput) {
    const addFilterValue = addFilterInput.value;
    if (!addFilterValue) return alert('Please enter a new value to add to filter.');

    try {
      const response = await fetch(`${apiUrl}/${addFilterValue}/add`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      alert(`Added "${addFilterValue}" to the bloom filter?\nAnswer: ${data?.data?.added}.`);
      window.location.reload();
    } catch (err) {
      console.log('Something went wrong with the add request.', err);
    }
  }
});

searchFilterBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log('Search button pressed.');
  const searchFilterInput = document.getElementById('searchFilterInput');
  if (searchFilterInput) {
    const searchFilterValue = searchFilterInput.value;
    if (!searchFilterValue) return alert('Please enter a search value.');

    try {
      const response = await fetch(`${apiUrl}/${searchFilterValue}/search`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      alert(`Does "${searchFilterValue}" exist in the bloom filter?\nAnswer: ${data?.data?.exists}.`);
    } catch (err) {
      console.log('Something went wrong with the search request.', err);
    }
  }
});

clearInputBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Clearing all input fields.');
  const addFilterInput = document.getElementById('addFilterInput');
  const searchFilterInput = document.getElementById('searchFilterInput');
  addFilterInput.value = '';
  searchFilterInput.value = '';
});
