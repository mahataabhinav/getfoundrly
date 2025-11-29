/**
 * OpenAI API Integration
 * 
 * Functions for AI-powered content generation and personalization
 */

import OpenAI from 'openai';

// Check if API key is configured
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ VITE_OPENAI_API_KEY is not set. AI features will not work. Add it to your .env file.');
}

// Initialize OpenAI client
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
}) : null;

/**
 * Generate LinkedIn post content using AI
 */
export async function generateLinkedInPost(options: {
  brandName: string;
  brandUrl?: string;
  postType: string;
  topic: string;
  contextDetails?: string;
  brandTone?: string;
}): Promise<string> {
  const systemPrompt = `You are an expert LinkedIn content creator specializing in professional thought leadership and brand visibility. 
Create engaging, authentic LinkedIn posts that drive engagement and establish authority.

Guidelines:
- Write in a conversational yet professional tone
- Use emojis sparingly and strategically
- Include actionable insights
- End with a question or call-to-action to drive engagement
- Use relevant hashtags (3-5 max)
- Keep posts between 200-300 words for optimal engagement
- Make it feel personal and authentic, not corporate`;

  const userPrompt = `Create a ${options.postType} LinkedIn post for ${options.brandName}${options.brandUrl ? ` (${options.brandUrl})` : ''}.

Topic: ${options.topic}
${options.contextDetails ? `Additional context: ${options.contextDetails}` : ''}
${options.brandTone ? `Brand tone: ${options.brandTone}` : ''}

Generate a compelling LinkedIn post that:
1. Captures attention with a strong opening
2. Provides valuable insights or storytelling
3. Engages the audience with a question or CTA
4. Uses appropriate hashtags

Return only the post content, no explanations.`;

  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Using GPT-4o (latest available), can be changed to gpt-4-turbo or gpt-3.5-turbo
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Error generating LinkedIn post:', error);
    if (error?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your .env file.');
    } else if (error?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    } else if (error?.message) {
      throw new Error(`Failed to generate post: ${error.message}`);
    }
    throw new Error('Failed to generate post. Please try again.');
  }
}

/**
 * Refine/edit existing post content using AI
 */
export async function refinePostContent(
  originalPost: string,
  instruction: string,
  brandName?: string
): Promise<string> {
  const systemPrompt = `You are an expert content editor specializing in LinkedIn posts. 
Your task is to refine and improve existing LinkedIn post content based on user instructions.

Maintain the core message and authenticity while applying the requested changes.`;

  const userPrompt = `Original post:
${originalPost}

${brandName ? `Brand: ${brandName}` : ''}

User instruction: ${instruction}

Refine the post according to the instruction. Return only the refined post content, no explanations.`;

  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    return completion.choices[0]?.message?.content || originalPost;
  } catch (error: any) {
    console.error('Error refining post:', error);
    if (error?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your .env file.');
    }
    throw new Error('Failed to refine post. Please try again.');
  }
}

/**
 * Generate personalized welcome message for dashboard
 */
export async function generatePersonalizedWelcome(
  firstName: string,
  userData?: {
    recentActivity?: string[];
    topPerformingContent?: string;
    visibilityScore?: number;
  }
): Promise<string> {
  const systemPrompt = `You are Foundi, a friendly AI assistant for Foundrly. 
Generate warm, personalized welcome messages that feel authentic and helpful.
Keep messages concise (1-2 sentences) and encouraging.`;

  const userPrompt = `Generate a personalized welcome message for ${firstName}.

${userData?.recentActivity ? `Recent activity: ${userData.recentActivity.join(', ')}` : ''}
${userData?.topPerformingContent ? `Top performing content: ${userData.topPerformingContent}` : ''}
${userData?.visibilityScore ? `Current visibility score: ${userData.visibilityScore}` : ''}

Create a friendly, personalized message that acknowledges their progress and encourages them.`;

  if (!openai) {
    return `Welcome back, ${firstName}! Ready to boost your visibility today?`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 100,
    });

    return completion.choices[0]?.message?.content || `Welcome back, ${firstName}! Ready to boost your visibility today?`;
  } catch (error) {
    console.error('Error generating welcome message:', error);
    return `Welcome back, ${firstName}! Ready to boost your visibility today?`;
  }
}

/**
 * Generate AI insights and recommendations
 */
export async function generateInsights(options: {
  contentType: 'dashboard' | 'analytics' | 'growth';
  userData?: Record<string, any>;
  context?: string;
}): Promise<string> {
  const systemPrompt = `You are an expert marketing and visibility strategist. 
Provide actionable insights and recommendations based on user data and context.`;

  const userPrompt = `Generate insights for: ${options.contentType}

${options.context ? `Context: ${options.context}` : ''}
${options.userData ? `User data: ${JSON.stringify(options.userData)}` : ''}

Provide 2-3 actionable insights or recommendations. Keep it concise and valuable.`;

  if (!openai) {
    return '';
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating insights:', error);
    return '';
  }
}

/**
 * Generate newsletter content
 */
export async function generateNewsletter(options: {
  brandName: string;
  topic: string;
  audience?: string;
  tone?: string;
}): Promise<string> {
  const systemPrompt = `You are an expert email newsletter writer. 
Create engaging, valuable newsletter content that drives engagement and provides real value to subscribers.`;

  const userPrompt = `Create a newsletter for ${options.brandName}.

Topic: ${options.topic}
${options.audience ? `Target audience: ${options.audience}` : ''}
${options.tone ? `Tone: ${options.tone}` : ''}

Generate a complete newsletter with:
- Compelling subject line suggestion
- Engaging introduction
- Main content (2-3 sections)
- Call-to-action
- Professional closing

Format it clearly with sections.`;

  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Error generating newsletter:', error);
    throw new Error('Failed to generate newsletter. Please try again.');
  }
}

/**
 * Generate blog post content
 */
export async function generateBlogPost(options: {
  title: string;
  brandName: string;
  topic: string;
  targetKeywords?: string[];
  tone?: string;
}): Promise<string> {
  const systemPrompt = `You are an expert SEO content writer. 
Create comprehensive, well-structured blog posts that are SEO-optimized and provide real value.`;

  const userPrompt = `Create a blog post for ${options.brandName}.

Title: ${options.title}
Topic: ${options.topic}
${options.targetKeywords ? `Target keywords: ${options.targetKeywords.join(', ')}` : ''}
${options.tone ? `Tone: ${options.tone}` : ''}

Generate a complete blog post with:
- SEO-optimized introduction
- Well-structured body with headings
- Actionable insights
- Conclusion with CTA
- Natural keyword integration

Aim for 800-1200 words.`;

  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Error generating blog post:', error);
    throw new Error('Failed to generate blog post. Please try again.');
  }
}

/**
 * Chat completion for interactive AI features
 */
export async function chatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 500,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Error in chat completion:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}

