import React from 'react';
import { PaginationItem, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './pagination.css';

export const SurveysPagination = () => {
  const { totalCount, page, limit, search } = useSelector((state) => state.surveys);

  const count = Math.ceil(totalCount / limit);

  if (count >= 2) {
    return (
      <Pagination
        className='pagination'
        page={page}
        count={count}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/?page=${item.page}&limit=${limit}&search=${search.join(' ')}`}
            {...item}
          />
        )}
      />
    )
  }
};
