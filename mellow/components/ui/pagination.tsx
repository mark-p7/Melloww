import React from 'react';

interface PaginationProps {
  nPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ nPages, currentPage, setCurrentPage }) => {
    const pageNumbers = Array.from({ length: nPages }, (_, index) => index + 1);

    // ...
    
    for (let i = 0; i < pageNumbers.length; i++) {
      const pgNumber = pageNumbers[i];
    
      const isActive = currentPage === pgNumber;
      const liClassName = `page-item ${isActive ? 'active' : ''}`;
    
      return (
        <li key={pgNumber} className={liClassName}>
          <a
            onClick={() => setCurrentPage(pgNumber)}
            className="page-link"
            href="#"
          >
            {pgNumber}
          </a>
        </li>
      );
    }

  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <a className="page-link" onClick={goToPrevPage} href="#">
            Previous
          </a>
        </li>
        {pageNumbers.map((pgNumber) => (
          <li key={pgNumber} className={`page-item ${currentPage === pgNumber ? 'active' : ''}`}>
            <a
              onClick={() => setCurrentPage(pgNumber)}
              className="page-link"
              href="#"
            >
              {pgNumber}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a className="page-link" onClick={goToNextPage} href="#">
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
