const API_URL = 'https://disease.sh/v3/covid-19/nyt/usa';

const tableBody = document.querySelector('#covid-table tbody');
const pagination = document.querySelector('.pagination');

let currentPage = 1;
let itemsPerPage = 10;

function loadData() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const items = data.slice(startIndex, endIndex);
            renderTable(items);
            renderPagination(data.length);
        })
        .catch(error => console.error(error));
}

function renderTable(items) {
    let rows = '';
    items.forEach(item => {
        rows += `
      <tr>
        <td>${item.date}</td>
        <td>${item.cases}</td>
        <td>${item.deaths}</td>
        <td>${item.updated}</td>
      </tr>
    `;
    });
    tableBody.innerHTML = rows;
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let pages = '';

    if (currentPage > 1) {
        pages += `<li class="page-item"><a class="page-link" href="#">Previous</a></li>`;
    }

    let startPage, endPage;
    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 1 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
    }

    if (currentPage < totalPages) {
        pages += `<li class="page-item"><a class="page-link" href="#">Next</a></li>`;
    }

    pagination.innerHTML = pages;

    const pageStart = (currentPage - 1) * itemsPerPage + 1;
    const pageEnd = Math.min(pageStart + itemsPerPage - 1, totalItems);
    const pageInfo = document.getElementById('page-info');
    pageInfo.innerHTML = `On page ${currentPage} of ${totalPages}, showing rows ${pageStart} to ${pageEnd} of ${totalItems}`;

    pagination.addEventListener('click', handlePaginationClick);
}



function handlePaginationClick(event) {
    event.preventDefault();

    if (event.target.tagName !== 'A') {
        return;
    }

    if (event.target.textContent === 'Previous') {
        currentPage--;
    } else if (event.target.textContent === 'Next') {
        currentPage++;
    } else {
        currentPage = parseInt(event.target.textContent);
    }

    loadData();
}

function handleItemsPerPageChange(event) {
    itemsPerPage = parseInt(event.target.value);
    currentPage = 1;
    loadData();
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    pagination.addEventListener('click', handlePaginationClick);
    document.querySelector('#items-per-page').addEventListener('change', handleItemsPerPageChange);
});
