'use client';

import { Link } from 'react-router-dom';
import './Paginate.css';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  if (pages <= 1) {
    return null;
  }

  const getPageLink = (pageNum) => {
    if (isAdmin) {
      return `/admin/productlist/${pageNum}`;
    }
    return keyword ? `/search/${keyword}/page/${pageNum}` : `/page/${pageNum}`;
  };

  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(pages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='pagination-container'>
      <div className='pagination-wrapper'>
        {/* Previous Button */}
        {page > 1 && (
          <Link
            to={getPageLink(page - 1)}
            className='pagination-btn pagination-prev'
            aria-label='Previous page'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <polyline points='15 18 9 12 15 6'></polyline>
            </svg>
            <span>Prev</span>
          </Link>
        )}

        {/* Page Numbers */}
        <div className='pagination-numbers'>
          {startPage > 1 && (
            <>
              <Link to={getPageLink(1)} className='pagination-number'>
                1
              </Link>
              {startPage > 2 && (
                <span className='pagination-ellipsis'>...</span>
              )}
            </>
          )}

          {pageNumbers.map((num) => (
            <Link
              key={num}
              to={getPageLink(num)}
              className={`pagination-number ${num === page ? 'active' : ''}`}
              aria-label={`Page ${num}`}
              aria-current={num === page ? 'page' : undefined}
            >
              {num}
            </Link>
          ))}

          {endPage < pages && (
            <>
              {endPage < pages - 1 && (
                <span className='pagination-ellipsis'>...</span>
              )}
              <Link to={getPageLink(pages)} className='pagination-number'>
                {pages}
              </Link>
            </>
          )}
        </div>

        {/* Next Button */}
        {page < pages && (
          <Link
            to={getPageLink(page + 1)}
            className='pagination-btn pagination-next'
            aria-label='Next page'
          >
            <span>Next</span>
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <polyline points='9 18 15 12 9 6'></polyline>
            </svg>
          </Link>
        )}
      </div>

      {/* Page Info */}
      <div className='pagination-info'>
        Page <span className='page-current'>{page}</span> of{' '}
        <span className='page-total'>{pages}</span>
      </div>
    </div>
  );
};

export default Paginate;
