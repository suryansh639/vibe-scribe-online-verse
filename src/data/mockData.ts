
// Mock data for the application
// This will be replaced with actual API calls once connected to backend

// Mock Users
export const users = [
  {
    id: "user1",
    name: "Jane Cooper",
    email: "jane@example.com",
    bio: "Content creator and tech enthusiast. Writing about the future of technology and how it impacts our daily lives.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
    following: 124,
    followers: 847
  },
  {
    id: "user2",
    name: "Robert Johnson",
    email: "robert@example.com",
    bio: "Software developer and design aficionado. I write about UI/UX and development best practices.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
    following: 67,
    followers: 253
  },
  {
    id: "user3",
    name: "Esther Howard",
    email: "esther@example.com",
    bio: "Marketing specialist with 10+ years of experience. Sharing insights about growth and branding.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150",
    following: 231,
    followers: 1203
  },
  {
    id: "user4",
    name: "Cameron Williamson",
    email: "cameron@example.com",
    bio: "Travel blogger and photographer. Documenting my adventures and sharing travel tips.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
    following: 89,
    followers: 432
  }
];

// Mock Articles
export const articles = [
  {
    id: "article1",
    title: "The Future of Web Development: What to Expect in 2025",
    excerpt: "As technology evolves at a rapid pace, web development continues to transform. Learn about the emerging trends that will shape the future of the web.",
    content: `
# The Future of Web Development: What to Expect in 2025

As technology evolves at a rapid pace, web development continues to transform. In this article, we'll explore the emerging trends that will shape the future of the web and how developers can prepare for what's ahead.

## 1. AI-Driven Development

Artificial Intelligence is no longer just a buzzword; it's becoming an integral part of the development process. AI tools now help with code completion, bug detection, and even generating entire components based on simple prompts.

The rise of AI pair programmers means developers spend less time on repetitive tasks and more time solving complex problems. By 2025, we expect to see AI handling up to 40% of the coding workload for routine tasks.

## 2. WebAssembly Goes Mainstream

WebAssembly (Wasm) has been around for a few years, but it's about to reach a tipping point. This powerful technology allows high-performance applications to run in the browser by executing code at near-native speed.

In the coming years, we'll see more applications leveraging Wasm for computing-intensive tasks like video editing, 3D rendering, and complex simulations directly in the browser.

## 3. The Rise of Edge Computing

Edge computing pushes processing closer to data sources, reducing latency and improving performance. For web development, this means more computation happening at the edge rather than in centralized data centers.

Edge functions and edge databases will become standard components of web architecture, creating faster, more resilient applications that can operate in challenging network conditions.

## 4. Accessibility as a Priority

Accessibility is transitioning from a nice-to-have feature to a fundamental requirement. With increasing regulatory pressure and a broader understanding of inclusive design, developers will need to prioritize accessibility from the start of projects.

We'll see more sophisticated tools for testing and ensuring compliance with standards like WCAG, making it easier to build inclusive experiences for all users.

## 5. The No-Code Revolution Continues

While traditional coding will remain essential, the no-code and low-code movement will continue to transform how many websites and applications are built. These platforms will become more powerful, handling increasingly complex requirements.

Professional developers will find themselves working alongside citizen developers, focusing on the most challenging aspects while leveraging no-code tools to accelerate development cycles.

## Preparing for the Future

To stay relevant in this rapidly evolving landscape, developers should:

- Invest time in learning AI and machine learning fundamentals
- Experiment with WebAssembly for performance-critical applications
- Understand edge computing patterns and architectures
- Master accessibility principles and testing methodologies
- Learn to integrate with and extend no-code platforms

The future of web development is exciting, with technologies that will enable us to build faster, more powerful, and more inclusive experiences. By embracing these trends early, developers can position themselves at the forefront of the next web revolution.
    `,
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500",
    author: {
      id: "user1",
      name: "Jane Cooper",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150"
    },
    publishedAt: "2023-04-12T09:15:00Z",
    readTime: "8 min read",
    tags: ["Web Development", "Technology", "Future"],
    likes: 248,
    comments: 47,
    featured: true
  },
  {
    id: "article2",
    title: "Designing for Emotion: How to Create Meaningful User Experiences",
    excerpt: "Emotional design goes beyond aesthetics to create memorable experiences. Discover how to incorporate emotion into your digital products.",
    content: `
# Designing for Emotion: How to Create Meaningful User Experiences

Emotional design goes beyond aesthetics to create memorable experiences. This article explores practical strategies for incorporating emotion into your digital products to forge stronger connections with users.

## Understanding Emotional Design

Emotional design recognizes that user experiences aren't just functional—they're also emotional. When users interact with a product, they form emotional responses that influence their perception of the experience.

The goal isn't manipulation but rather creating authentic connections that resonate with users' needs, desires, and contexts. This approach leads to more engaging, memorable, and effective products.

## The Three Levels of Emotional Design

According to Don Norman, emotional design operates on three levels:

1. **Visceral**: The immediate, instinctive reaction to appearance
2. **Behavioral**: The experience during use, related to function and usability
3. **Reflective**: The contemplative level, involving self-image and memories

A successful emotional design strategy addresses all three levels, creating a cohesive experience that delights users at every interaction.

## Practical Strategies for Emotional Design

### 1. Create Personality Through Microcopy

Words matter. Thoughtful microcopy humanizes your product and conveys personality. Consider how brands like Mailchimp use playful language to make mundane tasks more enjoyable.

Instead of "Form submitted successfully," try "High five! Your message just made its way to our inbox."

### 2. Use Animation to Provide Feedback

Strategic animation can communicate status, provide feedback, and add delight:

- Loading indicators that tell a mini-story
- Success animations that celebrate achievements
- Transitions that maintain context and reduce cognitive load

### 3. Design for Imperfection

Perfect interfaces can feel sterile and mechanical. Intentional imperfections—handdrawn elements, asymmetrical layouts, or organic shapes—can create warmth and humanity.

### 4. Surprise and Delight

Unexpected moments of joy build emotional connections. Consider how you might:

- Add easter eggs for users to discover
- Create special animations for significant milestones
- Personalize experiences based on user behavior

### 5. Tell Stories

Humans are hardwired for storytelling. Weave narratives throughout your product:

- Origin stories that share your mission
- User journeys that showcase transformation
- Visual narratives that guide users through complex processes

## Measuring Emotional Impact

Emotional design should be measured, not just implemented. Consider these approaches:

- **Qualitative research**: Interviews and observation to understand emotional responses
- **Sentiment analysis**: Tracking emotional language in user feedback
- **Engagement metrics**: Measuring time spent, return visits, and social sharing

## Balancing Emotion with Function

While emotional design is powerful, it must never compromise usability. The most successful products combine both:

- **First**: Ensure core functionality works flawlessly
- **Then**: Layer emotional elements that enhance the experience
- **Always**: Test with users to confirm emotional elements don't create confusion

By thoughtfully incorporating emotional design principles, you create experiences that users not only use but love—fostering loyalty, engagement, and meaningful connections in an increasingly crowded digital landscape.
    `,
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=500",
    author: {
      id: "user2",
      name: "Robert Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150"
    },
    publishedAt: "2023-04-02T14:30:00Z",
    readTime: "6 min read",
    tags: ["UX Design", "Product Design", "Psychology"],
    likes: 182,
    comments: 24,
    featured: false
  },
  {
    id: "article3",
    title: "Building a Personal Brand in the Digital Age",
    excerpt: "In today's competitive landscape, a strong personal brand is essential. Learn strategies to establish yourself as an authority in your field.",
    content: `
# Building a Personal Brand in the Digital Age

In today's competitive landscape, a strong personal brand is essential for standing out. This article explores practical strategies to establish yourself as an authority in your field through consistent, authentic personal branding.

## Why Personal Branding Matters

Personal branding isn't about self-promotion—it's about deliberately shaping how others perceive your professional identity. A well-crafted personal brand:

- Distinguishes you from competitors
- Builds trust with your audience
- Creates opportunities without constant networking
- Establishes your expertise and authority
- Provides a platform for meaningful connections

## Defining Your Brand Foundation

Before creating content or engaging online, establish these fundamental elements:

### 1. Identify Your Unique Value Proposition

What makes you different? Consider:
- Your unique combination of skills and experiences
- Problems you're uniquely positioned to solve
- Your personal story and perspective
- Approaches or methodologies you've developed

### 2. Determine Your Target Audience

Be specific about who you want to reach:
- What industries or niches do they work in?
- What career stage are they in?
- What challenges do they face?
- Where do they already spend time online?

### 3. Craft Your Core Message

Distill your expertise into clear messaging:
- What fundamental beliefs guide your work?
- What perspective do you bring to your field?
- What transformation do you offer?
- What topics will you consistently address?

## Building Your Brand Presence

With your foundation established, focus on these key areas:

### 1. Content Creation Strategy

Content is the primary vehicle for your personal brand. Choose platforms and formats that:
- Align with your strengths (writing, speaking, visual communication)
- Reach your target audience effectively
- Allow you to demonstrate your expertise consistently

Consider these content approaches:
- Teaching what you know through tutorials and guides
- Sharing opinions on industry trends and developments
- Documenting your professional journey and lessons learned
- Curating valuable resources with your added perspective

### 2. Visual Identity

Visual consistency reinforces your brand:
- Professional photography that conveys your personality
- Consistent color schemes across platforms
- Typography and design elements that reflect your brand attributes
- Recognizable profile images across all channels

### 3. Networking and Community Building

A personal brand thrives through relationships:
- Engage genuinely with others in your field
- Collaborate with complementary professionals
- Participate in relevant communities
- Support and promote others' work

## Measuring Brand Impact

Track these indicators to gauge your brand's effectiveness:
- Growth in relevant followers and connections
- Engagement with your content
- Inbound opportunities (speaking, collaborations, jobs)
- Media mentions and features
- Direct feedback from your audience

## Authenticity: The Key to Sustainable Branding

While strategy is important, authenticity is essential:
- Share both successes and failures
- Maintain consistent values across platforms
- Take positions based on conviction, not popularity
- Let your personality shine through professional content

By thoughtfully building your personal brand, you create a valuable professional asset that opens doors, establishes authority, and creates meaningful connections throughout your career.
    `,
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=500",
    author: {
      id: "user3",
      name: "Esther Howard",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150"
    },
    publishedAt: "2023-03-28T10:45:00Z",
    readTime: "7 min read",
    tags: ["Personal Branding", "Career", "Social Media"],
    likes: 124,
    comments: 31,
    featured: false
  },
  {
    id: "article4",
    title: "The Complete Guide to Remote Work: Staying Productive and Connected",
    excerpt: "Remote work offers flexibility but comes with challenges. Discover practical strategies to maintain productivity and well-being while working from anywhere.",
    content: `
# The Complete Guide to Remote Work: Staying Productive and Connected

Remote work offers unprecedented flexibility but comes with unique challenges. This comprehensive guide explores practical strategies to maintain productivity, well-being, and connection while working from anywhere.

## Setting Up for Success

Your physical workspace significantly impacts your remote work experience:

### 1. Create a Dedicated Workspace

A defined workspace helps separate work from personal life:
- Choose a location with minimal distractions
- Ensure proper lighting to reduce eye strain
- Invest in an ergonomic chair and desk setup
- Consider background appearance for video calls

### 2. Optimize Your Tech Setup

Reliable technology is essential for remote work:
- Secure a stable internet connection (consider a backup option)
- Use noise-canceling headphones for focus and clear calls
- Set up proper video conferencing equipment
- Implement secure access to company resources

### 3. Establish Work-Life Boundaries

Without office walls, boundaries become crucial:
- Define clear working hours
- Create morning and evening routines to "commute" mentally
- Use separate devices or accounts for work and personal use
- Communicate boundaries to household members

## Mastering Remote Productivity

Remote work requires intentional productivity strategies:

### 1. Implement Structured Time Management

Structure prevents the work-from-home drift:
- Use time-blocking to schedule focused work periods
- Implement the Pomodoro Technique (25 minutes of work, 5-minute breaks)
- Schedule breaks and movement throughout your day
- Batch similar tasks to minimize context switching

### 2. Minimize Distractions

Home environments present unique distractions:
- Use website blockers during focus periods
- Enable do-not-disturb settings on devices
- Communicate your focus times to household members
- Create environmental cues that signal "work mode"

### 3. Practice Digital Organization

Stay organized without physical storage:
- Develop a consistent file naming and storage system
- Maintain an updated task management system
- Document processes and information for easy retrieval
- Use calendar blocking effectively

## Nurturing Remote Relationships

Connection requires extra attention in remote settings:

### 1. Communicate Intentionally

Without casual office interactions, communication must be deliberate:
- Over-communicate progress, challenges, and availability
- Choose appropriate channels for different messages
- Practice clear written communication
- Don't rely solely on asynchronous methods

### 2. Build Remote Team Bonds

Team cohesion needs active cultivation:
- Participate fully in virtual team activities
- Create space for non-work conversations
- Share appropriate personal updates and interests
- Recognize and celebrate team achievements

### 3. Leverage Video Effectively

Video adds crucial nonverbal communication:
- Use video for complex or sensitive discussions
- Be present and attentive during video calls
- Consider "virtual coworking" sessions
- Practice good video meeting etiquette

## Maintaining Well-being While Remote

Remote work can blur boundaries between professional and personal life:

### 1. Prioritize Physical Health

Physical health impacts remote work effectiveness:
- Schedule regular movement throughout your day
- Set up reminders to maintain proper posture
- Take breaks outdoors when possible
- Prepare healthy meals and snacks in advance

### 2. Safeguard Mental Health

Remote work presents unique mental health challenges:
- Create rituals to start and end your workday
- Schedule social interactions to prevent isolation
- Practice mindfulness to manage stress
- Monitor for signs of burnout

### 3. Embrace Flexibility Benefits

Leverage the unique advantages of remote work:
- Optimize your schedule around your energy levels
- Incorporate "life tasks" thoughtfully into your day
- Design your environment to support your well-being
- Reduce commute stress with occasional location changes

By implementing these strategies, you can cultivate a remote work experience that enhances both your professional contributions and personal quality of life.
    `,
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=500",
    author: {
      id: "user4",
      name: "Cameron Williamson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
    },
    publishedAt: "2023-03-15T08:00:00Z",
    readTime: "9 min read",
    tags: ["Remote Work", "Productivity", "Work-Life Balance"],
    likes: 315,
    comments: 56,
    featured: false
  },
  {
    id: "article5",
    title: "The Art of Storytelling in Marketing: Connecting with Your Audience",
    excerpt: "Stories have the power to transform how people perceive your brand. Learn how to craft compelling narratives that resonate with your target audience.",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=500",
    author: {
      id: "user3",
      name: "Esther Howard",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150"
    },
    publishedAt: "2023-03-05T11:30:00Z",
    readTime: "6 min read",
    tags: ["Marketing", "Storytelling", "Content Strategy"],
    likes: 189,
    comments: 27,
    featured: false
  }
];

