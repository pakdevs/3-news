export const categories = [
  { id: '1', name: 'Top Stories', slug: 'top' },
  { id: '2', name: 'Technology', slug: 'technology' },
  { id: '3', name: 'Business', slug: 'business' },
  { id: '4', name: 'Sports', slug: 'sports' },
  { id: '5', name: 'Politics', slug: 'politics' },
  { id: '6', name: 'Health', slug: 'health' },
  { id: '7', name: 'Science', slug: 'science' },
  { id: '8', name: 'Entertainment', slug: 'entertainment' },
]

export const newsArticles = [
  {
    id: '1',
    title: 'Breaking: AI Technology Reaches New Milestone in Healthcare',
    summary:
      'Revolutionary artificial intelligence system shows promising results in early disease detection, potentially changing the future of medical diagnosis.',
    content: `A groundbreaking artificial intelligence system has demonstrated unprecedented accuracy in early disease detection, marking a significant milestone in healthcare technology. The AI model, developed by researchers at leading medical institutions, has shown remarkable success in identifying various conditions weeks before traditional diagnostic methods.

The technology utilizes advanced machine learning algorithms to analyze medical imaging data, patient records, and symptom patterns. In clinical trials involving over 10,000 patients, the AI system achieved a 95% accuracy rate in early detection of cardiovascular diseases and an 89% success rate for early-stage cancer identification.

Dr. Sarah Johnson, lead researcher on the project, explained: "This represents a paradigm shift in how we approach preventive medicine. By catching diseases in their earliest stages, we can significantly improve patient outcomes and reduce healthcare costs."

The system's ability to process vast amounts of medical data in real-time has impressed the medical community. Unlike traditional diagnostic methods that rely on specific symptoms or risk factors, this AI can identify subtle patterns that might be invisible to human physicians.

Healthcare providers are already expressing interest in implementing this technology. Major hospitals across the country are planning pilot programs to integrate the AI system into their diagnostic workflows.

However, some experts urge caution, emphasizing the need for extensive validation and regulatory approval before widespread adoption. The FDA has announced plans to fast-track the review process given the technology's potential impact on public health.

The development team is now working on expanding the AI's capabilities to detect neurological conditions and rare diseases. They expect to begin additional clinical trials within the next six months.`,
    author: 'Dr. Emily Chen',
    publishDate: '2025-08-02T10:30:00Z',
    category: 'technology',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    readTime: '5 min read',
    tags: ['AI', 'Healthcare', 'Technology', 'Medicine'],
    isBreaking: true,
    likes: 1247,
    shares: 89,
  },
  {
    id: '2',
    title: 'Global Climate Summit Announces Ambitious 2030 Goals',
    summary:
      'World leaders commit to unprecedented environmental initiatives as scientists warn of critical climate tipping points.',
    content: `World leaders gathered at the Global Climate Summit have announced the most ambitious environmental goals in history, committing to achieve carbon neutrality by 2030. The summit, attended by representatives from 195 countries, marks a turning point in global climate action.

The comprehensive plan includes massive investments in renewable energy infrastructure, with participating nations pledging over $2 trillion in funding. The initiative aims to transition 80% of global energy production to renewable sources within the next five years.

President of the European Commission, Maria Santos, stated: "We are at a critical juncture for our planet. These commitments represent humanity's best chance to prevent catastrophic climate change."

Key components of the agreement include:
- Immediate phase-out of coal power plants
- 50% reduction in methane emissions by 2027
- Protection of 30% of global oceans and land
- Massive reforestation projects covering 10 million hectares annually

Scientists have welcomed the announcements but stress that implementation will be crucial. Recent climate models suggest that without immediate action, global temperatures could rise by 2.5°C above pre-industrial levels, triggering irreversible environmental changes.

The private sector has also shown strong support, with major corporations announcing their own sustainability commitments. Tech giants, automotive manufacturers, and energy companies have pledged to align their operations with the new climate goals.

However, some developing nations have raised concerns about the economic impact of rapid decarbonization. The summit has addressed these concerns by establishing a $500 billion climate adaptation fund to support vulnerable countries.

Environmental activists have praised the agreement while calling for even more aggressive action. Youth climate leaders emphasized the need for accountability mechanisms to ensure countries meet their commitments.`,
    author: 'Michael Torres',
    publishDate: '2025-08-02T08:15:00Z',
    category: 'politics',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop',
    readTime: '7 min read',
    tags: ['Climate', 'Environment', 'Politics', 'Global'],
    isBreaking: false,
    likes: 892,
    shares: 156,
  },
  {
    id: '3',
    title: 'Revolutionary Quantum Computer Solves 1000-Year Problem',
    summary:
      'Scientists achieve quantum supremacy breakthrough that could revolutionize cryptography and drug discovery.',
    content: `A team of quantum physicists has successfully used a quantum computer to solve a mathematical problem that would take classical computers over 1000 years to complete. This achievement represents a significant leap forward in quantum computing capabilities.

The quantum computer, featuring 1000 qubits, completed the complex optimization problem in just 8 hours. The problem, which involves finding the optimal configuration of millions of variables, has applications in drug discovery, financial modeling, and artificial intelligence.

"This is the moment we've been working toward for decades," said Dr. Robert Kim, lead quantum physicist at the research facility. "We've definitively demonstrated quantum advantage in a real-world application."

The implications for various industries are staggering:

In pharmaceuticals, the breakthrough could accelerate drug discovery by simulating molecular interactions at unprecedented scales. Companies are already exploring partnerships to leverage quantum computing for developing new medications.

The financial sector sees potential for revolutionary risk analysis and portfolio optimization. Traditional Monte Carlo simulations that take weeks could be completed in hours.

Cryptography faces both opportunities and challenges. While quantum computers could break current encryption methods, they also enable quantum cryptography that is theoretically unbreakable.

The achievement has sparked renewed investment in quantum research. Venture capital firms have announced plans to invest $10 billion in quantum startups over the next two years.

However, significant challenges remain. Quantum computers are extremely sensitive to environmental interference and require temperatures colder than outer space to operate. The cost of building and maintaining these systems currently limits their accessibility.

Major tech companies are racing to commercialize quantum computing. IBM, Google, and Microsoft have all announced plans to launch quantum cloud services within the next 18 months.

Educational institutions are scrambling to develop quantum computing curricula to train the next generation of quantum engineers and scientists.`,
    author: 'Dr. Lisa Park',
    publishDate: '2025-08-01T16:45:00Z',
    category: 'science',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    readTime: '6 min read',
    tags: ['Quantum Computing', 'Science', 'Technology', 'Research'],
    isBreaking: true,
    likes: 2156,
    shares: 234,
  },
  {
    id: '4',
    title: 'Championship Finals Set as Underdogs Defeat Favorites',
    summary:
      'In a stunning upset, the underdog team secures their spot in the championship game with a last-minute victory.',
    content: `In one of the most dramatic games of the season, the Phoenix Runners defeated the heavily favored Metro Lions 28-24 to advance to the championship finals. The victory came after a spectacular 75-yard touchdown pass with just 32 seconds remaining on the clock.

The Runners, who entered the playoffs as the lowest seed, have now defeated three higher-ranked teams on their path to the finals. Their Cinderella story has captivated fans across the nation and become a symbol of determination and teamwork.

Quarterback Jake Martinez threw for 387 yards and three touchdowns, including the game-winning pass to rookie receiver Danny Foster. "I've dreamed of this moment since I was a kid," Martinez said during the post-game interview. "This team never gave up, and now we're one game away from a championship."

The Lions, who had been undefeated at home this season, struggled with turnovers throughout the game. Three interceptions in the fourth quarter proved costly as the Runners capitalized on each opportunity.

Head coach Maria Rodriguez has transformed the Runners from a last-place team to championship contenders in just two seasons. Her innovative offensive strategies and emphasis on player development have become a model for other organizations.

The championship game will be played next Sunday at the National Stadium. Ticket prices have already reached record levels, with some seats selling for over $5,000. The game is expected to draw the largest television audience in the sport's history.

Foster, who was working as a waiter just two years ago before being discovered at a local tryout, has become an inspiration for amateur athletes everywhere. His story demonstrates that talent can be found in unexpected places.

The Lions will have the entire off-season to reflect on what might have been. Despite the loss, they had an outstanding season and are expected to return as strong contenders next year.

Fans are already planning victory celebrations, with the city announcing a parade route in anticipation of a championship victory.`,
    author: 'Carlos Rodriguez',
    publishDate: '2025-08-01T22:30:00Z',
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    readTime: '4 min read',
    tags: ['Sports', 'Championship', 'Football', 'Playoffs'],
    isBreaking: false,
    likes: 1534,
    shares: 178,
  },
  {
    id: '5',
    title: 'New Treatment Shows 90% Success Rate Against Rare Disease',
    summary:
      'Medical breakthrough offers hope to thousands of patients suffering from previously incurable genetic condition.',
    content: `A revolutionary gene therapy treatment has shown remarkable success in treating patients with Huntington's disease, a previously incurable genetic condition. In clinical trials, 90% of patients showed significant improvement in symptoms within six months of treatment.

The therapy, developed through a collaboration between three major research institutions, works by targeting and correcting the genetic mutation responsible for the disease. Using advanced CRISPR gene-editing technology, scientists can now modify defective genes directly in patients' brain cells.

Dr. Amanda Foster, lead researcher on the project, described the results as "nothing short of miraculous." Patients who had been wheelchair-bound for years are now walking independently, and cognitive functions have improved dramatically in most cases.

The treatment involves a series of targeted injections over three months. Each injection delivers millions of modified genes directly to affected brain regions. The procedure is minimally invasive and can be performed on an outpatient basis.

Patient stories from the trial have been particularly moving. Sarah Thompson, 34, who was diagnosed with Huntington's at age 28, can now play with her children again. "I thought I would never see them graduate," she said. "This treatment gave me my life back."

The FDA has granted breakthrough therapy designation, expediting the approval process. If approved, the treatment could be available to patients within 18 months.

However, the therapy comes with a significant cost. Initial estimates suggest each treatment course could cost $2.3 million. Insurance companies and healthcare systems are already debating coverage options.

Researchers are optimistic that the success of this treatment could lead to similar therapies for other genetic diseases. Trials for treatments targeting cystic fibrosis and muscular dystrophy are already in planning stages.

The Huntington's Disease Society has called the results "the most significant advancement in 150 years of research." They are working with patient advocacy groups to ensure broad access to the treatment once approved.

Pharmaceutical companies are taking notice, with several announcing increased investment in gene therapy research. The success of this treatment could mark the beginning of a new era in personalized medicine.`,
    author: 'Dr. James Wilson',
    publishDate: '2025-08-01T14:20:00Z',
    category: 'health',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    readTime: '6 min read',
    tags: ['Health', 'Medicine', 'Gene Therapy', 'Breakthrough'],
    isBreaking: true,
    likes: 3421,
    shares: 567,
  },
  {
    id: '6',
    title: 'Tech Giants Announce Major Investment in Green Energy',
    summary:
      'Leading technology companies commit $50 billion to renewable energy projects worldwide.',
    content: `Five of the world's largest technology companies have announced a joint $50 billion investment in renewable energy infrastructure, marking the largest private commitment to green energy in history. The initiative will fund solar, wind, and hydroelectric projects across six continents.

The consortium, which includes major cloud computing and device manufacturing companies, aims to achieve carbon-negative operations by 2028. This ambitious timeline exceeds previous industry commitments and sets a new standard for corporate environmental responsibility.

The investment will create an estimated 200,000 jobs in the renewable energy sector over the next five years. Projects will prioritize communities that have been economically dependent on fossil fuel industries, providing retraining and employment opportunities.

"This isn't just about corporate responsibility," explained Tech Alliance spokesperson Jennifer Martinez. "Renewable energy is now the most cost-effective option for powering our global operations."

The first phase of the initiative will focus on building massive solar farms in desert regions of North America, Australia, and North Africa. These facilities will generate enough clean energy to power 15 million homes annually.

Advanced energy storage systems will address the intermittency challenges traditionally associated with renewable energy. The companies are investing heavily in next-generation battery technology that can store excess energy for weeks rather than hours.

Environmental groups have praised the announcement while calling for other industries to follow suit. The initiative could accelerate the global transition to renewable energy by demonstrating the economic viability of large-scale green projects.

Small communities in rural areas are expected to benefit significantly from the investments. Many projects will be built in economically disadvantaged regions, bringing high-paying jobs and tax revenue to areas that need economic development.

The companies involved have committed to using only renewable energy for their operations by 2030. This includes data centers, manufacturing facilities, and office buildings worldwide.

Critics argue that the timeline is too aggressive and that the companies should focus on reducing energy consumption rather than just switching to renewable sources. However, supporters believe this bold approach could catalyze industry-wide changes.`,
    author: 'Rachel Green',
    publishDate: '2025-08-01T11:00:00Z',
    category: 'business',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop',
    readTime: '5 min read',
    tags: ['Business', 'Technology', 'Green Energy', 'Investment'],
    isBreaking: false,
    likes: 987,
    shares: 234,
  },
  {
    id: '7',
    title: 'Celebrity Chef Opens Chain of Sustainable Restaurants',
    summary:
      'Award-winning chef launches innovative restaurant concept focusing on zero-waste cooking and local ingredients.',
    content: `Celebrity chef Marco Delacroix has announced the opening of his new restaurant chain, "Earth Table," which promises to revolutionize sustainable dining. The first location opened last week to rave reviews and completely booked reservations for the next three months.

The restaurant concept eliminates food waste entirely through innovative cooking techniques and partnerships with local farms. All ingredients are sourced within a 50-mile radius, supporting local agriculture and reducing transportation emissions.

"We're proving that sustainable dining doesn't mean compromising on taste or quality," Delacroix explained during the opening ceremony. "In fact, our ingredients are fresher and more flavorful because they're harvested the same day we serve them."

The menu changes daily based on available seasonal ingredients. Diners receive a surprise tasting menu that showcases the chef's creativity in working with whatever ingredients are freshest that day. This approach has created a unique dining experience that food critics are calling "revolutionary."

The restaurant's design incorporates recycled materials and energy-efficient systems. Solar panels provide most of the electrical power, while an innovative water recycling system reduces consumption by 80% compared to traditional restaurants.

Food waste that would typically be discarded is transformed into compost or donated to local food banks. The restaurant has achieved true zero-waste status, with nothing going to landfills.

The success of the first location has led to plans for expansion. Five additional restaurants are planned for major cities over the next two years. Each location will partner with local farms and adapt the menu to regional ingredients and preferences.

Other celebrity chefs are taking notice of Delacroix's approach. Several have announced plans to incorporate similar sustainability practices into their own establishments.

The restaurant industry, traditionally known for high waste levels, is beginning to embrace sustainable practices. Earth Table's success demonstrates that environmental responsibility can be profitable and appealing to consumers.

Culinary schools are already incorporating Earth Table's methods into their curricula, training the next generation of chefs in sustainable cooking techniques.`,
    author: 'Isabella Romano',
    publishDate: '2025-07-31T19:45:00Z',
    category: 'entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
    readTime: '4 min read',
    tags: ['Entertainment', 'Sustainability', 'Food', 'Celebrity'],
    isBreaking: false,
    likes: 756,
    shares: 123,
  },
  {
    id: '8',
    title: 'Space Tourism Company Announces Lunar Vacation Packages',
    summary:
      'Private space company reveals plans for week-long trips to lunar orbit starting in 2027.',
    content: `Stellar Voyages, a leading space tourism company, has announced the launch of lunar vacation packages that will take civilians on week-long trips around the Moon. The first commercial lunar mission is scheduled for late 2027, with tickets priced at $50 million per passenger.

The luxury spacecraft, designed specifically for tourism, can accommodate 12 passengers and features private suites, a dining area, and observation decks with panoramic views of space. Each suite includes sleeping quarters, personal workspace, and private bathroom facilities.

"We're making space travel accessible to anyone who dreams of seeing Earth from space," said CEO Alexandra Volkov during yesterday's announcement. "This represents the next evolution in luxury travel."

The seven-day itinerary includes three days traveling to lunar orbit, two days orbiting the Moon with multiple viewing opportunities, and two days returning to Earth. Passengers will experience weightlessness and witness Earth rising over the lunar horizon.

Safety protocols exceed those required by space agencies, with extensive training provided to all passengers. The three-month preparation program includes physical conditioning, spacecraft familiarization, and emergency procedures.

The spacecraft incorporates advanced life support systems and radiation shielding to ensure passenger safety during the journey. Multiple backup systems provide redundancy for all critical functions.

Early reservation holders include tech entrepreneurs, entertainment celebrities, and adventure enthusiasts from around the world. The company has already received deposits for the first five flights.

The lunar tourism program represents a significant milestone in the commercialization of space travel. Previously, only government astronauts had traveled beyond Earth orbit.

Environmental groups have raised concerns about the carbon footprint of space tourism, while supporters argue that commercial space travel drives innovation that benefits scientific research.

The success of suborbital space tourism has demonstrated public interest in space travel. Lunar tourism represents the next logical step in making space accessible to civilians.

Future plans include establishing a lunar hotel and offering surface excursions for extended stays on the Moon.`,
    author: 'Commander David Chen',
    publishDate: '2025-07-31T15:30:00Z',
    category: 'science',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
    readTime: '5 min read',
    tags: ['Space', 'Tourism', 'Science', 'Technology'],
    isBreaking: true,
    likes: 1876,
    shares: 432,
  },
]

