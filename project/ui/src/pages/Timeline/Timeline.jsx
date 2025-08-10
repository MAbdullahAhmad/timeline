import React from 'react';
import tl_items from '@dist/timeline.json';
import TimelineView from '@/components/timeline/Timeline';

export default function Timeline() {
  return <TimelineView items={tl_items} />;
}
