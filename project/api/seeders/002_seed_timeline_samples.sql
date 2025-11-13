SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE timeline_relationships;
TRUNCATE TABLE timeline_items;
SET FOREIGN_KEY_CHECKS=1;

INSERT INTO timeline_items 
(id, title, category, category_color, note, img, img_link, description, event_date, date_label, level) VALUES
(1, 'Started Timeline App', 'Project', '#ffffff', 'Initial concept and planning', 'https://picsum.photos/300?1', NULL, 'Sketched core idea, screens and workflow.', '2024-01-05', '05 Jan 2024', 0),
(2, 'UI Wireframes', 'Design', '#ffffff', 'Created first wireframes', 'https://picsum.photos/300?2', NULL, 'Built clean layout for timeline scrolling and grouping.', '2024-01-12', '12 Jan 2024', 1),
(3, 'Database Schema', 'Backend', '#ffffff', 'Designed MySQL tables', 'https://picsum.photos/300?3', NULL, 'Created items, categories and relationships schema.', '2024-01-18', '18 Jan 2024', 1),
(4, 'Timeline Rendering Engine', 'Frontend', '#ffffff', 'Implemented dynamic UI', 'https://picsum.photos/300?4', NULL, 'Built vertical timeline with levels and connectors.', '2024-02-04', '04 Feb 2024', 2),
(5, 'Image & Media Support', 'Feature', '#ffffff', 'Added media previews', 'https://picsum.photos/300?5', NULL, 'Enabled external image URLs and optional video links.', '2024-02-15', '15 Feb 2024', 2),
(6, 'Public Launch', 'Milestone', '#ffffff', 'Released MVP', 'https://picsum.photos/300?6', 'https://example.com/demo', 'First public version shipped with CRUD and relationships.', '2024-03-01', '01 Mar 2024', 0);

INSERT INTO timeline_relationships (parent_id, child_id, sort_order) VALUES
(1, 2, 0),
(1, 3, 1),
(3, 4, 0),
(4, 5, 0),
(1, 6, 2);
