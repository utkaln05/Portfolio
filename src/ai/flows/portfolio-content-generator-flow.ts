'use server';
/**
 * @fileOverview A Genkit flow to generate content for various sections of a professional portfolio website.
 *
 * - generatePortfolioContent - A function that orchestrates the generation of portfolio website content.
 * - PortfolioContentGeneratorInput - The input type for the generatePortfolioContent function.
 * - PortfolioContentGeneratorOutput - The return type for the generatePortfolioContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const PortfolioContentGeneratorInputSchema = z.object({
  fullName: z.string().describe("The full name of the portfolio owner (e.g., 'Utkal Nikam')."),
  primaryRole: z.string().describe("The primary professional role (e.g., 'Data Analyst and Python Developer')."),
  tagline: z.string().describe("A concise personal tagline or professional summary (e.g., 'Leveraging data for insightful decisions')."),
  aboutMeContent: z.string().describe("A detailed paragraph about the portfolio owner's skills, problem-solving abilities, and passion for data-driven decision making."),
  coreSkills: z.array(z.string()).describe("A list of core technical skills (e.g., 'Python', 'SQL', 'Power BI')."),
  specificProjects: z.array(z.object({
    name: z.string().describe("Project name (e.g., 'Bus Route Data Scraper using Selenium')."),
    description: z.string().describe("Short description of the project."),
    keyTechnologies: z.array(z.string()).describe("List of key technologies used (e.g., ['Selenium', 'Python'])."),
    githubUrl: z.string().url().optional().describe("Optional GitHub link for the project.")
  })).describe("A list of specific projects with details."),
  workExperience: z.array(z.object({
    title: z.string().describe("Job title or role (e.g., 'Data Analyst Intern')."),
    company: z.string().describe("Company or organization name."),
    duration: z.string().describe("Employment or project duration (e.g., 'June 2022 - August 2023')."),
    responsibilities: z.array(z.string()).describe("Key responsibilities and duties."),
    achievements: z.array(z.string()).optional().describe("Notable achievements or contributions.")
  })).describe("A list of professional work experiences."),
  educationDetails: z.array(z.object({
    degree: z.string().describe("Degree or qualification obtained (e.g., 'B.Tech in Computer Science')."),
    university: z.string().describe("University or institution name."),
    duration: z.string().describe("Study duration (e.g., '2018 - 2022')."),
    relevantCoursework: z.array(z.string()).optional().describe("Relevant coursework or specializations."),
    certifications: z.array(z.string()).optional().describe("Relevant certifications.")
  })).describe("A list of educational background details."),
  contactInformation: z.object({
    email: z.string().email().describe("Contact email address."),
    linkedinUrl: z.string().url().optional().describe("LinkedIn profile URL."),
    githubUrl: z.string().url().optional().describe("GitHub profile URL."),
    phoneNumber: z.string().optional().describe("Optional phone number.")
  }).describe("Contact details for the portfolio owner."),
  designAesthetic: z.object({
    primaryColor: z.string().describe("Primary color (e.g., '#5a67d8')."),
    backgroundColor: z.string().describe("Background color (e.g., '#0f111a')."),
    accentColor: z.string().describe("Accent color (e.g., '#4299e1')."),
    headlineFont: z.string().describe("Font for headlines (e.g., 'Space Grotesk')."),
    bodyFont: z.string().describe("Font for body text (e.g., 'Inter')."),
    layoutDescription: z.string().describe("Description of the layout style (e.g., 'Minimalist premium layout utilizing wide margins and layered glass-effect cards to organize complex technical data elegantly.')."),
    animationDescription: z.string().describe("Description of animation style (e.g., 'Silky-smooth entrance transitions for portfolio blocks and staggered animations on list items for a professional narrative feel.')."),
    iconographyDescription: z.string().describe("Description of iconography style (e.g., 'Thin-line vector icons specifically representing core tools such as Python, Power BI, and Selenium for visual shorthand.').")
  }).describe("Preferences for the website's design aesthetic.")
});

export type PortfolioContentGeneratorInput = z.infer<typeof PortfolioContentGeneratorInputSchema>;

// Output Schema
const PortfolioContentGeneratorOutputSchema = z.object({
  heroSection: z.object({
    headline: z.string().describe("A professional headline like 'Utkal Nikam: Data Analyst & Python Developer'."),
    introduction: z.string().describe("A short, engaging introduction about the professional and their value proposition."),
    callToActions: z.array(z.object({ text: z.string(), link: z.string() })).describe("Call-to-action buttons like 'View Projects' and 'Download Resume' along with their intended links (e.g., '#projects' or '/resume.pdf')."),
    backgroundDescription: z.string().describe("A description of the ideal background for the hero section, incorporating the clean background with subtle animations as per the design aesthetic.")
  }).describe("Content for the Hero section."),
  aboutMeSection: z.object({
    title: z.string().describe("Title for the About Me section, e.g., 'About Me' or 'Who I Am'."),
    content: z.string().describe("An engaging paragraph highlighting skills, problem-solving abilities, and passion for data-driven decision making, tailored to the professional's details.")
  }).describe("Content for the About Me section."),
  skillsSection: z.object({
    title: z.string().describe("Title for the Skills section, e.g., 'My Expertise' or 'Skills & Tools'."),
    skills: z.array(z.object({
      name: z.string().describe("Skill name, e.g., 'Python'."),
      description: z.string().optional().describe("A short description or context for the skill, used for proficiency indicators or tooltips.")
    })).describe("A list of core technical skills with optional descriptions for proficiency indicators, formatted for modern skill cards.")
  }).describe("Content for the Skills section."),
  projectsSection: z.array(z.object({
    title: z.string().describe("Project title."),
    description: z.string().describe("Brief, engaging description of the project, highlighting its purpose and impact."),
    technologiesUsed: z.array(z.string()).describe("List of key technologies utilized in the project."),
    githubLink: z.string().url().optional().describe("Optional GitHub link for the project, if available.")
  })).describe("Content for the Project showcase section."),
  experienceSection: z.array(z.object({
    title: z.string().describe("Job title or role (e.g., 'Data Analyst Intern')."),
    company: z.string().describe("Company or organization name."),
    duration: z.string().describe("Employment or project duration (e.g., 'June 2022 - August 2023')."),
    responsibilities: z.array(z.string()).describe("Key responsibilities and duties in bullet points."),
    achievements: z.array(z.string()).optional().describe("Notable achievements or contributions in bullet points.")
  })).describe("Content for the Professional Experience timeline."),
  educationSection: z.array(z.object({
    degree: z.string().describe("Degree or qualification obtained (e.g., 'B.Tech in Computer Science')."),
    university: z.string().describe("University or institution name."),
    duration: z.string().describe("Study duration (e.g., '2018 - 2022')."),
    details: z.array(z.string()).describe("Relevant coursework, certifications, or specializations in bullet points.")
  })).describe("Content for the Education and Certifications section."),
  resumeSection: z.object({
    previewCardText: z.string().describe("Engaging text for the professional resume preview card, encouraging download."),
    downloadButtonText: z.string().describe("Text for the resume download button, e.g., 'Download Full Resume (PDF)'")
  }).describe("Content for the Resume section."),
  contactSection: z.object({
    email: z.string().email().describe("Contact email address for direct outreach."),
    linkedinUrl: z.string().url().optional().describe("LinkedIn profile URL for professional networking."),
    githubUrl: z.string().url().optional().describe("GitHub profile URL for code showcase."),
    phoneNumber: z.string().optional().describe("Optional phone number for direct contact."),
    contactFormDescription: z.string().describe("A brief, inviting description encouraging visitors to use the contact form for inquiries.")
  }).describe("Content for the Contact section."),
  footerSection: z.object({
    socialMediaPrompt: z.string().describe("A concise prompt for social media links to include in the footer, e.g., 'Connect with me across platforms.'"),
    copyrightInfo: z.string().describe("Standard copyright information, e.g., '© [Year] Utkal Nikam. All rights reserved.'"),
    quickNavigationPrompt: z.string().describe("A concise prompt for quick navigation links to key sections of the portfolio.")
  }).describe("Content for the Footer section.")
});

export type PortfolioContentGeneratorOutput = z.infer<typeof PortfolioContentGeneratorOutputSchema>;

export async function generatePortfolioContent(input: PortfolioContentGeneratorInput): Promise<PortfolioContentGeneratorOutput> {
  return portfolioContentGeneratorFlow(input);
}

const portfolioContentPrompt = ai.definePrompt({
  name: 'portfolioContentGeneratorPrompt',
  input: { schema: PortfolioContentGeneratorInputSchema },
  output: { schema: PortfolioContentGeneratorOutputSchema },
  prompt: `You are an expert AI assistant tasked with generating comprehensive, professional content for a developer's portfolio website. Your goal is to create engaging and recruiter-optimized text for all major sections based on the provided professional details and design aesthetic.\n\nThe portfolio owner's details are:\n- Full Name: {{{fullName}}}\n- Primary Role: {{{primaryRole}}}\n- Tagline/Summary: {{{tagline}}}\n- About Me Content: {{{aboutMeContent}}}\n- Core Skills: {{{#each coreSkills}}}- {{this}}\n{{/each}}\n- Specific Projects:\n{{#each specificProjects}}- Name: {{name}}\n  Description: {{description}}\n  Technologies: {{#each keyTechnologies}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}\n  {{#if githubUrl}}GitHub: {{githubUrl}}{{/if}}\n{{/each}}\n- Work Experience:\n{{#each workExperience}}- Title: {{title}}\n  Company: {{company}}\n  Duration: {{duration}}\n  Responsibilities: {{#each responsibilities}}- {{this}}\n{{/each}}\n  {{#if achievements}}Achievements: {{#each achievements}}- {{this}}\n{{/each}}{{/if}}\n{{/each}}\n- Education Details:\n{{#each educationDetails}}- Degree: {{degree}}\n  University: {{university}}\n  Duration: {{duration}}\n  {{#if relevantCoursework}}Coursework: {{#each relevantCoursework}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}\n  {{#if certifications}}Certifications: {{#each certifications}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}\n{{/each}}\n- Contact Information:\n  Email: {{{contactInformation.email}}}\n  {{#if contactInformation.linkedinUrl}}LinkedIn: {{{contactInformation.linkedinUrl}}}{{/if}}\n  {{#if contactInformation.githubUrl}}GitHub: {{{contactInformation.githubUrl}}}{{/if}}\n  {{#if contactInformation.phoneNumber}}Phone: {{{contactInformation.phoneNumber}}}{{/if}}\n\nThe desired design aesthetic for the website includes:\n- Primary Color: {{{designAesthetic.primaryColor}}}\n- Background Color: {{{designAesthetic.backgroundColor}}}\n- Accent Color: {{{designAesthetic.accentColor}}}\n- Headline Font: {{{designAesthetic.headlineFont}}}\n- Body Font: {{{designAesthetic.bodyFont}}}\n- Layout Description: {{{designAesthetic.layoutDescription}}}\n- Animation Description: {{{designAesthetic.animationDescription}}}\n- Iconography Description: {{{designAesthetic.iconographyDescription}}}\n\nGenerate comprehensive content for the following sections of the portfolio website, ensuring it is:\n- Modern and professional.\n- Optimized for recruiters and job applications.\n- Reflects the specified design aesthetic (e.g., glassmorphism, dark mode, smooth animations) in its descriptive text where appropriate.\n\n## Section Content Guidelines:\n\n### Hero Section\n- **Headline**: Create a professional and impactful headline for Utkal Nikam, a Data Analyst and Python Developer.\n- **Introduction**: Write a short, engaging introduction.\n- **Call-to-Action Buttons**: Suggest text and conceptual links for "View Projects" and "Download Resume".\n- **Background Description**: Describe a clean background with subtle animations, integrating the provided design aesthetic (e.g., glassmorphism effects, dark mode colors).\n\n### About Me Section\n- **Title**: Provide a compelling title.\n- **Content**: Write an engaging About Me section using the provided `aboutMeContent`, highlighting problem-solving abilities and passion for data-driven decision making. Mention relevant skills.\n\n### Skills Section\n- **Title**: Provide a suitable title for this section.\n- **Skills**: List all provided `coreSkills` and describe how they might be presented with modern skill cards and proficiency indicators, leveraging the `iconographyDescription`.\n\n### Projects Section\n- Iterate through each `specificProjects` entry.\n- **Title**: Use the project name.\n- **Description**: Elaborate on the project description, focusing on impact, problem solved, and technologies used.\n- **Technologies Used**: List the `keyTechnologies`.\n- **GitHub Link**: Include the provided `githubUrl` if available. Ensure the descriptions are clear and concise, suitable for project cards.\n\n### Experience Section\n- Iterate through each `workExperience` entry.\n- **Title, Company, Duration**: Use the provided details.\n- **Responsibilities**: List key responsibilities.\n- **Achievements**: List notable achievements. Format this as a professional timeline.\n\n### Education Section\n- Iterate through each `educationDetails` entry.\n- **Degree, University, Duration**: Use the provided details.\n- **Details**: Combine `relevantCoursework` and `certifications` into a concise list of relevant details.\n\n### Resume Section\n- **Preview Card Text**: Write text for a professional resume preview card.\n- **Download Button Text**: Provide text for a prominent "Download Resume" button.\n\n### Contact Section\n- **Email, LinkedIn, GitHub, Phone Number**: Use the provided contact information.\n- **Contact Form Description**: Write an inviting message for a contact form. Ensure a clean and professional design is implicitly requested.\n\n### Footer\n- **Social Media Prompt**: Suggest a phrase to encourage connection on social media, reflecting the `iconographyDescription`.\n- **Copyright Info**: Provide standard copyright information for the current year.\n- **Quick Navigation Prompt**: Suggest text for quick navigation links.\n\nGenerate the output in JSON format adhering strictly to the `PortfolioContentGeneratorOutputSchema`.\n`
});

const portfolioContentGeneratorFlow = ai.defineFlow(
  {
    name: 'portfolioContentGeneratorFlow',
    inputSchema: PortfolioContentGeneratorInputSchema,
    outputSchema: PortfolioContentGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await portfolioContentPrompt(input);
    if (!output) {
      throw new Error('Failed to generate portfolio content.');
    }
    return output;
  }
);