export const authors = [
  {
    id: '1',
    name: 'Dr. Emily Chen',
    bio: 'Senior Technology Correspondent with 15 years of experience covering AI and healthcare innovations.',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612993c?w=150&h=150&fit=crop&crop=face',
    followers: 125000,
    articles: 234,
  },
  {
    id: '2',
    name: 'Michael Torres',
    bio: 'Environmental and Political Reporter focusing on climate policy and international relations.',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    followers: 89000,
    articles: 156,
  },
  {
    id: '3',
    name: 'Dr. Lisa Park',
    bio: 'Science Correspondent specializing in quantum physics and emerging technologies.',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    followers: 67000,
    articles: 98,
  },
  {
    id: '4',
    name: 'Carlos Rodriguez',
    bio: 'Sports Editor covering professional athletics and championship events.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    followers: 145000,
    articles: 567,
  },
]

export const breakingNews = newsArticles.filter((article) => article.isBreaking)

export const getArticlesByCategory = (category) => {
  if (category === 'top') return newsArticles
  return newsArticles.filter((article) => article.category === category)
}

export const getArticleById = (id) => {
  // Handle string conversion explicitly
  const idString = String(id || '')
  return newsArticles.find((article) => String(article.id) === idString)
}

export const searchArticles = (query) => {
  // Handle empty or undefined query
  if (!query) return []

  const lowercaseQuery = String(query).toLowerCase()
  return newsArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  )
}
