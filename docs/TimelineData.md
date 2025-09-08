## TimelineData.md

A concise guide to add your project history to the **Timeline** app (free & open-source).

### Fields (schema)
- **id** *(required, string, unique)* — stable identifier (e.g., `"11"`).
- **date** *(required, string)* — shown as-is (e.g., `"2025-09-01"` or `"1 Sep, 25"`).
- **level** *(required, number)* — hierarchy level: `0`=root, `1`=child, `2`=sub-child…
- **title** *(string)* — card title.
- **category** *(string)* — tag or type (e.g., Project, Milestone).
- **note** *(string)* — short badge/label.
- **desc** *(string)* — longer description.
- **children** *(array|string)* — child ids; accept JSON array (`["21","22"]`) **or** pipe string (`21|22`) **or** comma string.
- **img** *(string URL)* — image to display on the card.
- **img_link** *(string URL)* — **optional**; where to go when the image is clicked.
> You may leave any field empty **except** `id`, `date`, and `level`.

---

### Choose a data source (fastest → simplest)
1. **Local file** in `/public`  
   - `items.json`, `items.csv`, or `items.xlsx`
2. **Public URL**  
   - `items.url` file containing a direct link to a public `.json/.csv/.xlsx`
3. **Google Sheets (public “Anyone with link”)**  
   - `/sheets.json`:
   ```json
   { "mode": "csv", "public_link": "https://docs.google.com/spreadsheets/d/<SID>/edit?usp=sharing", "sheet": "Sheet1" }

4. **Google Drive (public)**

   * `/drive.json` (examples):

   ```json
   { "kind": "sheet", "file_id": "<SID>", "ext": "csv", "sheet": "Sheet1" }
   ```

**Provider selection (priority):** local files → URL → Sheets → Drive.
Override via `?method=json|csv|xlsx|url|gsheet|gdrive` or `VITE_TIMELINE_DATA_METHOD`.

---

### JSON example (`/public/items.json`)

```json
[
  {
    "id": "11",
    "title": "Timeline",
    "category": "Project",
    "note": "A tool to showcase your work",
    "desc": "Local app to present achievements as nested timeline cards.",
    "date": "2025-09-01",
    "children": ["21"],
    "level": 0,
    "img": "https://example.com/preview.png",
    "img_link": "https://example.com/case-study"
  },
  {
    "id": "21",
    "title": "First Release",
    "category": "Milestone",
    "date": "2025-09-02",
    "level": 1
  }
]
```

### CSV example (`/public/items.csv`)

```csv
id,title,category,note,desc,date,children,level,img,img_link
11,Timeline,Project,A tool to showcase your work,"Nested cards across history",2025-09-01,"21",0,https://example.com/preview.png,https://example.com/case-study
21,First Release,Milestone,,,2025-09-02,,1,,
```

> **children** accepts `[]`, `21|22`, or `"21,22"` (quoted).

### Google Sheets (columns)

Create a public sheet with columns matching the field names:
`id, title, category, note, desc, date, children, level, img, img_link`
Then use `/sheets.json` (above). The app will parse rows exactly like CSV.

---

### Tips

* Keep `id` stable; use strings for safety.
* `level` controls layout depth; children normally have `level = parent + 1`.
* Missing/invalid source shows a console error and alert; fix your config or file path.