// Mock Tags
export const popularTags = [
  "Technology",
  "UX Design",
  "Web Development",
  "Marketing",
  "Productivity",
  "Remote Work",
  "Career",
  "Psychology",
  "Programming",
  "Future",
  "Personal Branding",
  "Social Media",
  "Artificial Intelligence",
  "Product Design",
  "Work-Life Balance"
];

// Mock Comments
export const comments = [
  {
    id: "comment1",
    articleId: "article1",
    author: {
      id: "user2",
      name: "Robert Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150"
    },
    content: "This is such an insightful article! I particularly enjoyed the section about AI-driven development. It's exciting to think about how AI will transform the coding landscape in the coming years.",
    publishedAt: "2023-04-12T14:32:00Z",
    likes: 8
  },
  {
    id: "comment2",
    articleId: "article1",
    author: {
      id: "user3",
      name: "Esther Howard",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150"
    },
    content: "I'm a bit skeptical about the no-code revolution going as far as predicted. While these tools are getting better, I still think there will always be a strong need for traditional coding skills, especially for complex applications.",
    publishedAt: "2023-04-12T15:47:00Z",
    likes: 6
  },
  {
    id: "comment3",
    articleId: "article1",
    author: {
      id: "user4",
      name: "Cameron Williamson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
    },
    content: "WebAssembly is definitely an exciting technology! I've been experimenting with it for a few projects, and the performance improvements are substantial. Great to see it highlighted in this article.",
    publishedAt: "2023-04-12T17:23:00Z",
    likes: 12
  },
  {
    id: "comment4",
    articleId: "article2",
    author: {
      id: "user1",
      name: "Jane Cooper",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150"
    },
    content: "I've been implementing some of these emotional design principles in my recent projects, and the user feedback has been overwhelmingly positive. The section on microcopy was particularly helpful!",
    publishedAt: "2023-04-03T09:12:00Z",
    likes: 9
  },
  {
    id: "comment5",
    articleId: "article2",
    author: {
      id: "user3",
      name: "Esther Howard",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150"
    },
    content: "One challenge I often face is balancing emotional design with accessibility. Some playful elements can be confusing for users with cognitive disabilities. Would love to see more discussion about this intersection in future articles.",
    publishedAt: "2023-04-03T11:39:00Z",
    likes: 14
  }
];
