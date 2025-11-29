/**
 * Quick Test Script for OpenAI Integration
 * 
 * Run this in Node.js to test OpenAI API connection
 * Usage: node test-ai.js
 * 
 * Make sure you have VITE_OPENAI_API_KEY set in your environment or .env file
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const apiKey = process.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ Error: VITE_OPENAI_API_KEY is not set in .env file');
  console.log('\nPlease add to your .env file:');
  console.log('VITE_OPENAI_API_KEY=sk-your-api-key-here\n');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: apiKey,
});

async function testLinkedInPostGeneration() {
  console.log('🧪 Testing LinkedIn Post Generation...\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert LinkedIn content creator. Create engaging, authentic LinkedIn posts.',
        },
        {
          role: 'user',
          content: 'Create a thought-leadership LinkedIn post for Acme Inc (https://acme.com).\n\nTopic: Why most startups fail at brand visibility\n\nGenerate a compelling LinkedIn post that captures attention, provides valuable insights, and engages the audience.',
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const generatedPost = completion.choices[0]?.message?.content || '';

    console.log('✅ Success! Generated post:\n');
    console.log('─'.repeat(60));
    console.log(generatedPost);
    console.log('─'.repeat(60));
    console.log(`\n📊 Token usage: ${completion.usage?.total_tokens || 'N/A'} tokens`);
    console.log(`💰 Estimated cost: ~$${((completion.usage?.total_tokens || 0) * 0.00001).toFixed(4)}\n`);

    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.status === 401) {
      console.error('   → Invalid API key. Please check your VITE_OPENAI_API_KEY.');
    } else if (error.status === 429) {
      console.error('   → Rate limit exceeded. Please try again later.');
    }
    return false;
  }
}

// Run test
testLinkedInPostGeneration()
  .then((success) => {
    if (success) {
      console.log('✅ All tests passed! Your OpenAI integration is working.\n');
      process.exit(0);
    } else {
      console.log('❌ Test failed. Please check the errors above.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });

