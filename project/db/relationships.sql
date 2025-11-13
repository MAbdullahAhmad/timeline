-- Example relationship inserts
INSERT INTO timeline_relationships (parent_id, child_id, sort_order)
VALUES (1, 2, 0), (1, 3, 1), (1, 4, 2);

-- Query children of a parent
SELECT child.*
FROM timeline_relationships rel
JOIN timeline_items child ON child.id = rel.child_id
WHERE rel.parent_id = 1
ORDER BY rel.sort_order;
