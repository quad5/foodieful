
'use client'

import { usePathname, useRouter } from 'next/navigation';
import {
  Fragment,
  useState
} from 'react';

import {
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import theme from '@/theme';



export default function DropDownMenu(props) {
  const pathname = usePathname()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (link) => {
    setAnchorEl(null);
    if (typeof (link) === "string") {
      router.push(link)
    }
  };

  const list = props.menu.map(o => {
    return <MenuItem
      key={o.title}
      onClick={() => handleClose(o.link)}
      selected={!!pathname && o.link === pathname}
      sx={{
        '&.Mui-selected': { backgroundColor: theme.palette.primary.main },
        ":hover": {
          backgroundColor: theme.palette.secondary.main,
          color: 'black'
        },
      }}>
      {o.title}
    </MenuItem>
  })

  return (
    <Fragment>
      <Button
        endIcon={!props.singleLevel && <ExpandMore />}
        onClick={props.singleLevel ? props.fn : handleClick}
        sx={{
          backgroundColor: 'common.black',
          color: 'white',
          ":hover": {
            backgroundColor: "white",
            color: 'black'
          }
        }}
        type="submit"
        variant='contained'>
        {props.menuName}
      </Button>

      {!props.singleLevel && <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}>
        {list}
      </Menu>}
    </Fragment>
  );
}
