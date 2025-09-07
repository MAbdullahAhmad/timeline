import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';

import ExpandibleAccordionTimelineItem from '@/components/ExpandibleAccordionTimelineItem/ExpandibleAccordionTimelineItem';
import ExpandButton from '@/components/misc/ExpandButton/ExpandButton';
import TimeAside from '@/components/TimeAside/TimeAside';

export default function Timeline({ items = [], child = false, level=1 }) {
  const root = !child;

  const scrollRef = useRef(null);
  const itemRefs = useRef([]);

  const [openAside, setOpenAside] = useState(true);
  const [date, setDate] = useState(new Date());

  const ioRef = useRef(null);

  useEffect(() => {
    if (!root) return;

    const rootEl = scrollRef.current;
    if (!rootEl) return;
    
    const obs = new IntersectionObserver(
      (entries) => {
        // pick the visible item closest to the top (after the 25px line)
        const topMost = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (topMost) {
          const idx = Number(topMost.target.dataset.idx);
          const d = new Date(items[idx]?.date);
          if (!Number.isNaN(d.getTime())) setDate(d);
        }
      },
      {
        root: rootEl,
        rootMargin: "0px 0px -100% 0px", // trigger near the top line
        threshold: 0
      }
    );

    ioRef.current = obs;
    itemRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();

  }, [items, openAside, root]);

  itemRefs.current = useMemo(
    () => (root ? Array(items.length).fill(null) : []),
    [items.length, root]
  );

  return (
    <Box
      ref={root ? scrollRef : null}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flex: '1 1 0',
        ...(root && { overflowY: 'auto' })
      }}
    >
      {/* Main content (75% or 100% if child=true or aside closed) */}
      <Box
        sx={{
          flex: child ? '1 1 100%' : openAside ? '1 1 75%' : '1 1 100%',
          alignItems: 'stretch',
          p: child ? 0 : 2,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.map((item, idx) => (
            <ExpandibleAccordionTimelineItem
              key={idx}
              level={level}
              attach={root && openAside}
              ref={(el) => {
                itemRefs.current[idx] = el;
                if (el) el.dataset.idx = String(idx); // for lookup in IO callback
              }}
              {...item}
            />
          ))}
        </Box>

        { root && <ExpandButton open={openAside} onClick={() => setOpenAside(!openAside)} />}
      </Box>

      {/* Aside panel (hidden if child=true) */}
      {root && openAside && <TimeAside open={openAside} date={date} />}
    </Box>
  );
}
