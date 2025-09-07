import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';

import ExpandibleAccordionTimelineItem from '@/components/ExpandibleAccordionTimelineItem/ExpandibleAccordionTimelineItem';
import ExpandButton from '@/components/misc/ExpandButton/ExpandButton';
import TimeAside from '@/components/TimeAside/TimeAside';

export default function Timeline({ items = [], child = false, level=1 }) {
  const root = !child;

  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const offsetsRef = useRef([]);

  const [openAside, setOpenAside] = useState(true);
  const [date, setDate] = useState(new Date());

  // Cache offsets (recompute on deps change)
  const recomputeOffsets = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return [];
    const offsets = itemRefs.current.map((n) => (n ? n.offsetTop : 0));
    return offsets;
  }, []);

  useEffect(() => {
    offsetsRef.current = recomputeOffsets();
  }, [recomputeOffsets, items, openAside]);

  useEffect(() => {
    const onResize = () => (offsetsRef.current = recomputeOffsets());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recomputeOffsets]);

  const onScroll = () => {
    // Parent scrolltop
    const sc = scrollRef.current;
    if (!sc || items.length === 0) return;
    const threshold = sc.scrollTop + 25;

    // Current item (via offsets)
    const offs = offsetsRef.current;
    let idx = 0;
    for (let i = 0; i < offs.length; i++) {
      if (offs[i] <= threshold) idx = i;
      else break;
    }

    // Get Current Date
    const d = new Date(items[idx]?.date);
    if (!Number.isNaN(d.getTime())) setDate(d);
  };

  itemRefs.current = useMemo(() => Array(items.length).fill(null), [items.length]);

  return (
    <Box
      ref={scrollRef}
      onScroll={onScroll}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        overflow: 'scroll',
        flex: '1 1 0',
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
              ref={(el) => (itemRefs.current[idx] = el)}
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
