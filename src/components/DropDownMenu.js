
'use client'

import { usePathname } from 'next/navigation';

import {
  Fragment,
  useState
} from 'react';

import ExpandMore from '@mui/icons-material/ExpandMore';

import {
  Button,
  Menu,
} from '@mui/material';

import { hyphenateText } from '@/app/lib/utils'

import theme from '@/theme';


export default function DropDownMenu(props) {
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const list = props.menu.map(o => {
    // return <MenuItem
    return <Button
      className={hyphenateText(o.title).toLowerCase()}
      key={o.title}
      href={o.link}
      onClick={() => handleClose(o.link)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        color: 'black',
        ":hover": {
          backgroundColor: theme.palette.secondary.main,
        },
        // ".MuiButton-startIcon": {
        //   display: !!pathname && o.link === pathname ? 'flex' : 'none',
        //   justifyContent: 'flex-start'
        // }

      }}
    // SAVE - Below is MenuItem's sx. Has issue using MenuItem when going to VendorProfile (edit -> view)
    // sx={{
    //   '&.Mui-selected': {
    //     // alignContent: 'center',
    //     backgroundColor: 'white',
    //     display: "list-item",
    //     listStylePosition: 'inside',
    //     listStyleType: "disc",
    //     ":hover": {
    //       backgroundColor: theme.palette.primary.main,
    //     }
    //   },
    //   ":hover": {
    //     backgroundColor: theme.palette.primary.main,
    //   }
    // }}
    >
      {o.title}
    </Button>
    {/* </MenuItem> */ }
  })

  return (
    <Fragment>
      <Button
        className={`drop-down-menu-${hyphenateText(props.menuName).toLowerCase()}`}
        endIcon={!props.singleLevel && <ExpandMore />}
        onClick={props.singleLevel ? props.fn : handleClick}
        size='large'  // Need this to be large and width to make other buttons same size 
        sx={{
          backgroundColor: 'black',
          color: 'white',
          ":hover": {
            backgroundColor: "white",
            color: 'black'
          },
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
