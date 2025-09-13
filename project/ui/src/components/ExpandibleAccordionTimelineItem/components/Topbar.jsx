import React from 'react';

import {
  Typography, Box
} from '@mui/material';

import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ParentsBreadcrumb from '@/components/misc/Breadcrumb/Breadcrumb';
import date_2_dmy from '@/util/functions/date_2_dmy';

export default function Topbar({
  parents, children, date, category, categoryColor
}){
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
      {/* Left: Parents */}
      <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
        {parents && <ParentsBreadcrumb parents={parents} />}
      </Box>

      {/* Right: category pill, children icon, date */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          {children && children.length > 0 && (
            <>
              <KeyboardReturnIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography sx={{
                fontSize:10,
                fontWeight:'bold',
                marginLeft: '-8px'
              }}>{children.length}</Typography>
            </>
          )}
          

          {date && (
            <Typography sx={{ fontSize: 10, fontWeight: 'bold', color: 'text.primary' }}>
              {Object.values(date_2_dmy(new Date(date))).join(' ')}
            </Typography>
          )}
        </Box>

        {category && (
          <Box
            sx={{
              bgcolor: categoryColor || 'primary.main',
              color: (theme) =>
                theme.palette.getContrastText(categoryColor || theme.palette.primary.main) === theme.palette.common.white
                  ? theme.palette.primary.main
                  : theme.palette.background.default,
              height: 20,
              px: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 'bold', lineHeight: 1 }}>
              {category}
            </Typography>
          </Box>
        )}

      </Box>
    </Box>
  );
}
