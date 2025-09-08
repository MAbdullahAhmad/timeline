import React, { useState, lazy, Suspense } from 'react';

import {
  Typography, Box, CircularProgress, Collapse
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const LazyTimeline = lazy(() => import('@/components/Timeline/Timeline'));

export default function Children({
  id, children, level, url='/app'
}){
  const [showChildren, setShowChildren] = useState(false);

  return (
    <>
      {/* Children controls */}
      {children && children.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Plus: expand to load/render timeline */}
          <Box
            onClick={() => setShowChildren((s) => !s)}
            sx={{
              width: 24, height: 24, border: '2px solid', borderColor: 'primary.main',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={showChildren ? 'Hide children' : 'Show children'}
          >
            {showChildren ? (
              <RemoveIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            ) : (
              <AddIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            )}
          </Box>

          <Box
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              // width: 24, height: 24, border: '1px solid', borderColor: 'primary.main',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none'
            }}
            title="Open in new tab"
          >
            <OpenInNewIcon sx={{ fontSize: 30, color: 'primary.main' }} />
          </Box>

          {level ? (
            <Typography sx={{
              fontSize:15,
              fontWeight:'bold'
            }}>#L{level}</Typography>
          ) : ''}
        </Box>
      )}

      {/* Lazy accordion content */}
      {children && children.length > 0 && (
        <Collapse in={showChildren} timeout={500} mountOnEnter unmountOnExit>
          <Box sx={{ ml: 1.5, mt: 0, pl: 2, borderLeft: '1px solid', borderColor: 'primary.main' }}>
            <Suspense fallback={<CircularProgress size={16} />}>
              <LazyTimeline focusId={id} level={level ? level+1 : 1 } child />
            </Suspense>
          </Box>
        </Collapse>
      )}
    </>
  )
}
