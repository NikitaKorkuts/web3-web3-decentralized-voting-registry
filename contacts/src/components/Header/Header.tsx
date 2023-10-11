import React, {useState} from 'react';
import {Divider, Grid, IconButton, InputBase, Paper, Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {Link} from 'react-router-dom';
import {AccountCircle} from '@mui/icons-material';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './header.css'

export const Header = () => {
  const { page, limit, search } = useSelector((store) => store.surveys);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(search);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?page=${page}&limit=${limit}&search=${inputValue}`);
  }

  return (
    <header>
        <Grid
          container
          sx={{padding: {xs: '0 5px', sm: '0 10%'}}}
        >
          <Grid
            item
            xs={10}
            sm={11}
            sx={{display: 'flex', alignItems: 'center'}}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: 'white', display: { xs: 'none', sm: 'block' }, marginRight: '25px' }}
            >
              <Link style={{textDecoration: 'none', color: 'white'}} to='/'>
                Quiz
              </Link>
            </Typography>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            >

              <InputBase
                width='100px'
                sx={{ ml: 1, flex: 1}}
                placeholder="Найти опрос"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <Link
                to={`/?page=${page}&limit=${limit}&search=${inputValue}`}
              >
                <IconButton
                  type="submit"
                  sx={{ p: '10px' }}
                  aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              className='accountCircle'
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="light"
            >
              <AccountCircle />
            </IconButton>
          </Grid>
        </Grid>


    </header>
  );
};

