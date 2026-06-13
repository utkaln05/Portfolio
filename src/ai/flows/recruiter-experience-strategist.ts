'use server';
/**
 * @fileOverview This file implements a Genkit flow for the Recruiter Experience Strategist tool.
 * It allows recruiters to ask free-form questions about Utkal Nikam's data analyst projects
 * and professional achievements, and receive concise, relevant answers.
 *
 * - recruiterQuery - A function that handles the recruiter's query.
 * - RecruiterQueryInput - The input type for the recruiterQuery function.
 * - RecruiterQueryOutput - The return type for the recruiterQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecruiterQueryInputSchema = z.object({
  query: z.string().describe("The recruiter's free-form question about Utkal Nikam's projects or achievements."),
});
export type RecruiterQueryInput = z.infer<typeof RecruiterQueryInputSchema>;

const RecruiterQueryOutputSchema = z.object({
  answer: z.string().describe("A concise and relevant answer to the recruiter's query based on Utkal Nikam's profile."),
});
export type RecruiterQueryOutput = z.infer<typeof RecruiterQueryOutputSchema>;

export async function recruiterQuery(input: RecruiterQueryInput): Promise<RecruiterQueryOutput> {
  return recruiterExperienceStrategistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recruiterExperienceStrategistPrompt',
  input: {schema: RecruiterQueryInputSchema},
  output: {schema: RecruiterQueryOutputSchema},
  prompt: `You are an AI assistant providing information about Utkal Nikam's professional profile.
Utkal Nikam is a Data Analyst and Python Developer with skills in Python, SQL, Excel, Power BI, Web Scraping, Automation, Data Visualization, Pandas, NumPy, Selenium, React, and general Data Analysis.
He is passionate about data-driven decision making and problem-solving.

Here are some key highlights from his portfolio:

Projects:
- **Bus Route Data Scraper using Selenium:** A project demonstrating web scraping capabilities to collect bus route data.
- **RAG Chatbot using LLMs:** An advanced project showcasing expertise in Large Language Models and Retrieval Augmented Generation.
- **Data Analytics Dashboard in Power BI:** Illustrates skills in data visualization and business intelligence using Power BI.
- **Web Automation Projects:** Various projects demonstrating automation skills, likely using Python and Selenium.

Experience:
- Includes internships, freelance work, and various data analysis projects.
- Achievements and responsibilities typically involve data cleaning, analysis, visualization, and building data-driven solutions.

Education:
- Degree in a relevant field, certifications, and coursework focused on Data Analytics and Software Development.

Please answer the following query from a recruiter about Utkal Nikam's profile. Be concise, relevant, and only use the information provided above. If the information is not explicitly available, state that you cannot provide a specific detail but can elaborate on related areas.

Recruiter Query: {{{query}}}`,
});

const recruiterExperienceStrategistFlow = ai.defineFlow(
  {
    name: 'recruiterExperienceStrategistFlow',
    inputSchema: RecruiterQueryInputSchema,
    outputSchema: RecruiterQueryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
