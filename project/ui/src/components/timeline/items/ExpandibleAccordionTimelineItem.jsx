import React, { useState, lazy, Suspense } from 'react';
import {
  Typography, Chip, Box
} from '@mui/material';
// import Timeline from '../Timeline';
import ParentsBreadcrumb from '../../misc/Breadcrumb/Breadcrumb';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { CircularProgress } from '@mui/material';

const LazyTimeline = lazy(() => import('../Timeline'));

export default function ExpandibleAccordionTimelineItem({
  title, note, category, categoryColor, desc, img, url, children, parents, date, level
}) {

  const [showChildren, setShowChildren] = useState(false);

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'primary.main' }}>

      {/* Topbar */}
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
                {date}
              </Typography>
            )}
          </Box>

          {category && (
            <Box
              sx={{
                bgcolor: categoryColor || 'primary.main',
                color: categoryColor ? categoryColor : 'background.default',
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
      
      {/* Split */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left */}
        <Box sx={{ flex: img ? '0 0 60%' : '1 1 100%' }}>
          {/* Title */}
          {title && (
            <Typography sx={{
              mt:2,
              fontWeight:"bold",
              fontSize:30,
            }}>{title}</Typography>
          )}

          {/* Note */}
          {note && (
            <Typography sx={{
              mt:3,
              pb: 1,
              fontSize:20,
            }}>{note}</Typography>
          )}

          {/* Description */}
          {desc && desc.split("\n").map( (d, idx) => (
            <Typography key={idx} varient="p" sx={{
              mt:2,
              fontSize:15,
            }}>{d}</Typography>
          ))}
        </Box>

        {/* Right: image (40%) */}
        {img && (
          <Box sx={{ flex: '0 0 40%', display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              component="img"
              src={img}
              alt={title || 'image'}
              sx={{ width: '100%', height: 'auto', objectFit: 'contain', m: 1 }}
            />
          </Box>
        )}
      </Box>


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
            href="https://example.com"
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
      {showChildren && children && children.length > 0 && (
        <Box sx={{ ml: 1.5, mt: 0, pl: 2, borderLeft: '1px solid', borderColor: 'primary.main' }}>
          <Suspense fallback={<CircularProgress size={16} />}>
            <LazyTimeline items={children} child level={level ? level+1 : 1 } />
          </Suspense>
        </Box>
      )}

    </Box>
  );
}
