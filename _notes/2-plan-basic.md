## Plan for Phase-1: Basic

Take a look at following draft for basic phase:

#### Theme:
- Dark Mode (white on black)
- Minimalist Modern Tech-related Design
- A professional sans-serif font
- Cut-edge, sharpe rectangular design
- Transitions (animations)

#### Skillset:
- Basic: `HTML` + `CSS` + `JavaScript`
- Framework: `ReactJS`
- Libraries: `MaterialUI`, `GSAP`
- Others: router, accordion, animations

#### Architecture

- **Routes**: `index.js` will render `App` with [`ESRouter`](https://github.com/EigenSol/core-reactjs/blob/main/core/util/components/ESRouter/ESRouter.jsx) (uses json routes from `/routes/` dir)
    - `/` for welcome 
    - `/filter` to filter categorically
    - `/timeline` (**primary**) to render timeline items from `dist/timeline.json` 
- **Timeline Component(s)**: Each timeline item can have a different design:
    - `components/timeline/items/ExpandibleAccordionTimelineItem.jsx`: will show an image, title, category label, desc and a learn more button. 
    - for starter, we're only using one timeline-item component atm.
    - Parent component `components/timeline/Timeline.jsx` itself can recursively render its children.

## Next-Up

As we already have the plan, now its time to develop [UI](../project/ui).