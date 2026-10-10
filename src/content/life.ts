/**
 * BEYOND THE TERMINAL — motorcycle gallery + passions.
 *
 * To add a photo: put a web-sized file in public/gallery/, then add an item below.
 * To add a clip: a short muted MP4 (H.264, ~720px wide) as `video`, plus a poster frame as `src`.
 * Strip metadata (GPS!) and blur number plates before adding.
 */

export type GalleryItem = {
  id: string
  /** photo (webp/jpg) in public/gallery */
  src?: string
  /** muted looping clip in public/gallery; `src` is then used as the poster */
  video?: string
  alt: string
  caption: string
  place?: string
  date?: string
  story?: string
  /** CSS object-position, to keep the subject in frame when cropped */
  focus?: string
  shape: 'wide' | 'tall' | 'square'
  placeholder?: boolean
}

/**
 * Real ride media (Oct 2026 upload). Metadata, including GPS, is stripped,
 * number plates are blurred, and the desert clip is trimmed to exclude
 * other people. Places are only what's visible in the frame. Ask Irfan for names.
 * 'river', 'highway-irfan' and 'highway-bike' are AI-enhanced (Gemini colour grade; tail bag swapped and
 * panniers added at Irfan's request). Note: Gemini rendered the Pune distance on the sign in 'highway-bike' as 826 instead of 326.
 */
export const gallery: GalleryItem[] = [
  {
    id: 'misty-trail',
    video: '/gallery/ride-misty-trail.mp4',
    src: '/gallery/ride-misty-trail-poster.jpg',
    alt: 'Irfan in a hi-vis riding jacket on his adventure motorcycle, riding a gravel trail into thick fog',
    caption: 'Into the monsoon mist',
    date: 'Jun 2026',
    story: 'Off-road trail, visibility down to a few metres.',
    focus: '50% 60%',
    shape: 'tall',
  },
  {
    id: 'river',
    src: '/gallery/ride-river-crossing.webp',
    alt: 'Irfan in riding boots and a yellow rain jacket wading across a shallow rocky river with a walking stick, green hills either side',
    caption: 'Wading a monsoon river',
    date: 'Jun 2026',
    story: 'Exploring a rocky river bed in the monsoon.',
    focus: '50% 70%',
    shape: 'tall',
  },
  {
    id: 'clouds',
    src: '/gallery/ride-boots-clouds.webp',
    alt: 'Riding boots and a helmet resting on a rock at a misty viewpoint above the treeline',
    caption: 'Boots off, above the clouds',
    date: 'Jun 2026',
    story: 'A pause at a misty viewpoint.',
    focus: '55% 85%',
    shape: 'tall',
  },
  {
    id: 'highway-irfan',
    src: '/gallery/ride-highway-irfan.webp',
    alt: 'Irfan in full riding gear and helmet beside his motorcycle, a black roll-top tail bag on the rack, under a highway sign for Akkalkot, Mumbai, Pune and Solapur',
    caption: 'Suited up for the highway',
    place: 'Solapur 75 km · Pune 326 km',
    date: 'Jun 2026',
    focus: '40% 50%',
    shape: 'tall',
  },
  {
    id: 'highway-bike',
    src: '/gallery/ride-highway-bike.webp',
    alt: 'Low-angle shot of the adventure motorcycle with a black tail bag and panniers, parked on the roadside under a dramatic cloudy sky',
    caption: 'Loaded for the long haul',
    date: 'Jun 2026',
    focus: '50% 45%',
    shape: 'tall',
  },
  {
    id: 'desert-quad',
    video: '/gallery/ride-desert-quad.mp4',
    src: '/gallery/ride-desert-quad-poster.jpg',
    alt: 'A rider on a red quad bike carving across rippled desert sand dunes',
    caption: 'Dune run on a quad',
    date: 'Dec 2023',
    story: 'Swapping two wheels for four on the sand.',
    focus: '50% 55%',
    shape: 'tall',
  },
]

/** Ride log: dated from the media itself. */
export const rideLog = [
  { date: 'Jun 2026', title: 'Monsoon tour', note: 'Highway miles, misty off-road trails and a river crossing.' },
  { date: 'Dec 2023', title: 'Desert dunes', note: 'Quad biking across the sand.' },
]

export const passions = [
  {
    id: 'touring',
    title: 'Long-distance motorcycle touring',
    body: 'An ADV bike and roads I haven’t ridden yet. Planning a long ride feels a lot like planning a migration: fuel, fallbacks and weather.',
    glyph: 'road',
  },
  {
    id: 'games',
    title: 'Story-driven games',
    body: 'Half-Life 2, Far Cry, Prince of Persia. I like worlds you explore rather than just finish.',
    glyph: 'game',
  },
  {
    id: 'community',
    title: 'Showing up for people',
    body: 'Two years as a Deshpande Foundation leader and ten months with the Indian Red Cross Society, Karnataka. I’ve also helped find blood donors for strangers in Bengaluru.',
    glyph: 'heart',
  },
  {
    id: 'learning',
    title: 'Learning in public',
    body: 'Sharing my DevOps → DevSecOps roadmap openly and asking practitioners which tools I should swap out.',
    glyph: 'spark',
  },
  {
    id: 'products',
    title: 'Products, music, film & digital art',
    body: 'Product thinking and startup ideas, plus a steady supply of music, movies and digital art.',
    glyph: 'frame',
  },
]
