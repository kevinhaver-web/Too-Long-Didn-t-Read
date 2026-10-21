export interface BookQuoteItem {
  page: number;
  quote: string;
  realWorldContext: string;
  strategicDirection: string;
  year?: string;
}

export interface BookCatalog {
  id: string;
  title: string;
  author: string;
  year: string;
  quotes: BookQuoteItem[];
}

export const BOOK_CATALOGS: BookCatalog[] = [
  {
    id: 'the-creative-act',
    title: 'The Creative Act',
    author: 'Rick Rubin',
    year: '2023',
    quotes: [
      {
        page: 24,
        quote: 'The object isn’t to make art, it’s to be in that wonderful state which makes art inevitable.',
        realWorldContext: 'Rubin produced Slayer, Johnny Cash, and Adele without touching instruments, simply sitting in the studio listening for what did not belong.',
        strategicDirection: 'Tune yourself to notice what culture is already whispering. Strip away the urge to force an outcome—strategy is an antenna, not a factory.',
      },
      {
        page: 118,
        quote: 'Rules are limitations disguised as wisdom.',
        realWorldContext: 'Apple launched the iPod by ignoring the consumer tech rule of listing gigabytes and storage specifications, simply stating "1,000 songs in your pocket."',
        strategicDirection: 'Category best practices create sea-of-sameness. Question every rule inherited from legacy client decks; innovation happens by violating conventions everyone else treats as sacred.',
      },
      {
        page: 247,
        quote: 'The work is never finished, only abandoned.',
        realWorldContext: 'Nike’s "Just Do It" was written in minutes on a scrap of paper, not refined through twenty rounds of committee revisions.',
        strategicDirection: 'Strategists waste weeks polishing decks that add zero incremental insight. Commit to the core strategic tension early and let reality test it.',
      },
      {
        page: 61,
        quote: 'Look for what you notice but no one else sees.',
        realWorldContext: 'Dove launched the Real Beauty platform after noticing that 98% of women felt alienated by fashion advertising representations.',
        strategicDirection: 'The best strategic insights do not live in client data portals. They come from observing idiosyncratic human behaviors that other people overlook.',
      },
      {
        page: 184,
        quote: 'Doubt is not a sign of failure. It is a sign of engagement with the unknown.',
        realWorldContext: 'Patagonia took a massive risk with the "Don’t Buy This Jacket" campaign, doubting retail conventions but driving record brand trust.',
        strategicDirection: 'If a strategic direction feels completely safe and comfortable to everyone in the boardroom, it will be completely invisible in the market.',
      },
    ],
  },
  {
    id: 'how-brands-grow',
    title: 'How Brands Grow',
    author: 'Byron Sharp',
    year: '2010',
    quotes: [
      {
        page: 132,
        quote: 'Rather than striving for meaningful, perceived differentiation, marketers should seek distinctive brand assets.',
        realWorldContext: 'Snickers grew by attaching the physical cue of hunger to the bar, not by convincing anyone of chocolate pedigree.',
        strategicDirection: 'Brand loyalty is largely a statistical myth. Most buyers forget you exist until they need to buy, so build distinctive memory cues that require zero cognitive effort to choose.',
      },
      {
        page: 48,
        quote: 'Growth is largely driven by acquiring light and non-buyers, not by increasing the loyalty of existing ones.',
        realWorldContext: 'Coca-Cola doesn’t run summer campaigns for soda enthusiasts; they run them to catch the person buying one soda every six months at a gas station.',
        strategicDirection: 'Stop burning marketing budget trying to turn casual buyers into passionate apostles. Brands scale by casting a wide net over occasional shoppers who barely remember you.',
      },
      {
        page: 186,
        quote: 'Mental availability is the probability that a buyer will notice, recognize, and think of a brand in buying situations.',
        realWorldContext: 'Corona conquered global market share by linking its bottle directly to a lime wedge on a beach vacation.',
        strategicDirection: 'Customers do not search their memory for mission statements; they react to situational cues. Your communications must anchor directly to purchase triggers.',
      },
      {
        page: 210,
        quote: 'Continuous reach is more effective than burst advertising.',
        realWorldContext: 'Target shifted from seasonal ad explosions to an ongoing weekly retail rhythm, stabilizing customer foot traffic year-round.',
        strategicDirection: 'Stop pulsing massive ad budgets into concentrated two-week flights followed by radio silence. Brands grow through an uninterrupted hum across the calendar.',
      },
      {
        page: 89,
        quote: 'Brands compete as imperfect substitutes. They share customer bases with all other brands in the category.',
        realWorldContext: 'McDonald’s buyers also eat at Burger King, Wendy’s, and Subway; no fast-food brand has a private, exclusive congregation.',
        strategicDirection: 'Never design a strategy assuming your brand owns an exclusive enclave of customers. Plan against category-wide churn and availability.',
      },
    ],
  },
  {
    id: 'made-to-stick',
    title: 'Made to Stick',
    author: 'Chip & Dan Heath',
    year: '2007',
    quotes: [
      {
        page: 19,
        quote: 'If you say three things, you don’t say anything.',
        realWorldContext: 'To expose movie theater popcorn fat, researchers skipped grams and dumped an entire day’s worth of greasy bacon onto a table.',
        strategicDirection: 'The enemy of communication is knowing too much. Strip your message to a single core proverb, rupture expectations, and anchor abstract numbers in tangible reality.',
      },
      {
        page: 64,
        quote: 'The most basic way to get someone’s attention is this: Break a pattern.',
        realWorldContext: 'The famous "Dumb Ways to Die" campaign for Melbourne Metro bypassed terrifying train crash warnings in favor of cheerful animated blobs singing a catchy song.',
        strategicDirection: 'The human brain is an efficient pattern-matching machine built to ignore the predictable. To get an idea noticed, violate expected category tropes before delivering the payoff.',
      },
      {
        page: 102,
        quote: 'Concrete language helps people understand new concepts. Abstraction is the luxury of the expert.',
        realWorldContext: 'Boeing commanded engineers: "Design an airplane that can carry 131 passengers from Denver to Reno without refueling," replacing pages of abstract specs.',
        strategicDirection: 'Internal briefs drown in high-level jargon. Translate strategic objectives into sensory, visual examples that anyone can immediately picture in three seconds.',
      },
      {
        page: 165,
        quote: 'To make an idea stick, make people care. We are wired to feel things for people, not for abstractions.',
        realWorldContext: 'Donation tests proved people gave twice as much to a flyer about a 7-year-old girl named Rokia than to a brochure with national malnutrition statistics.',
        strategicDirection: 'Charity campaigns and brand causes fail when they recite statistics about millions of suffering individuals. Focus on a single named human to awaken empathy.',
      },
      {
        page: 204,
        quote: 'Stories are flight simulators for the human mind.',
        realWorldContext: 'Subway’s Jared campaign transformed a sandwich chain into a health brand through a single authentic student weight-loss story.',
        strategicDirection: 'Do not present strategy as bullet-pointed analytical conclusions. Frame the strategic problem as an unresolved narrative conflict that the audience instinctively wants to resolve.',
      },
    ],
  },
  {
    id: 'ogilvy-on-advertising',
    title: 'Ogilvy on Advertising',
    author: 'David Ogilvy',
    year: '1983',
    quotes: [
      {
        page: 96,
        quote: 'The customer is not a moron; she’s your wife.',
        realWorldContext: 'Ogilvy spent three weeks reading technical manuals on Rolls-Royce before finding the headline: "At 60 miles an hour the loudest noise in this new Rolls-Royce comes from the electric clock."',
        strategicDirection: 'If it doesn’t sell, it isn’t creative. Real strategy is obsessive preliminary study until you isolate the single factual truth that solves a genuine human frustration.',
      },
      {
        page: 71,
        quote: 'On the average, five times as many people read the headline as read the body copy.',
        realWorldContext: 'Ogilvy’s Hathaway shirt ad paired a compelling headline with a model wearing an eye patch, creating an instant narrative hook that multiplied shirt sales by hundreds of percent.',
        strategicDirection: 'If your headline fails to sell the product, you have wasted 80% of your client’s money. Front-load the benefit and the brand promise immediately.',
      },
      {
        page: 80,
        quote: 'Do not address your readers as though they were gathered together in a stadium. When people read your copy, they are alone.',
        realWorldContext: 'The most effective direct-response letters read like an honest personal note rather than a slick agency brochure.',
        strategicDirection: 'Great copywriting is a conversation between two individuals, not an institutional announcement. Write like an earnest friend giving advice.',
      },
      {
        page: 206,
        quote: 'Never write an advertisement which you wouldn’t want your family to read.',
        realWorldContext: 'Avis confessed "We’re only No. 2" in car rentals, earning immediate credibility and driving their first profitable year in a decade.',
        strategicDirection: 'Do not tell lies or exaggerate product capabilities. Cynical advertising burns brand equity and destroys customer trust that took decades to build.',
      },
      {
        page: 158,
        quote: 'Search all the parks in all your cities; you’ll find no statues of committees.',
        realWorldContext: 'Volkswagen’s "Think Small" campaign was driven by a tiny team at DDB refusing client focus-group dilution.',
        strategicDirection: 'Consensus kills sharp strategy. Defend the single brave thesis from the committee blender; water down the idea and nobody remembers it.',
      },
    ],
  },
  {
    id: 'technique-for-producing-ideas',
    title: 'A Technique for Producing Ideas',
    author: 'James Webb Young',
    year: '1940',
    quotes: [
      {
        page: 18,
        quote: 'An idea is nothing more nor less than a new combination of old elements.',
        realWorldContext: 'The strongest creative frameworks come from transposing an insight from an unrelated discipline directly into a commercial brief.',
        strategicDirection: 'Flood your mind with disparate raw materials, churn them until you feel exhausted, then deliberately walk away so subconscious synthesis can do the work.',
      },
      {
        page: 26,
        quote: 'The habit of mind which leads to a search for relationships between facts is of the highest importance in the production of ideas.',
        realWorldContext: 'Gutenberg invented the printing press by recognizing the mechanical connection between a coin punch and a wine press.',
        strategicDirection: 'Specialization is a strategist’s trap. Broaden your curiosity into anthropology, architecture, and comedy; creative breakthrough lives at the intersection of unconnected dots.',
      },
      {
        page: 38,
        quote: 'Drop the whole subject and put the problem out of your mind completely. Let your unconscious do the synthesizing.',
        realWorldContext: 'Archimedes discovered his displacement principle not while grinding at a desk, but while stepping into a warm bath.',
        strategicDirection: 'Staring at a blank slide induces creative paralysis. Ingest the research, walk away to run or sleep, and allow peripheral cognition to deliver the eureka moment.',
      },
      {
        page: 45,
        quote: 'Words are ideas in a state of suspended animation. When you master words, ideas come alive.',
        realWorldContext: 'Hemingway’s concise diction transformed American literature by deleting every superfluous adjective.',
        strategicDirection: 'Strategic rigor demands precise language. Avoid fuzzy marketing buzzwords; exact word choice sharpens thinking and reveals whether an insight is genuine.',
      },
      {
        page: 52,
        quote: 'Do not make the mistake of holding your idea too close to your chest. Submit it to the criticism of the judicious.',
        realWorldContext: 'Pixar’s Braintrust reviews unfinished film storyboards every few months, relentlessly testing ideas against candid peer feedback.',
        strategicDirection: 'An unshared idea remains untested theory. Expose early strategic theses to tough colleagues before presenting to clients.',
      },
    ],
  },
];
